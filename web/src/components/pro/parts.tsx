"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { s } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

// Pieces every pro card repeats: the open buttons on the cover, the guest's name,
// the hero's staggered entrance and the scroll cue at its foot.

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Props for the n-th hero element: it rises into place once the cover has been opened. */
export const rise = (opened: boolean, i: number, delay = 0.35) => ({
  initial: { opacity: 0, y: 16 },
  animate: opened ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
  transition: { duration: 1, ease: EASE, delay: delay + i * 0.14 },
});

export function OpenButtons({ lang, onOpen, className = "", linkClass = "text-ink-soft" }: { lang: Lang; onOpen: (withMusic: boolean) => void; className?: string; linkClass?: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className={`flex flex-col items-center gap-3 ${className}`}>
      <button type="button" onClick={() => onOpen(true)} className="btn-gold min-w-56">
        {s("open", lang)}
      </button>
      <button type="button" onClick={() => onOpen(false)} className={`font-sans text-xs underline underline-offset-4 ${linkClass}`}>
        {s("openNoMusic", lang)}
      </button>
    </motion.div>
  );
}

/** "Kepada / <guest>" as printed on the cover. */
export function GuestLine({ lang, guest, className = "" }: { lang: Lang; guest: string; className?: string }) {
  return (
    <div className={className}>
      <p className="font-sans text-[0.7rem] text-ink-mute">{s("to", lang)}</p>
      <p className="mt-1 font-serif text-lg italic text-ink">{guest || s("guest", lang)}</p>
    </div>
  );
}

export function ScrollCue({ lang, opened, i = 7, className = "text-ink-mute" }: { lang: Lang; opened: boolean; i?: number; className?: string }) {
  return (
    <motion.div {...rise(opened, i)} className={`absolute bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] left-1/2 flex -translate-x-1/2 flex-col items-center ${className}`}>
      <span className="font-sans text-[0.65rem] tracking-[0.2em]">{s("scroll", lang)}</span>
      <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
        <ChevronDown size={18} />
      </motion.span>
    </motion.div>
  );
}