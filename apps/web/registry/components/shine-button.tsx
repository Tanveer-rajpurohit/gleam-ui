"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface ShineButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "border";
  mode?: "auto" | "hover" | "off";
  speed?: number;
  accent?: string;
  className?: string;
}

export function ShineButton({
  children,
  href,
  onClick,
  variant = "solid",
  mode = "auto",
  speed = 2.8,
  accent = "#a3b5cc",
  className = "",
}: ShineButtonProps) {
  const rootRef = useRef<HTMLElement>(null);
  const sheenRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || mode === "off") return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (variant === "border") {
          gsap.fromTo(root, { "--angle": 0 }, { "--angle": 360, duration: (6 * 2.8) / speed, ease: "none", repeat: -1 });
          return;
        }
        const sheen = sheenRef.current;
        if (!sheen) return;
        const sweep = gsap.fromTo(
          sheen,
          { xPercent: -120 },
          { xPercent: 420, duration: speed * 0.45, ease: "power2.inOut", repeat: -1, repeatDelay: speed * 0.55, paused: mode === "hover" },
        );
        if (mode !== "hover") return;
        const play = () => sweep.restart();
        const stop = () => sweep.pause(0);
        root.addEventListener("pointerenter", play);
        root.addEventListener("pointerleave", stop);
        return () => {
          root.removeEventListener("pointerenter", play);
          root.removeEventListener("pointerleave", stop);
        };
      });
    },
    { dependencies: [variant, mode, speed] },
  );

  const base =
    "group relative isolate inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-7 text-sm font-medium transition-transform duration-150 active:scale-[0.97]";
  const look =
    variant === "border"
      ? "text-neutral-900 dark:text-neutral-50"
      : "bg-neutral-950 text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200";
  const style =
    variant === "border"
      ? { background: `conic-gradient(from calc(var(--angle, 0) * 1deg), rgba(128,128,128,0.25) 0%, ${accent} 12%, rgba(128,128,128,0.25) 28%)` }
      : undefined;

  const content = (
    <>
      {variant === "border" ? (
        <span aria-hidden className="absolute inset-px -z-10 rounded-full bg-neutral-50 transition-colors group-hover:bg-white dark:bg-neutral-950 dark:group-hover:bg-neutral-900" />
      ) : mode !== "off" ? (
        <span
          ref={sheenRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)]"
        />
      ) : null}
      <span className="relative">{children}</span>
    </>
  );

  if (href) {
    return (
      <a ref={(node) => { rootRef.current = node; }} href={href} onClick={onClick} className={`${base} ${look} ${className}`} style={style}>
        {content}
      </a>
    );
  }

  return (
    <button ref={(node) => { rootRef.current = node; }} type="button" onClick={onClick} className={`${base} ${look} ${className}`} style={style}>
      {content}
    </button>
  );
}
