"use client";

import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { CalendarDays, Heart, Home, MapPin, MessageCircle, Music2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { isDemo, loadWedding } from "@/lib/data";
import { defaultWedding } from "@/lib/defaults";
import { asset } from "@/lib/format";
import { s } from "@/lib/i18n";
import type { Lang, Wedding } from "@/lib/types";
import { Ambience } from "./Ambience";
import { Countdown } from "./Countdown";
import { Contacts, Footer, Gallery, Gift, GuestNotes, Invitation, Location, Schedule, Story } from "./Details";
import { Envelope } from "./Envelope";
import { Guestbook } from "./Guestbook";
import { Hero } from "./Hero";
import { Rsvp } from "./Rsvp";
import { SongketBand } from "../ornaments";

type Phase = "loading" | "cover" | "opening" | "open";

const LANG_KEY = "vowe:lang";

export function InvitationApp() {
  const reduced = !!useReducedMotion();
  const [w, setW] = useState<Wedding>(defaultWedding);
  // Demo mode has nothing to fetch, so the envelope is pre-rendered straight into the HTML.
  const [phase, setPhase] = useState<Phase>(isDemo ? "cover" : "loading");
  const [lang, setLang] = useState<Lang>("ms");
  const [guest, setGuest] = useState("");
  const [url, setUrl] = useState("");
  const [flash, setFlash] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  // The page is pre-rendered without a URL or storage, so these are read once on mount.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setGuest((params.get("to") ?? "").slice(0, 80));
    setUrl(`${location.origin}${location.pathname}`);
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "ms" || saved === "en") setLang(saved);
    } catch {
      /* ignore */
    }
    // Don't hold the envelope hostage to a slow network: fall back to the built-in details.
    const timeout = setTimeout(() => setPhase((p) => (p === "loading" ? "cover" : p)), 4000);
    loadWedding()
      .then(setW)
      .finally(() => {
        clearTimeout(timeout);
        setPhase((p) => (p === "loading" ? "cover" : p));
      });
    return () => clearTimeout(timeout);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    document.documentElement.dataset.theme = w.theme;
  }, [w.theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  // Lock scrolling while the envelope is on screen.
  useEffect(() => {
    document.body.style.overflow = phase === "open" ? "" : "hidden";
  }, [phase]);

  const startMusic = () => {
    const a = audio.current;
    if (!a || !w.music.src) return;
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

  const reveal = () => {
    window.scrollTo(0, 0);
    if (!reduced) {
      setFlash(true);
      setTimeout(() => setFlash(false), 1400);
    }
    setPhase("open");
  };

  const skip = () => {
    if (phase === "cover") startMusic();
    window.scrollTo(0, 0);
    setPhase("open");
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
      {w.music.src && <audio ref={audio} src={asset(w.music.src)} loop preload="none" />}

      {/* Top controls */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 mx-auto flex max-w-[480px] items-center justify-between p-4 pt-[max(env(safe-area-inset-top),1rem)]">
        <div className="pointer-events-auto flex rounded-full border border-card-line bg-bg/60 p-0.5 backdrop-blur-md">
          {(["ms", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`rounded-full px-3 py-1 font-sans text-[0.65rem] uppercase tracking-widest transition ${
                lang === l ? "bg-gold text-[#1b160b]" : "text-ink-soft"
              }`}
            >
              {l === "ms" ? "BM" : "EN"}
            </button>
          ))}
        </div>
        <div className="pointer-events-auto flex gap-2">
          {phase !== "open" && phase !== "loading" && (
            <button
              type="button"
              onClick={skip}
              className="rounded-full border border-card-line bg-bg/60 px-4 py-1.5 font-sans text-[0.65rem] uppercase tracking-widest text-ink-soft backdrop-blur-md"
            >
              {s("skip", lang)}
            </button>
          )}
          {phase === "open" && w.music.src && (
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={s("music", lang)}
              aria-pressed={playing}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-card-line bg-bg/60 text-gold backdrop-blur-md"
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
      </div>

      {isDemo && phase === "open" && (
        <div className="fixed inset-x-0 top-[max(env(safe-area-inset-top),1rem)] z-30 mx-auto mt-12 w-fit rounded-full border border-dashed border-card-line bg-bg/70 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-widest text-ink-mute backdrop-blur">
          Demo
        </div>
      )}

      {/* Cover */}
      <AnimatePresence>
        {phase !== "open" && (
          <motion.div
            key="cover"
            className="fixed inset-0 z-[35]"
            exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {phase === "loading" ? (
              <div className="flex min-h-dvh items-center justify-center bg-bg">
                <motion.div
                  className="h-10 w-10 rounded-full border border-gold border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
                />
              </div>
            ) : (
              <Envelope
                w={w}
                lang={lang}
                guest={guest}
                reduced={reduced}
                onStart={() => {
                  setPhase("opening");
                  startMusic();
                }}
                onOpened={reveal}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            className="pointer-events-none fixed inset-0 z-[36]"
            style={{ background: "radial-gradient(circle at 50% 45%, #fff8e6 0%, var(--gold-hi) 30%, transparent 75%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, times: [0, 0.25, 1], ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {phase === "open" && !reduced && <Ambience />}

      {phase === "open" && (
        <main className="relative mx-auto max-w-[480px] overflow-x-clip bg-bg shadow-[0_0_80px_rgba(0,0,0,.35)]">
          <Hero w={w} lang={lang} />
          <Invitation w={w} lang={lang} />
          <SongketBand className="text-gold opacity-40" />
          <Countdown w={w} lang={lang} url={url} />
          {sec.story && <Story w={w} lang={lang} />}
          {sec.gallery && <Gallery w={w} lang={lang} />}
          {sec.schedule && <Schedule w={w} lang={lang} />}
          <Location w={w} lang={lang} />
          <GuestNotes w={w} lang={lang} />
          {sec.rsvp && (
            <div className="songket-bg bg-bg-2">
              <Rsvp w={w} lang={lang} guest={guest} />
            </div>
          )}
          {sec.gift && <Gift w={w} lang={lang} />}
          {sec.guestbook && <Guestbook lang={lang} guest={guest} />}
          {sec.contacts && <Contacts w={w} lang={lang} />}
          <Footer w={w} lang={lang} url={url} />
        </main>
      )}

      {/* Dock */}
      <AnimatePresence>
        {phase === "open" && (
          <motion.nav
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="safe-bottom fixed inset-x-0 bottom-0 z-40 flex justify-center px-4"
            aria-label="Sections"
          >
            <ul className="flex w-full max-w-[400px] justify-between rounded-[26px] border border-card-line bg-bg/70 px-2 py-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,.6)] backdrop-blur-xl">
              {nav.map((n) => (
                <li key={n.href} className="flex-1">
                  <a href={n.href} className="flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-ink-soft transition active:scale-95 hover:text-gold">
                    <n.icon size={19} strokeWidth={1.6} />
                    <span className="font-sans text-[0.6rem] tracking-wide">{n.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}