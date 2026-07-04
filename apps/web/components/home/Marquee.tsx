"use client";

import React from "react";

export function Marquee() {
  const items = [
    "Framer Motion",
    "GSAP",
    "React Three Fiber",
    "Tailwind v4",
    "Radix UI",
    "TypeScript",
    "Next.js 16",
    "Accessible",
    "Motion-First",
  ];

  return (
    <div className="w-full border-b border-line bg-surface overflow-hidden flex items-center h-12">
      <div className="flex whitespace-nowrap animate-[gl-marquee_30s_linear_infinite] min-w-full">
        {/* Double the items to ensure seamless loop */}
        {[...items, ...items, ...items].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-6"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted">
              {item}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-line-strong" />
          </div>
        ))}
      </div>
    </div>
  );
}
