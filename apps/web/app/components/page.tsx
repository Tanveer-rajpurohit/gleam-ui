import type { Metadata } from "next";
import { registry } from "@/registry";
import { ComponentsGrid } from "@/components/components-grid";

export const metadata: Metadata = {
  title: "Components",
  description: "Live previews of every Gleam UI component: shaders, text effects, scroll sections, cards, galleries and docks.",
  alternates: { canonical: "/components" },
};

export default function ComponentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <p className="text-caption-upper uppercase text-accent">The library</p>
      <h1 className="mt-3 font-display text-display-lg text-ink">Components</h1>
      <p className="mt-4 max-w-2xl text-body-md text-ink-muted">
        {registry.length} live components. Every card is a real render. Click one to open its fullscreen showcase with
        playground controls and the exact source file you copy into your project.
      </p>
      <div className="mt-12">
        <ComponentsGrid />
      </div>
    </div>
  );
}
