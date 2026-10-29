"use client";

import { motion, useTransform } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { s, t } from "@/lib/i18n";
import { formatDate, formatTimeRange } from "@/lib/format";
import type { L } from "@/lib/types";
import type { DesignCtx } from "../DesignShell";
import { Act, EnterCue, Flood, SceneFrame, useSceneProgress } from "../scene";

const LINES: Record<"letter" | "open" | "from" | "sincerely" | "on" | "at" | "airmail", L> = {
  letter: { ms: "Sepucuk surat untuk anda", en: "A letter for you" },
  open: { ms: "Buka surat", en: "Open the letter" },
  from: { ms: "Daripada", en: "From" },
  sincerely: { ms: "Yang ikhlas,", en: "With love," },
  on: { ms: "pada", en: "on" },
  at: { ms: "bertempat di", en: "at" },
  airmail: { ms: "MELALUI UDARA", en: "BY AIR MAIL" },
};

const INK = "#1b2a6b";
const CHEVRON = "repeating-linear-gradient(135deg, #c8323b 0 14px, #f3f7fb 14px 22px, #1b3f8f 22px 36px, #f3f7fb 36px 44px)";
const RULED: CSSProperties = {
  backgroundColor: "#f3f7fb",
  backgroundImage:
    "linear-gradient(90deg, transparent 0 30px, rgba(200,50,59,.45) 30px 31px, transparent 31px), repeating-linear-gradient(to bottom, transparent 0 23px, rgba(27,63,143,.16) 23px 24px)",
};

/** A made-up stamp: perforated edge, a bunga raya, a value. */
function Stamp({ rotate = 0, tint = "#c8323b" }: { rotate?: number; tint?: string }) {
  return (
    <div
      className="relative h-16 w-[3.25rem] bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,.2)]"
      style={{
        transform: `rotate(${rotate}deg)`,
        WebkitMask: "radial-gradient(circle 3px at 3px 3px, transparent 98%, #000) -3px -3px / 7px 7px",
        mask: "radial-gradient(circle 3px at 3px 3px, transparent 98%, #000) -3px -3px / 7px 7px",
      }}
    >
      <div className="flex h-full flex-col items-center justify-between border p-0.5" style={{ borderColor: tint, background: `${tint}14` }}>
        <svg viewBox="-12 -12 24 24" className="w-7" aria-hidden>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} rx="4" ry="9" cy="-5" transform={`rotate(${r})`} fill={tint} opacity="0.85" />
          ))}
          <circle r="2.4" fill="#f8db8a" />
        </svg>
        <span className="font-sans text-[0.5rem] font-bold" style={{ color: tint }}>
          50 sen
        </span>
      </div>
    </div>
  );
}

function Postmark({ date }: { date: string }) {
  return (
    <svg viewBox="0 0 120 64" className="absolute right-6 top-7 w-28 opacity-75" aria-hidden>
      <circle cx="32" cy="32" r="26" fill="none" stroke={INK} strokeWidth="1.6" />
      <circle cx="32" cy="32" r="18" fill="none" stroke={INK} strokeWidth="0.8" />
      <text x="32" y="30" textAnchor="middle" fontSize="7" fontFamily="var(--font-d-ui)" fill={INK}>
        KELANA JAYA
      </text>
      <text x="32" y="40" textAnchor="middle" fontSize="7" fontFamily="var(--font-d-ui)" fill={INK}>
        {date}
      </text>
      {[22, 30, 38].map((y) => (
        <path key={y} d={`M60 ${y} q 7 -4 14 0 t 14 0 t 14 0 t 14 0`} fill="none" stroke={INK} strokeWidth="1.4" />
      ))}
    </svg>
  );
}

function Panel({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`absolute inset-x-0 overflow-hidden pl-10 pr-4 ${className}`} style={{ ...RULED, color: INK, backfaceVisibility: "hidden", ...style }}>
      {children}
    </div>
  );
}

