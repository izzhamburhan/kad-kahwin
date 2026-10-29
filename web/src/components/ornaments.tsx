import { useId } from "react";

// Hand-drawn motifs used across the invitation: bunga raya (hibiscus),
// songket pucuk rebung bands and a wax seal. All strokes use currentColor
// or theme tokens, so they follow the active theme.

const PETAL = "M0 0 C -15 -8 -18 -34 0 -46 C 18 -34 15 -8 0 0 Z";
const LEAF = "M0 0 C 12 -10 34 -10 46 0 C 34 10 12 10 0 0 Z";

export function Hibiscus({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="-60 -60 120 120" width={size} height={size} className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        {[0, 72, 144, 216, 288].map((r) => (
          <g key={r} transform={`rotate(${r})`}>
            <path d={PETAL} />
            <path d="M0 -6 C -4 -18 -4 -28 0 -38" strokeWidth="0.8" opacity="0.7" />
          </g>
        ))}
        <path d="M0 0 C 6 -10 10 -20 18 -30" strokeWidth="1.2" />
      </g>
      <g fill="currentColor">
        <circle cx="18" cy="-30" r="2.4" />
        <circle cx="13" cy="-33" r="1.6" />
        <circle cx="21" cy="-25" r="1.6" />
        <circle r="3.2" />
      </g>
    </svg>
  );
}

/** Floral spray for section corners: a hibiscus with leaves and tendrils. */
export function FloralCorner({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M4 196 C 40 150 70 120 120 96 C 150 82 178 70 196 40" />
        <path d="M30 168 C 22 140 30 112 52 96" />
        <path d="M70 128 C 92 132 108 150 112 176" />
        <path d="M140 86 C 148 64 166 52 186 52" strokeWidth="0.9" />
        <path d="M52 96 C 60 90 66 92 64 100 C 62 106 54 104 56 98" strokeWidth="0.9" />
        <path d="M112 176 C 114 184 108 188 104 184" strokeWidth="0.9" />
      </g>
      <g fill="currentColor" opacity="0.18">
        <path d={LEAF} transform="translate(40 150) rotate(-70) scale(0.9)" />
        <path d={LEAF} transform="translate(88 118) rotate(20) scale(0.8)" />
        <path d={LEAF} transform="translate(150 80) rotate(-30) scale(0.7)" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d={LEAF} transform="translate(40 150) rotate(-70) scale(0.9)" />
        <path d={LEAF} transform="translate(88 118) rotate(20) scale(0.8)" />
        <path d={LEAF} transform="translate(150 80) rotate(-30) scale(0.7)" />
      </g>
      <g transform="translate(120 96) scale(0.62)">
        <g fill="none" stroke="currentColor" strokeWidth="2">
          {[0, 72, 144, 216, 288].map((r) => (
            <path key={r} d={PETAL} transform={`rotate(${r + 18})`} />
          ))}
        </g>
        <circle r="4" fill="currentColor" />
      </g>
      <g fill="currentColor">
        <circle cx="186" cy="52" r="2" />
        <circle cx="196" cy="40" r="2.4" />
        <circle cx="104" cy="184" r="1.6" />
      </g>
    </svg>
  );
}

/** Songket border: pucuk rebung (bamboo shoot) triangles over a diamond row. */
export function SongketBand({ className = "", height = 22 }: { className?: string; height?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width="100%" height={height} className={className} aria-hidden preserveAspectRatio="none">
      <defs>
        <pattern id={`sb${id}`} width="28" height={height} patternUnits="userSpaceOnUse">
          <path
            d={`M0 ${height} L14 2 L28 ${height}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path d={`M7 ${height} L14 ${height * 0.42} L21 ${height}`} fill="currentColor" opacity="0.35" />
          <circle cx="14" cy={height * 0.25} r="1.2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#sb${id})`} />
    </svg>
  );
}

/** Line · flower · line divider. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold ${className}`} aria-hidden>
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-current opacity-70" />
      <svg viewBox="-12 -12 24 24" width="18" height="18">
        <path d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3 Z" fill="currentColor" opacity="0.85" />
        <circle r="1.6" fill="var(--bg)" />
      </svg>
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-current opacity-70" />
    </div>
  );
}

/** Wax seal with an organic, drippy edge and an embossed monogram. */
export function WaxSeal({ initials, size = 92 }: { initials: string; size?: number }) {
  const id = useId().replace(/:/g, "");
  // Wobbly circle: radius varies with a few sine waves for a hand-poured look.
  const pts = Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2;
    const r = 46 + Math.sin(a * 5) * 1.6 + Math.sin(a * 9 + 1) * 1.1 + Math.cos(a * 3) * 0.9;
    return `${(50 + Math.cos(a) * r).toFixed(2)},${(50 + Math.sin(a) * r).toFixed(2)}`;
  });
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      <defs>
        <radialGradient id={`wax${id}`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="var(--seal-hi)" />
          <stop offset="0.6" stopColor="var(--seal)" />
          <stop offset="1" stopColor="#2a0a10" />
        </radialGradient>
        <linearGradient id={`foil${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--gold-hi)" />
          <stop offset="0.5" stopColor="var(--gold)" />
          <stop offset="1" stopColor="var(--gold-lo)" />
        </linearGradient>
      </defs>
      <polygon points={pts.join(" ")} fill={`url(#wax${id})`} />
      <circle cx="50" cy="50" r="35" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="35" fill="none" stroke={`url(#foil${id})`} strokeWidth="0.8" strokeDasharray="1.2 2.4" />
      {[0, 90, 180, 270].map((r) => (
        <path
          key={r}
          d="M50 17 L52 21 L50 25 L48 21 Z"
          fill={`url(#foil${id})`}
          transform={`rotate(${r} 50 50)`}
          opacity="0.9"
        />
      ))}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontFamily="var(--font-script)"
        fontSize="26"
        fill={`url(#foil${id})`}
        style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,.35))" }}
      >
        {initials}
      </text>
    </svg>
  );
}