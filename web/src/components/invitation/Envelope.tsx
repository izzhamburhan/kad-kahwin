"use client";

import { motion, useAnimate } from "motion/react";
import { useState } from "react";
import { s } from "@/lib/i18n";
import { formatDateDots } from "@/lib/format";
import type { Lang, Wedding } from "@/lib/types";
import { FloralCorner, SongketBand, WaxSeal } from "../ornaments";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The opening scene: a sealed envelope. Tapping the seal breaks it, the flap
 * swings open, the card rises out, and the envelope sinks away. `onOpened`
 * fires once the card has risen; the parent then flashes into the invitation.
 */
export function Envelope({
  w,
  lang,
  guest,
  reduced,
  onStart,
  onOpened,
}: {
  w: Wedding;
  lang: Lang;
  guest: string;
  reduced: boolean;
  onStart: () => void;
  onOpened: () => void;
}) {
  const [scope, animate] = useAnimate();
  const [opening, setOpening] = useState(false);
  const initials = `${w.couple.groomShort[0] ?? ""}${w.couple.brideShort[0] ?? ""}`;

  async function open() {
    if (opening) return;
    setOpening(true);
    onStart();
    if (reduced) return onOpened();

    await animate(
      ".seal",
      { scale: [1, 1.14, 0.4], rotate: [0, -10, 18], opacity: [1, 1, 0], y: [0, -4, 36] },
      { duration: 0.75, ease: "easeInOut", times: [0, 0.35, 1] },
    );
    await animate(".flap", { rotateX: 90 }, { duration: 0.42, ease: "easeIn" });
    // Past 90° the flap is behind the card, so drop it beneath the card layer.
    (scope.current.querySelector(".flap") as HTMLElement).style.zIndex = "1";
    await animate(".flap", { rotateX: 180 }, { duration: 0.42, ease: "easeOut" });
    await animate(".card", { y: "-62%" }, { duration: 1.05, ease: EASE });
    animate(".env-part", { y: 140, opacity: 0 }, { duration: 0.9, ease: "easeIn" });
    await animate(".card", { y: "-30%", scale: 1.22 }, { duration: 0.9, ease: EASE });
    onOpened();
  }

  return (
    <div className="songket-bg relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-bg px-6 py-16 text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 45% at 50% 48%, color-mix(in srgb, var(--gold) 22%, transparent), transparent 70%)" }}
      />
      <FloralCorner className="pointer-events-none absolute -left-6 -top-6 w-44 text-gold opacity-50" />
      <FloralCorner className="pointer-events-none absolute -bottom-6 -right-6 w-44 rotate-180 text-gold opacity-50" />
      <SongketBand className="absolute left-0 top-0 text-gold opacity-60" />
      <SongketBand className="absolute bottom-0 left-0 rotate-180 text-gold opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: opening ? 0 : 1, y: 0 }}
        transition={{ duration: opening ? 0.4 : 1.1, ease: EASE }}
        className="relative z-10 mb-10"
      >
        <p className="label text-gold">{w.title[lang]}</p>
        <p className="mt-5 font-serif text-sm italic text-ink-soft">{s("to", lang)}</p>
        <p className="mt-1 font-serif text-2xl text-ink">{guest || s("guest", lang)}</p>
      </motion.div>

      {/* Envelope */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
        className="relative z-10"
      >
        <motion.div
          animate={opening ? { y: 0 } : { y: [0, -7, 0] }}
          transition={opening ? { duration: 0.3 } : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            ref={scope}
            className="relative"
            style={{ width: "min(84vw, 340px)", aspectRatio: "1.42", perspective: "1100px" }}
          >
            {/* back */}
            <div
              className="env-part absolute inset-0 rounded-[6px]"
              style={{
                background: "linear-gradient(160deg, var(--paper-2), color-mix(in srgb, var(--paper-2) 70%, #000))",
                boxShadow: "0 30px 60px -20px rgba(0,0,0,.55), 0 10px 20px -10px rgba(0,0,0,.35)",
              }}
            />

            {/* card that rises out */}
            <div
              className="card paper absolute left-[6%] right-[6%] top-[5%] z-[2] flex h-[90%] flex-col items-center justify-center rounded-[4px] text-paper-ink"
              style={{ boxShadow: "0 6px 18px -8px rgba(0,0,0,.35)" }}
            >
              <div className="absolute inset-2 rounded-[2px] border" style={{ borderColor: "color-mix(in srgb, var(--gold) 55%, transparent)" }} />
              <p className="label text-[0.55rem]" style={{ color: "var(--gold-lo)" }}>
                {w.title[lang]}
              </p>
              <p className="mt-2 font-script text-[2.1rem] leading-none" style={{ color: "var(--paper-ink)" }}>
                {w.couple.groomShort} <span style={{ color: "var(--gold)" }}>&</span> {w.couple.brideShort}
              </p>
              <p className="label mt-3 text-[0.55rem] tracking-[0.4em]" style={{ color: "var(--gold-lo)" }}>
                {formatDateDots(w.start)}
              </p>
            </div>

            {/* front pocket */}
            <svg
              viewBox="0 0 100 70"
              preserveAspectRatio="none"
              className="env-part absolute inset-0 z-[3] h-full w-full"
              aria-hidden
            >
              <defs>
                <linearGradient id="pocketL" x1="0" x2="1">
                  <stop offset="0" stopColor="var(--paper)" />
                  <stop offset="1" stopColor="var(--paper-2)" />
                </linearGradient>
                <linearGradient id="pocketR" x1="1" x2="0">
                  <stop offset="0" stopColor="var(--paper)" />
                  <stop offset="1" stopColor="var(--paper-2)" />
                </linearGradient>
                <linearGradient id="pocketB" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0" stopColor="var(--paper)" />
                  <stop offset="1" stopColor="var(--paper-2)" />
                </linearGradient>
              </defs>
              <path d="M0 0 L52 38 L0 70 Z" fill="url(#pocketL)" />
              <path d="M100 0 L48 38 L100 70 Z" fill="url(#pocketR)" />
              <path d="M0 70 L50 32 L100 70 Z" fill="url(#pocketB)" />
              <path d="M0 70 L50 32 L100 70" fill="none" stroke="rgba(0,0,0,.08)" strokeWidth="0.4" />
              <path d="M8 66 L50 36 L92 66" fill="none" stroke="var(--gold)" strokeWidth="0.35" strokeDasharray="1 1.2" opacity="0.8" />
            </svg>

            {/* top flap */}
            <div
              className="flap env-part absolute inset-x-0 top-0 z-[4] h-[62%]"
              style={{ transformOrigin: "50% 0%", transformStyle: "preserve-3d" }}
            >
              <svg viewBox="0 0 100 62" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
                <defs>
                  <linearGradient id="flapG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--paper-2)" />
                    <stop offset="1" stopColor="var(--paper)" />
                  </linearGradient>
                </defs>
                <path d="M0 0 L100 0 L50 60 Z" fill="url(#flapG)" style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,.18))" }} />
                <path d="M7 3 L50 54 L93 3" fill="none" stroke="var(--gold)" strokeWidth="0.35" strokeDasharray="1 1.2" opacity="0.8" />
              </svg>
            </div>

            {/* seal */}
            <button
              type="button"
              onClick={open}
              aria-label={s("open", lang)}
              className="seal absolute left-1/2 top-[58%] z-[5] -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {!opening && (
                <motion.span
                  className="absolute inset-0 rounded-full border border-gold"
                  animate={{ scale: [1, 1.45], opacity: [0.7, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <WaxSeal initials={initials} size={84} />
            </button>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: opening ? 0.3 : 1, delay: opening ? 0 : 1.1 }}
        className="relative z-10 mt-12 flex flex-col items-center gap-5"
      >
        <p className="font-serif text-sm italic text-ink-soft">{s("tapSeal", lang)}</p>
        <button type="button" onClick={open} className="btn-gold">
          {s("open", lang)}
        </button>
      </motion.div>
    </div>
  );
}