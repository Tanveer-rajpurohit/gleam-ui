"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface PerspectiveTextProps {
  children: ReactNode;
  height?: string;
  angle?: number;
  travel?: number;
  depth?: number;
  hint?: string;
  fade?: string;
  scroller?: RefObject<HTMLElement | null>;
  textClassName?: string;
  className?: string;
}

export function PerspectiveText({
  children,
  height = "300vh",
  angle = 30,
  travel = 480,
  depth = 200,
  hint = "Scroll",
  fade = "#f0f5fa",
  scroller,
  textClassName = "",
  className = "",
}: PerspectiveTextProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const plane = planeRef.current;
      if (!section || !plane) return;
      gsap.set(plane, { "--travel": travel });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(plane, { "--travel": 0 });
        return;
      }
      gsap.to(plane, {
        "--travel": 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller: scroller?.current ?? undefined,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [angle, travel, depth] },
  );

  return (
    <div ref={sectionRef} className={`relative w-full ${className}`} style={{ height }}>
      {hint ? (
        <p className="absolute left-1/2 top-[8%] -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.2em] opacity-50">{hint}</p>
      ) : null}
      <div
        className="sticky top-0 flex h-screen max-h-full items-center justify-center overflow-hidden [transform-style:preserve-3d]"
        style={{ perspective: `${depth}px` }}
      >
        <div
          ref={planeRef}
          className={`relative w-full max-w-4xl px-6 text-center text-6xl font-semibold tracking-tighter will-change-transform ${textClassName}`}
          style={{ transform: `rotateX(${angle}deg) translateY(calc(var(--travel, ${travel}) * 1px)) translateZ(10px)`, transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2" style={{ background: `linear-gradient(to bottom, transparent, ${fade})` }} />
      </div>
    </div>
  );
}
