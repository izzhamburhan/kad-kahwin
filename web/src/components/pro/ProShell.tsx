"use client";

import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { CalendarCheck, CalendarDays, Gift as GiftIcon, MapPin, Music2, Phone, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { loadWedding } from "@/lib/data";
import { defaultWedding } from "@/lib/defaults";
import { asset, formatDate, formatHijri, formatTimeRange } from "@/lib/format";
import { s, t } from "@/lib/i18n";
import type { Lang, Wedding } from "@/lib/types";
import { Bismillah } from "../designs/scene";
import { Countdown } from "../invitation/Countdown";
import { Footer, Gallery, GuestNotes, Schedule, Story } from "../invitation/Details";
import { Guestbook } from "../invitation/Guestbook";
import { Rsvp } from "../invitation/Rsvp";
import { Reveal } from "../invitation/Section";
import { CalendarSheet, ContactSheet, GiftSheet, MapSheet, Sheet } from "./sheets";

const LANG_KEY = "vowe:lang";
const DEFAULT_MUSIC = "audio/lagu.mp3";

export type ProCtx = {
  w: Wedding;
  lang: Lang;
  guest: string;
  reduced: boolean;
  /** True once the guest has opened the cover; heroes play their entrance on it. */
  opened: boolean;
};
export type CoverProps = ProCtx & { onOpen: (withMusic: boolean) => void };

type SheetId = "gift" | "contact" | "map" | "calendar";

/**
 * The "professional" e-kad pattern used across the Malaysian market: a cover the guest
 * taps open (music starts), one calm vertical card with soft fade-ins, and a fixed
 * action bar whose buttons open sheets for RSVP, salam kaut, contacts, map and calendar.
 * A card template only brings its cover, its hero, an ornament and the panel style.
 */
export function ProShell({
  theme,
  fontClass,
  Cover,
  Hero,
  ornament,
  backdrop,
  cardClass = "",
  cardStyle,
  fullNameClass = "font-script text-[2rem] leading-snug text-[var(--heading)]",
  music = DEFAULT_MUSIC,
}: {
  theme: string;
  fontClass: string;
  Cover: ComponentType<CoverProps>;
  Hero: ComponentType<ProCtx>;
  /** Small divider between the names and around headings. */
  ornament: ReactNode;
  /** Decoration laid behind the whole card column (patterns, edge florals). */
  backdrop?: ReactNode;
  cardClass?: string;
  cardStyle?: CSSProperties;
  /** How the couple's full names are set. Script faces with tight spacing want serif capitals instead. */
  fullNameClass?: string;
  music?: string;
}) {
  const reduced = !!useReducedMotion();
  const [w, setW] = useState<Wedding>(defaultWedding);
  const [lang, setLang] = useState<Lang>("ms");
  const [guest, setGuest] = useState("");
  const [url, setUrl] = useState("");
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [sheet, setSheet] = useState<SheetId | null>(null);
  // What the sheet shows; kept after closing so its content doesn't vanish mid-slide.
  const [shown, setShown] = useState<SheetId>("map");
  const [mounted, setMounted] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  // The page is pre-rendered without a URL or storage, so these are read once on mount.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const params = new URLSearchParams(location.search);
    setGuest((params.get("to") ?? "").slice(0, 80));
    setUrl(`${location.origin}${location.pathname}`);
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "ms" || saved === "en") setLang(saved);
    } catch {
      /* ignore */
    }
    setMounted(true);
    loadWedding().then(setW);
  }, [theme]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  // The card stays still under the cover until it is opened.
  useEffect(() => {
    document.documentElement.style.overflow = opened ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [opened]);

  const startMusic = () => {
    const a = audio.current;
    if (!a) return;
    a.volume = 0.55;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  const toggleMusic = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) startMusic();
    else {
      a.pause();
      setPlaying(false);
    }
  };

  const open = (withMusic: boolean) => {
    if (withMusic) startMusic();
    window.scrollTo(0, 0);
    setOpened(true);
  };

  const sec = w.sections;
  const ctx: ProCtx = { w, lang, guest, reduced, opened };
  const actions = [
    sec.rsvp && { id: "rsvp", icon: CalendarCheck, label: "RSVP" },
    sec.gift && (w.gift.accountNo || w.gift.qrImage) && { id: "gift", icon: GiftIcon, label: s("gift", lang) },
    sec.contacts && w.contacts.length > 0 && { id: "contact", icon: Phone, label: s("navContact", lang) },
    { id: "map", icon: MapPin, label: s("navMap", lang) },
    { id: "calendar", icon: CalendarDays, label: s("calendar", lang) },
  ].filter(Boolean) as { id: SheetId | "rsvp"; icon: typeof Phone; label: string }[];

  const openSheet = (id: SheetId) => {
    setShown(id);
    setSheet(id);
  };

  const act = (id: SheetId | "rsvp") => {
    if (id === "rsvp") document.getElementById("rsvp")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    else openSheet(id);
  };

  const sheetTitle: Record<SheetId, string> = {
    gift: s("gift", lang),
    contact: s("contact", lang),
    map: s("location", lang),
    calendar: s("addCalendar", lang),
  };

  const details = [
    { k: s("date", lang), v: formatDate(w.start, lang), sub: formatHijri(w.start) },
    { k: s("time", lang), v: formatTimeRange(w, lang) },
    { k: s("venue", lang), v: w.venue.name, sub: w.venue.address },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className={`design pro ${fontClass}`}>
        <audio ref={audio} src={asset(music)} loop preload="none" />

        <AnimatePresence>{!opened && <Cover key="cover" {...ctx} onOpen={open} />}</AnimatePresence>

        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 mx-auto flex max-w-[480px] items-center justify-between p-4 pt-[max(env(safe-area-inset-top),1rem)]">
          <div className="pointer-events-auto flex rounded-full border border-card-line bg-bg/70 p-0.5 backdrop-blur-md">
            {(["ms", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-3 py-1 font-sans text-xs font-medium transition ${lang === l ? "bg-gold text-[var(--on-gold)]" : "text-ink-soft"}`}
              >
                {l === "ms" ? "BM" : "EN"}
              </button>
            ))}
          </div>
          {opened && (
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={s("music", lang)}
              aria-pressed={playing}
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-card-line bg-bg/70 text-gold backdrop-blur-md"
            >
              {playing ? (
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }}>
                  <Music2 size={16} />
                </motion.span>
              ) : (
                <VolumeX size={16} />
              )}
            </button>
          )}
        </div>

        <main className="relative mx-auto min-h-dvh max-w-[480px] overflow-x-clip bg-bg shadow-[0_0_80px_rgba(0,0,0,.18)]">
          {backdrop}
          <Hero {...ctx} />

          <section id="jemputan" className="relative px-5 pb-6 pt-10">
            <div className={`relative px-6 py-12 text-center ${cardClass}`} style={cardStyle}>
              <Reveal>
                <Bismillah className="text-[var(--heading)]" />
                <p className="mt-4 font-sans text-[0.7rem] uppercase tracking-[0.28em] text-ink-soft">{s("salam", lang)}</p>
              </Reveal>
              <Reveal delay={0.05} className="mt-8">
                <p className="font-serif text-[1.05rem] font-medium uppercase leading-relaxed tracking-[0.08em] text-ink">{w.hosts}</p>
                <p className="mx-auto mt-5 max-w-[22rem] font-serif text-[1.08rem] leading-relaxed text-ink-soft">{t(w.message, lang)}</p>
              </Reveal>
              <Reveal delay={0.05} className="mt-9">
                <p className={fullNameClass}>{w.couple.groomFull}</p>
                <div className="my-3 flex justify-center">{ornament}</div>
                <p className={fullNameClass}>{w.couple.brideFull}</p>
              </Reveal>
              <Reveal delay={0.05} className="mt-10 grid gap-6">
                {details.map((d) => (
                  <div key={d.k}>
                    <p className="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-gold">{d.k}</p>
                    <p className="mt-1.5 font-serif text-xl leading-snug text-ink">{d.v}</p>
                    {d.sub && <p className="font-serif text-sm text-ink-soft">{d.sub}</p>}
                  </div>
                ))}
                <button type="button" onClick={() => openSheet("map")} className="btn-ghost mx-auto !py-2.5 !text-[0.7rem]">
                  <MapPin size={15} /> {s("viewMap", lang)}
                </button>
              </Reveal>
              <Reveal delay={0.05} className="mt-10">
                <p className="mx-auto max-w-[20rem] font-serif text-base italic leading-relaxed text-ink-soft">{t(w.closing, lang)}</p>
              </Reveal>
            </div>
          </section>

          {mounted && (
            <>
              <Countdown w={w} lang={lang} url={url} />
              {sec.schedule && <Schedule w={w} lang={lang} />}
              <GuestNotes w={w} lang={lang} />
              {sec.story && <Story w={w} lang={lang} />}
              {sec.gallery && <Gallery w={w} lang={lang} />}
              {sec.rsvp && <Rsvp w={w} lang={lang} guest={guest} />}
              {sec.guestbook && <Guestbook lang={lang} guest={guest} />}
              <Footer w={w} lang={lang} url={url} />
            </>
          )}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px]" aria-label="Tindakan">
          <ul className="safe-bottom flex justify-around border-t border-card-line bg-bg/90 px-1 pt-1.5 shadow-[0_-10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur-xl">
            {actions.map((a) => (
              <li key={a.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => act(a.id)}
                  className="flex w-full flex-col items-center gap-1 rounded-xl py-1.5 text-ink-soft transition hover:text-gold active:scale-95"
                >
                  <a.icon size={19} strokeWidth={1.6} />
                  <span className="font-sans text-[0.62rem]">{a.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <Sheet open={sheet !== null} onClose={() => setSheet(null)} title={sheetTitle[shown]} lang={lang}>
          {shown === "gift" && <GiftSheet w={w} lang={lang} />}
          {shown === "contact" && <ContactSheet w={w} lang={lang} />}
          {shown === "map" && <MapSheet w={w} lang={lang} />}
          {shown === "calendar" && <CalendarSheet w={w} lang={lang} url={url} />}
        </Sheet>
      </div>
    </MotionConfig>
  );
}