"use client";

import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { CalendarDays, Heart, Home, MapPin, MessageCircle, Music2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { loadWedding } from "@/lib/data";
import { defaultWedding } from "@/lib/defaults";
import { asset } from "@/lib/format";
import { s } from "@/lib/i18n";
import type { Lang, Wedding } from "@/lib/types";
import { Ambience } from "../invitation/Ambience";
import { Countdown } from "../invitation/Countdown";
import { Contacts, Footer, Gift, GuestNotes, Location, Schedule } from "../invitation/Details";
import { Guestbook } from "../invitation/Guestbook";
import { Rsvp } from "../invitation/Rsvp";
import { KampungInvite } from "./KampungInvite";
import { TikarBand } from "./motifs";
import { Scene } from "./Scene";

const LANG_KEY = "vowe:lang";

// Swap in your own track by dropping an mp3 you have the rights to into
// public/audio/ and pointing this at it.
const MUSIC = "audio/lagu.mp3";

/**
 * /kampung: the same invitation, data and RSVP as /, told as an evening walk
 * up to a kampung house. Admin edits and RSVPs are shared with the main design.
 */
export function KampungApp({ fontClass }: { fontClass: string }) {
  const reduced = !!useReducedMotion();
  const [w, setW] = useState<Wedding>(defaultWedding);
  const [lang, setLang] = useState<Lang>("ms");
  const [guest, setGuest] = useState("");
  const [url, setUrl] = useState("");
  const [playing, setPlaying] = useState(false);
  // Countdown and RSVP read the clock and this phone's storage, so they render client-side only.
  const [mounted, setMounted] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  // The page is pre-rendered without a URL or storage, so these are read once on mount.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    document.documentElement.dataset.theme = "kampung";
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
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

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

  const enter = () => {
    startMusic();
    window.scrollBy({ top: window.innerHeight * 1.4, behavior: reduced ? "auto" : "smooth" });
  };

  const sec = w.sections;
  const nav = [
    { href: "#utama", icon: Home, label: s("navHome", lang) },
    { href: "#tarikh", icon: CalendarDays, label: s("navDate", lang) },
    { href: "#lokasi", icon: MapPin, label: s("navMap", lang) },
    sec.rsvp && { href: "#rsvp", icon: Heart, label: s("navRsvp", lang) },
    sec.contacts && w.contacts.length
      ? { href: "#hubungi", icon: MessageCircle, label: s("navContact", lang) }
      : sec.guestbook && { href: "#ucapan", icon: MessageCircle, label: s("guestbook", lang).split(" ")[0] },
  ].filter(Boolean) as { href: string; icon: typeof Home; label: string }[];

  return (
    <MotionConfig reducedMotion="user">
      <div className={`kampung ${fontClass}`}>
        <audio ref={audio} src={asset(MUSIC)} loop preload="none" />

        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 mx-auto flex max-w-[480px] items-center justify-between p-4 pt-[max(env(safe-area-inset-top),1rem)]">
          <div className="pointer-events-auto flex rounded-full border border-card-line bg-bg/55 p-0.5 backdrop-blur-md">
            {(["ms", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-3 py-1 font-sans text-xs font-medium transition ${
                  lang === l ? "bg-gold text-[#2b140c]" : "text-ink-soft"
                }`}
              >
                {l === "ms" ? "BM" : "EN"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={s("music", lang)}
            aria-pressed={playing}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-card-line bg-bg/55 text-gold backdrop-blur-md"
          >
            {playing ? (
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }}>
                <Music2 size={16} />
              </motion.span>
            ) : (
              <VolumeX size={16} />
            )}
          </button>
        </div>

        <Scene w={w} lang={lang} guest={guest} reduced={reduced} onEnter={enter} />

        <main className="relative mx-auto min-h-dvh max-w-[480px] overflow-x-clip bg-bg shadow-[0_0_80px_rgba(0,0,0,.45)]">
          <KampungInvite w={w} lang={lang} />
          {mounted && (
            <>
              <TikarBand />
              <Countdown w={w} lang={lang} url={url} />
              {sec.schedule && <Schedule w={w} lang={lang} />}
              <Location w={w} lang={lang} />
              <GuestNotes w={w} lang={lang} />
              {sec.rsvp && (
                <div className="papan">
                  <TikarBand />
                  <Rsvp w={w} lang={lang} guest={guest} />
                  <TikarBand />
                </div>
              )}
              {sec.gift && <Gift w={w} lang={lang} />}
              {sec.guestbook && <Guestbook lang={lang} guest={guest} />}
              {sec.contacts && <Contacts w={w} lang={lang} />}
              <Footer w={w} lang={lang} url={url} />
            </>
          )}
        </main>

        {!reduced && <Ambience kind="fireflies" intensity={0.8} />}

        <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 flex justify-center px-4" aria-label="Sections">
          <ul className="flex w-full max-w-[400px] justify-between rounded-[22px] border border-card-line bg-bg/75 px-2 py-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,.6)] backdrop-blur-xl">
            {nav.map((n) => (
              <li key={n.href} className="flex-1">
                <a href={n.href} className="flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-ink-soft transition hover:text-gold active:scale-95">
                  <n.icon size={19} strokeWidth={1.6} />
                  <span className="font-sans text-[0.65rem]">{n.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </MotionConfig>
  );
}