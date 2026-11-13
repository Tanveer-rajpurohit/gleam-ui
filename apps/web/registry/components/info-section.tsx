"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface InfoBadgeProps {
  children: ReactNode;
  variant?: "solid" | "soft";
  className?: string;
}

export function InfoBadge({ children, variant = "solid", className = "" }: InfoBadgeProps) {
  const look = variant === "solid" ? "bg-[#a3b5cc] text-[#0b0d10]" : "bg-[#44607f] text-[#f0f5fa]";
  return <span className={`inline-block rounded-md px-2.5 py-0.5 ${look} ${className}`}>{children}</span>;
}

interface Pill {
  left: number;
  top: number;
  width: number;
  height: number;
  radius: number;
}

export interface InfoSectionProps {
  paragraphs: ReactNode[][];
  skeleton?: boolean;
  skeletonColor?: string;
  skeletonOpacity?: number;
  stagger?: number;
  start?: string;
  end?: string;
  scroller?: RefObject<HTMLElement | null>;
  textClassName?: string;
  children?: ReactNode;
  className?: string;
}

export function InfoSection({
  paragraphs,
  skeleton = true,
  skeletonColor = "#a3b5cc",
  skeletonOpacity = 0.16,
  stagger = 0.05,
  start = "top 70%",
  end = "top 40%",
  scroller,
  textClassName = "",
  children,
  className = "",
}: InfoSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [pills, setPills] = useState<Pill[][]>([]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!skeleton || !root) return;
    const measure = () => {
      const box = root.getBoundingClientRect();
      const next = Array.from(root.querySelectorAll<HTMLElement>("[data-paragraph]")).map((paragraph) =>
        Array.from(paragraph.querySelectorAll<HTMLElement>("[data-word]")).map((word) => {
          const rect = word.getBoundingClientRect();
          return {
            left: rect.left - box.left,
            top: rect.top - box.top,
            width: rect.width,
            height: rect.height * 0.9,
            radius: Math.min(rect.height, 28) / 2,
          };
        }),
      );
      setPills(next);
      ScrollTrigger.refresh();
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => undefined);
    const sizing = new ResizeObserver(measure);
    sizing.observe(root);
    return () => sizing.disconnect();
  }, [skeleton, paragraphs]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const blocks = root.querySelectorAll<HTMLElement>("[data-paragraph]");
      const ghosts = root.querySelectorAll<HTMLElement>("[data-ghost]");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(blocks, { opacity: 1 });
        gsap.set(ghosts, { opacity: 0 });
        return;
      }
      blocks.forEach((block, index) => {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: block, scroller: scroller?.current ?? undefined, start, end, scrub: 1 },
        });
        const ghost = ghosts[index];
        if (ghost) timeline.to(ghost, { opacity: 0, duration: 0.6 }, 0);
        timeline.to(block, { opacity: 1, duration: 0.6 }, 0);
        block.querySelectorAll<HTMLElement>("[data-word]").forEach((word, position) => {
          gsap.set(word, { clipPath: "inset(0 100% 0 0)", y: 10 });
          timeline.to(word, { clipPath: "inset(0 0% 0 0)", y: 0, duration: 0.45, ease: "power3.out" }, 0.2 + position * stagger);
        });
      });
    },
    { scope: rootRef, dependencies: [paragraphs, start, end, stagger, pills.length] },
  );

  const pillStyle = (pill: Pill): CSSProperties => ({
    left: pill.left,
    top: pill.top,
    width: pill.width,
    height: pill.height,
    borderRadius: pill.radius,
    opacity: skeletonOpacity,
    background: skeletonColor,
  });

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {skeleton
        ? pills.map((paragraph, index) => (
            <div key={`ghost-${index}`} data-ghost aria-hidden className="pointer-events-none absolute inset-0">
              {paragraph.map((pill, position) => (
                <span key={position} className="absolute" style={pillStyle(pill)} />
              ))}
            </div>
          ))
        : null}
      {paragraphs.map((words, index) => (
        <div
          key={`paragraph-${index}`}
          data-paragraph
          className={`flex flex-wrap gap-x-3 gap-y-2 text-4xl font-semibold leading-tight tracking-tight opacity-0 ${index > 0 ? "mt-16" : ""} ${textClassName}`}
        >
          {words.map((word, position) => (
            <span key={position} data-word className="inline-block">
              {word}
            </span>
          ))}
        </div>
      ))}
      {children}
    </div>
  );
}
