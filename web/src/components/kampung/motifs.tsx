"use client";

import { motion, type MotionValue } from "motion/react";
import { useId } from "react";

// Drawn pieces of the kampung world. Colours that change with the evening
// arrive as MotionValues so the scene can darken them as it scrolls.

const useUid = () => useId().replace(/:/g, "");

/** Rumah kampung on stilts, gable facing us: silang gunting finials, tebar layar slats,
 *  jala-jala verandah lattice, tangga and two pelita buluh. */
export function House({ glow, door, night }: { glow: MotionValue<number>; door: MotionValue<number>; night: MotionValue<number> }) {
  const id = useUid();
  // Gable edge height at x, for the tebar layar slats.
  const gableY = (x: number) => 150 - (x < 200 ? x - 84 : 316 - x) * (92 / 116);
  const slats = Array.from({ length: 22 }, (_, i) => 95 + i * 10).filter((x) => x > 86 && x < 314);

  return (
    <svg viewBox="0 0 400 330" className="block h-auto w-full overflow-visible" aria-hidden>
      <defs>
        <pattern id={`planks${id}`} width="9" height="80" patternUnits="userSpaceOnUse">
          <rect width="9" height="80" fill="#74381f" />
          <rect width="1.2" height="80" fill="#4b2113" />
          <rect x="4" width="0.6" height="80" fill="#83432a" opacity="0.6" />
        </pattern>
        <pattern id={`jala${id}`} width="12" height="22" patternUnits="userSpaceOnUse">
          <path d="M0 11 L6 0 L12 11 L6 22 Z" fill="none" stroke="#2a130b" strokeWidth="1.6" />
        </pattern>
        <clipPath id={`gable${id}`}>
          <polygon points="84,150 200,58 316,150" />
        </clipPath>
        <clipPath id={`body${id}`}>
          <polygon points="30,156 200,30 370,156" />
          <rect x="56" y="150" width="288" height="84" />
          <polygon points="170,233 230,233 242,300 158,300" />
          {[72, 112, 152, 240, 280, 320].map((x) => (
            <rect key={x} x={x} y="228" width="8" height="72" />
          ))}
        </clipPath>
        <radialGradient id={`flame${id}`}>
          <stop offset="0" stopColor="#fff4c9" />
          <stop offset="0.45" stopColor="#ffc35c" />
          <stop offset="1" stopColor="#ff8a1e" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="200" cy="302" rx="190" ry="10" fill="#140904" opacity="0.45" />

      {/* stilts */}
      {[72, 112, 152, 240, 280, 320].map((x) => (
        <rect key={x} x={x} y="228" width="8" height="72" fill="#2c140b" />
      ))}

      {/* walls of the rumah ibu */}
      <rect x="62" y="150" width="276" height="80" fill={`url(#planks${id})`} />
      <rect x="56" y="226" width="288" height="7" fill="#3b1a0f" />

      {/* roof: attap mass, tebar layar gable with slats and a carved diamond */}
      <polygon points="30,156 200,30 370,156" fill="#3a1f14" />
      <polygon points="84,150 200,58 316,150" fill="#b8753b" />
      <g clipPath={`url(#gable${id})`} stroke="#7f4a22" strokeWidth="2.2">
        {slats.map((x) => (
          <line key={x} x1={x} y1="150" x2={x} y2={gableY(x)} />
        ))}
      </g>
      <g fill="none" stroke="#3a1f14" strokeWidth="2.4">
        <polygon points="200,90 216,114 200,138 184,114" />
        <polygon points="200,102 208,114 200,126 192,114" />
      </g>
      <path d="M30,156 L222,12 M370,156 L178,12" stroke="#24120a" strokeWidth="11" strokeLinecap="round" />

      {/* windows (tingkap) with open shutters */}
      {[80, 122, 248, 290].map((x) => (
        <g key={x}>
          <rect x={x - 9} y="164" width="9" height="40" fill="#5a2816" />
          <rect x={x + 30} y="164" width="9" height="40" fill="#5a2816" />
          <rect x={x} y="164" width="30" height="40" fill="#1d0d06" />
          <motion.rect x={x + 3} y="167" width="24" height="34" fill="#ffcf73" style={{ opacity: glow }} />
          <g stroke="#2a130b" strokeWidth="1.6">
            <line x1={x + 10} y1="166" x2={x + 10} y2="202" />
            <line x1={x + 20} y1="166" x2={x + 20} y2="202" />
          </g>
        </g>
      ))}

      {/* doorway: warm room behind two leaves that swing open */}
      <rect x="180" y="160" width="40" height="66" fill="#1d0d06" />
      <motion.rect x="181" y="161" width="38" height="65" fill="#ffd27e" style={{ opacity: glow }} />
      <motion.g style={{ scaleX: door, transformOrigin: "0% 50%", transformBox: "fill-box" }}>
        <rect x="181" y="161" width="19" height="65" fill="#4a2214" />
        <rect x="184" y="166" width="13" height="24" fill="none" stroke="#2a130b" strokeWidth="1.2" />
        <rect x="184" y="196" width="13" height="24" fill="none" stroke="#2a130b" strokeWidth="1.2" />
      </motion.g>
      <motion.g style={{ scaleX: door, transformOrigin: "100% 50%", transformBox: "fill-box" }}>
        <rect x="200" y="161" width="19" height="65" fill="#4a2214" />
        <rect x="203" y="166" width="13" height="24" fill="none" stroke="#2a130b" strokeWidth="1.2" />
        <rect x="203" y="196" width="13" height="24" fill="none" stroke="#2a130b" strokeWidth="1.2" />
      </motion.g>

      {/* serambi railing */}
      <rect x="62" y="203" width="112" height="23" fill={`url(#jala${id})`} />
      <rect x="226" y="203" width="112" height="23" fill={`url(#jala${id})`} />
      <rect x="60" y="199" width="116" height="4" fill="#2c140b" />
      <rect x="224" y="199" width="116" height="4" fill="#2c140b" />

      {/* tangga */}
      <polygon points="172,233 228,233 240,300 160,300" fill="#5b2a18" />
      <g stroke="#2c140b" strokeWidth="2">
        {[246, 259, 272, 285].map((y) => (
          <line key={y} x1={172 - (y - 233) * 0.18} y1={y} x2={228 + (y - 233) * 0.18} y2={y} />
        ))}
        <line x1="172" y1="233" x2="160" y2="300" strokeWidth="3" />
        <line x1="228" y1="233" x2="240" y2="300" strokeWidth="3" />
      </g>

      {/* evening falls on the timber, not on the lamplight */}
      <motion.g clipPath={`url(#body${id})`} style={{ opacity: night }}>
        <rect width="400" height="330" fill="#0d0f2b" opacity="0.55" />
      </motion.g>
      <motion.g style={{ opacity: glow }}>
        {[80, 122, 248, 290].map((x) => (
          <rect key={x} x={x + 3} y="167" width="24" height="34" fill="#ffcf73" opacity="0.35" style={{ filter: "blur(6px)" }} />
        ))}
      </motion.g>

      {/* pelita buluh */}
      {[146, 254].map((x, i) => (
        <g key={x}>
          <rect x={x - 2} y="252" width="4" height="48" fill="#6b5a2a" />
          <rect x={x - 3} y="250" width="6" height="5" fill="#3b2f14" />
          <motion.g style={{ opacity: glow }}>
            <circle cx={x} cy="243" r="16" fill={`url(#flame${id})`} opacity="0.55" />
            <ellipse
              cx={x}
              cy="244"
              rx="3.2"
              ry="6.5"
              fill="#ffd27e"
              className="flicker"
              style={{ animationDelay: `${i * 0.37}s`, transformOrigin: `${x}px 250px` }}
            />
          </motion.g>
        </g>
      ))}
    </svg>
  );
}

