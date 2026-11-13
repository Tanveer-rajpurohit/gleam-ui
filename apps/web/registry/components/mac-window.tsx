"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface MacWindowProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  origin?: HTMLElement | null;
  children: ReactNode;
  className?: string;
}

export function MacWindow({ open, onClose, title, origin, children, className = "" }: MacWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = windowRef.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const collapsed = () => {
        gsap.set(el, { x: 0, y: 0, scaleX: 1, scaleY: 1 });
        if (!origin) return { x: 0, y: 32, scaleX: 0.92, scaleY: 0.92 };
        const rect = el.getBoundingClientRect();
        const from = origin.getBoundingClientRect();
        return {
          x: from.left + from.width / 2 - (rect.left + rect.width / 2),
          y: from.top + from.height / 2 - (rect.top + rect.height / 2),
          scaleX: Math.max(0.04, from.width / rect.width),
          scaleY: Math.max(0.04, from.height / rect.height),
        };
      };

      gsap.killTweensOf(el);
      if (open) {
        const start = collapsed();
        gsap.fromTo(
          el,
          { ...start, autoAlpha: 0, skewX: origin ? -8 : 0 },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            autoAlpha: 1,
            duration: reduce ? 0 : 0.6,
            ease: "expo.out",
          },
        );
      } else if (gsap.getProperty(el, "visibility") !== "hidden") {
        const end = collapsed();
        gsap.fromTo(
          el,
          { x: 0, y: 0, scaleX: 1, scaleY: 1 },
          { ...end, skewX: origin ? 8 : 0, autoAlpha: 0, duration: reduce ? 0 : 0.38, ease: "power3.in" },
        );
      }
    },
    { dependencies: [open, origin] },
  );

  return (
    <div
      ref={windowRef}
      role="dialog"
      aria-label={title ?? "Window"}
      aria-hidden={!open}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
      className={`invisible flex flex-col overflow-hidden rounded-xl border border-black/15 bg-neutral-50 text-neutral-900 shadow-[0_30px_80px_rgba(0,0,0,0.35)] will-change-transform dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-100 ${className}`}
    >
      <div className="relative flex h-10 shrink-0 items-center border-b border-black/10 px-3 dark:border-white/10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Close window"
            onClick={onClose}
            className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-inset ring-black/15 active:brightness-75"
          />
          <span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-inset ring-black/15" />
          <span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-inset ring-black/15" />
        </div>
        {title ? (
          <span className="pointer-events-none absolute inset-x-0 text-center text-xs font-medium opacity-70">{title}</span>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
