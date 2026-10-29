"use client";

import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { t } from "@/lib/i18n";
import { formatDate, formatHijri } from "@/lib/format";
import type { L } from "@/lib/types";
import type { DesignCtx } from "../DesignShell";
import { Act, Bismillah, EnterCue, Flood, SceneFrame, ToGuest, useSceneProgress } from "../scene";

const LINES: Record<"thesis" | "begin", L> = {
  thesis: { ms: "Setitik lilin, sehelai kain.", en: "A drop of wax, a length of cloth." },
  begin: { ms: "Mula melukis", en: "Begin drawing" },
};

const COTTON = "#efe6d2";
const WAX_ON_COTTON = "#b4975e";
const WAX = "#f4ead6";
const INDIGO = "#1f2b5e";
const SOGA = "#b0652f";

// The motif, in the order the canting draws it (viewBox 360 x 480).
const PETAL = "M0 0 C -38 -18 -44 -86 0 -104 C 44 -86 38 -18 0 0";
const LEAF_L = "M176 330 C 140 300, 96 304, 70 330 C 100 352, 146 352, 176 330 Z";
const LEAF_R = "M184 380 C 220 352, 262 356, 290 380 C 262 404, 218 404, 184 380 Z";
const STROKES: { d: string; transform?: string }[] = [
  { d: "M24 24 H336 V456 H24 Z" },
  { d: "M180 205 C 168 270, 200 330, 176 420 C 170 440, 174 452, 180 456" },
  ...[0, 72, 144, 216, 288].map((r) => ({ d: PETAL, transform: `translate(180 190) rotate(${r})` })),
  ...[0, 72, 144, 216, 288].map((r) => ({ d: "M0 -12 C -6 -40 -4 -70 0 -90", transform: `translate(180 190) rotate(${r})` })),
  { d: LEAF_L },
  { d: "M176 330 C 140 328, 104 330, 74 330" },
  { d: LEAF_R },
  { d: "M184 380 C 220 378, 256 380, 286 380" },
  { d: "M70 330 C 50 320, 40 296, 56 284 C 68 276, 80 290, 70 298" },
  { d: "M290 380 C 312 370, 322 346, 306 334 C 294 326, 282 340, 292 348" },
  { d: "M60 70 C 80 96, 110 112, 132 134" },
  { d: "M300 70 C 280 96, 250 112, 228 134" },
  { d: "M180 190 C 188 166, 202 146, 220 132" },
];
const WAX_FROM = 0.06;
const WAX_TO = 0.5;
const SPAN = (WAX_TO - WAX_FROM) / STROKES.length;

// Cecek: the fine wax dots that fill the ground, placed by a small fixed LCG.
const DOTS = (() => {
  let seed = 11;
  const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const out: { x: number; y: number }[] = [];
  while (out.length < 46) {
    const x = Math.round((34 + r() * 292) * 10) / 10;
    const y = Math.round((34 + r() * 412) * 10) / 10;
    if (Math.hypot(x - 180, y - 190) > 120 && Math.abs(x - 180) > 24) out.push({ x, y });
  }
  return out;
})();

function Stroke({ p, i, color, drawn }: { p: MotionValue<number>; i: number; color: string; drawn?: boolean }) {
  const a = WAX_FROM + i * SPAN;
  const len = useTransform(p, [a, a + SPAN], [0, 1]);
  const s = STROKES[i];
  return (
    <motion.path
      d={s.d}
      transform={s.transform}
      fill="none"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={drawn ? undefined : { pathLength: len }}
    />
  );
}

