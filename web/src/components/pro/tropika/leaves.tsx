import { useId } from "react";

// Tropical garden pieces for the Tropika card: a split monstera leaf, a palm frond and a
// hibiscus, drawn flat in deep greens with one coral bloom.

/** Monstera in a 100x120 box, stalk at the bottom centre. The splits and holes are cut with a mask. */
function Monstera({ fill = "#2f6b4a", vein = "#9cc7a6" }: { fill?: string; vein?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <g>
      <defs>
        <mask id={`ms${id}`}>
          <path d="M50 116 C 18 108, 2 78, 6 50 C 10 20, 32 4, 52 4 C 76 4, 96 24, 95 54 C 94 84, 78 108, 50 116 Z" fill="#fff" />
          <g stroke="#000" strokeWidth="5" strokeLinecap="round">
            <path d="M8 46 L 30 52" />
            <path d="M10 70 L 32 68" />
            <path d="M20 92 L 38 82" />
            <path d="M93 44 L 70 50" />
            <path d="M91 68 L 68 67" />
            <path d="M80 92 L 62 82" />
          </g>
          <g fill="#000">
            <ellipse cx="34" cy="36" rx="3.5" ry="6" transform="rotate(-30 34 36)" />
            <ellipse cx="66" cy="34" rx="3.5" ry="6" transform="rotate(30 66 34)" />
            <ellipse cx="38" cy="62" rx="3" ry="5" />
            <ellipse cx="63" cy="60" rx="3" ry="5" />
          </g>
        </mask>
      </defs>
      <path d="M50 116 C 18 108, 2 78, 6 50 C 10 20, 32 4, 52 4 C 76 4, 96 24, 95 54 C 94 84, 78 108, 50 116 Z" fill={fill} mask={`url(#ms${id})`} />
      <path d="M50 118 C 50 90, 51 50, 52 8" stroke={vein} strokeWidth="1.6" fill="none" opacity=".8" />
    </g>
  );
}

/** Palm frond in a 40x160 box: a curved rachis with long leaflets either side. */
function Frond({ fill = "#3f7d55" }: { fill?: string }) {
  return (
    <g>
      <path d="M20 160 C 22 110, 18 60, 22 4" stroke="#2c5a3c" strokeWidth="1.6" fill="none" />
      {Array.from({ length: 16 }, (_, i) => {
        const y = 150 - i * 9;
        const len = 26 - Math.abs(i - 7) * 1.6;
        return (
          <g key={i}>
            <path d={`M21 ${y} q ${-len * 0.6} ${-6} ${-len} ${-14}`} stroke={fill} strokeWidth="3.4" strokeLinecap="round" fill="none" />
            <path d={`M21 ${y} q ${len * 0.6} ${-6} ${len} ${-14}`} stroke={fill} strokeWidth="3.4" strokeLinecap="round" fill="none" />
          </g>
        );
      })}
    </g>
  );
}

/** Bunga raya (hibiscus) in a 60x60 box. */
function Hibiscus() {
  return (
    <g transform="translate(30 30)">
      {Array.from({ length: 5 }, (_, i) => (
        <path key={i} d="M0 0 C -12 -8, -12 -26, 0 -28 C 12 -26, 12 -8, 0 0 Z" fill={i % 2 ? "#ec6f5a" : "#f08a72"} transform={`rotate(${i * 72})`} />
      ))}
      <circle r="5" fill="#a8322b" />
      <path d="M0 0 L 10 -16" stroke="#f6d27a" strokeWidth="1.6" />
      <circle cx="10" cy="-16" r="2.2" fill="#f6d27a" />
    </g>
  );
}

/** A leafy cluster for one side of the screen, drawn for the left edge. `flip` mirrors it to the right. */
export function Cluster({ className = "", flip = false, sway = true }: { className?: string; flip?: boolean; sway?: boolean }) {
  return (
    <div className={className} style={flip ? { scale: "-1 1" } : undefined} aria-hidden>
      <svg viewBox="0 0 260 420" className={`block h-auto w-full ${sway ? "sway-slow" : ""}`}>
        {/* Every stem starts on the left edge (translate) and swings out to the right (rotate). */}
        <g transform="translate(0 40) rotate(118) scale(1.1) translate(-20 -160)">
          <Frond fill="#3f7d55" />
        </g>
        <g transform="translate(0 150) rotate(68) scale(1.6) translate(-50 -116)">
          <Monstera fill="#245c3f" />
        </g>
        <g transform="translate(0 235) rotate(88) scale(1.3) translate(-20 -160)">
          <Frond fill="#4a8a5f" />
        </g>
        <g transform="translate(0 320) rotate(108) scale(1.8) translate(-50 -116)">
          <Monstera fill="#2f6b4a" />
        </g>
        <g transform="translate(118 196)">
          <Hibiscus />
        </g>
      </svg>
    </div>
  );
}

/** Divider: a small palm leaflet either side of a coral dot. */
export function LeafRule() {
  return (
    <svg viewBox="0 0 140 20" className="h-5 w-36" aria-hidden>
      <path d="M8 10 H 132" stroke="#2f6b4a" strokeWidth=".8" opacity=".5" />
      {[-1, 1].map((d) => (
        <g key={d} transform={`translate(70 10) scale(${d} 1)`}>
          <path d="M8 0 C 18 -9, 34 -9, 44 0 C 34 9, 18 9, 8 0 Z" fill="#2f6b4a" />
          <path d="M8 0 H 44" stroke="#9cc7a6" strokeWidth=".8" />
        </g>
      ))}
      <circle cx="70" cy="10" r="4" fill="#ec6f5a" />
    </svg>
  );
}