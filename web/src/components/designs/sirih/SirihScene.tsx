"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { t } from "@/lib/i18n";
import { formatDate, formatHijri, formatTimeRange } from "@/lib/format";
import type { L, Lang, Wedding } from "@/lib/types";
import { SIRIH_LEAF } from "../bands";
import type { DesignCtx } from "../DesignShell";
import { Act, Bismillah, EnterCue, Flood, SceneFrame, ToGuest, useSceneProgress } from "../scene";

const LINES: Record<"gloss" | "begin" | "respect", L> = {
  gloss: {
    ms: "",
    en: "Folded betel, betel and areca, from the Isle of Pearls; sweet words of welcome, and Bismillah to begin.",
  },
  begin: { ms: "Buka tepak sirih", en: "Open the tepak sirih" },
  respect: { ms: "Sirih pinang tanda hormat", en: "Betel and areca, a token of respect" },
};

// The traditional pantun that opens a majlis. It stays in Malay in both languages.
const PANTUN = ["Sirih berlipat sirih pinang,", "Sirih dari Pulau Mutiara;", "Pemanis kata selamat datang,", "Awal Bismillah pembuka bicara."];

type Kind = "pinang" | "kapur" | "gambir" | "cengkih";
// The four cembul, opened in this order. Each one gives up one part of the invitation.
const CEMBUL: { kind: Kind; name: string; line: L }[] = [
  { kind: "pinang", name: "Pinang", line: { ms: "Bagai pinang dibelah dua", en: "Like an areca nut split in two" } },
  { kind: "kapur", name: "Kapur", line: { ms: "Putih kapur, putih niat", en: "White as lime, pure in intent" } },
  { kind: "gambir", name: "Gambir", line: { ms: "Pahit gambir, manis akhirnya", en: "Bitter gambier, a sweet ending" } },
  { kind: "cengkih", name: "Cengkih", line: { ms: "Harum cengkih menyambut tetamu", en: "Fragrant cloves to welcome guests" } },
];
// The tepak is set down once the pantun has been read, then its lid comes off.
const SET = 0.04;
const LID = 0.1;
const OPEN = 0.24;
const STEP = 0.11;
// After the last cembul the tray gives way to a wreath of leaves round the names.
const WREATH = 0.68;
const LEAVES = 10;

const BRASS = "linear-gradient(140deg, #f3d68e 0%, #c8963a 38%, #f0cf7f 52%, #a8772a 78%, #d9ae58 100%)";
const ENGRAVE = "#7d5718";

function Leaf({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 40 52" className={className} aria-hidden>
      <path d={SIRIH_LEAF} fill={dark ? "#2f6b33" : "#3d8240"} stroke="#1f4a22" strokeWidth=".8" />
      <path
        d="M20 45 L20 6 M20 34 C14 30 9 30 6 33 M20 34 C26 30 31 30 34 33 M20 24 C15 21 11 21 8 23 M20 24 C25 21 29 21 32 23 M20 15 C17 13 14 13 12 14 M20 15 C23 13 26 13 28 14"
        fill="none"
        stroke="#a9d08a"
        strokeWidth=".7"
        opacity=".7"
      />
    </svg>
  );
}

/** What lies in each cembul, drawn from above. */
function Contents({ kind }: { kind: Kind }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      {kind === "pinang" && (
        <>
          {[
            { x: 36, r: -12 },
            { x: 64, r: 12 },
          ].map((h) => (
            <g key={h.x} transform={`translate(${h.x} 52) rotate(${h.r})`}>
              <ellipse rx="17" ry="24" fill="#8a4a24" />
              <ellipse rx="13.5" ry="20" fill="#ead7b0" />
              <path d="M-8 -10 C-2 -4, -6 4, 0 10 M4 -14 C8 -6, 2 2, 7 12 M-4 2 C0 6, 4 4, 6 0" fill="none" stroke="#a0643a" strokeWidth="1.6" />
            </g>
          ))}
        </>
      )}
      {kind === "kapur" && (
        <>
          <ellipse cx="50" cy="55" rx="34" ry="28" fill="#e9e2d2" />
          <ellipse cx="44" cy="48" rx="20" ry="12" fill="#fffdf7" opacity=".85" />
          <ellipse cx="60" cy="62" rx="8" ry="4" fill="#d6cdb8" />
        </>
      )}
      {kind === "gambir" &&
        [
          [34, 36, 12],
          [58, 32, -18],
          [44, 58, 28],
          [68, 56, 6],
          [30, 64, -30],
          [54, 76, 14],
        ].map(([x, y, r], i) => (
          <rect key={i} x={x - 9} y={y - 9} width="18" height="18" rx="3" fill={i % 2 ? "#7a3d1c" : "#9a5326"} transform={`rotate(${r} ${x} ${y})`} />
        ))}
      {kind === "cengkih" &&
        Array.from({ length: 11 }, (_, i) => {
          const a = (i * 137.5 * Math.PI) / 180;
          const d = 10 + (i % 4) * 8;
          return (
            <g key={i} transform={`translate(${50 + Math.cos(a) * d} ${50 + Math.sin(a) * d}) rotate(${i * 47})`}>
              <rect x="-1.6" y="-1" width="3.2" height="16" rx="1.6" fill="#5a2e1a" />
              <circle r="4" fill="#6e3a20" />
              <circle r="1.6" fill="#8e5230" />
            </g>
          );
        })}
    </svg>
  );
}

