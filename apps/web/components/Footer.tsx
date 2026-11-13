import Link from "next/link";
import { GITHUB_URL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-display text-title-md text-ink">Gleam</p>
        <p className="text-caption text-ink-faint">One file per component. Built by Tanveer Singh.</p>
        <div className="flex items-center gap-6">
          <Link href="/docs" className="text-nav-link text-ink-muted hover:text-ink">
            Documentation
          </Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="text-nav-link text-ink-muted hover:text-ink">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
