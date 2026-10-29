import { useId } from "react";

// Section dividers for the alternate designs, one per world.

const useUid = () => useId().replace(/:/g, "");

/** Songket: a woven strip of pucuk rebung over a row of bunga tabur. */
export function SongketWeave({ height = 30 }: { height?: number }) {
  const id = useUid();
  return (
    <svg width="100%" height={height} aria-hidden className="block">
      <defs>
        <pattern id={`sw${id}`} width="26" height={height} patternUnits="userSpaceOnUse">
          <rect width="26" height={height} fill="#5a0d1e" />
          <path d={`M0 ${height - 4} L13 5 L26 ${height - 4} Z`} fill="#d9a441" />
          <path d={`M6 ${height - 4} L13 ${height * 0.42} L20 ${height - 4} Z`} fill="#5a0d1e" />
          <rect y={height - 3} width="26" height="1.5" fill="#f3d28a" />
          <rect y="1.5" width="26" height="1" fill="#d9a441" />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#sw${id})`} />
    </svg>
  );
}

/** Pelamin: a garland of jasmine and roses strung on a gold cord. */
export function Garland({ height = 34 }: { height?: number }) {
  const id = useUid();
  return (
    <svg width="100%" height={height} aria-hidden className="block">
      <defs>
        <pattern id={`ga${id}`} width="64" height={height} patternUnits="userSpaceOnUse">
          <path d={`M0 6 Q 32 ${height - 4}, 64 6`} fill="none" stroke="#e6b84a" strokeWidth="1.4" />
          <circle cx="32" cy={height - 9} r="6" fill="#f28bb0" />
          <circle cx="32" cy={height - 9} r="2.4" fill="#c23b6b" />
          <circle cx="16" cy={height / 2} r="3.2" fill="#fdf6e8" />
          <circle cx="48" cy={height / 2} r="3.2" fill="#fdf6e8" />
          <circle cx="0" cy="6" r="3" fill="#e6b84a" />
          <circle cx="64" cy="6" r="3" fill="#e6b84a" />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#ga${id})`} />
    </svg>
  );
}

/** Surat: the red-and-blue chevron edge of an airmail envelope. */
export function AirmailEdge({ height = 14 }: { height?: number }) {
  const id = useUid();
  return (
    <svg width="100%" height={height} aria-hidden className="block">
      <defs>
        <pattern id={`am${id}`} width="44" height={height} patternUnits="userSpaceOnUse" patternTransform="skewX(-40)">
          <rect width="11" height={height} fill="#c8323b" />
          <rect x="22" width="11" height={height} fill="#1b3f8f" />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill="#f3f7fb" />
      <rect width="100%" height={height} fill={`url(#am${id})`} />
    </svg>
  );
}

/** Batik: a parang band of diagonal wax blades with cecek dots. */
export function ParangBand({ height = 26 }: { height?: number }) {
  const id = useUid();
  return (
    <svg width="100%" height={height} aria-hidden className="block">
      <defs>
        <pattern id={`pb${id}`} width="22" height={height} patternUnits="userSpaceOnUse">
          <rect width="22" height={height} fill="#8a4b22" />
          <path d={`M-4 ${height} C 4 ${height * 0.6}, 8 ${height * 0.4}, 18 0 L 24 0 C 14 ${height * 0.4}, 10 ${height * 0.6}, 2 ${height} Z`} fill="#18224d" />
          <path d={`M2 ${height} C 10 ${height * 0.6}, 14 ${height * 0.4}, 24 0`} fill="none" stroke="#f4ead6" strokeWidth="1.1" />
          <circle cx="16" cy={height * 0.72} r="1.3" fill="#f4ead6" />
          <circle cx="6" cy={height * 0.28} r="1.3" fill="#f4ead6" />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#pb${id})`} />
    </svg>
  );
}