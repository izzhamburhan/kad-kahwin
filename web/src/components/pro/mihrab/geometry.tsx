"use client";

import { motion } from "motion/react";
import { useId } from "react";

// Islamic-contemporary geometry for the Mihrab card: a pointed arch, khatam stars
// (two squares turned 45° to each other) and the door panels of the cover.

const GOLD = "#c9a55a";

/** The pointed arch in a 200x320 box, open at the bottom. */
export const ARCH_OUTER = "M6 320 V118 C6 66 52 36 100 6 C148 36 194 66 194 118 V320";
export const ARCH_INNER = "M14 320 V121 C14 73 57 45 100 17 C143 45 186 73 186 121 V320";

/** Arch outline that draws itself in once `drawn` turns true. (No non-scaling stroke here:
 *  it would measure the dash in screen units and stop the draw part-way.) */
export function ArchFrame({ drawn, className = "" }: { drawn: boolean; className?: string }) {
  const line = (d: string, width: number, delay: number) => (
    <motion.path
      d={d}
      fill="none"
      stroke={GOLD}
      strokeWidth={width}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={drawn ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], delay }}
    />
  );
  return (
    <svg viewBox="0 0 200 320" preserveAspectRatio="none" className={className} aria-hidden>
      {line(ARCH_OUTER, 0.8, 0.2)}
      {line(ARCH_INNER, 0.45, 0.45)}
    </svg>
  );
}

/** One eight-pointed khatam star. */
export function Khatam({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="-12 -12 24 24" width={size} height={size} className={className} aria-hidden>
      <rect x="-7" y="-7" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="-7" y="-7" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(45)" />
      <circle r="2.2" fill="currentColor" />
    </svg>
  );
}

/** Divider: two gold rules either side of a khatam. */
export function KhatamRule() {
  return (
    <div className="flex items-center gap-3 text-gold" aria-hidden>
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#c9a55a]" />
      <Khatam size={20} />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#c9a55a]" />
    </div>
  );
}

/** A faint field of khatam stars, fading out towards the edges. */
export function StarField({ className = "", opacity = 0.09 }: { className?: string; opacity?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} width="100%" height="100%" aria-hidden style={{ opacity }}>
      <defs>
        <pattern id={`ks${id}`} width="48" height="48" patternUnits="userSpaceOnUse">
          <g transform="translate(24 24)" fill="none" stroke={GOLD} strokeWidth=".8">
            <rect x="-10" y="-10" width="20" height="20" />
            <rect x="-10" y="-10" width="20" height="20" transform="rotate(45)" />
          </g>
          <path d="M0 0 L10 10 M48 0 L38 10 M0 48 L10 38 M48 48 L38 38" stroke={GOLD} strokeWidth=".6" />
        </pattern>
        <radialGradient id={`kf${id}`} cx="50%" cy="45%" r="65%">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`km${id}`}>
          <rect width="100%" height="100%" fill={`url(#kf${id})`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#ks${id})`} mask={`url(#km${id})`} />
    </svg>
  );
}

/** One leaf of the cover's double door. Each holds the whole arch, so the arch splits as the doors part. */
export function DoorLeaf({ side }: { side: "left" | "right" }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(180deg, #1d1a17 0%, #141210 100%)" }}>
      <StarField className="absolute inset-0" opacity={0.12} />
      <svg
        viewBox="0 0 200 320"
        preserveAspectRatio="none"
        className={`absolute top-[9%] h-[82%] w-[180%] ${side === "left" ? "left-[10%]" : "right-[10%]"}`}
        aria-hidden
      >
        <path d={ARCH_OUTER} fill="#191715" stroke={GOLD} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
        <path d={ARCH_INNER} fill="none" stroke={GOLD} strokeWidth=".7" vectorEffect="non-scaling-stroke" opacity=".8" />
      </svg>
      {/* the meeting edge and its ring pull */}
      <div className={`absolute inset-y-0 w-px bg-[#c9a55a]/60 ${side === "left" ? "right-0" : "left-0"}`} />
      <div
        className={`absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border-2 border-[#c9a55a] ${side === "left" ? "right-3" : "left-3"}`}
        style={{ boxShadow: "0 2px 6px rgba(0,0,0,.6)" }}
      />
    </div>
  );
}