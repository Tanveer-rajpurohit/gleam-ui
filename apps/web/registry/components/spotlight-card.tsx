"use client";

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

export interface SpotlightCardProps {
  children: ReactNode;
  radius?: number;
  intensity?: number;
  color?: string;
  edge?: string;
  mode?: "hover" | "always";
  borderGlow?: boolean;
  className?: string;
}

export function SpotlightCard({
  children,
  radius = 320,
  intensity = 0.6,
  color = "rgba(163,181,204,0.18)",
  edge = "#a3b5cc",
  mode = "hover",
  borderGlow = true,
  className = "",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  const visibility = mode === "hover" ? "opacity-0 group-hover:opacity-100" : "opacity-100";

  return (
    <div
      ref={cardRef}
      onPointerMove={onPointerMove}
      className={`group relative overflow-hidden rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900 ${className}`}
      style={{ "--spot-x": "50%", "--spot-y": "50%" } as CSSProperties}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${visibility}`}
        style={{ background: `radial-gradient(${radius}px circle at var(--spot-x) var(--spot-y), ${color}, transparent 65%)` }}
      />
      {borderGlow ? (
        <div aria-hidden className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${visibility}`}>
          <div
            className="absolute inset-0 rounded-[inherit]"
            style={{
              opacity: intensity,
              padding: 1,
              background: `radial-gradient(${Math.round(radius * 0.75)}px circle at var(--spot-x) var(--spot-y), ${edge}, transparent 70%)`,
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        </div>
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}
