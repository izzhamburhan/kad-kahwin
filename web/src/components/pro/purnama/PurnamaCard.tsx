"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { formatDate, formatDateDots, formatHijri } from "@/lib/format";
import { ProShell, type CoverProps, type ProCtx } from "../ProShell";
import { EASE, GuestLine, OpenButtons, ScrollCue, rise } from "../parts";

const SKY = "radial-gradient(110% 70% at 50% 18%, #1d2c5e 0%, #0f1a3d 50%, #070d22 100%)";

// A fixed seed so the server and the browser scatter the same stars.
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = seeded(1407);
const STARS = Array.from({ length: 90 }, () => ({ x: rnd() * 100, y: rnd() * 100, r: rnd() < 0.12 ? 1.6 : 0.5 + rnd() * 0.7, o: 0.35 + rnd() * 0.6, tw: rnd() < 0.3 }));

function Stars({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.18} fill="#fffbea" opacity={s.o} className={s.tw ? "twinkle" : undefined} style={s.tw ? { animationDelay: `${(i % 7) * 0.45}s` } : undefined} />
      ))}
    </svg>
  );
}

/** A crescent: a disc with an offset disc masked out, glowing softly. */
function Crescent({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <mask id={`cm${id}`}>
          <circle cx="50" cy="50" r="34" fill="#fff" />
          <circle cx="64" cy="40" r="30" fill="#000" />
        </mask>
        <radialGradient id={`cg${id}`} cx="40%" cy="55%" r="60%">
          <stop offset="0" stopColor="#fff8e1" />
          <stop offset="1" stopColor="#e9d8a6" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="34" fill={`url(#cg${id})`} mask={`url(#cm${id})`} style={{ filter: "drop-shadow(0 0 10px rgba(255,240,200,.55))" }} />
    </svg>
  );
}

/** Divider: a thin line through a small crescent between two stars. */
function MoonRule() {
  return (
    <div className="flex items-center gap-2.5 text-[#e9d8a6]" aria-hidden>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9d1e6]" />
      <svg viewBox="0 0 10 10" className="h-1.5 w-1.5"><path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="currentColor" /></svg>
      <Crescent className="h-5 w-5" />
      <svg viewBox="0 0 10 10" className="h-1.5 w-1.5"><path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="currentColor" /></svg>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9d1e6]" />
    </div>
  );
}

/** Purnama cover: a night sky with a crescent. Opening rushes the stars past and lifts the moon away. */
function Cover({ w, lang, guest, onOpen }: CoverProps) {
  return (
    <motion.div className="fixed inset-0 z-50 overflow-hidden" style={{ background: SKY }} exit={{ opacity: 0, transition: { delay: 0.55, duration: 0.6 } }}>
      <motion.div className="absolute inset-0" exit={{ scale: 2.4, opacity: 0, transition: { duration: 1.1, ease: [0.55, 0, 0.8, 0.4] } }}>
        <Stars className="absolute inset-0 h-full w-full" />
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-[11%] w-28 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1.4, ease: EASE } }}
        exit={{ y: -260, opacity: 0, transition: { duration: 1, ease: EASE } }}
      >
        <Crescent />
      </motion.div>
      <motion.div className="relative mx-auto flex h-full max-w-[480px] flex-col items-center justify-end px-10 pb-[calc(env(safe-area-inset-bottom)+3rem)] text-center" exit={{ opacity: 0, y: 20, transition: { duration: 0.4 } }}>
        <p className="font-sans text-[0.66rem] uppercase tracking-[0.42em] text-gold">Walimatul Urus</p>
        <p className="mt-4 font-script text-[2.9rem] leading-[1.05] text-[var(--heading)]">
          {w.couple.groomShort} <span className="text-gold">&amp;</span> {w.couple.brideShort}
        </p>
        <p className="mt-4 font-sans text-xs tracking-[0.32em] text-ink-soft">{formatDateDots(w.start)}</p>
        <div className="my-6">
          <MoonRule />
        </div>
        <GuestLine lang={lang} guest={guest} />
        <OpenButtons lang={lang} onOpen={onOpen} className="mt-8" />
      </motion.div>
    </motion.div>
  );
}

/** First screen: a full moon rises behind the names. */
function Hero({ w, lang, opened }: ProCtx) {
  return (
    <section id="utama" className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-10 text-center" style={{ background: SKY }}>
      <Stars className="absolute inset-0 -z-10 h-full w-full" />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[min(92vw,420px)] -translate-x-1/2 -translate-y-[58%] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(255,248,225,.2) 0%, rgba(233,216,166,.1) 45%, rgba(233,216,166,.03) 75%, transparent 100%)" }}
        initial={{ opacity: 0, y: 60 }}
        animate={opened ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 2.2, ease: EASE, delay: 0.2 }}
      />
      <motion.div {...rise(opened, 0)}>
        <Crescent className="mx-auto h-12 w-12" />
      </motion.div>
      <motion.p {...rise(opened, 1)} className="mt-5 font-sans text-[0.68rem] uppercase tracking-[0.42em] text-gold">
        Walimatul Urus
      </motion.p>
      <motion.p {...rise(opened, 2)} className="mt-6 font-script text-[3.7rem] leading-[1] text-[var(--heading)]">
        {w.couple.groomShort}
      </motion.p>
      <motion.p {...rise(opened, 3)} className="my-1 font-script text-3xl text-gold">
        &amp;
      </motion.p>
      <motion.p {...rise(opened, 4)} className="font-script text-[3.7rem] leading-[1] text-[var(--heading)]">
        {w.couple.brideShort}
      </motion.p>
      <motion.div {...rise(opened, 5)} className="mt-8">
        <MoonRule />
        <p className="mt-5 font-serif text-lg text-ink">{formatDate(w.start, lang)}</p>
        <p className="font-serif text-sm italic text-ink-soft">{formatHijri(w.start)}</p>
        <p className="mt-3 font-sans text-[0.66rem] uppercase tracking-[0.26em] text-ink-soft">{w.venue.name}</p>
      </motion.div>
      <ScrollCue lang={lang} opened={opened} />
    </section>
  );
}

/** /pro/purnama: navy night, silver stars and a crescent moon. */
export function PurnamaCard({ fontClass }: { fontClass: string }) {
  return (
    <ProShell
      theme="pro-purnama"
      fontClass={fontClass}
      Cover={Cover}
      Hero={Hero}
      ornament={<MoonRule />}
      backdrop={<Stars className="pointer-events-none absolute inset-0 h-full w-full opacity-40" />}
      fullNameClass="font-script text-[1.9rem] leading-snug text-[var(--heading)]"
      cardClass="rounded-t-[11rem] rounded-b-[6px] bg-bg-2/90 !pt-24"
      cardStyle={{ boxShadow: "inset 0 0 0 1px rgba(201,209,230,.35), 0 30px 60px -30px rgba(0,0,0,.8)" }}
    />
  );
}