"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { formatDate, formatDateDots, formatHijri, formatTimeRange } from "@/lib/format";
import { s, t } from "@/lib/i18n";
import type { Lang, Wedding } from "@/lib/types";
import { Bismillah } from "../../designs/scene";
import { ProShell, type CoverProps, type ProCtx } from "../ProShell";
import { EASE, GuestLine, OpenButtons, ScrollCue } from "../parts";
import { BackWorld, Couple, Egrets, FrontWorld, PadiClump, Wau } from "./world";

// Senja: the invitation plays like a short film over padi fields at dusk, while the
// action bar stays live on top of it. Unlike a rendered video, every word comes from the
// wedding settings and the guest's link, so nothing has to be re-exported when they change.

type ShotId = "title" | "date" | "invite" | "couple" | "venue" | "closing";

/** The running order. `hold` is seconds on screen, `zoom` the camera, `veil` how far the picture dims for reading. */
const SHOTS: { id: ShotId; hold: number; zoom: number; veil: number }[] = [
  { id: "title", hold: 7, zoom: 1, veil: 0 },
  { id: "date", hold: 6.5, zoom: 1.16, veil: 0.25 },
  { id: "invite", hold: 10, zoom: 1.3, veil: 1 },
  { id: "couple", hold: 8, zoom: 1.55, veil: 0.7 },
  { id: "venue", hold: 8, zoom: 1.22, veil: 1 },
  { id: "closing", hold: 7, zoom: 1.04, veil: 0.2 },
];

/** Both layers zoom around the couple, who stand at about this height in the frame. */
const ORIGIN = "50% 72%";
const IRIS = "50% 50%";
/** How much of the camera's move the far layer takes, which is what gives the depth. */
const FAR_LAYER = 0.42;

const TEXT_SHADOW = "[text-shadow:0_1px_14px_rgba(10,35,45,.6)]";
const LABEL = "font-sans text-[0.68rem] uppercase tracking-[0.3em] text-[#ffdca8]";
const SCRIPT = "font-script leading-[1.05] text-white";

const words = (lang: Lang, ms: string, en: string) => (lang === "ms" ? ms : en);

/** One line of a shot, arriving after the ones above it. */
function Line({ i, className = "", children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.18 }} className={className}>
      {children}
    </motion.div>
  );
}

function Shot({ id, w, lang, guest }: { id: ShotId; w: Wedding; lang: Lang; guest: string }) {
  switch (id) {
    case "title":
      return (
        <>
          <Line i={0} className={LABEL}>
            {t(w.title, lang)}
          </Line>
          <Line i={1} className={`${SCRIPT} mt-5 text-[clamp(3.5rem,17vw,5rem)]`}>
            {w.couple.groomShort}
          </Line>
          <Line i={2} className={`${SCRIPT} text-[2.4rem] text-[#ffdca8]`}>
            &amp;
          </Line>
          <Line i={3} className={`${SCRIPT} text-[clamp(3.5rem,17vw,5rem)]`}>
            {w.couple.brideShort}
          </Line>
          {guest && (
            <Line i={4} className="mt-6 font-sans text-xs text-white/85">
              {s("to", lang)} <span className="font-serif text-base italic text-white">{guest}</span>
            </Line>
          )}
        </>
      );
    case "date":
      return (
        <>
          <Line i={0} className={`${SCRIPT} text-[2.6rem]`}>
            {words(lang, "Pada", "On")}
          </Line>
          <Line i={1} className="mt-3 font-serif text-[1.9rem] leading-tight text-white">
            {formatDate(w.start, lang)}
          </Line>
          <Line i={2} className="mt-2 font-serif text-base text-white/85">
            {formatHijri(w.start)}
          </Line>
          <Line i={3} className="mt-5 font-sans text-sm tracking-[0.08em] text-[#ffdca8]">
            {formatTimeRange(w, lang)}
          </Line>
        </>
      );
    case "invite":
      return (
        <>
          <Line i={0}>
            <Bismillah className="text-white" />
          </Line>
          <Line i={1} className={`${LABEL} mt-3`}>
            {s("salam", lang)}
          </Line>
          <Line i={2} className="mt-6 font-serif text-[1.02rem] font-medium uppercase leading-relaxed tracking-[0.08em] text-white">
            {w.hosts}
          </Line>
          <Line i={3} className="mx-auto mt-5 max-w-[21rem] font-serif text-[1.08rem] leading-relaxed text-white/90">
            {t(w.message, lang)}
          </Line>
        </>
      );
    case "couple":
      return (
        <>
          <Line i={0} className={LABEL}>
            {words(lang, "Mempelai", "The Couple")}
          </Line>
          <Line i={1} className="mt-4 font-serif text-[1.3rem] uppercase leading-snug tracking-[0.08em] text-white">
            {w.couple.groomFull}
          </Line>
          <Line i={2} className={`${SCRIPT} my-1 text-[2.4rem] text-[#ffdca8]`}>
            &amp;
          </Line>
          <Line i={3} className="font-serif text-[1.3rem] uppercase leading-snug tracking-[0.08em] text-white">
            {w.couple.brideFull}
          </Line>
        </>
      );
    case "venue":
      return (
        <>
          <Line i={0} className={LABEL}>
            {s("venue", lang)}
          </Line>
          <Line i={1} className="mt-2 font-serif text-[1.7rem] leading-tight text-white">
            {w.venue.name}
          </Line>
          <Line i={2} className="mx-auto mt-2 max-w-[20rem] font-serif text-base leading-snug text-white/85">
            {w.venue.address}
          </Line>
          <Line i={3} className={`${LABEL} mt-8`}>
            {s("time", lang)}
          </Line>
          <Line i={4} className="mt-2 font-serif text-[1.4rem] text-white">
            {formatTimeRange(w, lang)}
          </Line>
        </>
      );
    case "closing":
      return (
        <>
          <Line i={0} className="mx-auto max-w-[20rem] font-serif text-lg italic leading-relaxed text-white">
            {t(w.closing, lang)}
          </Line>
          <Line i={1} className={`${SCRIPT} mt-6 text-[3rem]`}>
            {w.couple.groomShort} &amp; {w.couple.brideShort}
          </Line>
          <Line i={2} className="mt-3 font-sans text-sm tabular-nums tracking-[0.2em] text-[#ffdca8]">
            {formatDateDots(w.start)}
          </Line>
        </>
      );
  }
}

