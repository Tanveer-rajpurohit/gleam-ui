"use client";

import { useEffect, useRef, useState } from "react";
import { defaultValues, getEntry, type ControlValues } from "@/registry";
import { demos } from "@/registry/demos";

interface DemoFrameProps {
  slug: string;
  values?: ControlValues;
  compact?: boolean;
  className?: string;
}

export function DemoFrame({ slug, values, compact = false, className = "" }: DemoFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const entry = getEntry(slug);
  const Demo = demos[slug];

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(([item]) => setIsVisible(item?.isIntersecting ?? false), {
      rootMargin: "120px",
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  if (!entry || !Demo) return null;

  return (
    <div
      ref={frameRef}
      className={`relative overflow-hidden ${entry.dark ? "bg-[#080808] text-[#ecedee]" : "bg-surface text-ink"} ${
        entry.stage === "center" ? "flex items-center justify-center" : ""
      } ${className}`}
    >
      {isVisible ? (
        entry.stage === "fill" ? (
          <div className="absolute inset-0">
            <Demo values={values ?? defaultValues(entry)} compact={compact} />
          </div>
        ) : (
          <Demo values={values ?? defaultValues(entry)} compact={compact} />
        )
      ) : null}
    </div>
  );
}
