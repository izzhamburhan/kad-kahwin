"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { formatDate, formatDateDots, formatHijri } from "@/lib/format";
import { s } from "@/lib/i18n";
import { Bismillah } from "../../designs/scene";
import { ProShell, type CoverProps, type ProCtx } from "../ProShell";
import { ArchFrame, DoorLeaf, Khatam, KhatamRule, StarField } from "./geometry";

const EASE = [0.22, 1, 0.36, 1] as const;
const DOOR = { duration: 1.25, ease: [0.65, 0, 0.35, 1] as const };

/** Mihrab cover: carved double doors under one arch. Opening parts them onto the card. */
function Cover({ w, lang, guest, onOpen }: CoverProps) {
  return (
    <motion.div className="fixed inset-0 z-50 mx-auto max-w-[480px]" exit={{ opacity: 0, transition: { delay: DOOR.duration, duration: 0.01 } }}>
      <motion.div className="absolute inset-y-0 left-0 w-1/2" exit={{ x: "-100%", transition: DOOR }}>
        <DoorLeaf side="left" />
      </motion.div>
      <motion.div className="absolute inset-y-0 right-0 w-1/2" exit={{ x: "100%", transition: DOOR }}>
        <DoorLeaf side="right" />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.35 } }}
      >
        <div className="rounded-[2px] bg-[#141210]/85 px-7 py-9 backdrop-blur-[1px]">
          <Khatam size={26} className="mx-auto text-gold" />
          <p className="mt-4 font-sans text-[0.66rem] uppercase tracking-[0.42em] text-gold">Walimatul Urus</p>
          <p className="mt-5 font-script text-[2.6rem] leading-[1.05] text-[var(--heading)]">{w.couple.groomShort}</p>
          <p className="my-1 font-script text-2xl italic text-gold">&amp;</p>
          <p className="font-script text-[2.6rem] leading-[1.05] text-[var(--heading)]">{w.couple.brideShort}</p>
          <p className="mt-5 font-sans text-xs tracking-[0.3em] text-ink-soft">{formatDateDots(w.start)}</p>
          <div className="mx-auto my-5 h-px w-12 bg-card-line" />
          <p className="font-sans text-[0.7rem] text-ink-mute">{s("to", lang)}</p>
          <p className="mt-1 font-serif text-lg italic text-ink">{guest || s("guest", lang)}</p>
        </div>
        <div className="mt-8 flex flex-col items-center gap-3">
          <button type="button" onClick={() => onOpen(true)} className="btn-gold min-w-56">
            {s("open", lang)}
          </button>
          <button type="button" onClick={() => onOpen(false)} className="font-sans text-xs text-ink-soft underline underline-offset-4">
            {s("openNoMusic", lang)}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** First screen: the arch draws itself in gold, then the words settle inside it. */
function Hero({ w, lang, opened }: ProCtx) {
  const item = (i: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: opened ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: 1, ease: EASE, delay: 0.9 + i * 0.14 },
  });
  return (
    <section
      id="utama"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: "radial-gradient(70% 50% at 50% 42%, #2a241c 0%, #121110 70%)" }}
    >
      <StarField className="absolute inset-0" />
      <div className="relative flex h-[min(76dvh,640px)] w-[min(84vw,360px)] flex-col items-center justify-center px-7 pt-16 text-center">
        <ArchFrame drawn={opened} className="absolute inset-0 h-full w-full" />
        <motion.div {...item(0)}>
          <Bismillah className="text-[var(--heading)]" />
        </motion.div>
        <motion.p {...item(1)} className="mt-5 font-sans text-[0.66rem] uppercase tracking-[0.42em] text-gold">
          Walimatul Urus
        </motion.p>
        <motion.p {...item(2)} className="mt-6 font-script text-[3.1rem] leading-[1.02] text-[var(--heading)]">
          {w.couple.groomShort}
        </motion.p>
        <motion.p {...item(3)} className="my-1 font-script text-3xl italic text-gold">
          &amp;
        </motion.p>
        <motion.p {...item(4)} className="font-script text-[3.1rem] leading-[1.02] text-[var(--heading)]">
          {w.couple.brideShort}
        </motion.p>
        <motion.div {...item(5)} className="mt-6">
          <KhatamRule />
        </motion.div>
        <motion.div {...item(6)} className="mt-5">
          <p className="font-serif text-lg text-ink">{formatDate(w.start, lang)}</p>
          <p className="font-serif text-sm italic text-ink-soft">{formatHijri(w.start)}</p>
          <p className="mt-3 font-sans text-[0.66rem] uppercase tracking-[0.25em] text-ink-soft">{w.venue.name}</p>
        </motion.div>
      </div>

      <motion.div {...item(8)} className="absolute bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] flex flex-col items-center text-ink-mute">
        <span className="font-sans text-[0.65rem] tracking-[0.2em]">{s("scroll", lang)}</span>
        <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
          <ChevronDown size={18} />
        </motion.span>
      </motion.div>
    </section>
  );
}

/** /pro/mihrab: black and gold, a pointed arch and khatam stars. Islamic-contemporary e-kad. */
export function MihrabCard({ fontClass }: { fontClass: string }) {
  return (
    <ProShell
      theme="pro-mihrab"
      fontClass={fontClass}
      Cover={Cover}
      Hero={Hero}
      ornament={<KhatamRule />}
      backdrop={<StarField className="pointer-events-none absolute inset-0" opacity={0.05} />}
      cardClass="rounded-t-[11rem] bg-bg-2 !pt-24"
      cardStyle={{ boxShadow: "inset 0 0 0 1px rgba(201,165,90,.55), inset 0 0 0 7px #191715, inset 0 0 0 8px rgba(201,165,90,.25), 0 30px 60px -30px rgba(0,0,0,.8)" }}
    />
  );
}