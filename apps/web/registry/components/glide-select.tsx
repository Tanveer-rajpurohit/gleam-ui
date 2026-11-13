"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface GlideSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
}

export function GlideSelect({ label, value, options, onChange, className = "" }: GlideSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const glide = useRef<((y: number) => void) | null>(null);

  useGSAP(
    () => {
      gsap.set(menuRef.current, { autoAlpha: 0, y: -6 });
      gsap.set("[data-option]", { autoAlpha: 0, y: -6 });
      gsap.set(highlightRef.current, { autoAlpha: 0 });
      timeline.current = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .to(menuRef.current, { autoAlpha: 1, y: 0, duration: 0.3 }, 0)
        .to(chevronRef.current, { rotate: 180, duration: 0.3 }, 0)
        .to("[data-option]", { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05 }, "-=0.15");
      glide.current = gsap.quickTo(highlightRef.current, "y", { duration: 0.3, ease: "power3" });
    },
    { scope: rootRef, dependencies: [options.length] },
  );

  const rest = (target: HTMLElement | null, instant = false) => {
    const highlight = highlightRef.current;
    if (!target || !highlight) return;
    gsap.set(highlight, { height: target.offsetHeight, autoAlpha: 1 });
    if (instant) gsap.set(highlight, { y: target.offsetTop });
    else glide.current?.(target.offsetTop);
  };

  const selected = () => menuRef.current?.querySelector<HTMLElement>('[aria-selected="true"]') ?? null;

  useEffect(() => {
    if (isOpen) {
      timeline.current?.restart();
      rest(selected(), true);
      selected()?.focus();
    } else {
      gsap.to(menuRef.current, { autoAlpha: 0, y: -6, duration: 0.25, ease: "power3.in" });
      gsap.to(chevronRef.current, { rotate: 0, duration: 0.25, ease: "power3.in" });
    }
  }, [isOpen]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const move = (step: number) => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>("[data-option]") ?? []);
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next = items[(current + step + items.length) % items.length];
    next?.focus();
    rest(next ?? null);
  };

  return (
    <div
      ref={rootRef}
      className={`relative inline-block text-left ${className}`}
      onKeyDown={(event) => {
        if (event.key === "Escape") setIsOpen(false);
        if (!isOpen) return;
        if (event.key === "ArrowDown") {
          event.preventDefault();
          move(1);
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          move(-1);
        }
      }}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-10 items-center gap-2 rounded-lg border border-current/20 px-3.5 text-sm font-medium hover:border-current/45"
      >
        <span className="font-normal opacity-65">{label}</span>
        <span>{value}</span>
        <svg ref={chevronRef} viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={menuRef}
        className="invisible absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-neutral-900/15 bg-white p-1.5 text-neutral-900 shadow-[0_16px_40px_rgba(0,0,0,0.18)] dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-100"
      >
        <div
          id={listId}
          role="listbox"
          aria-label={label}
          className="relative flex flex-col gap-0.5"
          onPointerLeave={() => rest(selected())}
        >
          <div
            ref={highlightRef}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 rounded-lg bg-neutral-900/[0.07] dark:bg-white/10"
          />
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              data-option
              aria-selected={value === option}
              onPointerEnter={(event) => rest(event.currentTarget)}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`relative z-10 w-full rounded-lg px-3 py-2 text-left text-sm ${value === option ? "font-semibold" : ""}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
