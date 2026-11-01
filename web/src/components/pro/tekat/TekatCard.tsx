"use client";

import { motion } from "motion/react";
import { formatDate, formatDateDots, formatHijri } from "@/lib/format";
import { ProShell, type CoverProps, type ProCtx } from "../ProShell";
import { EASE, GuestLine, OpenButtons, ScrollCue, rise } from "../parts";

// Tekat: gold thread couched onto velvet. Every motif is stroked, not filled, with a short
// dash so the line reads as laid thread, and a soft shadow so it sits raised on the pile.

const VELVET = "radial-gradient(90% 60% at 50% 40%, #5a1a28 0%, #3f0f1a 55%, #2a0911 100%)";
const THREAD = { fill: "none", stroke: "#e2bd68", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeDasharray: "2.2 1.1" };
const RAISED = { filter: "drop-shadow(0 1.5px 1px rgba(0,0,0,.55))" };

/** Bunga tekat: an eight-petal flower with a padded centre, in a 60x60 box. */
function Bunga({ x, y, r = 1 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r})`}>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d="M0 -4 C -6 -10, -5 -20, 0 -24 C 5 -20, 6 -10, 0 -4 Z" {...THREAD} transform={`rotate(${i * 45})`} />
      ))}
      <circle r="4.5" fill="#e2bd68" />
      <circle r="2" fill="#f7dc96" />
    </g>
  );
}

/** A corner of couched vines and flowers, drawn for the top-left. */
function Corner({ className = "", flip = "" }: { className?: string; flip?: "x" | "y" | "xy" | "" }) {
  const scale = { "": undefined, x: "-1 1", y: "1 -1", xy: "-1 -1" }[flip];
  return (
    <svg viewBox="0 0 200 200" className={className} style={{ scale, ...RAISED }} aria-hidden>
      <path d="M8 8 C 60 12, 110 30, 150 70 M8 8 C 12 60, 30 110, 70 150" {...THREAD} />
      <path d="M40 18 C 46 34, 62 40, 78 36 M18 40 C 34 46, 40 62, 36 78" {...THREAD} />
      <path d="M95 40 C 104 54, 122 58, 134 50 M40 95 C 54 104, 58 122, 50 134" {...THREAD} />
      {[
        [70, 30, 7],
        [30, 70, 7],
        [116, 52, 6],
        [52, 116, 6],
      ].map(([cx, cy, r]) => (
        <path key={`${cx}${cy}`} d={`M${cx} ${cy - r} C ${cx + r} ${cy - r}, ${cx + r} ${cy + r}, ${cx} ${cy + r} C ${cx - r * 0.4} ${cy}, ${cx - r * 0.4} ${cy}, ${cx} ${cy - r} Z`} {...THREAD} />
      ))}
      <Bunga x={34} y={34} r={0.9} />
      <Bunga x={150} y={72} r={0.45} />
      <Bunga x={72} y={150} r={0.45} />
    </svg>
  );
}

/** Divider: two couched lines either side of a small bunga. */
function ThreadRule() {
  return (
    <svg viewBox="0 0 160 28" className="h-7 w-40" style={RAISED} aria-hidden>
      <path d="M6 14 H 60 M100 14 H 154" {...THREAD} />
      <path d="M60 14 C 66 6, 72 6, 76 14 M100 14 C 94 22, 88 22, 84 14" {...THREAD} />
      <Bunga x={80} y={14} r={0.42} />
    </svg>
  );
}

/** Tekat cover: a velvet curtain with a couched hem and fringe. Opening gathers it upward. */
function Cover({ w, lang, guest, onOpen }: CoverProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 origin-top overflow-hidden"
      style={{ background: VELVET }}
      exit={{ scaleY: 0, transition: { duration: 1.1, ease: [0.65, 0, 0.35, 1] } }}
    >
      {/* the pile: vertical folds of the curtain */}
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,.22) 0 2px, transparent 2px 38px, rgba(255,255,255,.035) 38px 46px, transparent 46px 64px)" }} />
      <Corner className="pointer-events-none absolute left-3 top-3 w-[38%] max-w-[180px]" />
      <Corner flip="x" className="pointer-events-none absolute right-3 top-3 w-[38%] max-w-[180px]" />
      {/* hem and fringe */}
      <div className="absolute inset-x-0 bottom-0 h-16">
        <svg viewBox="0 0 400 20" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-5 w-full" style={RAISED} aria-hidden>
          <path d="M0 6 H 400 M0 12 H 400" {...THREAD} />
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-11" style={{ backgroundImage: "repeating-linear-gradient(90deg, #c99a45 0 1.5px, transparent 1.5px 6px)", maskImage: "linear-gradient(#000 60%, transparent)" }} />
      </div>
      <motion.div className="relative mx-auto flex h-full max-w-[480px] flex-col items-center justify-center px-10 pb-12 text-center" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
        <ThreadRule />
        <p className="mt-6 font-sans text-[0.66rem] uppercase tracking-[0.42em] text-gold">Walimatul Urus</p>
        <p className="mt-5 font-script text-[3rem] leading-[1.02] text-[var(--heading)] [text-shadow:0_2px_0_rgba(0,0,0,.35)]">{w.couple.groomShort}</p>
        <p className="my-1 font-script text-2xl text-gold">&amp;</p>
        <p className="font-script text-[3rem] leading-[1.02] text-[var(--heading)] [text-shadow:0_2px_0_rgba(0,0,0,.35)]">{w.couple.brideShort}</p>
        <p className="mt-5 font-sans text-xs tracking-[0.3em] text-ink-soft">{formatDateDots(w.start)}</p>
        <GuestLine lang={lang} guest={guest} className="mt-7" />
        <OpenButtons lang={lang} onOpen={onOpen} className="mt-8" />
      </motion.div>
    </motion.div>
  );
}

/** First screen: the names on velvet framed by four couched corners. */
function Hero({ w, lang, opened }: ProCtx) {
  return (
    <section id="utama" className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-10 text-center" style={{ background: VELVET }}>
      {(["", "x", "y", "xy"] as const).map((f) => (
        <motion.div
          key={f || "tl"}
          className={`pointer-events-none absolute w-[36%] max-w-[170px] ${f.includes("x") ? "right-2" : "left-2"} ${f.includes("y") ? "bottom-2" : "top-2"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: opened ? 1 : 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
        >
          <Corner flip={f} className="block h-auto w-full" />
        </motion.div>
      ))}
      <motion.div {...rise(opened, 0)}>
        <ThreadRule />
      </motion.div>
      <motion.p {...rise(opened, 1)} className="mt-6 font-sans text-[0.68rem] uppercase tracking-[0.42em] text-gold">
        Walimatul Urus
      </motion.p>
      <motion.p {...rise(opened, 2)} className="mt-6 font-script text-[3.5rem] leading-[1] text-[var(--heading)] [text-shadow:0_2px_0_rgba(0,0,0,.35)]">
        {w.couple.groomShort}
      </motion.p>
      <motion.p {...rise(opened, 3)} className="my-1 font-script text-3xl text-gold">
        &amp;
      </motion.p>
      <motion.p {...rise(opened, 4)} className="font-script text-[3.5rem] leading-[1] text-[var(--heading)] [text-shadow:0_2px_0_rgba(0,0,0,.35)]">
        {w.couple.brideShort}
      </motion.p>
      <motion.div {...rise(opened, 5)} className="mt-8">
        <p className="font-serif text-lg text-ink">{formatDate(w.start, lang)}</p>
        <p className="font-serif text-sm italic text-ink-soft">{formatHijri(w.start)}</p>
        <p className="mt-3 font-sans text-[0.66rem] uppercase tracking-[0.26em] text-ink-soft">{w.venue.name}</p>
      </motion.div>
      <ScrollCue lang={lang} opened={opened} />
    </section>
  );
}

/** /pro/tekat: gold-thread tekat embroidery on maroon velvet, the traditional pattern card. */
export function TekatCard({ fontClass }: { fontClass: string }) {
  return (
    <ProShell
      theme="pro-tekat"
      fontClass={fontClass}
      Cover={Cover}
      Hero={Hero}
      ornament={<ThreadRule />}
      fullNameClass="font-script text-[1.75rem] leading-snug text-[var(--heading)]"
      cardClass="rounded-[4px] bg-bg-2"
      cardStyle={{ boxShadow: "inset 0 0 0 1px rgba(226,189,104,.55), inset 0 0 0 7px #44111c, inset 0 0 0 8px rgba(226,189,104,.3), 0 30px 60px -30px rgba(0,0,0,.8)" }}
    />
  );
}