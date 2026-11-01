"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { formatDate, formatDateDots, formatHijri } from "@/lib/format";
import { s } from "@/lib/i18n";
import { ProShell, type CoverProps, type ProCtx } from "../ProShell";
import { Spray, SprigRule } from "./flora";

const EASE = [0.22, 1, 0.36, 1] as const;
const PAPER = "radial-gradient(120% 70% at 20% 0%, #fffdf8 0%, #f7f2e7 55%, #efe7d6 100%)";

/** Botani cover: a folded ivory card on linen, lifted away when opened. */
function Cover({ w, lang, guest, onOpen }: CoverProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ background: PAPER }}
      exit={{ y: "-100%", transition: { duration: 0.95, ease: EASE } }}
    >
      <Spray className="pointer-events-none absolute -left-6 -top-6 w-[62%] max-w-[300px]" />
      <Spray corner="br" slow className="pointer-events-none absolute -bottom-6 -right-6 w-[62%] max-w-[300px]" />

      <div className="relative mx-auto flex h-full max-w-[480px] flex-col items-center justify-center px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="w-full max-w-[19rem] rounded-[3px] bg-[#fffdf8] px-6 py-10 shadow-[0_24px_50px_-28px_rgba(60,70,50,.55)]"
          style={{ boxShadow: "inset 0 0 0 1px #c9d4c3, inset 0 0 0 6px #fffdf8, inset 0 0 0 7px #dfe6da, 0 24px 50px -28px rgba(60,70,50,.55)" }}
        >
          <p className="font-sans text-[0.66rem] uppercase tracking-[0.4em] text-gold">Walimatul Urus</p>
          <p className="mt-6 font-script text-[3.1rem] leading-[1.05] text-[var(--heading)]">{w.couple.groomShort}</p>
          <p className="my-1 font-script text-2xl text-gold">&amp;</p>
          <p className="font-script text-[3.1rem] leading-[1.05] text-[var(--heading)]">{w.couple.brideShort}</p>
          <p className="mt-6 font-sans text-xs tracking-[0.3em] text-ink-soft">{formatDateDots(w.start)}</p>
          <div className="mx-auto my-6 h-px w-14 bg-card-line" />
          <p className="font-sans text-[0.7rem] text-ink-mute">{s("to", lang)}</p>
          <p className="mt-1 font-serif text-lg italic text-ink">{guest || s("guest", lang)}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="mt-9 flex flex-col items-center gap-3">
          <button type="button" onClick={() => onOpen(true)} className="btn-gold min-w-56">
            {s("open", lang)}
          </button>
          <button type="button" onClick={() => onOpen(false)} className="font-sans text-xs text-ink-soft underline underline-offset-4">
            {s("openNoMusic", lang)}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/** First screen of the card: the names framed by greenery. */
function Hero({ w, lang, opened }: ProCtx) {
  const item = (i: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: opened ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 1, ease: EASE, delay: 0.35 + i * 0.14 },
  });
  return (
    <section id="utama" className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-8 text-center" style={{ background: PAPER }}>
      <Spray className="pointer-events-none absolute -left-8 -top-8 w-[68%] max-w-[330px]" />
      <Spray corner="tr" slow className="pointer-events-none absolute -right-8 -top-8 w-[46%] max-w-[220px] opacity-80" />
      <Spray corner="br" slow className="pointer-events-none absolute -bottom-10 -right-8 w-[64%] max-w-[310px]" />

      <motion.p {...item(0)} className="font-sans text-[0.7rem] uppercase tracking-[0.42em] text-gold">
        Walimatul Urus
      </motion.p>
      <motion.p {...item(1)} className="mt-8 font-script text-[4rem] leading-[1] text-[var(--heading)]">
        {w.couple.groomShort}
      </motion.p>
      <motion.div {...item(2)} className="my-3">
        <SprigRule />
      </motion.div>
      <motion.p {...item(3)} className="font-script text-[4rem] leading-[1] text-[var(--heading)]">
        {w.couple.brideShort}
      </motion.p>
      <motion.div {...item(4)} className="mt-9">
        <p className="font-serif text-xl text-ink">{formatDate(w.start, lang)}</p>
        <p className="font-serif text-sm italic text-ink-soft">{formatHijri(w.start)}</p>
        <p className="mt-3 font-sans text-[0.7rem] uppercase tracking-[0.25em] text-ink-soft">{w.venue.name}</p>
      </motion.div>

      <motion.div {...item(6)} className="absolute bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] flex flex-col items-center text-ink-mute">
        <span className="font-sans text-[0.65rem] tracking-[0.2em]">{s("scroll", lang)}</span>
        <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
          <ChevronDown size={18} />
        </motion.span>
      </motion.div>
    </section>
  );
}

/** /pro/botani: ivory paper and watercolour eucalyptus, in the calm style of the leading e-kad. */
export function BotaniCard({ fontClass }: { fontClass: string }) {
  return (
    <ProShell
      theme="pro-botani"
      fontClass={fontClass}
      Cover={Cover}
      Hero={Hero}
      ornament={<SprigRule />}
      fullNameClass="font-serif text-[1.3rem] font-semibold uppercase leading-snug tracking-[0.08em] text-[var(--heading)]"
      cardClass="rounded-[3px] bg-[#fffdf8]"
      cardStyle={{ boxShadow: "inset 0 0 0 1px #c9d4c3, inset 0 0 0 7px #fffdf8, inset 0 0 0 8px #dfe6da, 0 24px 50px -30px rgba(60,70,50,.5)" }}
    />
  );
}