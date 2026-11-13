"use client";

import { useEffect, useRef } from "react";

export interface ScrambleTextProps {
  text: string;
  speed?: number;
  glyphs?: string;
  trigger?: "mount" | "hover";
  className?: string;
}

const DEFAULT_GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&/<>+=";

export function ScrambleText({
  text,
  speed = 1,
  glyphs = DEFAULT_GLYPHS,
  trigger = "mount",
  className,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const frameRef = useRef(0);
  const playRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    playRef.current = () => {
      cancelAnimationFrame(frameRef.current);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = text;
        return;
      }
      const start = performance.now();
      const perChar = 45 / speed;
      const settle = 380 / speed;
      const tick = (now: number) => {
        const elapsed = now - start;
        let output = "";
        let done = true;
        for (let i = 0; i < text.length; i++) {
          const char = text[i]!;
          if (char === " " || elapsed > i * perChar + settle) {
            output += char;
          } else {
            done = false;
            output += elapsed < i * perChar * 0.4 ? " " : glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }
        el.textContent = output;
        if (!done) frameRef.current = requestAnimationFrame(tick);
      };
      frameRef.current = requestAnimationFrame(tick);
    };

    if (trigger === "mount") playRef.current();
    return () => cancelAnimationFrame(frameRef.current);
  }, [text, speed, glyphs, trigger]);

  return (
    <span
      ref={ref}
      aria-label={text}
      onPointerEnter={trigger === "hover" ? () => playRef.current() : undefined}
      className={className}
      style={{ whiteSpace: "pre", fontVariantNumeric: "tabular-nums" }}
    >
      {text}
    </span>
  );
}
