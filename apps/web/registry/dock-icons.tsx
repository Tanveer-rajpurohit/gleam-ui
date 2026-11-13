import type { ReactNode } from "react";

interface TileProps {
  from: string;
  to: string;
  children: ReactNode;
}

function Tile({ from, to, children }: TileProps) {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
      <defs>
        <linearGradient id={`tile-${from.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="11" fill={`url(#tile-${from.slice(1)})`} />
      <g fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

export const DOCK_ICONS: Record<string, ReactNode> = {
  shader: (
    <Tile from="#ff8a4c" to="#e8320a">
      <circle cx="24" cy="24" r="9" />
      <path d="M15 24c3-4 6-4 9 0s6 4 9 0" />
    </Tile>
  ),
  text: (
    <Tile from="#5b6470" to="#1d2126">
      <path d="M15 16h18M24 16v17" />
    </Tile>
  ),
  gallery: (
    <Tile from="#57c7ff" to="#1667d9">
      <rect x="13" y="15" width="22" height="18" rx="3" />
      <path d="m14 29 6-6 5 5 3-3 6 6" />
    </Tile>
  ),
  cursor: (
    <Tile from="#7be08a" to="#16924a">
      <path d="m17 14 15 8-7 2-2 7z" />
    </Tile>
  ),
  window: (
    <Tile from="#c59bff" to="#6a35d8">
      <rect x="12" y="14" width="24" height="20" rx="3" />
      <path d="M12 20h24" />
    </Tile>
  ),
  stars: (
    <Tile from="#3a3f55" to="#0c0e17">
      <path d="M24 13v6M24 29v6M13 24h6M29 24h6" />
    </Tile>
  ),
  loader: (
    <Tile from="#ffd44f" to="#e89a0c">
      <path d="M24 13a11 11 0 1 0 11 11" />
    </Tile>
  ),
};
