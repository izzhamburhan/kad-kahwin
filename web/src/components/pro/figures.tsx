// Faceless drawings of the groom (baju melayu, samping, songkok) and the bride (baju kurung,
// tudung, a posy), each on its own canvas so a card can frame them apart. Cards show these
// until the hosts set real photos in the admin.

const IVORY = "#f8f0e2";
const SHADE = "#e6d8c3";
const SKIN = "#c98f68";
const GOLD = "#d8a544";

/** `accent` colours the samping and the hem of the kurung, so the pair matches the card. */
export function GroomFigure({ accent, className = "" }: { accent: string; className?: string }) {
  return (
    <svg viewBox="8 6 104 384" className={className} role="img" aria-label="Pengantin lelaki">
      <path d="M36 90Q28 94 25 114L18 196Q17 206 27 206H36L42 122Z" fill={SHADE} />
      <circle cx="26" cy="212" r="7.5" fill={SKIN} />
      <path d="M38 262L36 378H58L63 286L67 378H89L87 262Z" fill={SHADE} />
      <path d="M34 376H60V381Q60 386 54 386H39Q34 386 34 381ZM65 376H91V381Q91 386 86 386H71Q65 386 65 381Z" fill="#1c2430" />
      <path d="M34 92Q40 78 55 73L62 80L69 73Q84 78 90 92L95 190H29Z" fill={IVORY} />
      <path d="M29 174Q62 186 95 174L100 268Q62 282 24 268Z" fill={accent} />
      <path d="M28 190Q62 202 96 190M26 252Q62 266 98 252" fill="none" stroke={GOLD} strokeWidth="2.4" />
      <path
        d="M35 222l4 -5 4 5 -4 5ZM44 224l4 -5 4 5 -4 5ZM53 225.4l4 -5 4 5 -4 5ZM62 226l4 -5 4 5 -4 5ZM71 225.4l4 -5 4 5 -4 5ZM80 224l4 -5 4 5 -4 5ZM89 222l4 -5 4 5 -4 5Z"
        fill={GOLD}
      />
      <path d="M57 73Q62 90 67 73" fill="none" stroke={GOLD} strokeWidth="2.2" />
      <circle cx="62" cy="98" r="1.9" fill={GOLD} />
      <circle cx="62" cy="111" r="1.9" fill={GOLD} />
      <circle cx="62" cy="124" r="1.9" fill={GOLD} />
      <path d="M56 60H68V76Q62 82 56 76Z" fill="#b57c58" />
      <ellipse cx="62" cy="46" rx="16" ry="20" fill={SKIN} />
      <path d="M45 42L47 18Q62 10 77 18L79 42Q62 34 45 42Z" fill="#1c2430" />
      <path d="M88 92Q98 96 100 114L103 196L91 200L84 124Z" fill={SHADE} />
      <circle cx="98" cy="207" r="7.5" fill={SKIN} />
    </svg>
  );
}

export function BrideFigure({ accent, className = "" }: { accent: string; className?: string }) {
  return (
    <svg viewBox="8 6 104 384" className={className} role="img" aria-label="Pengantin perempuan">
      <g transform="translate(-76 0)">
        <path d="M112 232L100 380Q138 394 178 380L166 232Z" fill="#efe1cd" />
        <path d="M101 366Q138 380 177 366L178 380Q138 394 100 380Z" fill={accent} />
        <path d="M102 362Q138 376 176 362" fill="none" stroke={GOLD} strokeWidth="2.2" />
        <path d="M112 112Q110 180 106 250Q138 262 172 250Q168 180 166 112Z" fill={IVORY} />
        <path d="M108 238Q138 250 170 238" fill="none" stroke={GOLD} strokeWidth="1.8" />
        <path d="M113 116Q102 122 101 146L99 204L111 206L120 148Z" fill={SHADE} />
        <circle cx="105" cy="212" r="7.5" fill={SKIN} />
        <path d="M164 116Q176 122 176 146L174 186L160 190L156 148Z" fill={SHADE} />
        <path d="M138 12C116 12 108 34 110 60C111 84 104 104 102 128C122 142 154 142 176 128C172 104 165 84 166 60C168 34 160 12 138 12Z" fill="#fbf0e6" />
        <ellipse cx="138" cy="50" rx="15" ry="19" fill={SKIN} />
        <path d="M116 112Q138 128 162 112" fill="none" stroke={SHADE} strokeWidth="2" />
        <circle cx="158" cy="72" r="2.6" fill={GOLD} />
        <circle cx="168" cy="190" r="9" fill={SKIN} />
        <path d="M152 188L168 218L184 188Z" fill="#5d7f5f" />
        <circle cx="156" cy="180" r="9" fill="#c8605a" />
        <circle cx="172" cy="172" r="10" fill="#fff7ee" />
        <circle cx="185" cy="184" r="8.5" fill={accent} />
        <circle cx="168" cy="190" r="8" fill="#fbe6cf" />
      </g>
    </svg>
  );
}