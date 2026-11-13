"use client";

import { useEffect, useRef } from "react";

export interface PressureTextProps {
  text: string;
  minWeight?: number;
  maxWeight?: number;
  radius?: number;
  className?: string;
}

export function PressureText({
  text,
  minWeight = 300,
  maxWeight = 700,
  radius = 160,
  className,
}: PressureTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const chars = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-char]"));
    const weights = chars.map(() => minWeight);
    const pointer = { x: -9999, y: -9999 };
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      chars.forEach((char, index) => {
        const rect = char.getBoundingClientRect();
        const distance = Math.hypot(pointer.x - (rect.left + rect.width / 2), pointer.y - (rect.top + rect.height / 2));
        const pressure = Math.max(0, 1 - distance / radius);
        const target = minWeight + (maxWeight - minWeight) * pressure * pressure;
        const next = weights[index]! + (target - weights[index]!) * 0.14;
        weights[index] = next;
        char.style.fontVariationSettings = `"wght" ${next.toFixed(1)}`;
      });
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [text, minWeight, maxWeight, radius]);

  return (
    <span ref={rootRef} aria-label={text} className={className} style={{ display: "inline-block" }}>
      {Array.from(text).map((char, index) => (
        <span
          key={`${char}-${index}`}
          data-char
          aria-hidden
          style={{ display: "inline-block", whiteSpace: "pre", fontVariationSettings: `"wght" ${minWeight}` }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
