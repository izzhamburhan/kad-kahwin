"use client";

import { motion } from "motion/react";
import { formatDate, formatDateDots, formatHijri } from "@/lib/format";
import { ProShell, type CoverProps, type ProCtx } from "../ProShell";
import { EASE, GuestLine, OpenButtons, ScrollCue, rise } from "../parts";
import { Cluster, LeafRule } from "./leaves";

const GROUND = "radial-gradient(120% 80% at 50% 30%, #f6faf3 0%, #e7efe1 60%, #d9e6d2 100%)";
const PART = { duration: 1.1, ease: [0.65, 0, 0.35, 1] as const };

/** Tropika cover: the card hidden behind garden leaves, which part to either side when opened. */
function Cover({ w, lang, guest, onOpen }: CoverProps) {
  return (
    <motion.div className="fixed inset-0 z-50 overflow-hidden" style={{ background: GROUND }} exit={{ opacity: 0, transition: { delay: 0.7, duration: 0.5 } }}>
      {/* the leaves sit behind the card and frame it from the edges */}
      <motion.div
        className="pointer-events-none absolute -left-10 top-[3%] w-[60%] max-w-[300px]"
        initial={{ x: "-20%" }}
        animate={{ x: 0, transition: { duration: 1.2, ease: EASE } }}
        exit={{ x: "-110%", rotate: -12, transition: PART }}
      >
        <Cluster sway={false} />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -right-10 bottom-[2%] w-[60%] max-w-[300px]"
        initial={{ x: "20%" }}
        animate={{ x: 0, transition: { duration: 1.2, ease: EASE } }}
        exit={{ x: "110%", rotate: 12, transition: PART }}
      >
        <Cluster flip sway={false} />
      </motion.div>
      <motion.div className="absolute inset-0 mx-auto flex max-w-[480px] flex-col items-center justify-center px-8 text-center" exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.4 } }}>
        <div className="w-full max-w-[17.5rem] rounded-[999px_999px_14px_14px] bg-white/90 px-6 pb-9 pt-14 shadow-[0_24px_50px_-26px_rgba(20,60,40,.55)]">
          <p className="font-sans text-[0.64rem] uppercase tracking-[0.4em] text-gold">Walimatul Urus</p>
          <p className="mt-5 font-script text-[3.2rem] leading-[1] text-[var(--heading)]">{w.couple.groomShort}</p>
          <p className="font-script text-2xl text-[#ec6f5a]">&amp;</p>
          <p className="font-script text-[3.2rem] leading-[1] text-[var(--heading)]">{w.couple.brideShort}</p>
          <p className="mt-5 font-sans text-xs tracking-[0.3em] text-ink-soft">{formatDateDots(w.start)}</p>
          <GuestLine lang={lang} guest={guest} className="mt-6" />
        </div>
        <OpenButtons lang={lang} onOpen={onOpen} className="mt-8" />
      </motion.div>
    </motion.div>
  );
}

/** First screen: the names under an arch of leaves that keep moving in the breeze. */
function Hero({ w, lang, opened }: ProCtx) {
  return (
    <section id="utama" className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: GROUND }}>
      <Cluster className="pointer-events-none absolute -left-14 -top-10 -z-10 w-[58%] max-w-[290px]" />
      <Cluster flip className="pointer-events-none absolute -right-14 -top-16 -z-10 w-[44%] max-w-[220px] opacity-90" />
      <Cluster flip className="pointer-events-none absolute -bottom-6 -right-12 -z-10 w-[54%] max-w-[270px]" />
      <motion.p {...rise(opened, 0)} className="font-sans text-[0.68rem] uppercase tracking-[0.42em] text-gold">
        Walimatul Urus
      </motion.p>
      <motion.p {...rise(opened, 1)} className="mt-6 font-script text-[4.4rem] leading-[0.95] text-[var(--heading)]">
        {w.couple.groomShort}
      </motion.p>
      <motion.div {...rise(opened, 2)} className="my-2">
        <LeafRule />
      </motion.div>
      <motion.p {...rise(opened, 3)} className="font-script text-[4.4rem] leading-[0.95] text-[var(--heading)]">
        {w.couple.brideShort}
      </motion.p>
      <motion.div {...rise(opened, 4)} className="mt-8 rounded-full bg-white/70 px-6 py-3 backdrop-blur-sm">
        <p className="font-serif text-lg text-ink">{formatDate(w.start, lang)}</p>
        <p className="font-serif text-sm italic text-ink-soft">{formatHijri(w.start)}</p>
      </motion.div>
      <motion.p {...rise(opened, 5)} className="mt-4 font-sans text-[0.66rem] uppercase tracking-[0.26em] text-ink-soft">
        {w.venue.name}
      </motion.p>
      <ScrollCue lang={lang} opened={opened} />
    </section>
  );
}

/** /pro/tropika: a Malaysian garden of monstera, palm and bunga raya. */
export function TropikaCard({ fontClass }: { fontClass: string }) {
  return (
    <ProShell
      theme="pro-tropika"
      fontClass={fontClass}
      Cover={Cover}
      Hero={Hero}
      ornament={<LeafRule />}
      fullNameClass="font-serif text-[1.25rem] font-bold uppercase leading-snug tracking-[0.08em] text-[var(--heading)]"
      cardClass="rounded-t-[999px] rounded-b-[18px] bg-white/85 !pt-24"
      cardStyle={{ boxShadow: "inset 0 0 0 1px rgba(47,107,74,.28), 0 24px 50px -30px rgba(20,60,40,.5)" }}
    />
  );
}