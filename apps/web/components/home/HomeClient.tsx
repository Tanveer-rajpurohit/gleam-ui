"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { getEntry, type RegistryEntry } from "@/registry";
import { LivePreview } from "@/components/LivePreview";
import { GreetingLoader } from "@/registry/components/greeting-loader";
import { PulseCircle } from "@/registry/components/pulse-circle";

const INTRO_KEY = "gleam-intro-played";

export function IntroLoader() {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(INTRO_KEY)) return;
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch (error) {
      console.warn("Session storage unavailable", error);
      return;
    }
    setIsShowing(true);
  }, []);

  if (!isShowing) return null;
  return (
    <GreetingLoader wordDuration={0.16} onComplete={() => setIsShowing(false)}>
      <PulseCircle mode="sonar" size={84} rings={2} color="#819bb9" />
    </GreetingLoader>
  );
}

export function InView({ children, className = "", rootMargin = "200px 0px" }: { children: ReactNode; className?: string; rootMargin?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(([item]) => setIsVisible(item?.isIntersecting ?? false), { rootMargin });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={frameRef} className={className}>
      {isVisible ? children : null}
    </div>
  );
}

function Tile({ entry, number, className, scale }: { entry: RegistryEntry; number: string; className: string; scale: number }) {
  return (
    <Link
      href={`/components/${entry.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[border-color,transform] duration-300 ease-vd-out hover:-translate-y-1 hover:border-accent ${className}`}
    >
      <InView className={`vd-dotgrid relative min-h-0 flex-1 overflow-hidden ${entry.dark ? "bg-[#080808]" : "bg-bg"}`}>
        <LivePreview entry={entry} width={1200} height={760} scale={scale} />
      </InView>
      <div className="flex items-baseline justify-between gap-4 border-t border-line px-5 py-4">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-caption text-ink-faint">{number}</span>
          <span className="text-title-md text-ink transition-colors group-hover:text-accent">{entry.name}</span>
        </div>
        <span className="text-caption text-ink-faint">{entry.category}</span>
      </div>
    </Link>
  );
}

const FEATURED: { slug: string; className: string; scale: number }[] = [
  { slug: "liquid-chrome", className: "h-[420px] lg:col-span-7 lg:h-[520px]", scale: 0.62 },
  { slug: "spiral-gallery", className: "h-[420px] lg:col-span-5 lg:h-[520px]", scale: 0.5 },
  { slug: "noise-sphere", className: "h-[380px] lg:col-span-5 lg:h-[440px]", scale: 0.46 },
  { slug: "water-ripple", className: "h-[380px] lg:col-span-7 lg:h-[440px]", scale: 0.6 },
];

export function FeaturedTiles() {
  return (
    <div className="grid gap-5 lg:grid-cols-12">
      {FEATURED.map((tile, index) => {
        const entry = getEntry(tile.slug);
        return entry ? (
          <Tile key={tile.slug} entry={entry} number={String(index + 1).padStart(2, "0")} className={tile.className} scale={tile.scale} />
        ) : null;
      })}
    </div>
  );
}