/** One small brass pot. Its lid lifts away when its turn comes in the scroll. */
function Cembul({ p, i, kind }: { p: MotionValue<number>; i: number; kind: Kind }) {
  const a = OPEN + i * STEP;
  const lidY = useTransform(p, [a, a + 0.05], ["0%", "-70%"]);
  const lidR = useTransform(p, [a, a + 0.05], [0, i % 2 ? 18 : -18]);
  const lidO = useTransform(p, [a + 0.02, a + 0.06], [1, 0]);
  const glow = useTransform(p, [a + 0.02, a + 0.06], [0, 1]);
  return (
    <div className="relative aspect-square h-full">
      <div className="absolute inset-0 rounded-full" style={{ background: BRASS, boxShadow: "inset 0 0 0 2px #8a6420, 0 6px 10px rgba(0,0,0,.45)" }} />
      <div className="absolute inset-[13%] overflow-hidden rounded-full bg-[#2a1230] shadow-[inset_0_4px_8px_rgba(0,0,0,.6)]">
        <Contents kind={kind} />
      </div>
      <motion.div className="absolute inset-[13%] rounded-full" style={{ opacity: glow, boxShadow: "0 0 22px 6px rgba(242,213,142,.4)" }} />
      <motion.div
        className="absolute inset-[4%] rounded-full"
        style={{
          y: lidY,
          rotate: lidR,
          opacity: lidO,
          background: BRASS,
          boxShadow: `inset 0 0 0 1.5px ${ENGRAVE}, inset 0 0 0 5px #e9c473, inset 0 0 0 6px ${ENGRAVE}, 0 8px 14px rgba(0,0,0,.5)`,
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: BRASS, boxShadow: `0 2px 3px rgba(0,0,0,.5), inset 0 0 0 1px ${ENGRAVE}` }}
        />
      </motion.div>
    </div>
  );
}

