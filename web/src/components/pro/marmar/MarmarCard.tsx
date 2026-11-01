"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { formatDate, formatDateDots, formatHijri } from "@/lib/format";
import type { Wedding } from "@/lib/types";
import { ProShell, type CoverProps, type ProCtx } from "../ProShell";
import { EASE, GuestLine, OpenButtons, ScrollCue, rise } from "../parts";

const GOLD = "linear-gradient(135deg, #f1d79a 0%, #c79a45 40%, #f3dfa8 55%, #9c7328 100%)";

/** Carrara marble: grey creases from turbulence noise, with a faint second vein in gold. */
function Marble({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} width="100%" height="100%" aria-hidden>
      <defs>
        <filter id={`mv${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="turbulence" baseFrequency="0.0035 0.011" numOctaves="5" seed="11" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.42  0 0 0 0 0.45  -5 0 0 0 0.7" />
        </filter>
        <filter id={`mg${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="turbulence" baseFrequency="0.006 0.003" numOctaves="3" seed="4" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.78  0 0 0 0 0.6  0 0 0 0 0.27  -8 0 0 0 0.55" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="#f6f4f1" />
      <rect width="100%" height="100%" filter={`url(#mv${id})`} opacity=".55" />
      <rect width="100%" height="100%" filter={`url(#mg${id})`} opacity=".45" />
    </svg>
  );
}

/** Gold rule with a lozenge at its centre. */
function GoldRule({ width = "w-16" }: { width?: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5" aria-hidden>
      <span className={`h-px ${width} bg-[#c79a45]`} />
      <span className="h-2 w-2 rotate-45" style={{ background: GOLD }} />
      <span className={`h-px ${width} bg-[#c79a45]`} />
    </div>
  );
}

/** The couple's initials stamped in a gold medallion. */
function Monogram({ w, size = "h-24 w-24" }: { w: Wedding; size?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-full ${size}`} style={{ background: GOLD, boxShadow: "0 10px 24px -10px rgba(110,80,20,.6), inset 0 1px 0 rgba(255,255,255,.6)" }}>
      <div className="absolute inset-[5px] rounded-full border border-[#fff3d0]/70" />
      <span className="font-script text-[1.9rem] italic leading-none text-white [text-shadow:0_1px_1px_rgba(90,60,10,.45)]">
        {w.couple.groomShort[0]}
        <span className="mx-0.5 text-[1.1rem]">&amp;</span>
        {w.couple.brideShort[0]}
      </span>
    </div>
  );
}

/** Marmar cover: a marble slab sealed with a gold monogram. Opening turns the seal and the slab dissolves. */
function Cover({ w, lang, guest, onOpen }: CoverProps) {
  return (
    <motion.div className="fixed inset-0 z-50 overflow-hidden" exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)", transition: { duration: 0.9, ease: EASE } }}>
      <Marble className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-4 border border-[#c79a45]/70" />
      <div className="pointer-events-none absolute inset-[22px] border border-[#c79a45]/35" />
      <div className="relative mx-auto flex h-full max-w-[480px] flex-col items-center justify-center px-10 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ rotate: 90, scale: 1.5, transition: { duration: 0.8, ease: EASE } }} transition={{ duration: 1, ease: EASE }}>
          <Monogram w={w} />
        </motion.div>
        <p className="mt-8 font-sans text-[0.66rem] uppercase tracking-[0.42em] text-gold-lo">Walimatul Urus</p>
        <p className="mt-4 font-script text-[2.7rem] leading-[1.05] text-[var(--heading)]">
          {w.couple.groomShort} <span className="italic text-gold">&amp;</span> {w.couple.brideShort}
        </p>
        <p className="mt-4 font-sans text-xs tracking-[0.32em] text-ink-soft">{formatDateDots(w.start)}</p>
        <div className="my-6">
          <GoldRule width="w-10" />
        </div>
        <GuestLine lang={lang} guest={guest} />
        <OpenButtons lang={lang} onOpen={onOpen} className="mt-9" />
      </div>
    </motion.div>
  );
}

/** First screen: a gold frame rules itself around the names on marble. */
function Hero({ w, lang, opened }: ProCtx) {
  const line = (axis: "x" | "y", delay: number) => ({
    initial: { [axis === "x" ? "scaleX" : "scaleY"]: 0 },
    animate: { [axis === "x" ? "scaleX" : "scaleY"]: opened ? 1 : 0 },
    transition: { duration: 1.2, ease: EASE, delay },
  });
  return (
    <section id="utama" className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-10 text-center">
      <Marble className="absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute inset-5" aria-hidden>
        <motion.span {...line("x", 0.2)} className="absolute inset-x-0 top-0 h-px origin-left bg-[#c79a45]" />
        <motion.span {...line("y", 0.5)} className="absolute inset-y-0 right-0 w-px origin-top bg-[#c79a45]" />
        <motion.span {...line("x", 0.8)} className="absolute inset-x-0 bottom-0 h-px origin-right bg-[#c79a45]" />
        <motion.span {...line("y", 1.1)} className="absolute inset-y-0 left-0 w-px origin-bottom bg-[#c79a45]" />
      </div>
      <motion.div {...rise(opened, 0)}>
        <Monogram w={w} size="h-16 w-16" />
      </motion.div>
      <motion.p {...rise(opened, 1)} className="mt-8 font-sans text-[0.66rem] uppercase tracking-[0.42em] text-gold-lo">
        Walimatul Urus
      </motion.p>
      <motion.p {...rise(opened, 2)} className="mt-6 font-script text-[3.6rem] leading-[1] text-[var(--heading)]">
        {w.couple.groomShort}
      </motion.p>
      <motion.p {...rise(opened, 3)} className="my-2 font-script text-3xl italic text-gold">
        &amp;
      </motion.p>
      <motion.p {...rise(opened, 4)} className="font-script text-[3.6rem] leading-[1] text-[var(--heading)]">
        {w.couple.brideShort}
      </motion.p>
      <motion.div {...rise(opened, 5)} className="mt-8">
        <GoldRule />
        <p className="mt-5 font-serif text-lg text-ink">{formatDate(w.start, lang)}</p>
        <p className="font-serif text-sm italic text-ink-soft">{formatHijri(w.start)}</p>
        <p className="mt-3 font-sans text-[0.66rem] uppercase tracking-[0.28em] text-ink-soft">{w.venue.name}</p>
      </motion.div>
      <ScrollCue lang={lang} opened={opened} />
    </section>
  );
}

/** /pro/marmar: white Carrara marble, gold hairlines and a monogram seal. */
export function MarmarCard({ fontClass }: { fontClass: string }) {
  return (
    <ProShell
      theme="pro-marmar"
      fontClass={fontClass}
      Cover={Cover}
      Hero={Hero}
      ornament={<GoldRule />}
      fullNameClass="font-script text-[1.85rem] leading-snug text-[var(--heading)]"
      cardClass="bg-white/80"
      cardStyle={{ boxShadow: "inset 0 0 0 1px rgba(199,154,69,.7), inset 0 0 0 6px rgba(255,255,255,.8), inset 0 0 0 7px rgba(199,154,69,.35), 0 24px 50px -30px rgba(60,50,30,.45)" }}
    />
  );
}