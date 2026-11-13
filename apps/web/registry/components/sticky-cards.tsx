"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface StickyCardItem {
  src: string;
  alt?: string;
  label?: string;
}

export interface StickyCardsProps {
  items: StickyCardItem[];
  margin?: number;
  rotate?: number;
  falloff?: number;
  header?: ReactNode;
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
}

export function StickyCards({ items, margin = 10, rotate = 100, falloff = 10000, header, scroller, className = "" }: StickyCardsProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root);
      cards.forEach((card) => {
        const image = card.querySelector("img");
        ScrollTrigger.create({
          trigger: card,
          scroller: scroller?.current ?? undefined,
          start: `top top+=${margin}%`,
          end: "max",
          onUpdate: (self) => {
            const travelled = Math.max(0, self.scroll() - self.start);
            const depth = Math.max(0, 1 - travelled / falloff);
            gsap.set(card, { scale: depth, rotation: (1 - depth) * rotate });
            if (image) gsap.set(image, { rotation: -(1 - depth) * rotate });
          },
        });
      });
    },
    { scope: rootRef, dependencies: [items, margin, rotate, falloff] },
  );

  return (
    <section ref={rootRef} className={`relative flex w-full flex-col items-center gap-[10vh] px-4 pb-[20vh] pt-[50vh] ${className}`}>
      {header ? <div className="absolute inset-x-0 top-24 flex flex-col items-center gap-4 text-center">{header}</div> : null}
      {items.map((item, index) => (
        <div
          key={`${item.src}-${index}`}
          data-card
          className="sticky w-full max-w-4xl overflow-hidden rounded-3xl bg-neutral-200 shadow-[0_30px_80px_rgba(0,0,0,0.25)] will-change-transform dark:bg-neutral-800"
          style={{ top: `${margin}vh`, height: `${100 - margin * 2}vh` }}
        >
          <img src={item.src} alt={item.alt ?? ""} className="h-full w-full scale-125 object-cover will-change-transform" />
          {item.label ? (
            <span className="absolute bottom-5 left-5 rounded-md bg-neutral-950/80 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-neutral-50">
              {item.label}
            </span>
          ) : null}
        </div>
      ))}
    </section>
  );
}