/** The engraved lid of the tepak: a border, corner curls and a bunga tanjung round the couple's initials. */
function Lid({ p, w }: { p: MotionValue<number>; w: Wedding }) {
  const rotateX = useTransform(p, [LID, LID + 0.1], [0, -68]);
  const y = useTransform(p, [LID, LID + 0.12], ["0%", "-55%"]);
  const opacity = useTransform(p, [LID + 0.06, LID + 0.12], [1, 0]);
  return (
    <motion.div
      className="absolute inset-0 rounded-[14px]"
      style={{ rotateX, y, opacity, transformOrigin: "50% 0%", background: BRASS, boxShadow: "0 24px 40px -12px rgba(0,0,0,.75)" }}
    >
      <svg viewBox="0 0 100 125" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <rect x="5" y="5" width="90" height="115" rx="5" fill="none" stroke={ENGRAVE} strokeWidth=".8" />
        <rect x="8" y="8" width="84" height="109" rx="4" fill="none" stroke="#fbe7ae" strokeWidth=".5" opacity=".7" />
        {[
          [13, 13, 1, 1],
          [87, 13, -1, 1],
          [13, 112, 1, -1],
          [87, 112, -1, -1],
        ].map(([x, y, sx, sy]) => (
          <path
            key={`${x}${y}`}
            transform={`translate(${x} ${y}) scale(${sx} ${sy})`}
            d="M0 12 C0 3, 3 0, 12 0 M3 12 C3 6, 6 3, 12 3 M6 9 C6 6, 8 5, 10 6"
            fill="none"
            stroke={ENGRAVE}
            strokeWidth=".8"
          />
        ))}
        <g transform="translate(50 62.5)">
          <circle r="27" fill="none" stroke={ENGRAVE} strokeWidth=".8" />
          <circle r="23" fill="none" stroke="#fbe7ae" strokeWidth=".4" opacity=".7" />
          {Array.from({ length: 8 }, (_, k) => (
            <ellipse key={k} rx="3.6" ry="9" cy="-14" fill="none" stroke={ENGRAVE} strokeWidth=".6" transform={`rotate(${k * 45})`} opacity=".8" />
          ))}
          <circle r="9" fill="#d8ab52" stroke={ENGRAVE} strokeWidth=".6" />
        </g>
      </svg>
      <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-script text-lg tracking-tight text-[#5a3c0e]">
        {w.couple.groomShort[0]}
        {w.couple.brideShort[0]}
      </p>
    </motion.div>
  );
}

/** The open tepak: a wide well of folded leaves above four cembul. */
function Tray({ p, w }: { p: MotionValue<number>; w: Wedding }) {
  return (
    <div className="absolute inset-0" style={{ perspective: "1000px" }}>
      <div
        className="absolute inset-0 rounded-[14px] p-[7%]"
        style={{ background: BRASS, boxShadow: "inset 0 0 0 2px #8a6420, 0 30px 50px -16px rgba(0,0,0,.8)" }}
      >
        <div className="flex h-full flex-col gap-[5%] rounded-[8px] bg-[#2a1230] p-[5%] shadow-[inset_0_6px_14px_rgba(0,0,0,.7)]">
          <div className="relative h-[38%] shrink-0 rounded-[6px] border-2 border-[#b8862e] bg-[#3a1b40]">
            {[-28, -10, 10, 28].map((r, i) => (
              <div key={r} className="absolute bottom-[8%] left-1/2 h-[84%] w-[30%] -translate-x-1/2" style={{ transform: `rotate(${r}deg)`, transformOrigin: "50% 90%" }}>
                <Leaf dark={i % 2 === 1} className="h-full w-full" />
              </div>
            ))}
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-[6%]">
            {CEMBUL.map((c, i) => (
              <div key={c.kind} className="flex min-h-0 items-center justify-center">
                <Cembul p={p} i={i} kind={c.kind} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Lid p={p} w={w} />
    </div>
  );
}

/** One leaf of the closing wreath, sliding outward from the centre along its own spoke. */
function WreathLeaf({ p, k }: { p: MotionValue<number>; k: number }) {
  const y = useTransform(p, [WREATH, WREATH + 0.14], ["0%", "-150%"]);
  const opacity = useTransform(p, [WREATH, WREATH + 0.06], [0, 1]);
  return (
    <div className="absolute left-1/2 top-1/2 -ml-[8.5%] -mt-[11%] h-[22%] w-[17%]" style={{ transform: `rotate(${(360 / LEAVES) * k}deg)` }}>
      <motion.div className="h-full w-full" style={{ y, opacity }}>
        <Leaf dark={k % 2 === 1} className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,.5)]" />
      </motion.div>
    </div>
  );
}

function Detail({ kind, w, lang }: { kind: Kind; w: Wedding; lang: Lang }) {
  if (kind === "pinang")
    return (
      <p className="font-script text-[2rem] leading-tight text-[#f2d58e]">
        {w.couple.groomShort} <span className="text-[#d4a64a]">&amp;</span> {w.couple.brideShort}
      </p>
    );
  if (kind === "kapur")
    return (
      <>
        <p className="font-serif text-xl text-[#f6ead2]">{formatDate(w.start, lang)}</p>
        <p className="font-serif text-sm text-[#dac6a0]">{formatHijri(w.start)}</p>
      </>
    );
  if (kind === "gambir") return <p className="font-serif text-xl text-[#f6ead2]">{formatTimeRange(w, lang)}</p>;
  return (
    <>
      <p className="font-serif text-xl leading-snug text-[#f6ead2]">{w.venue.name}</p>
      <p className="mt-0.5 font-serif text-sm text-[#dac6a0]">{w.venue.address}</p>
    </>
  );
}

const CAPTION = "bottom-[calc(env(safe-area-inset-bottom)+5.25rem)]";

/** /sirih opening: a brass tepak sirih on velvet. Its lid lifts, then each cembul opens
 *  in turn to give up the couple, the date, the time and the place, until the leaves
 *  fan out into a wreath round the names. */
export function SirihScene({ w, lang, guest, reduced, enter }: DesignCtx) {
  const { ref, p } = useSceneProgress(reduced, 0.86);
  const setO = useTransform(p, [SET, SET + 0.05], [0, 1]);
  const setY = useTransform(p, [SET, SET + 0.05], ["6vh", "0vh"]);
  const trayO = useTransform(p, [WREATH, WREATH + 0.1], [1, 0]);
  const trayS = useTransform(p, [WREATH, WREATH + 0.1], [1, 0.82]);
  const wreathR = useTransform(p, [WREATH, WREATH + 0.2], [-40, 0]);
  const medO = useTransform(p, [WREATH + 0.08, WREATH + 0.16], [0, 1]);
  const medS = useTransform(p, [WREATH + 0.08, WREATH + 0.16], [0.75, 1]);
  const zoom = useTransform(p, [0.88, 1], [1, 1.22]);

  return (
    <SceneFrame
      sceneRef={ref}
      reduced={reduced}
      length="h-[560vh]"
      style={{ background: "radial-gradient(85% 65% at 50% 42%, #3a1c44 0%, #22102a 62%, #12081a 100%)" }}
    >
      {/* velvet nap */}
      <div
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,.018) 0 2px, transparent 2px 5px)" }}
      />

      <motion.div className="absolute left-1/2 top-[42%] aspect-[4/5] w-[min(84vw,38dvh,352px)] -translate-x-1/2 -translate-y-1/2" style={{ scale: zoom, opacity: setO, y: setY }}>
        <div className="absolute -inset-x-[10%] -bottom-[8%] h-[16%] rounded-[50%] bg-black/45 blur-xl" />
        <motion.div className="absolute inset-0" style={{ opacity: trayO, scale: trayS }}>
          <Tray p={p} w={w} />
        </motion.div>

        <motion.div className="absolute inset-x-0 top-1/2 aspect-square -translate-y-1/2" style={{ rotate: wreathR }}>
          {Array.from({ length: LEAVES }, (_, k) => (
            <WreathLeaf key={k} p={p} k={k} />
          ))}
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-1/2 flex aspect-square w-[58%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{ opacity: medO, scale: medS, background: BRASS, boxShadow: "0 0 0 2px #8a6420, 0 24px 40px -10px rgba(0,0,0,.8)" }}
        >
          <div className="absolute inset-[6%] rounded-full bg-[#26132c] shadow-[inset_0_0_0_1px_#f2d58e,inset_0_8px_18px_rgba(0,0,0,.6)]" />
          <div className="relative px-3 text-center">
            <p className="font-script text-[1.7rem] leading-none text-[#f2d58e]">{w.couple.groomShort}</p>
            <p className="my-1 font-script text-base text-[#d4a64a]">&amp;</p>
            <p className="font-script text-[1.7rem] leading-none text-[#f2d58e]">{w.couple.brideShort}</p>
          </div>
        </motion.div>
      </motion.div>

      {!reduced && (
        <>
          <Act p={p} at={[-1, 0, 0.04, 0.08]} className="top-[9%]">
            <div className="rounded-[4px] bg-[#12081a]/80 px-5 py-6 backdrop-blur-[2px]">
              <Bismillah className="text-[#f2d58e]" />
              <ToGuest lang={lang} guest={guest} className="mt-4 text-[#dac6a0]" />
              <div className="mt-5 font-serif text-[1.15rem] italic leading-relaxed text-[#f6ead2]">
                {PANTUN.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
              {lang === "en" && <p className="mt-3 font-sans text-xs leading-relaxed text-[#a693a8]">{LINES.gloss.en}</p>}
              <p className="mt-4 font-sans text-xs tracking-[0.2em] text-[#d4a64a]">{w.title[lang].toUpperCase()}</p>
            </div>
          </Act>

          {CEMBUL.map((c, i) => {
            const a = OPEN + i * STEP;
            return (
              <Act key={c.kind} p={p} at={[a, a + 0.03, a + 0.09, a + 0.11]} className={CAPTION}>
                <div className="rounded-[4px] bg-[#12081a]/75 px-5 py-4 backdrop-blur-[2px]">
                  <p className="font-sans text-[0.68rem] tracking-[0.3em] text-[#d4a64a]">{c.name.toUpperCase()}</p>
                  <p className="mt-1 font-serif text-base italic text-[#dac6a0]">{t(c.line, lang)}</p>
                  <div className="mt-2">
                    <Detail kind={c.kind} w={w} lang={lang} />
                  </div>
                </div>
              </Act>
            );
          })}

          <Act p={p} at={[WREATH + 0.12, WREATH + 0.16, 1.1, 1.2]} className={CAPTION}>
            <p className="font-serif text-lg italic text-[#f6ead2]">{t(LINES.respect, lang)}</p>
            <p className="mt-1 font-sans text-xs tracking-[0.2em] text-[#d4a64a]">{formatDate(w.start, lang).toUpperCase()}</p>
          </Act>

          <EnterCue p={p} label={t(LINES.begin, lang)} onEnter={enter} className="text-[#f2d58e]" />
        </>
      )}
      <Flood p={p} from={0.9} background="var(--bg)" />
    </SceneFrame>
  );
}