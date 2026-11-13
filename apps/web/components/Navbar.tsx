"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GITHUB_URL } from "@/lib/site";
import { SearchModal } from "./SearchModal";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/components", label: "Components" },
  { href: "/docs", label: "Docs" },
  { href: "/docs/theming", label: "Theming" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.closest("input, textarea, [contenteditable]") !== null;
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !isTyping)) {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <Link href="/" className="group flex items-baseline gap-2">
              <span className="font-display text-title-lg tracking-tight text-ink">Gleam</span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-300 ease-vd-out group-hover:scale-150" />
            </Link>
            <nav aria-label="Main" className="hidden items-center gap-7 sm:flex">
              {LINKS.map((link) => {
                const isActive =
                  link.href === "/docs" ? pathname === "/docs" || pathname === "/docs/installation" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`text-nav-link transition-colors duration-200 ${isActive ? "text-ink" : "text-ink-muted hover:text-ink"}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden items-center gap-2 text-nav-link text-ink-muted transition-colors hover:text-ink sm:flex"
            >
              Search
              <kbd className="rounded border border-line px-1.5 font-mono text-[11px] text-ink-faint">/</kbd>
            </button>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hidden text-nav-link text-ink-muted transition-colors hover:text-ink sm:block">
              GitHub
            </a>
            <ThemeToggle />
          </div>
        </div>
        <nav aria-label="Mobile" className="flex gap-6 overflow-x-auto border-t border-line px-6 py-3 sm:hidden">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="shrink-0 text-nav-link text-ink-muted hover:text-ink">
              {link.label}
            </Link>
          ))}
          <button type="button" onClick={() => setIsSearchOpen(true)} className="shrink-0 text-nav-link text-ink-muted">
            Search
          </button>
        </nav>
      </header>
    </>
  );
}
