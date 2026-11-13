"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface SplitRevealProps {
  text: string;
  by?: "chars" | "words";
  stagger?: number;
  duration?: number;
  className?: string;
}

export function SplitReveal({ text, by = "chars", stagger = 0.03, duration = 0.9, className }: SplitRevealProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          by === "chars" ? "[data-char]" : "[data-word]",
          { yPercent: 115, rotate: 6 },
          { yPercent: 0, rotate: 0, duration, stagger, ease: "power4.out" },
        );
      });
    },
    { scope: rootRef, dependencies: [text, by, stagger, duration], revertOnUpdate: true },
  );

  return (
    <span ref={rootRef} aria-label={text} className={className} style={{ display: "inline-block" }}>
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          aria-hidden
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.08em" }}
        >
          <span data-word style={{ display: "inline-block", transformOrigin: "0% 100%" }}>
            {by === "chars"
              ? Array.from(word).map((char, charIndex) => (
                  <span key={`${char}-${charIndex}`} data-char style={{ display: "inline-block", transformOrigin: "0% 100%" }}>
                    {char}
                  </span>
                ))
              : word}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
