import { useId } from "react";

// Watercolour greenery for the Botani card: eucalyptus, olive sprigs and blush blooms.
// Each wash is a flat shape with a lighter bloom inside, softened by a turbulence filter
// so the edges wobble like pigment on cold-press paper.

const SAGE = ["#a7bda4", "#8fa98c", "#b8cab3", "#9cb497", "#7f9a7d"];

function Eucalyptus({
  x,
  y,
  r,
  s = 1,
}: {
  x: number;
  y: number;
  r: number;
  s?: number;
}) {
  const leaves = Array.from({ length: 9 }, (_, i) => ({
    cy: 186 - i * 21,
    cx: 60 + (i % 2 ? 15 : -15) * (1 - i * 0.05),
    rx: 13 - i * 0.6,
    ry: 10.5 - i * 0.5,
    rot: i % 2 ? 22 : -22,
    fill: SAGE[i % SAGE.length],
  }));
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${r}) scale(${s}) translate(-60 -200)`}
    >
      <path
        d="M60 200 C 58 150, 66 110, 58 62 C 55 38, 60 16, 64 2"
        fill="none"
        stroke="#6f8a6c"
        strokeWidth="1.6"
      />
      {leaves.map((l, i) => (
        <g key={i} transform={`rotate(${l.rot} ${l.cx} ${l.cy})`}>
          <ellipse
            cx={l.cx}
            cy={l.cy}
            rx={l.rx}
            ry={l.ry}
            fill={l.fill}
            opacity=".88"
          />
          <ellipse
            cx={l.cx - l.rx * 0.2}
            cy={l.cy - l.ry * 0.2}
            rx={l.rx * 0.55}
            ry={l.ry * 0.5}
            fill="#dfe8db"
            opacity=".35"
          />
        </g>
      ))}
    </g>
  );
}

function Sprig({
  x,
  y,
  r,
  s = 1,
}: {
  x: number;
  y: number;
  r: number;
  s?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${r}) scale(${s}) translate(-60 -200)`}
    >
      <path
        d="M60 200 C 62 150, 54 100, 62 50 C 64 30, 60 14, 58 0"
        fill="none"
        stroke="#5f7a5c"
        strokeWidth="1.2"
      />
      {Array.from({ length: 10 }, (_, i) => {
        const cy = 182 - i * 18;
        const side = i % 2 ? 1 : -1;
        return (
          <ellipse
            key={i}
            cx={60 + side * 9}
            cy={cy}
            rx="3.6"
            ry="13"
            fill={i % 3 ? "#7f9a7d" : "#6b8868"}
            opacity=".82"
            transform={`rotate(${side * 48} ${60 + side * 9} ${cy})`}
          />
        );
      })}
    </g>
  );
}

function Bloom({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      {Array.from({ length: 6 }, (_, i) => (
        <circle
          key={i}
          cx={Math.cos((i * Math.PI) / 3) * 9}
          cy={Math.sin((i * Math.PI) / 3) * 9}
          r="10"
          fill="#efd8cc"
          opacity=".85"
        />
      ))}
      <circle r="9" fill="#e6c2b1" />
      <circle r="5" fill="#d9a993" />
      <circle cx="-2" cy="-2" r="2.4" fill="#f6e6dd" opacity=".8" />
    </g>
  );
}

const MIRROR = { tl: undefined, tr: "-1 1", bl: "1 -1", br: "-1 -1" } as const;

/** A corner spray, drawn for the top-left corner and mirrored into the `corner` it sits in.
 *  It sways from its stem ends, so the breeze never moves it out of its corner. */
export function Spray({
  className = "",
  corner = "tl",
  slow = false,
}: {
  className?: string;
  corner?: keyof typeof MIRROR;
  slow?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={className} style={{ scale: MIRROR[corner] }} aria-hidden>
      {/* The sway runs on the whole svg so the browser can move it as one layer;
          animating inside the filtered group would repaint the watercolour every frame. */}
      <svg
        viewBox="0 0 240 240"
        className={`block h-auto w-full ${slow ? "sway-slow" : "sway"}`}
      >
        <defs>
          <filter id={`wc${id}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035"
              numOctaves="2"
              seed="3"
            />
            <feDisplacementMap in="SourceGraphic" scale="4" />
          </filter>
        </defs>
        <g filter={`url(#wc${id})`}>
          {/* Stems start in the top-left corner and fan out towards the page. */}
          <Sprig x={12} y={14} r={100} s={0.6} />
          <Eucalyptus x={12} y={14} r={115} s={0.95} />
          <Eucalyptus x={14} y={12} r={140} s={0.7} />
          <Sprig x={12} y={14} r={155} s={0.8} />
          <Bloom x={30} y={30} size={1.15} />
          <Bloom x={62} y={22} size={0.7} />
          <Bloom x={22} y={62} size={0.8} />
        </g>
      </svg>
    </div>
  );
}

/** Thin sprig used as the divider between the couple's names. */
export function SprigRule() {
  return (
    <svg viewBox="0 0 160 24" className="h-6 w-40" aria-hidden>
      <path d="M8 12 H152" stroke="#8fa98c" strokeWidth=".8" />
      {[-1, 1].map((d) => (
        <g key={d} transform={`translate(80 12) scale(${d} 1)`}>
          {[14, 26, 38].map((x, i) => (
            <ellipse
              key={x}
              cx={x}
              cy={i % 2 ? 4 : -4}
              rx="5.5"
              ry="2.4"
              fill="#9cb497"
              transform={`rotate(${i % 2 ? 25 : -25} ${x} ${i % 2 ? 4 : -4})`}
            />
          ))}
        </g>
      ))}
      <circle cx="80" cy="12" r="3.4" fill="#e6c2b1" />
    </svg>
  );
}
