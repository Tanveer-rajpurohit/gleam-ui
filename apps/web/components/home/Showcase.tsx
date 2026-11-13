"use client";

import Link from "next/link";
import { useState } from "react";
import { getEntry } from "@/registry";
import { DOCK_ICONS } from "@/registry/dock-icons";
import { MacDock } from "@/registry/components/mac-dock";
import { MacWindow } from "@/registry/components/mac-window";
import { DemoFrame } from "@/components/DemoFrame";

export interface ShowcaseApp {
  id: string;
  slug: string;
  html: string;
}

export function Showcase({ apps }: { apps: ShowcaseApp[] }) {
  const [activeId, setActiveId] = useState(apps[0]?.id ?? "");
  const [isOpen, setIsOpen] = useState(true);
  const [origin, setOrigin] = useState<HTMLElement | null>(null);
  const [tab, setTab] = useState<"preview" | "code">("preview");

  const active = apps.find((app) => app.id === activeId) ?? apps[0];
  const entry = active ? getEntry(active.slug) : undefined;

  const items = apps.map((app) => ({
    id: app.id,
    label: getEntry(app.slug)?.name ?? app.slug,
    icon: DOCK_ICONS[app.id],
    active: isOpen && app.id === activeId,
  }));

  return (
    <div className="grid-paper relative h-[640px] overflow-hidden rounded-gl-lg border border-line bg-surface-2 sm:h-[720px]">
      <div className="flex h-8 items-center justify-between border-b border-line bg-surface px-4 font-mono text-[11px] text-ink-muted">
        <span>gleam / desktop</span>
        <span>click an icon in the dock</span>
      </div>

      {active && entry ? (
        <MacWindow
          open={isOpen}
          onClose={() => setIsOpen(false)}
          origin={origin}
          title={`${active.slug}.tsx`}
          className="absolute inset-x-3 bottom-24 top-12 mx-auto max-w-4xl sm:inset-x-8"
        >
          <div className="flex h-full flex-col">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/10 px-3 py-2 dark:border-white/10">
              <div role="tablist" aria-label="Window view" className="flex gap-1 font-mono text-xs">
                {(["preview", "code"] as const).map((name) => (
                  <button
                    key={name}
                    type="button"
                    role="tab"
                    aria-selected={tab === name}
                    onClick={() => setTab(name)}
                    className={`rounded-md px-2.5 py-1 capitalize ${
                      tab === name ? "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <Link href={`/components/${active.slug}`} className="font-mono text-xs underline underline-offset-4">
                Open {entry.name}
              </Link>
            </div>
            {tab === "preview" ? (
              <DemoFrame key={active.slug} slug={active.slug} className="min-h-0 flex-1" />
            ) : (
              <div tabIndex={0} className="min-h-0 flex-1 overflow-auto p-4" dangerouslySetInnerHTML={{ __html: active.html }} />
            )}
          </div>
        </MacWindow>
      ) : null}

      <div className="absolute inset-x-0 bottom-4 flex justify-center">
        <MacDock
          items={items}
          size={44}
          onSelect={(id, element) => {
            setOrigin(element);
            if (id === activeId && isOpen) {
              setIsOpen(false);
              return;
            }
            setActiveId(id);
            setTab("preview");
            setIsOpen(true);
          }}
        />
      </div>
    </div>
  );
}
