"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, registry } from "@/registry";
import { DOC_PAGES } from "@/lib/site";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Docs" className="no-scrollbar flex gap-6 overflow-x-auto py-4 md:block md:h-full md:space-y-8 md:overflow-y-auto md:py-10 md:pr-6">
      <div className="shrink-0">
        <p className="mb-2 font-mono text-label uppercase text-ink-faint">Guide</p>
        <ul className="flex gap-1 md:block md:space-y-0.5">
          {DOC_PAGES.map((page) => {
            const isActive = pathname === page.href;
            return (
              <li key={page.href}>
                <Link
                  href={page.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`block whitespace-nowrap rounded-md px-2.5 py-1.5 text-body-sm ${
                    isActive ? "bg-surface-2 font-medium text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {page.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {CATEGORIES.map((category) => (
        <div key={category} className="hidden md:block">
          <p className="mb-2 font-mono text-label uppercase text-ink-faint">{category}</p>
          <ul className="space-y-0.5">
            {registry
              .filter((entry) => entry.category === category)
              .map((entry) => (
                <li key={entry.slug}>
                  <Link href={`/components/${entry.slug}`} className="block rounded-md px-2.5 py-1.5 text-body-sm text-ink-muted hover:text-ink">
                    {entry.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
