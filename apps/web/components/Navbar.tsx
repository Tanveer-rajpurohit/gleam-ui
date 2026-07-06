"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";
import { SearchModal } from "./SearchModal";

const NAV_LINKS = [
  { name: "Docs", href: "/docs" },
  { name: "Components", href: "/components" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === "/") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <header className="sticky top-0 z-40 w-full h-14 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="container flex items-center h-full w-full px-8 mx-auto">
          
          <Link href="/" className="flex items-center gap-2 mr-8 group">
            <span className="text-xl font-medium tracking-tight font-display text-ink transition-colors">
              Gleam UI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-ink ${
                    isActive ? "text-ink" : "text-ink-muted"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end flex-1 gap-4">
            
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 w-60 rounded-[10px] bg-transparent border border-line text-ink-muted hover:border-line-strong hover:text-ink hover:bg-surface/50 transition-all group"
            >
              <Search className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="flex-1 text-sm text-left opacity-70 group-hover:opacity-100 transition-opacity">Search...</span>
              <kbd className="hidden sm:flex items-center justify-center w-5 h-5 text-[10px] font-medium rounded border border-line bg-transparent text-ink-muted">
                /
              </kbd>
            </button>

            <a
              href="https://www.npmjs.com/package/gleam-ui"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-transparent border border-line text-sm font-medium text-ink hover:bg-surface/50 hover:border-line-strong transition-all"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-accent">
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
              </svg>
              <span>npm</span>
            </a>

            <a
              href="https://github.com/Tanveer-rajpurohit/gleam-ui"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-transparent border border-line text-sm font-medium text-ink hover:bg-surface/50 hover:border-line-strong transition-all"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span className="hidden sm:inline-block">42.6K</span>
            </a>
            
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
