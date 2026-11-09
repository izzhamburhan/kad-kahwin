"use client";

import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { Music2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { loadWedding } from "@/lib/data";
import { defaultWedding } from "@/lib/defaults";
import { asset } from "@/lib/format";
import { s } from "@/lib/i18n";
import type { Lang, Wedding } from "@/lib/types";
import { CalendarSheet, ContactSheet, GiftSheet, MapSheet, Sheet } from "./sheets";

const LANG_KEY = "vowe:lang";
const DEFAULT_MUSIC = "audio/lagu.mp3";

export type SheetId = "gift" | "contact" | "map" | "calendar";

export type ProCtx = {
  w: Wedding;
  lang: Lang;
  guest: string;
  reduced: boolean;
  /** True once the guest has opened the cover; heroes play their entrance on it. */
  opened: boolean;
};
export type CoverProps = ProCtx & { onOpen: (withMusic: boolean) => void };

/** What a card's body gets: the wedding, plus the shell's sheets and its language and music buttons. */
export type SuiteCtx = ProCtx & {
  url: string;
  /** False during the static pre-render; parts that read the clock or storage wait for it. */
  mounted: boolean;
  openSheet: (id: SheetId) => void;
  /** The BM/EN switch and the music button. The body decides where they sit. */
  controls: ReactNode;
};

/**
 * Plumbing shared by every pro card: it loads the wedding, reads the guest's name from the link,
 * keeps the language, plays the music, holds the page still under the cover, and owns the bottom
 * sheets for map, calendar, contacts and salam kaut. The card brings its cover and its body.
 */
export function SuiteShell({
  theme,
  fontClass,
  Cover,
  body,
  music = DEFAULT_MUSIC,
}: {
  theme: string;
  fontClass: string;
  Cover: ComponentType<CoverProps>;
  /** Renders everything after the cover: the card itself and its menu. */
  body: (ctx: SuiteCtx) => ReactNode;
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

  const openSheet = (id: SheetId) => {
    setShown(id);
    setSheet(id);
  };

  const sheetTitle: Record<SheetId, string> = {
    gift: s("gift", lang),
    contact: s("contact", lang),
    map: s("location", lang),
    calendar: s("addCalendar", lang),
  };

  const controls = (
    <>
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
    </>
  );

  const ctx: ProCtx = { w, lang, guest, reduced, opened };

  return (
    <MotionConfig reducedMotion="user">
      <div className={`design pro ${fontClass}`}>
        <audio ref={audio} src={asset(music)} loop preload="none" />
        <AnimatePresence>{!opened && <Cover key="cover" {...ctx} onOpen={open} />}</AnimatePresence>
        {body({ ...ctx, url, mounted, openSheet, controls })}
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

/** The sheets a card can offer, in the order its menu lists them, leaving out the ones with nothing to show. */
export function sheetActions(w: Wedding, lang: Lang) {
  const sec = w.sections;
  return [
    { id: "map" as const, label: s("navMap", lang) },
    { id: "calendar" as const, label: s("calendar", lang) },
    sec.contacts && w.contacts.length > 0 && { id: "contact" as const, label: s("navContact", lang) },
    sec.gift && (w.gift.accountNo || w.gift.qrImage) && { id: "gift" as const, label: s("gift", lang) },
  ].filter(Boolean) as { id: SheetId; label: string }[];
}