/** Keeps the 480x1040 canvas covering the frame on any phone shape. */
function Canvas({ children }: { children: ReactNode }) {
  return (
    <div className="absolute left-1/2 top-1/2 aspect-[480/1040] -translate-x-1/2 -translate-y-1/2" style={{ width: "max(100%, calc(100dvh * 480 / 1040))" }}>
      {children}
    </div>
  );
}

/** Cover: a paper sky with the couple before the sun. Opening sets it, closing down into the sun. */
function Cover({ w, lang, guest, onOpen }: CoverProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50"
      style={{ background: "linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 52%, #f3b679 100%)" }}
      initial={{ clipPath: `circle(150% at ${IRIS})` }}
      exit={{ clipPath: `circle(0% at ${IRIS})`, transition: { duration: 1.15, ease: [0.7, 0, 0.25, 1] } }}
    >
      <div className="mx-auto flex h-full max-w-[480px] flex-col items-center justify-between px-7 pb-[calc(env(safe-area-inset-bottom)+1.75rem)] pt-[calc(env(safe-area-inset-top)+4.25rem)] text-center">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.1 }}>
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-gold">{t(w.title, lang)}</p>
          <p className="mt-3 font-script text-[clamp(3rem,14vw,4.2rem)] leading-[1.05] text-[var(--heading)]">
            {w.couple.groomShort} <span className="text-gold">&amp;</span> {w.couple.brideShort}
          </p>
          <p className="mt-1 font-sans text-xs tabular-nums tracking-[0.2em] text-ink-soft">{formatDateDots(w.start)}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.3, ease: EASE, delay: 0.2 }} className="relative aspect-square h-[min(40dvh,330px)]">
          <div className="absolute inset-[6%] rounded-full" style={{ background: "linear-gradient(180deg,#fff6d8 0%,#ffc98a 62%,#ee9d6b 100%)" }} />
          <Couple className="absolute inset-x-0 bottom-0 mx-auto h-[92%]" />
        </motion.div>

        <div>
          <GuestLine lang={lang} guest={guest} />
          <OpenButtons lang={lang} onOpen={onOpen} className="mt-5" />
        </div>
      </div>
    </motion.div>
  );
}

