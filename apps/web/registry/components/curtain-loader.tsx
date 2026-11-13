"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface CurtainLoaderProps {
  words?: string[];
  duration?: number;
  exit?: "up" | "down";
  onComplete?: () => void;
  className?: string;
}

export function CurtainLoader({
  words = ["GLEAM", "LOADING"],
  duration = 1.8,
  exit = "up",
  onComplete,
  className = "",
}: CurtainLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      const count = countRef.current;
      const line = lineRef.current;
      if (!root || !count || !line) return;

      const finish = () => {
        setIsDone(true);
        onComplete?.();
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const timer = window.setTimeout(finish, 400);
        return () => window.clearTimeout(timer);
      }

      const progress = { value: 0 };
      gsap.set(line, { scaleX: 0, transformOrigin: "0% 50%" });

      gsap
        .timeline({ onComplete: finish })
        .fromTo(
          "[data-loader-char]",
          { yPercent: 115, rotateX: -70, autoAlpha: 0 },
          { yPercent: 0, rotateX: 0, autoAlpha: 1, duration: 0.72, stagger: 0.025, ease: "power4.out" },
        )
        .fromTo("[data-loader-detail]", { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42, stagger: 0.06, ease: "power3.out" }, 0.24)
        .to(
          progress,
          {
            value: 100,
            duration,
            ease: "power1.inOut",
            onUpdate: () => {
              const value = Math.round(progress.value);
              count.textContent = String(value).padStart(3, "0");
              gsap.set(line, { scaleX: value / 100 });
            },
          },
          0,
        )
        .to("[data-loader-char]", {
          yPercent: -115,
          autoAlpha: 0,
          duration: 0.48,
          stagger: { each: 0.018, from: "end" },
          ease: "power3.in",
        })
        .to("[data-loader-detail]", { y: -12, autoAlpha: 0, duration: 0.28, stagger: 0.025, ease: "power2.in" }, "<0.04")
        .to(root, { yPercent: exit === "up" ? -108 : 108, rotation: exit === "up" ? 1.2 : -1.2, duration: 0.92, ease: "power4.inOut" }, "<0.14");
    },
    { scope: rootRef, dependencies: [duration, exit, words.join("|")], revertOnUpdate: true },
  );

  if (isDone) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Loading"
      className={`absolute inset-0 z-50 flex flex-col justify-between overflow-hidden bg-neutral-950 p-6 font-mono text-neutral-100 sm:p-9 ${className}`}
    >
      <div data-loader-detail className="flex items-center justify-between text-[10px] uppercase tracking-widest sm:text-xs">
        <span>[ Loading ]</span>
        <span>Preparing sequence</span>
      </div>

      <div className="uppercase" style={{ perspective: 900 }}>
        {words.map((word) => (
          <div key={word} className="overflow-hidden text-[clamp(2.5rem,11vw,8rem)] font-semibold leading-[0.9]">
            {Array.from(word).map((char, index) => (
              <span key={`${word}-${index}`} data-loader-char aria-hidden className="inline-block">
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div data-loader-detail className="uppercase">
        <div className="mb-3 flex items-end justify-between text-[10px] tracking-widest sm:text-xs">
          <span>Loading assets</span>
          <span ref={countRef} className="text-xl tabular-nums sm:text-2xl">
            000
          </span>
        </div>
        <div className="h-px w-full bg-neutral-100/20">
          <div ref={lineRef} className="h-full w-full bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}
