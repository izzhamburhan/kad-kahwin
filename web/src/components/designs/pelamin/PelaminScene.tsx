"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { t } from "@/lib/i18n";
import { formatDate, formatHijri } from "@/lib/format";
import type { L } from "@/lib/types";
import type { DesignCtx } from "../DesignShell";
import { Act, Bismillah, EnterCue, Flood, SceneFrame, ToGuest, useSceneProgress } from "../scene";

const LINES: Record<"walk" | "begin", L> = {
  walk: { ms: "Langkah demi langkah, menuju ke pelamin.", en: "Step by step, to the bridal dais." },
  begin: { ms: "Melangkah masuk", en: "Walk in" },
};

// The hall is drawn in one-point perspective: the horizon sits at 40% of the
// screen, and a thing at depth z, seen from camera position c, appears at
// scale 1/(z - c), sliding outward and downward from the vanishing point.
const HORIZON = 40;
// Node and the browser disagree in the last digits of sin/cos; round so hydration matches.
const r2 = (n: number) => Math.round(n * 100) / 100;
const LANE_VW = 22;
const FLOOR_VH = 30;

function Depth({ c, z, lane = 0, width, children }: { c: MotionValue<number>; z: number; lane?: number; width: string; children: ReactNode }) {
  const s = useTransform(c, (v) => 1 / Math.max(0.05, z - v));
  const x = useTransform(s, (k) => `${lane * k * LANE_VW}vw`);
  const y = useTransform(s, (k) => `${k * FLOOR_VH}vh`);
  const o = useTransform(c, (v) => {
    const rel = z - v;
    return Math.min(1, Math.max(0, (rel - 0.3) / 0.35)) * Math.min(1, Math.max(0, (11 - rel) / 2));
  });
  const zIndex = useTransform(c, (v) => Math.round(200 - (z - v) * 10));
  return (
    <motion.div className="absolute left-1/2" style={{ top: `${HORIZON}%`, x, y, zIndex, opacity: o }}>
      <motion.div className="absolute bottom-0 -translate-x-1/2" style={{ width, scale: s, transformOrigin: "50% 100%" }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Bunga manggar: a gold pole in a tempayan, crowned with a spray of tinsel fronds. */
function Manggar({ hue = 0 }: { hue?: number }) {
  const colours = ["#f28bb0", "#f8db8a", "#5ec3c0", "#fdf6e8", "#e05d8a"];
  const fronds = Array.from({ length: 17 }, (_, i) => {
    const a = (-165 + i * (150 / 16)) * (Math.PI / 180);
    const len = 42 + ((i * 7) % 5) * 4;
    const ex = r2(30 + Math.cos(a) * len);
    const ey = r2(62 + Math.sin(a) * len);
    const cx = r2(30 + Math.cos(a) * len * 0.5 + Math.sin(a) * 6);
    const cy = r2(62 + Math.sin(a) * len * 0.5 - 6);
    return { d: `M30 62 Q ${cx} ${cy} ${ex} ${ey}`, ex, ey, col: colours[(i + hue) % colours.length] };
  });
  return (
    <svg viewBox="-10 0 80 200" className="block w-full" aria-hidden>
      {fronds.map((f, i) => (
        <g key={i}>
          <path d={f.d} fill="none" stroke={f.col} strokeWidth="1.6" strokeLinecap="round" />
          <circle cx={f.ex} cy={f.ey} r="2.6" fill={f.col} />
        </g>
      ))}
      <rect x="28.5" y="60" width="3" height="118" fill="#e6b84a" />
      <circle cx="30" cy="62" r="4" fill="#f8db8a" />
      <path d="M16 178 C 12 186, 14 196, 22 200 L 38 200 C 46 196, 48 186, 44 178 Z" fill="#a77c1f" />
      <rect x="14" y="175" width="32" height="5" rx="2" fill="#e6b84a" />
    </svg>
  );
}

/** The pelamin: a silk arch hung with flowers, two thrones on a stepped dais, bunga pahar either side. */
function Dais() {
  const garland = Array.from({ length: 23 }, (_, i) => {
    const tt = i / 22;
    const x = r2(70 + tt * 260);
    const y = r2(96 - Math.sin(tt * Math.PI) * 78);
    return { x, y, col: i % 3 === 0 ? "#f28bb0" : i % 3 === 1 ? "#fdf6e8" : "#f8db8a" };
  });
  const pahar = (x: number) => (
    <g>
      <rect x={x - 2} y="150" width="4" height="82" fill="#e6b84a" />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          {Array.from({ length: 7 - k * 2 }, (_, j) => (
            <circle key={j} cx={x + (j - (6 - k * 2) / 2) * 7} cy={160 - k * 22} r="5" fill={["#f28bb0", "#fdf6e8", "#e05d8a"][(j + k) % 3]} />
          ))}
        </g>
      ))}
      <circle cx={x} cy="100" r="6" fill="#f8db8a" />
    </g>
  );
  const throne = (x: number) => (
    <g>
      <path d={`M${x - 24} 232 L${x - 24} 150 C ${x - 26} 120, ${x - 10} 108, ${x} 104 C ${x + 10} 108, ${x + 26} 120, ${x + 24} 150 L${x + 24} 232 Z`} fill="#e6b84a" />
      <path d={`M${x - 16} 200 L${x - 16} 152 C ${x - 16} 130, ${x - 6} 122, ${x} 120 C ${x + 6} 122, ${x + 16} 130, ${x + 16} 152 L${x + 16} 200 Z`} fill="#8e1b3a" />
      <rect x={x - 28} y="198" width="56" height="12" rx="3" fill="#f8db8a" />
      <circle cx={x} cy="102" r="5" fill="#f8db8a" />
    </g>
  );
  return (
    <svg viewBox="0 0 400 290" className="block w-full" aria-hidden>
      <path d="M50 232 L50 96 Q 200 -24 350 96 L350 232 Z" fill="#fbf3e2" stroke="#e6b84a" strokeWidth="6" />
      <path d="M78 232 L78 104 Q 200 8 322 104 L322 232 Z" fill="#fffaf0" />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <path key={k} d={`M${78 + k * 40.7} 120 Q ${98 + k * 40.7} 150 ${118.7 + k * 40.7} 120`} fill="none" stroke="#e6b84a" strokeWidth="2" opacity="0.8" />
      ))}
      {garland.map((g, i) => (
        <circle key={i} cx={g.x} cy={g.y + 6} r="7" fill={g.col} />
      ))}
      {throne(165)}
      {throne(235)}
      {pahar(28)}
      {pahar(372)}
      <rect x="60" y="232" width="280" height="20" fill="#e6b84a" />
      <rect x="30" y="252" width="340" height="22" fill="#a77c1f" />
      <rect x="60" y="232" width="280" height="3" fill="#f8db8a" />
      <rect x="30" y="252" width="340" height="3" fill="#e6b84a" />
    </svg>
  );
}

