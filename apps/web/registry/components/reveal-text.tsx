"use client";

import { createElement, useRef, type ElementType, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface RevealTextProps {
  children: string;
  mode?: "scrub" | "once";
  start?: string;
  stagger?: number;
  y?: number;
  duration?: number;
  blur?: boolean;
  as?: ElementType;
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
}

export function RevealText({
  children,
  mode = "once",
  start = "top 85%",
  stagger = 0.045,
  y = 14,
  duration = 0.6,
  blur = false,
  as = "p",
  scroller,
  className = "",
}: RevealTextProps) {
  const rootRef = useRef<HTMLElement>(null);
  const words = children.split(/\s+/).filter(Boolean);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const targets = root.querySelectorAll<HTMLElement>("[data-word]");
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(targets, { clipPath: "inset(-10% 100% -10% 0)", y, filter: blur ? "blur(6px)" : "none" });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            scroller: scroller?.current ?? undefined,
            start,
            ...(mode === "scrub" ? { end: "top 35%", scrub: 1 } : { toggleActions: "play none none none" }),
          },
        });
        targets.forEach((word, index) => {
          timeline.to(word, { clipPath: "inset(-10% -5% -10% 0)", y: 0, filter: "blur(0px)", duration, ease: "power3.out" }, index * stagger);
        });
      });
    },
    { scope: rootRef, dependencies: [children, mode, start, stagger, y, duration, blur] },
  );

  return createElement(
    as,
    { ref: rootRef, className: `flex flex-wrap gap-x-[0.28em] ${className}` },
    words.map((word, index) => (
      <span key={`${word}-${index}`} data-word className="inline-block will-change-transform">
        {word}
      </span>
    )),
  );
}