/** First screen: the film. It runs while in view, and a tap on either side moves between shots. */
function Hero({ w, lang, guest, reduced, opened }: ProCtx) {
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { amount: 0.35 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const shot = SHOTS[index];
  const playing = opened && inView && !paused && !reduced;

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setIndex((n) => (n + 1) % SHOTS.length), shot.hold * 1000);
    return () => clearTimeout(timer);
  }, [playing, index, shot.hold]);

  const step = (by: number) => setIndex((n) => (n + by + SHOTS.length) % SHOTS.length);
  const camera = { duration: shot.hold, ease: [0.4, 0, 0.4, 1] as const };
  const farZoom = 1 + (shot.zoom - 1) * FAR_LAYER;

  return (
    <section ref={section} id="utama" className="relative isolate h-dvh overflow-hidden bg-[#163f50]">
      <div className="senja-world absolute inset-0" data-paused={!playing}>
        <motion.div className="absolute inset-0" style={{ transformOrigin: ORIGIN }} initial={{ scale: reduced ? farZoom : 1.05 }} animate={{ scale: farZoom }} transition={camera}>
          <Canvas>
            <BackWorld />
            <Wau className="absolute left-[76%] top-[40%] w-[15%]" />
            <Egrets className="absolute left-0 top-[35%] w-[17%]" />
          </Canvas>
        </motion.div>
        <motion.div className="absolute inset-0" style={{ transformOrigin: ORIGIN }} initial={{ scale: reduced ? shot.zoom : 1.1 }} animate={{ scale: shot.zoom }} transition={camera}>
          <Canvas>
            <FrontWorld />
            <div className="senja-walk absolute left-[34.4%] top-[60.6%] w-[31.25%]">
              <Couple className="block w-full" />
            </div>
            <PadiClump className="absolute -left-[3%] top-[76%] w-[36%]" />
            <PadiClump className="absolute -right-[4%] top-[75%] w-[38%] -scale-x-100" delay={-2.4} />
          </Canvas>
        </motion.div>
        <div className="absolute inset-x-0 top-0 h-2/5" style={{ background: "linear-gradient(180deg, rgba(14,42,52,.45), rgba(14,42,52,0))" }} />
        <motion.div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(14,42,52,.9) 0%, rgba(14,42,52,.78) 46%, rgba(14,42,52,.14) 80%, rgba(14,42,52,0) 100%)" }}
          initial={false}
          animate={{ opacity: reduced ? 0.8 : shot.veil }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
      </div>

      {reduced ? (
        <div className={`absolute inset-x-0 top-[clamp(5.5rem,15dvh,8.5rem)] px-7 text-center ${TEXT_SHADOW}`}>
          <p className={LABEL}>{t(w.title, lang)}</p>
          <p className={`${SCRIPT} mt-4 text-[3rem]`}>
            {w.couple.groomShort} &amp; {w.couple.brideShort}
          </p>
          <p className="mt-5 font-serif text-xl text-white">{formatDate(w.start, lang)}</p>
          <p className="mt-1 font-sans text-sm text-[#ffdca8]">{formatTimeRange(w, lang)}</p>
          <p className="mt-4 font-serif text-lg text-white">{w.venue.name}</p>
        </div>
      ) : (
        <>
          <div className="absolute inset-x-5 top-[calc(env(safe-area-inset-top)+3.7rem)] flex items-center gap-1.5">
            {SHOTS.map((item, n) => (
              <span key={item.id} className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/30">
                {n < index && <span className="block h-full bg-white" />}
                {n === index && (
                  <motion.span
                    key={`${index}-${playing}`}
                    className="block h-full origin-left bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: playing ? 1 : 0 }}
                    transition={{ duration: playing ? item.hold : 0, ease: "linear" }}
                  />
                )}
              </span>
            ))}
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? words(lang, "Main semula", "Play") : words(lang, "Jeda", "Pause")}
              aria-pressed={paused}
              className="-my-3 -mr-2 flex h-9 w-9 items-center justify-center text-white"
            >
              {paused ? <Play size={14} /> : <Pause size={14} />}
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+8rem)] top-[calc(env(safe-area-inset-top)+6.5rem)] z-10 flex">
            <button type="button" onClick={() => step(-1)} aria-label={words(lang, "Babak sebelum", "Previous scene")} className="flex-1" />
            <button type="button" onClick={() => step(1)} aria-label={words(lang, "Babak seterusnya", "Next scene")} className="flex-1" />
          </div>

          <AnimatePresence mode="wait">
            {opened && (
              <motion.div
                key={shot.id}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                className={`pointer-events-none absolute inset-x-0 top-[clamp(6.25rem,16dvh,9rem)] z-20 px-7 text-center ${TEXT_SHADOW}`}
              >
                <Shot id={shot.id} w={w} lang={lang} guest={guest} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <ScrollCue lang={lang} opened={opened} className="z-20 rounded-full bg-[#0e2a34]/55 px-4 py-1 text-white" />
    </section>
  );
}

/** The sun on the horizon, used between the couple's names. */
function SunRule() {
  return (
    <svg viewBox="0 0 120 26" className="h-6 w-28 text-gold" aria-hidden>
      <path d="M44 20a16 16 0 0 1 32 0Z" fill="currentColor" opacity="0.85" />
      <path d="M0 20H120" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** /pro/senja: the card as a short film, a couple walking the padi fields at dusk. */
export function SenjaCard({ fontClass }: { fontClass: string }) {
  return (
    <ProShell
      theme="pro-senja"
      fontClass={fontClass}
      Cover={Cover}
      Hero={Hero}
      ornament={<SunRule />}
      fullNameClass="font-serif text-[1.25rem] font-medium uppercase leading-snug tracking-[0.08em] text-[var(--heading)]"
      cardClass="rounded-t-[11rem] bg-[var(--paper)] !pt-24"
      cardStyle={{ boxShadow: "inset 0 0 0 1px var(--card-line)" }}
    />
  );
}