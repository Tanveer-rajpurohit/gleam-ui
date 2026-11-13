import type { ReactNode } from "react";

export function DocHeader({ title, lead }: { title: string; lead: string }) {
  return (
    <header>
      <p className="font-mono text-label uppercase text-accent-ink">Docs</p>
      <h1 className="mt-3 text-display-lg">{title}</h1>
      <p className="mt-4 text-body text-ink-muted sm:text-lg">{lead}</p>
    </header>
  );
}

export function DocSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12 space-y-4 text-body text-ink-muted [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-ink [&_strong]:font-semibold [&_strong]:text-ink">
      <h2 className="text-display-sm text-ink">{title}</h2>
      {children}
    </section>
  );
}
