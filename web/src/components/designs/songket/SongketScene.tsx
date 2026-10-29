"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { useId } from "react";
import { t } from "@/lib/i18n";
import { formatDate, formatHijri } from "@/lib/format";
import type { L } from "@/lib/types";
import type { DesignCtx } from "../DesignShell";
import { Act, Bismillah, EnterCue, Flood, SceneFrame, ToGuest, useSceneProgress } from "../scene";

const LINES: Record<"thesis" | "weave" | "begin", L> = {
  thesis: { ms: "Dua helai benang, ditenun menjadi sehelai kain.", en: "Two threads, woven into one cloth." },
  weave: { ms: "Tatal untuk menenun", en: "Scroll to weave" },
  begin: { ms: "Mula menenun", en: "Begin weaving" },
};

type Kind = "rebung" | "tabur" | "jalur" | "ketupat";
// Bottom to top, the order the weaver works in. The lattice rows in the middle
// become the ground of the medallion.
const ROWS: Kind[] = ["rebung", "jalur", "tabur", "jalur", "ketupat", "ketupat", "ketupat", "ketupat", "jalur", "tabur", "jalur", "rebung"];
const START = 0.08;
const STEP = 0.05;

function Motif({ kind }: { kind: Kind }) {
  const id = useId().replace(/:/g, "");
  const pid = `m${kind}${id}`;
  return (
    <svg width="100%" height="100%" className="block" aria-hidden>
      <defs>
        {kind === "rebung" && (
          <pattern id={pid} width="28" height="100%" patternUnits="userSpaceOnUse" viewBox="0 0 28 40" preserveAspectRatio="none">
            <rect width="28" height="40" fill="#4a0b19" />
            <path d="M0 37 L14 3 L28 37 Z" fill="#d9a441" />
            <path d="M6 37 L14 16 L22 37 Z" fill="#4a0b19" />
            <path d="M14 24 L17 30 L14 36 L11 30 Z" fill="#f3d28a" />
            <rect y="38" width="28" height="2" fill="#f3d28a" />
          </pattern>
        )}
        {kind === "tabur" && (
          <pattern id={pid} width="34" height="100%" patternUnits="userSpaceOnUse" viewBox="0 0 34 40" preserveAspectRatio="none">
            <rect width="34" height="40" fill="#30070f" />
            <g transform="translate(17 20)" fill="#d9a441">
              <ellipse rx="3" ry="8" />
              <ellipse rx="8" ry="3" />
              <circle r="2.4" fill="#f3d28a" />
            </g>
            <circle cx="0" cy="20" r="1.6" fill="#8f6420" />
            <circle cx="34" cy="20" r="1.6" fill="#8f6420" />
          </pattern>
        )}
        {kind === "jalur" && (
          <pattern id={pid} width="10" height="100%" patternUnits="userSpaceOnUse" viewBox="0 0 10 40" preserveAspectRatio="none">
            <rect width="10" height="40" fill="#5a0d1e" />
            <rect y="8" width="10" height="2" fill="#d9a441" />
            <rect y="19" width="10" height="2" fill="#f3d28a" />
            <rect y="30" width="10" height="2" fill="#d9a441" />
          </pattern>
        )}
        {kind === "ketupat" && (
          <pattern id={pid} width="24" height="100%" patternUnits="userSpaceOnUse" viewBox="0 0 24 40" preserveAspectRatio="none">
            <rect width="24" height="40" fill="#3a0a17" />
            <path d="M12 0 L24 20 L12 40 L0 20 Z" fill="none" stroke="#b8862e" strokeWidth="1.3" />
            <circle cx="12" cy="20" r="1.8" fill="#d9a441" />
          </pattern>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${pid})`} />
    </svg>
  );
}

/** One woven row. Even rows are thrown left to right, odd rows right to left. */
function Row({ p, i, kind }: { p: MotionValue<number>; i: number; kind: Kind }) {
  const a = START + i * STEP;
  const fromLeft = i % 2 === 0;
  const clip = useTransform(p, [a, a + STEP], fromLeft ? ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] : ["inset(0 0 0 100%)", "inset(0 0 0 0%)"]);
  return (
    <motion.div className="h-full" style={{ clipPath: clip }}>
      <Motif kind={kind} />
    </motion.div>
  );
}

/** The shuttle (torak) riding along the row being woven. */
function Shuttle({ p }: { p: MotionValue<number> }) {
  const end = START + ROWS.length * STEP;
  const pos = (v: number) => {
    const k = Math.min(ROWS.length - 1, Math.max(0, Math.floor((v - START) / STEP)));
    const frac = Math.min(1, Math.max(0, (v - START - k * STEP) / STEP));
    return { k, x: k % 2 === 0 ? frac : 1 - frac };
  };
  const left = useTransform(p, (v) => `${pos(v).x * 100}%`);
  const top = useTransform(p, (v) => `${((ROWS.length - 1 - pos(v).k + 0.5) / ROWS.length) * 100}%`);
  const o = useTransform(p, [START - 0.02, START, end - 0.01, end + 0.01], [0, 1, 1, 0]);
  return (
    <motion.div className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left, top, opacity: o }} aria-hidden>
      <svg viewBox="0 0 80 18" className="w-20 drop-shadow-[0_3px_4px_rgba(0,0,0,.6)]">
        <path d="M2 9 C 14 1, 66 1, 78 9 C 66 17, 14 17, 2 9 Z" fill="#7a4a24" stroke="#3b200d" strokeWidth="1.2" />
        <rect x="28" y="6" width="24" height="6" rx="3" fill="#d9a441" />
      </svg>
    </motion.div>
  );
}

/** /songket opening: an empty warp on the loom, woven row by row as you scroll,
 *  until the couple's names sit in a medallion at the heart of the cloth. */
export function SongketScene({ w, lang, guest, reduced, enter }: DesignCtx) {
  const { ref, p } = useSceneProgress(reduced, 0.86);
  const woven = START + ROWS.length * STEP;
  const medallion = useTransform(p, [woven, woven + 0.08], [0, 1]);
  const medallionScale = useTransform(p, [woven, woven + 0.08], [0.7, 1]);
  const loomScale = useTransform(p, [0.88, 1], [1, 1.25]);

  return (
    <SceneFrame
      sceneRef={ref}
      reduced={reduced}
      style={{ background: "radial-gradient(80% 60% at 50% 45%, #4a0c1c 0%, #22060f 70%, #14040a 100%)" }}
    >
      {/* the warp: fine gold threads stretched on the loom */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(243,210,138,.08) 0 1px, transparent 1px 7px)" }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[min(68dvh,580px)] w-[min(84vw,400px)] -translate-x-1/2 -translate-y-1/2"
        style={{ scale: loomScale }}
      >
        <div className="absolute -inset-x-3 -top-4 h-3 rounded-full bg-[#5b3417] shadow-[0_4px_8px_rgba(0,0,0,.5)]" />
        <div className="absolute -inset-x-3 -bottom-4 h-3 rounded-full bg-[#5b3417] shadow-[0_4px_8px_rgba(0,0,0,.5)]" />
        <div className="flex h-full flex-col-reverse overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)]">
          {ROWS.map((kind, i) => (
            <div key={i} className="min-h-0 flex-1">
              <Row p={p} i={i} kind={kind} />
            </div>
          ))}
        </div>
        {!reduced && <Shuttle p={p} />}

        {/* medallion at the heart of the cloth */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: medallion, scale: medallionScale }}
        >
          <div className="relative flex aspect-square w-[78%] items-center justify-center">
            <div className="absolute inset-[14%] rotate-45 border-2 border-[#d9a441] bg-[#3a0a17] shadow-[0_0_0_5px_#3a0a17,0_0_0_7px_#f3d28a,0_20px_40px_rgba(0,0,0,.6)]" />
            <div className="relative px-4 text-center">
              <p className="font-script text-[2.4rem] leading-none text-[#f3d28a]">{w.couple.groomShort}</p>
              <p className="my-1 font-script text-xl text-[#d9a441]">&amp;</p>
              <p className="font-script text-[2.4rem] leading-none text-[#f3d28a]">{w.couple.brideShort}</p>
              <p className="mt-3 font-sans text-[0.7rem] tracking-[0.2em] text-[#f7e7c6]">{formatDate(w.start, lang).toUpperCase()}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {!reduced && (
        <Act p={p} at={[-1, 0, 0.05, 0.1]} className="top-[16%]">
          <div className="rounded-[2px] bg-[#14040a]/75 px-5 py-6 backdrop-blur-[2px]">
            <Bismillah className="text-[#f3d28a]" />
            <ToGuest lang={lang} guest={guest} className="mt-4 text-[#e8cfa0]" />
            <p className="mt-5 font-script text-[2.3rem] leading-tight text-[#f7e7c6]">{t(LINES.thesis, lang)}</p>
            <p className="mt-4 font-serif text-base italic text-[#dcc095]">
              {w.title[lang]} · {formatDate(w.start, lang)}
            </p>
            <p className="font-serif text-sm text-[#b0906a]">{formatHijri(w.start)}</p>
          </div>
        </Act>
      )}

      {!reduced && <EnterCue p={p} label={t(LINES.begin, lang)} onEnter={enter} className="text-[#f3d28a]" />}
      <Flood p={p} from={0.9} background="var(--bg)" />
    </SceneFrame>
  );
}