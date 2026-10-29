"use client";

import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { s } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

// Building blocks for the scroll-driven openings: a tall section with one
// sticky viewport, a 0..1 progress value, and helpers for words that come
// and go at set points of the scroll.

/** Scroll progress through the opening. Reduced motion pins it to one still frame. */
export function useSceneProgress(reduced: boolean, still: number) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const pinned = useMotionValue(still);
  return { ref, p: reduced ? pinned : scrollYProgress };
}

export function SceneFrame({
  sceneRef,
  reduced,
  length = "h-[460vh]",
  className = "",
  style,
  children,
}: {
  sceneRef: React.RefObject<HTMLElement | null>;
  reduced: boolean;
  length?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <section id="utama" ref={sceneRef} className={reduced ? "relative h-dvh" : `relative ${length}`}>
      <div className={`sticky top-0 h-dvh overflow-hidden ${className}`} style={style}>
        {children}
      </div>
    </section>
  );
}

/** Words visible between `inAt` and `outAt` of the scroll, drifting up as they pass. */
export function Act({
  p,
  at,
  className = "",
  children,
}: {
  p: MotionValue<number>;
  /** [fade in starts, fully in, starts leaving, gone]. A first value below 0 means
   *  visible from the start; a last value above 1 means it never leaves. */
  at: [number, number, number, number];
  className?: string;
  children: ReactNode;
}) {
  // Keep every offset inside 0..1: the browser's scroll timeline rejects anything outside it.
  const [a, b, c, d] = at;
  const fromStart = a < 0;
  const toEnd = d > 1;
  const input = fromStart && toEnd ? [0, 1] : fromStart ? [0, c, d] : toEnd ? [a, b, 1] : at;
  const output = fromStart && toEnd ? [1, 1] : fromStart ? [1, 1, 0] : toEnd ? [0, 1, 1] : [0, 1, 1, 0];
  const o = useTransform(p, input, output);
  const y = useTransform(p, [Math.max(0, a), Math.min(1, d)], ["3vh", "-3vh"]);
  return (
    <motion.div style={{ opacity: o, y }} className={`pointer-events-none absolute inset-x-0 mx-auto max-w-[480px] px-7 text-center ${className}`}>
      {children}
    </motion.div>
  );
}

/** "Kepada <guest>" line used at the top of every opening. */
export function ToGuest({ lang, guest, className = "" }: { lang: Lang; guest: string; className?: string }) {
  return (
    <p className={`font-sans text-sm ${className}`}>
      {s("to", lang)} <span className="font-medium">{guest || s("guest", lang)}</span>
    </p>
  );
}

export function Bismillah({ className = "" }: { className?: string }) {
  return (
    <p className={`font-arabic text-xl ${className}`} dir="rtl" lang="ar">
      بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
    </p>
  );
}

/** Tap-to-begin cue: starts the music and scrolls into the scene. Fades once scrolling starts. */
export function EnterCue({ p, label, onEnter, className = "" }: { p: MotionValue<number>; label: string; onEnter: () => void; className?: string }) {
  const o = useTransform(p, [0, 0.04], [1, 0]);
  return (
    <motion.button
      type="button"
      onClick={onEnter}
      style={{ opacity: o }}
      className={`absolute bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 rounded-full px-5 py-2 font-sans text-sm tracking-wide ${className}`}
    >
      {label}
      <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
        <ChevronDown size={20} />
      </motion.span>
    </motion.button>
  );
}

/** Closing wash into the page background, so the opening hands over without a seam. */
export function Flood({ p, from = 0.9, background }: { p: MotionValue<number>; from?: number; background: string }) {
  const o = useTransform(p, [from, Math.min(1, from + 0.09)], [0, 1]);
  return <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: o, background }} />;
}