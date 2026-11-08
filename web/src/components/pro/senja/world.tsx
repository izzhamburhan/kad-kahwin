// The world of the Senja film: padi fields at dusk, drawn on one 480x1040 canvas and split
// into a far layer and a near layer so the camera can move them at different speeds.
// Anything that loops is its own small <svg>, so the browser moves it without repainting
// the landscape behind it.

/** Repeatable noise. Math.random would differ between the static export and the browser. */
function noise(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`;

/** Rows of padi receding to the horizon, one path per row, leaving the path through the middle clear. */
const PADI_ROWS = (() => {
  const r = noise(7);
  const rows: { d: string; stroke: string; width: number }[] = [];
  const far = [150, 142, 76];
  const near = [22, 66, 56];
  for (let y = 608; y < 1040; y += 7 + (y - 600) * 0.055) {
    const depth = (y - 600) / 440;
    const blade = 7 + depth * 26;
    const gap = 9 + depth * 16;
    const clear = 12 + depth * 136;
    let d = "";
    for (let x = -6 + r() * gap; x < 486; x += gap * (0.75 + r() * 0.5)) {
      if (Math.abs(x - 240) < clear) continue;
      const lean = (r() - 0.5) * blade * 0.7;
      d += `M${x.toFixed(1)} ${y.toFixed(1)}q${(lean * 0.3).toFixed(1)} ${(-blade * 0.6).toFixed(1)} ${lean.toFixed(1)} ${(-blade).toFixed(1)}`;
    }
    rows.push({ d, stroke: mix(far, near, Math.min(1, depth * 1.15)), width: 0.9 + depth * 1.9 });
  }
  return rows;
})();

function Palm({ x, y, h, flip = false }: { x: number; y: number; h: number; flip?: boolean }) {
  const lean = flip ? -14 : 14;
  const top = { x: x + lean, y: y - h };
  const fronds = [
    [-46, 10],
    [-38, -14],
    [-16, -28],
    [14, -28],
    [38, -14],
    [46, 10],
  ];
  return (
    <g>
      <path d={`M${x} ${y}Q${x - lean * 0.2} ${y - h * 0.6} ${top.x} ${top.y}`} fill="none" stroke="#17333d" strokeWidth={h * 0.04} strokeLinecap="round" />
      {fronds.map(([dx, dy]) => (
        <path
          key={`${dx}${dy}`}
          d={`M${top.x} ${top.y}Q${top.x + dx * 0.55} ${top.y + dy - 12} ${top.x + dx} ${top.y + dy + 12}Q${top.x + dx * 0.5} ${top.y + dy - 3} ${top.x} ${top.y}Z`}
          fill="#17333d"
        />
      ))}
    </g>
  );
}

export function BackWorld() {
  return (
    <svg viewBox="0 0 480 1040" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="senja-sky" x1="0" y1="0" x2="0" y2="640" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#163f50" />
          <stop offset="0.36" stopColor="#3f7180" />
          <stop offset="0.62" stopColor="#c58a80" />
          <stop offset="0.82" stopColor="#f4b47a" />
          <stop offset="1" stopColor="#ffdca0" />
        </linearGradient>
        <radialGradient id="senja-glow" cx="240" cy="548" r="290" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff0c4" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="#ffc98a" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ffc98a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="senja-sun" x1="0" y1="490" x2="0" y2="606" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff6d8" />
          <stop offset="1" stopColor="#ffb86f" />
        </linearGradient>
      </defs>
      <rect width="480" height="1040" fill="url(#senja-sky)" />
      <circle cx="240" cy="548" r="290" fill="url(#senja-glow)" />
      <circle cx="240" cy="548" r="58" fill="url(#senja-sun)" />

      <g fill="#f8cdb0">
        <path d="M-10 322Q70 306 168 316T318 312Q240 330 150 330T-10 340Z" opacity="0.34" />
        <path d="M250 402Q330 384 420 394T500 388V408Q420 416 350 412T250 402Z" opacity="0.42" />
        <path d="M-10 452Q60 438 130 446T220 446Q150 462 80 460T-10 468Z" opacity="0.5" />
      </g>

      <path d="M0 540C60 505 120 520 180 548C230 570 300 566 350 538C400 512 450 518 480 535V640H0Z" fill="#6f8a93" />
      <path d="M0 572C50 552 104 556 160 576C220 596 290 594 350 572C400 556 450 556 480 566V640H0Z" fill="#3a616e" />

      <g fill="#17333d">
        <path d="M362 566L396 540L430 566H424V590H368V566Z" />
        <path d="M372 590v14M390 590v14M406 590v14M420 590v14" stroke="#17333d" strokeWidth="2.2" />
      </g>
      <rect x="388" y="570" width="9" height="11" fill="#ffd28a" />
      <Palm x={64} y={606} h={118} />
      <Palm x={112} y={606} h={84} flip />
      <Palm x={474} y={606} h={96} flip />
      <rect y="600" width="480" height="440" fill="#2c5a52" />
    </svg>
  );
}

export function FrontWorld() {
  return (
    <svg viewBox="0 0 480 1040" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="senja-batas" x1="0" y1="590" x2="0" y2="1040" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffe0ad" />
          <stop offset="0.45" stopColor="#d8ab7d" />
          <stop offset="1" stopColor="#8e6443" />
        </linearGradient>
        <linearGradient id="senja-field" x1="0" y1="590" x2="0" y2="1040" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#c6ad6f" />
          <stop offset="0.3" stopColor="#7d8f5c" />
          <stop offset="1" stopColor="#2b5a4c" />
        </linearGradient>
      </defs>
      <path d="M0 596Q240 582 480 596V1040H0Z" fill="url(#senja-field)" />

      {/* Flooded strips holding the last of the sky. */}
      <g fill="#ffd9a3">
        <path d="M0 612Q100 604 208 610L204 618Q100 614 0 622Z" opacity="0.7" />
        <path d="M272 610Q380 604 480 612V622Q380 614 276 618Z" opacity="0.7" />
        <path d="M0 668Q90 658 190 664L180 678Q90 674 0 684Z" opacity="0.42" />
        <path d="M290 664Q390 658 480 668V684Q390 674 300 678Z" opacity="0.42" />
      </g>

      <g fill="none" strokeLinecap="round">
        {PADI_ROWS.map((row) => (
          <path key={row.d.slice(0, 24)} d={row.d} stroke={row.stroke} strokeWidth={row.width} />
        ))}
      </g>

      <path d="M232 590H248C256 700 306 900 382 1040H98C174 900 224 700 232 590Z" fill="url(#senja-batas)" />
    </svg>
  );
}

/** Faceless newlyweds walking the bund, hand in hand. Replace this one component to change the couple. */
export function Couple({ className = "" }: { className?: string }) {
  const ivory = "#f8f0e2";
  const shade = "#e6d8c3";
  const skin = "#c98f68";
  const gold = "#d8a544";
  const teal = "#1f5a66";
  return (
    <svg viewBox="0 0 200 400" className={className} aria-hidden>
      <ellipse cx="100" cy="389" rx="94" ry="9" fill="#0e2a34" opacity="0.3" />

      {/* Groom */}
      <path d="M38 262L36 378H58L63 286L67 378H89L87 262Z" fill={shade} />
      <path d="M34 376H60V381Q60 386 54 386H39Q34 386 34 381ZM65 376H91V381Q91 386 86 386H71Q65 386 65 381Z" fill="#1c2430" />
      <path d="M36 90Q28 94 25 114L18 196Q17 206 27 206H36L42 122Z" fill={shade} />
      <path d="M34 92Q40 78 55 73L62 80L69 73Q84 78 90 92L95 190H29Z" fill={ivory} />
      <path d="M29 174Q62 186 95 174L100 268Q62 282 24 268Z" fill={teal} />
      <path d="M28 190Q62 202 96 190M26 252Q62 266 98 252" fill="none" stroke={gold} strokeWidth="2.4" />
      <g fill={gold}>
        {[0, 1, 2, 3, 4, 5, 6].map((n) => (
          <path key={n} d={`M${35 + n * 9} ${222 + (n === 3 ? 4 : n === 2 || n === 4 ? 3.4 : n === 1 || n === 5 ? 2 : 0)}l4 -5 4 5 -4 5Z`} />
        ))}
      </g>
      <path d="M57 73Q62 90 67 73" fill="none" stroke={gold} strokeWidth="2.2" />
      <g fill={gold}>
        <circle cx="62" cy="98" r="1.9" />
        <circle cx="62" cy="111" r="1.9" />
        <circle cx="62" cy="124" r="1.9" />
      </g>
      <path d="M56 60H68V76Q62 82 56 76Z" fill="#b57c58" />
      <ellipse cx="62" cy="46" rx="16" ry="20" fill={skin} />
      <path d="M45 42L47 18Q62 10 77 18L79 42Q62 34 45 42Z" fill="#1c2430" />
      <path d="M88 92Q98 96 100 114L103 196L91 200L84 124Z" fill={shade} />

      {/* Bride */}
      <path d="M112 232L100 380Q138 394 178 380L166 232Z" fill="#efe1cd" />
      <path d="M101 366Q138 380 177 366L178 380Q138 394 100 380Z" fill={teal} />
      <path d="M102 362Q138 376 176 362" fill="none" stroke={gold} strokeWidth="2.2" />
      <path d="M112 112Q110 180 106 250Q138 262 172 250Q168 180 166 112Z" fill={ivory} />
      <path d="M108 238Q138 250 170 238" fill="none" stroke={gold} strokeWidth="1.8" />
      <path d="M113 116Q102 122 101 146L99 204L111 206L120 148Z" fill={shade} />
      <path d="M164 116Q176 122 176 146L174 186L160 190L156 148Z" fill={shade} />
      <path d="M138 12C116 12 108 34 110 60C111 84 104 104 102 128C122 142 154 142 176 128C172 104 165 84 166 60C168 34 160 12 138 12Z" fill="#f2e3d2" />
      <ellipse cx="138" cy="50" rx="15" ry="19" fill={skin} />
      <path d="M116 112Q138 128 162 112" fill="none" stroke={shade} strokeWidth="2" />
      <circle cx="158" cy="72" r="2.6" fill={gold} />

      {/* Clasped hands and a small posy */}
      <path d="M92 200Q100 196 108 202Q106 212 98 212Q92 210 92 200Z" fill={skin} />
      <circle cx="168" cy="190" r="9" fill={skin} />
      <g>
        <path d="M152 188L168 218L184 188Z" fill="#5d7f5f" />
        <circle cx="156" cy="180" r="9" fill="#ee9d6b" />
        <circle cx="172" cy="172" r="10" fill="#f8d6b8" />
        <circle cx="185" cy="184" r="8.5" fill="#d9734a" />
        <circle cx="168" cy="190" r="8" fill="#fbe6cf" />
      </g>
    </svg>
  );
}

/** A clump of ripe padi in the near foreground, curving under the weight of its grain. */
export function PadiClump({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const stems = [
    [14, -10, 96],
    [34, 16, 150],
    [58, -14, 176],
    [80, 24, 198],
    [104, -6, 170],
    [128, 22, 132],
    [148, -4, 92],
  ];
  return (
    <svg viewBox="0 0 160 220" className={`senja-sway ${className}`} style={{ animationDelay: `${delay}s` }} aria-hidden>
      {stems.map(([x, lean, h]) => {
        const tipX = x + lean;
        const tipY = 220 - h;
        return (
          <g key={x}>
            <path d={`M${x} 220Q${x + lean * 0.1} ${220 - h * 0.6} ${tipX} ${tipY}`} fill="none" stroke="#1d4a42" strokeWidth="3" strokeLinecap="round" />
            {[0, 1, 2, 3].map((n) => (
              <ellipse key={n} cx={tipX + (lean > 0 ? n * 2.6 : -n * 2.6)} cy={tipY + n * 9} rx="3" ry="5" fill="#d5a653" />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/** A wau bulan flying over the fields, its line trailing down out of frame. */
export function Wau({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 260" className={`senja-kite ${className}`} aria-hidden>
      <path d="M50 112Q44 190 22 260" fill="none" stroke="#fff3df" strokeWidth="0.8" opacity="0.65" />
      <path d="M50 14V112" stroke="#17333d" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M50 40C20 18 5 30 2 46C20 40 36 46 50 64C64 46 80 40 98 46C95 30 80 18 50 40Z" fill="#b4532a" />
      <path d="M50 44C30 30 17 34 12 42C26 40 40 48 50 58C60 48 74 40 88 42C83 34 70 30 50 44Z" fill="#ffd9a3" />
      <path d="M26 98C30 116 70 116 74 98C66 108 34 108 26 98Z" fill="#b4532a" />
      <path d="M50 6C58 14 58 28 50 40C42 28 42 14 50 6Z" fill="#1f5a66" />
    </svg>
  );
}

/** Egrets crossing the sky; they cross and leave, as the birds on a padi field do. */
export function Egrets({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 40" className={`senja-fly ${className}`} aria-hidden>
      <g fill="none" stroke="#fff6e8" strokeWidth="1.8" strokeLinecap="round">
        <path d="M2 18Q10 8 18 16Q26 8 34 18" />
        <path d="M34 34Q41 25 48 32Q55 25 62 34" />
        <path d="M58 12Q65 4 72 10Q79 4 86 12" />
      </g>
    </svg>
  );
}