/** Pokok kelapa: a leaning trunk and a crown of fronds with dashed leaflets. */
export function CoconutTree({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  const fronds = [
    "M62 70 C 40 58, 18 66, 2 92",
    "M62 70 C 84 56, 104 64, 118 88",
    "M62 70 C 46 50, 26 42, 8 46",
    "M62 70 C 78 48, 98 40, 116 48",
    "M62 70 C 58 50, 62 32, 70 18",
    "M62 70 C 44 74, 32 92, 28 118",
    "M62 70 C 82 76, 94 94, 98 120",
    "M62 70 C 54 80, 52 98, 56 122",
  ];
  return (
    <svg viewBox="0 0 120 300" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <path d="M58 300 C 52 230, 44 150, 62 72" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        {fronds.map((d) => (
          <g key={d}>
            <path d={d} strokeWidth="2" />
            {/* leaflets: a wide stroke chopped into thin dashes reads as a fringe */}
            <path d={d} strokeWidth="11" strokeDasharray="0.9 2.2" strokeLinecap="butt" />
          </g>
        ))}
      </g>
      <g fill="currentColor">
        <circle cx="57" cy="78" r="4.5" />
        <circle cx="66" cy="80" r="4.5" />
        <circle cx="61" cy="85" r="4" />
      </g>
    </svg>
  );
}

/** Tikar mengkuang: the woven pandan mat, straw with dyed red and black diamonds. */
export function TikarBand({ className = "", height = 26 }: { className?: string; height?: number }) {
  const id = useUid();
  return (
    <svg width="100%" height={height} className={className} aria-hidden preserveAspectRatio="none">
      <defs>
        <pattern id={`weave${id}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#d9b276" />
          <rect width="4" height="8" fill="#c79a5b" />
        </pattern>
        <pattern id={`ketupat${id}`} width="52" height={height} patternUnits="userSpaceOnUse">
          <path d={`M26 2 L40 ${height / 2} L26 ${height - 2} L12 ${height / 2} Z`} fill="#9b2a22" />
          <path d={`M26 8 L33 ${height / 2} L26 ${height - 8} L19 ${height / 2} Z`} fill="#24120a" />
          <circle cx="0" cy={height / 2} r="3" fill="#24120a" />
          <circle cx="52" cy={height / 2} r="3" fill="#24120a" />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#weave${id})`} />
      <rect width="100%" height={height} fill={`url(#ketupat${id})`} opacity="0.92" />
      <rect width="100%" height="2" fill="#24120a" />
      <rect y={height - 2} width="100%" height="2" fill="#24120a" />
    </svg>
  );
}

/** Awan larat: the carved cloud-vine scroll from door and window panels. */
export function AwanLarat({ className = "" }: { className?: string }) {
  const id = useUid();
  return (
    <svg width="100%" height="30" className={className} aria-hidden>
      <defs>
        <pattern id={`awan${id}`} width="84" height="30" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M0 15 C 12 2, 30 2, 42 15 S 72 28, 84 15" />
            <path d="M21 9 c -6 -1, -8 6, -3 8 c 3 1, 5 -2, 3 -4" />
            <path d="M63 21 c 6 1, 8 -6, 3 -8 c -3 -1, -5 2, -3 4" />
            <path d="M34 10 c 4 -6, 10 -6, 12 -2" strokeWidth="1.1" />
            <path d="M50 20 c -4 6, -10 6, -12 2" strokeWidth="1.1" />
          </g>
          <circle cx="42" cy="15" r="1.8" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="30" fill={`url(#awan${id})`} />
    </svg>
  );
}