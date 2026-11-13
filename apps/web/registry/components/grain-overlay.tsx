"use client";

import { useId } from "react";

export interface GrainOverlayProps {
  opacity?: number;
  speed?: number;
  frequency?: number;
  className?: string;
}

export function GrainOverlay({ opacity = 0.14, speed = 0.9, frequency = 0.8, className = "" }: GrainOverlayProps) {
  const id = useId().replace(/:/g, "");

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ opacity }}>
      <style>{`
        @keyframes grain-${id} {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-2%, 3%); }
          40% { transform: translate(3%, -2%); }
          60% { transform: translate(-3%, -3%); }
          80% { transform: translate(2%, 2%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .grain-${id} { animation: none !important; }
        }
      `}</style>
      <svg
        className={`grain-${id} absolute -inset-[10%] h-[120%] w-[120%]`}
        style={{ animation: `grain-${id} ${speed}s steps(5) infinite` }}
      >
        <filter id={`noise-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency={frequency} numOctaves={3} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#noise-${id})`} />
      </svg>
    </div>
  );
}
