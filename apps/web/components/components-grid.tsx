"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, registry, type RegistryEntry } from "@/registry";
import { LivePreview } from "./LivePreview";

function LazyPreview({ entry }: { entry: RegistryEntry }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(([item]) => setIsVisible(item?.isIntersecting ?? false), {
      rootMargin: "200px 0px",
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="vd-dotgrid relative h-56 overflow-hidden border-b border-line bg-bg">
      {isVisible ? <LivePreview entry={entry} width={960} height={620} scale={0.38} /> : null}
      <span className="absolute right-3 top-3 rounded-full border border-line bg-surface/80 px-2.5 py-1 font-mono backdrop-blur-sm text-[10px] uppercase tracking-wider text-ink-faint">
        live
      </span>
    </div>
  );
}

function ComponentCard({ entry, number }: { entry: RegistryEntry; number: string }) {
  const controls = entry.props.filter((prop) => prop.control).length;
  return (
    <Link
      href={`/components/${entry.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 ease-vd-out hover:-translate-y-1 hover:border-accent hover:shadow-vd-2"
    >
      <LazyPreview entry={entry} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-caption text-ink-faint">{number}</p>
          <span className="text-caption text-ink-faint transition-colors group-hover:text-accent">Open showcase →</span>
        </div>
        <h3 className="mt-1.5 text-title-md text-ink transition-colors group-hover:text-accent">{entry.name}</h3>
        <p className="mt-2 text-body-sm leading-relaxed text-ink-muted">{entry.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-caption text-ink-faint">
          <span className="font-mono">@/components/gleam/{entry.slug}</span>
          {controls > 0 ? <span>{controls} playground controls</span> : null}
        </div>
      </div>
    </Link>
  );
}

export function ComponentsGrid() {
  let counter = 0;
  return (
    <div className="space-y-16">
      {CATEGORIES.map((category) => {
        const items = registry.filter((entry) => entry.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} id={category.toLowerCase()} className="scroll-mt-24">
            <div className="mb-6 flex items-baseline gap-4">
              <h2 className="font-display text-display-sm text-ink">{category}</h2>
              <span className="text-caption text-ink-faint">{items.length} ready</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((entry) => {
                counter += 1;
                return <ComponentCard key={entry.slug} entry={entry} number={String(counter).padStart(2, "0")} />;
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
