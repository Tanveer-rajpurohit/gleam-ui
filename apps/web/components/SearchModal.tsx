"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { matchSorter } from "match-sorter";
import { registry } from "@/registry";
import { DOC_PAGES } from "@/lib/site";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  href: string;
  title: string;
  group: string;
  description: string;
}

const ITEMS: SearchItem[] = [
  ...registry.map((entry) => ({
    href: `/components/${entry.slug}`,
    title: entry.name,
    group: entry.category,
    description: entry.description,
  })),
  ...DOC_PAGES.map((page) => ({ href: page.href, title: page.title, group: "Docs", description: page.description })),
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const trimmed = query.trim();
    return trimmed ? matchSorter(ITEMS, trimmed, { keys: ["title", "group", "description"] }) : ITEMS;
  }, [query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const go = (item: SearchItem | undefined) => {
    if (!item) return;
    onClose();
    router.push(item.href);
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={() => {
        setQuery("");
        setActiveIndex(0);
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-label="Search"
      className="m-0 mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-xl rounded-xl border border-line-strong bg-surface p-0 text-ink shadow-gl-2 backdrop:bg-bg/85"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-ink-faint" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          autoFocus
          role="combobox"
          aria-expanded
          aria-controls="search-results"
          aria-label="Search components and docs"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) => Math.min(index + 1, results.length - 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, 0));
            }
            if (event.key === "Enter") go(results[activeIndex]);
          }}
          placeholder="Search components and docs"
          className="h-12 flex-1 bg-transparent text-body-sm outline-none placeholder:text-ink-faint"
        />
        <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">esc</kbd>
      </div>

      <ul ref={listRef} id="search-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
        {results.map((item, index) => (
          <li key={item.href} role="option" aria-selected={index === activeIndex}>
            <button
              type="button"
              tabIndex={-1}
              onPointerMove={() => setActiveIndex(index)}
              onClick={() => go(item)}
              className={`flex w-full items-baseline justify-between gap-4 rounded-lg px-3 py-2.5 text-left ${
                index === activeIndex ? "bg-surface-2" : ""
              }`}
            >
              <span className="min-w-0">
                <span className="block text-body-sm font-medium">{item.title}</span>
                <span className="block truncate text-xs text-ink-muted">{item.description}</span>
              </span>
              <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-ink-faint">{item.group}</span>
            </button>
          </li>
        ))}
        {results.length === 0 ? (
          <li className="px-3 py-8 text-center text-body-sm text-ink-muted">Nothing matches &ldquo;{query}&rdquo;.</li>
        ) : null}
      </ul>
    </dialog>
  );
}
