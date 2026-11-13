"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";

export interface GreetingLoaderProps {
  words?: string[];
  wordDuration?: number;
  exit?: "up" | "down" | "fade";
  exitDuration?: number;
  onComplete?: () => void;
  children?: ReactNode;
  className?: string;
}

const GREETINGS = ["Hello", "Hola", "नमस्ते", "Bonjour", "Ciao", "こんにちは", "안녕하세요"];

export function GreetingLoader({
  words = GREETINGS,
  wordDuration = 0.2,
  exit = "up",
  exitDuration = 0.8,
  onComplete,
  children,
  className = "",
}: GreetingLoaderProps) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);
  const [index, setIndex] = useState(0);
  const doneRef = useRef(onComplete);

  useEffect(() => {
    doneRef.current = onComplete;
  });

  useEffect(() => {
    const curtain = curtainRef.current;
    const word = wordRef.current;
    if (!curtain || !word) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => doneRef.current?.(), 400);
      return () => window.clearTimeout(timer);
    }

    let step = 0;
    const timeline = gsap.timeline();
    timeline.fromTo(word, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "power3.out" });
    timeline.to({}, {
      duration: wordDuration,
      repeat: words.length - 1,
      onRepeat: () => {
        step += 1;
        setIndex(step % words.length);
      },
    });
    const exitVars: gsap.TweenVars = { duration: exitDuration, ease: "power4.inOut", onComplete: () => doneRef.current?.() };
    if (exit === "fade") exitVars.autoAlpha = 0;
    else exitVars.yPercent = exit === "up" ? -100 : 100;
    timeline.to(word, { autoAlpha: 0, yPercent: exit === "down" ? 30 : -30, duration: 0.3, ease: "power2.in" }, "+=0.15");
    timeline.to(curtain, exitVars, "<0.05");

    return () => {
      timeline.kill();
    };
  }, [words, wordDuration, exit, exitDuration]);

  return (
    <div className={`fixed inset-0 z-[100] ${className}`} role="status" aria-live="polite">
      <div
        ref={curtainRef}
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-neutral-950 text-neutral-50 will-change-transform dark:bg-neutral-50 dark:text-neutral-950"
      >
        <p ref={wordRef} className="flex items-center gap-4 text-5xl font-medium tracking-tight sm:text-6xl">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-current" />
          {words[index]}
        </p>
        {children}
      </div>
    </div>
  );
}