/** /pelamin opening: walking down the aisle of the hall toward the bridal dais. */
export function PelaminScene({ w, lang, guest, reduced, enter }: DesignCtx) {
  const { ref, p } = useSceneProgress(reduced, 0.86);
  const c = useTransform(p, [0.04, 0.84], [0, 7.4]);
  const stripes = Array.from({ length: 16 }, (_, i) => 0.6 + i * 0.6);
  const stands = [1.6, 3.2, 4.8, 6.4, 8];

  return (
    <SceneFrame
      sceneRef={ref}
      reduced={reduced}
      style={{ background: `linear-gradient(to bottom, #0a1433 0%, #16306e ${HORIZON}%, #0c1a42 ${HORIZON}%, #07102c 100%)` }}
    >
      {/* chandelier light */}
      {[18, 50, 82].map((x, i) => (
        <motion.div
          key={x}
          className="absolute h-40 w-40 -translate-x-1/2 rounded-full"
          style={{ left: `${x}%`, top: `${6 + (i % 2) * 6}%`, background: "radial-gradient(circle, rgba(248,219,138,.55) 0%, rgba(248,219,138,0) 65%)" }}
          animate={reduced ? undefined : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* the aisle carpet, from the vanishing point to our feet */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
        <polygon points={`50,${HORIZON} 50,${HORIZON} ${50 + 0.6 * 2 * LANE_VW},100 ${50 - 0.6 * 2 * LANE_VW},100`} fill="#8e1b3a" />
        <polyline points={`50,${HORIZON} ${50 - 0.6 * 2 * LANE_VW},100`} stroke="#e6b84a" strokeWidth="0.5" fill="none" />
        <polyline points={`50,${HORIZON} ${50 + 0.6 * 2 * LANE_VW},100`} stroke="#e6b84a" strokeWidth="0.5" fill="none" />
      </svg>
      {stripes.map((z) => (
        <Depth key={z} c={c} z={z} width={`${1.2 * LANE_VW}vw`}>
          <div className="h-[3px] w-full bg-[#e6b84a]/70" />
        </Depth>
      ))}

      <Depth c={c} z={9.2} width="min(160vw, 1100px)">
        <Dais />
      </Depth>
      {stands.map((z, i) => (
        <div key={z}>
          <Depth c={c} z={z} lane={-1.25} width="16vw">
            <Manggar hue={i} />
          </Depth>
          <Depth c={c} z={z} lane={1.25} width="16vw">
            <Manggar hue={i + 2} />
          </Depth>
        </div>
      ))}

      {!reduced && (
        <>
          {/* everything sits above the horizon, clear of the dais at the far end */}
          <Act p={p} at={[-1, 0, 0.06, 0.12]} className="top-[7%] z-[300] text-[#fdf6e8]">
            <Bismillah className="text-[#f8db8a]" />
            <ToGuest lang={lang} guest={guest} className="mt-3 text-[#ddd2bb]" />
            <h1 className="mt-4 font-script text-[3.2rem] leading-none">
              {w.couple.groomShort} <span className="text-[#f8db8a]">&amp;</span> {w.couple.brideShort}
            </h1>
            <p className="mt-3 font-serif text-base italic text-[#f8db8a]">
              {w.title[lang]} · {formatDate(w.start, lang)}
            </p>
            <p className="font-serif text-sm text-[#ddd2bb]">{formatHijri(w.start)}</p>
          </Act>
          <Act p={p} at={[0.3, 0.36, 0.5, 0.57]} className="top-[12%] z-[300]">
            <p className="mx-auto max-w-[18rem] font-script text-[2.6rem] leading-tight text-[#fdf6e8]">{t(LINES.walk, lang)}</p>
          </Act>
        </>
      )}
      <Act p={p} at={reduced ? [-1, 0, 1, 2] : [0.8, 0.86, 1, 2]} className="top-[7%] z-[300]">
        <p className="font-script text-[3rem] leading-none text-[#f8db8a]">
          {w.couple.groomShort} <span className="text-[#fdf6e8]">&amp;</span> {w.couple.brideShort}
        </p>
        <p className="mt-2 font-sans text-xs tracking-[0.25em] text-[#fdf6e8]">{formatDate(w.start, lang).toUpperCase()}</p>
      </Act>

      {!reduced && <EnterCue p={p} label={t(LINES.begin, lang)} onEnter={enter} className="z-[300] text-[#f8db8a]" />}
      <Flood p={p} from={0.92} background="var(--bg)" />
    </SceneFrame>
  );
}