function Canting() {
  return (
    <svg viewBox="0 0 60 60" className="w-14 -translate-x-[6px] -translate-y-[52px] drop-shadow-[0_3px_3px_rgba(0,0,0,.35)]" aria-hidden>
      <path d="M8 52 L22 30" stroke="#7a5a2e" strokeWidth="5" strokeLinecap="round" />
      <path d="M20 26 C 20 18, 40 16, 44 24 C 46 30, 38 36, 28 36 C 22 36, 20 32, 20 26 Z" fill="#c07a3a" stroke="#6a3e18" strokeWidth="1.4" />
      <path d="M40 30 L52 44" stroke="#c07a3a" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** /batik opening: a canting draws the motif in wax on raw cotton; indigo rises
 *  around the wax, soga brown is painted into the petals, and the names appear. */
export function BatikScene({ w, lang, guest, reduced, enter }: DesignCtx) {
  const { ref, p } = useSceneProgress(reduced, 0.86);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const svg = useRef<SVGSVGElement>(null);
  const tool = useRef<HTMLDivElement>(null);

  // The canting rides the tip of whichever stroke is being drawn.
  useMotionValueEvent(p, "change", (v) => {
    const el = tool.current;
    if (!el) return;
    const i = Math.floor((v - WAX_FROM) / SPAN);
    const path = paths.current[i];
    if (v < WAX_FROM || v > WAX_TO || !path || !svg.current) {
      el.style.opacity = "0";
      return;
    }
    const frac = (v - WAX_FROM - i * SPAN) / SPAN;
    const pt = path.getPointAtLength(path.getTotalLength() * frac);
    const m = path.getScreenCTM();
    const box = svg.current.getBoundingClientRect();
    if (!m) return;
    el.style.opacity = "1";
    el.style.transform = `translate(${pt.x * m.a + pt.y * m.c + m.e - box.left}px, ${pt.x * m.b + pt.y * m.d + m.f - box.top}px)`;
  });

  const dots = useTransform(p, [WAX_TO - 0.04, WAX_TO], [0, 1]);
  const dye = useTransform(p, [0.52, 0.66], [520, -40]);
  const soga = useTransform(p, [0.68, 0.76], [0, 1]);
  const cloth = useTransform(p, [0.9, 1], [1, 1.12]);

  return (
    <SceneFrame sceneRef={ref} reduced={reduced} style={{ background: `radial-gradient(90% 70% at 50% 45%, ${COTTON} 0%, #dccfb2 100%)` }}>
      <motion.div className="absolute left-1/2 top-[54%] w-[min(84vw,380px)] -translate-x-1/2 -translate-y-1/2" style={{ scale: cloth }}>
        <svg ref={svg} viewBox="0 0 360 480" className="block w-full drop-shadow-[0_24px_30px_rgba(60,40,10,.25)]" aria-hidden>
          <defs>
            <clipPath id="batik-dye">
              <motion.path
                d="M-20 0 C 40 -14, 80 14, 140 0 S 260 -14, 380 0 V 600 H -20 Z"
                style={{ y: reduced ? -40 : dye }}
              />
            </clipPath>
          </defs>
          <rect width="360" height="480" fill={COTTON} />

          {/* wax as it goes onto raw cotton */}
          <g>
            {STROKES.map((_, i) => (
              <Stroke key={i} p={p} i={i} color={WAX_ON_COTTON} drawn={reduced} />
            ))}
            <motion.g style={{ opacity: reduced ? 1 : dots }} fill={WAX_ON_COTTON}>
              {DOTS.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r="1.8" />
              ))}
            </motion.g>
          </g>

          {/* after the dye bath: indigo everywhere the wax did not cover */}
          <g clipPath="url(#batik-dye)">
            <rect width="360" height="480" fill={INDIGO} />
            <motion.g style={{ opacity: reduced ? 1 : soga }}>
              {[0, 72, 144, 216, 288].map((r) => (
                <path key={r} d={PETAL} transform={`translate(180 190) rotate(${r})`} fill={SOGA} />
              ))}
              <path d={LEAF_L} fill="#8a4b22" />
              <path d={LEAF_R} fill="#8a4b22" />
            </motion.g>
            {STROKES.map((s, i) => (
              <path key={i} d={s.d} transform={s.transform} fill="none" stroke={WAX} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            ))}
            <g fill={WAX}>
              {DOTS.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r="1.8" />
              ))}
              <circle cx="180" cy="190" r="6" />
            </g>
          </g>

          {/* invisible copies the canting follows */}
          <g visibility="hidden">
            {STROKES.map((s, i) => (
              <path
                key={i}
                ref={(el) => {
                  paths.current[i] = el;
                }}
                d={s.d}
                transform={s.transform}
              />
            ))}
          </g>
        </svg>
        {!reduced && (
          <div ref={tool} className="pointer-events-none absolute left-0 top-0 opacity-0">
            <Canting />
          </div>
        )}
      </motion.div>

      {!reduced && (
        <Act p={p} at={[-1, 0, 0.04, 0.08]} className="top-[8%] z-10">
          <div className="rounded-[4px] bg-[#efe6d2]/90 px-5 py-5">
            <Bismillah className="text-[#8a4b22]" />
            <ToGuest lang={lang} guest={guest} className="mt-3 text-[#5a4a2e]" />
            <p className="mt-4 font-script text-[2.5rem] leading-tight text-[#1f2b5e]">{t(LINES.thesis, lang)}</p>
            <p className="mt-3 font-serif text-base italic text-[#5a4a2e]">
              {w.title[lang]} · {formatDate(w.start, lang)}
            </p>
            <p className="font-serif text-sm text-[#7a6a4a]">{formatHijri(w.start)}</p>
          </div>
        </Act>
      )}
      <Act p={p} at={reduced ? [-1, 0, 1, 2] : [0.76, 0.82, 1, 2]} className="top-[5%] z-10">
        <p className="font-script text-[3.1rem] leading-none text-[#1f2b5e]">
          {w.couple.groomShort} <span className="text-[#b0652f]">&amp;</span> {w.couple.brideShort}
        </p>
        <p className="mt-2 font-sans text-xs tracking-[0.25em] text-[#5a4a2e]">{formatDate(w.start, lang).toUpperCase()}</p>
      </Act>

      {!reduced && <EnterCue p={p} label={t(LINES.begin, lang)} onEnter={enter} className="z-10 text-[#1f2b5e]" />}
      <Flood p={p} from={0.9} background="var(--bg)" />
    </SceneFrame>
  );
}