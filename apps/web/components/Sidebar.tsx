"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import type { RegistryEntry } from "@/lib/registry";

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Sidebar({
  groups,
}: {
  groups: { category: string; items: RegistryEntry[] }[];
}) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;
    
    // Initialize an independent Lenis instance for the sidebar
    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <nav 
      ref={wrapperRef} 
      className="h-full w-full overflow-y-auto thin-scrollbar"
      data-lenis-prevent="true"
    >
      <div ref={contentRef} className="py-8 pr-4">
        <Link
          href="/docs"
          className={cn(
            "mb-6 block text-[13px] font-medium transition-colors duration-150",
            pathname === "/docs"
              ? "text-accent"
              : "text-ink-muted hover:text-ink",
          )}
        >
          Getting started
        </Link>

        <div className="space-y-6">
          {groups.map(({ category, items }) => (
            <div key={category}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                {category}
              </p>
              <ul className="space-y-px border-l border-line">
                {items.map((item) =>
                  item.status === "ready" ? (
                    <li key={item.slug}>
                      <Link
                        href={`/docs/${item.slug}`}
                        className={cn(
                          "-ml-px block border-l-2 py-1.5 pl-4 text-[13px] font-medium transition-colors duration-150",
                          pathname === `/docs/${item.slug}`
                            ? "border-accent text-accent"
                            : "border-transparent text-ink-muted hover:border-accent/40 hover:text-ink",
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ) : (
                    <li
                      key={item.slug}
                      className="flex items-center gap-2 py-1.5 pl-4 text-[13px] text-ink-faint"
                    >
                      {item.name}
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-accent">
                        soon
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