/** /surat opening: an airmail envelope turns over, opens, and the letter unfolds. */
export function SuratScene({ w, lang, guest, reduced, enter }: DesignCtx) {
  const { ref, p } = useSceneProgress(reduced, 0.8);
  const to = guest || s("guest", lang);
  const dateDots = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Kuala_Lumpur" })
    .format(new Date(w.start))
    .replace(/\//g, ".");

  // envelope: address side turns away, back turns in, flap lifts, envelope sinks
  const frontTurn = useTransform(p, [0.08, 0.14], [0, 90]);
  const backTurn = useTransform(p, [0.14, 0.2], [-90, 0]);
  const flap = useTransform(p, [0.21, 0.28], [0, 180]);
  const flapZ = useTransform(p, (v) => (v < 0.245 ? 6 : 1));
  // The open flap would sit in front of the rising letter, so it tucks away first.
  const flapO = useTransform(p, [0.28, 0.3], [1, 0]);
  const envY = useTransform(p, [0.36, 0.46], ["0vh", "70vh"]);
  const envO = useTransform(p, [0.4, 0.46], [1, 0]);
  // letter: rises out, settles at centre, then unfolds top and bottom
  const letterY = useTransform(p, [0.28, 0.38, 0.46], ["0vh", "-22vh", "0vh"]);
  const topFold = useTransform(p, [0.47, 0.58], [-180, 0]);
  const bottomFold = useTransform(p, [0.6, 0.71], [180, 0]);

  const panelH = "min(26dvh, 220px)";

  return (
    <SceneFrame sceneRef={ref} reduced={reduced} length="h-[500vh]" style={{ background: "radial-gradient(90% 70% at 50% 40%, #e4ecf4 0%, #c3d3e2 100%)" }}>
      {!reduced && (
        <Act p={p} at={[-1, 0, 0.06, 0.1]} className="top-[11%]">
          <p className="font-script text-[2.6rem] leading-none" style={{ color: INK }}>
            {t(LINES.letter, lang)}
          </p>
        </Act>
      )}

      <div className="absolute left-1/2 top-1/2 w-[min(88vw,390px)] -translate-x-1/2 -translate-y-1/2" style={{ perspective: 1200 }}>
        {/* The letter sits under the envelope layer. The envelope has no back panel, so
            the letter shows only where the open flap and the pocket leave a gap. */}
        <motion.div className="absolute inset-x-[3%] z-[1]" style={{ y: reduced ? "0vh" : letterY, top: `calc(50% - ${panelH} * 1.5)`, transformStyle: "preserve-3d" }}>
          <div className="relative" style={{ height: `calc(${panelH} * 3)`, transformStyle: "preserve-3d" }}>
            <Panel className="pt-5" style={{ top: panelH, height: panelH }}>
              <p className="font-script text-[1.75rem] leading-[24px]">{w.couple.groomFull}</p>
              <p className="my-[6px] font-script text-2xl leading-none text-[#c8323b]">&amp;</p>
              <p className="font-script text-[1.75rem] leading-[24px]">{w.couple.brideFull}</p>
            </Panel>

            <motion.div
              className="absolute inset-x-0 top-0"
              style={{ height: panelH, rotateX: reduced ? 0 : topFold, transformOrigin: "50% 100%", transformStyle: "preserve-3d", z: 1 }}
            >
              <Panel className="h-full pt-[18px]">
                <p className="font-script text-[1.4rem] leading-[24px]">Assalamualaikum {to},</p>
                <p className="font-script text-[1.1rem] leading-[24px]">{t(w.message, lang)}</p>
              </Panel>
              <Panel className="flex h-full items-center justify-center !pl-6" style={{ transform: "rotateX(180deg)", backgroundImage: "none" }}>
                <p className="font-script text-3xl">{to}</p>
              </Panel>
            </motion.div>

            <motion.div
              className="absolute inset-x-0"
              style={{ top: `calc(${panelH} * 2)`, height: panelH, rotateX: reduced ? 0 : bottomFold, transformOrigin: "50% 0%", transformStyle: "preserve-3d", z: -1 }}
            >
              <Panel className="h-full pt-[18px]">
                <p className="font-script text-[1.1rem] leading-[24px]">
                  {t(LINES.on, lang)} {formatDate(w.start, lang)}, {formatTimeRange(w, lang)}, {t(LINES.at, lang)} {w.venue.name}, {w.venue.address}.
                </p>
                <p className="mt-[24px] font-script text-[1.1rem] leading-[24px]">{t(LINES.sincerely, lang)}</p>
                <p className="font-script text-[1.4rem] leading-[24px]">{w.hosts}</p>
              </Panel>
              <Panel className="h-full" style={{ transform: "rotateX(180deg)", backgroundImage: "none" }}>
                {null}
              </Panel>
            </motion.div>
          </div>
        </motion.div>

        {!reduced && (
          <motion.div className="relative z-[2] aspect-[1.55]" style={{ y: envY, opacity: envO, transformStyle: "preserve-3d" }}>
            {/* address side */}
            <motion.div className="absolute inset-0 z-[7] p-2 shadow-[0_20px_40px_-18px_rgba(27,42,107,.5)]" style={{ background: CHEVRON, rotateY: frontTurn, backfaceVisibility: "hidden" }}>
              <div className="relative h-full bg-[#f3f7fb] px-5 py-4" style={{ color: INK }}>
                <div className="absolute right-4 top-3 flex gap-1.5">
                  <Stamp rotate={-4} />
                  <Stamp rotate={3} tint="#1b3f8f" />
                </div>
                <Postmark date={dateDots} />
                <p className="inline-block border border-[#1b3f8f] px-1.5 py-0.5 font-sans text-[0.55rem] font-bold tracking-wider text-[#1b3f8f]">
                  PAR AVION · {t(LINES.airmail, lang)}
                </p>
                <div className="absolute bottom-[18%] left-[12%] right-[10%]">
                  <p className="font-sans text-[0.6rem] uppercase">{s("to", lang)}:</p>
                  <p className="border-b border-[#1b2a6b]/25 font-script text-[1.9rem] leading-tight">{to}</p>
                  <p className="border-b border-[#1b2a6b]/25 font-script text-xl leading-tight">{w.venue.address}</p>
                </div>
                <p className="absolute bottom-2 left-5 font-sans text-[0.55rem]">
                  {t(LINES.from, lang)}: {w.hosts}
                </p>
              </div>
            </motion.div>

            {/* back: flap, pocket */}
            <motion.div className="absolute inset-0" style={{ rotateY: backTurn, transformStyle: "preserve-3d" }}>
              <div className="absolute inset-0 z-[1] border-8" style={{ borderImage: `${CHEVRON} 8` }} />
              <svg viewBox="0 0 155 100" preserveAspectRatio="none" className="absolute inset-0 z-[4] h-full w-full drop-shadow-[0_-2px_2px_rgba(27,42,107,.12)]" aria-hidden>
                <path d="M0 0 L78 56 L0 100 Z M155 0 L77 56 L155 100 Z M0 100 L77.5 48 L155 100 Z" fill="#f3f7fb" />
                <path d="M0 100 L77.5 48 L155 100" fill="none" stroke="#c3d3e2" strokeWidth="0.6" />
              </svg>
              <motion.div className="absolute inset-x-0 top-0 h-[58%]" style={{ rotateX: flap, zIndex: flapZ, opacity: flapO, transformOrigin: "50% 0%" }}>
                <svg viewBox="0 0 155 58" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
                  <path d="M0 0 L155 0 L77.5 56 Z" fill="#edf3f9" stroke="#c3d3e2" strokeWidth="0.6" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {!reduced && <EnterCue p={p} label={t(LINES.open, lang)} onEnter={enter} className="text-[#1b2a6b]" />}
      <Flood p={p} from={0.9} background="var(--bg)" />
    </SceneFrame>
  );
}