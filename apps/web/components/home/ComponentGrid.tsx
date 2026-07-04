import Link from "next/link";
import { readyEntries } from "@/lib/registry";

export function ComponentGrid() {
  return (
    <div className="w-full py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="font-display text-4xl text-ink mb-4">Available Components</h2>
        <p className="text-ink-muted text-lg max-w-2xl">
          Everything you need to build expressive, motion-driven interfaces.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {readyEntries.map((entry) => (
          <Link 
            key={entry.slug}
            href={`/docs/${entry.slug}`}
            className="group relative flex flex-col h-[280px] rounded-2xl border border-line bg-surface overflow-hidden hover:border-line-strong transition-all"
          >
            {/* Component Preview Placeholder Area */}
            <div className="flex-1 w-full bg-surface-2 flex items-center justify-center p-6">
              {/* If we had demo components built, we'd render <entry.demo /> here. 
                  For now, just a placeholder graphic based on category */}
              <div className="w-16 h-16 rounded-xl border border-line bg-surface shadow-sm flex items-center justify-center text-ink-muted group-hover:scale-110 transition-transform duration-500 ease-out">
                {entry.category === "Text Animations" && <span className="font-display italic text-2xl">Aa</span>}
                {entry.category === "Buttons & CTAs" && <div className="w-8 h-4 rounded-full bg-line-strong" />}
                {entry.category === "Cards" && <div className="w-8 h-10 rounded-md border border-line" />}
                {entry.category === "3D & Shaders" && <div className="w-8 h-8 rounded-full border border-line border-dashed" />}
                {entry.category === "Backgrounds" && <div className="w-full h-full bg-noise opacity-20" />}
                {entry.category === "Sections" && <div className="w-8 h-2 bg-line rounded-full" />}
                {entry.category === "Scroll Effects" && <div className="w-2 h-8 bg-line rounded-full" />}
                {entry.category === "Loaders & Feedback" && <div className="w-6 h-6 rounded-full border-2 border-line border-t-accent animate-spin" />}
              </div>
            </div>
            
            {/* Meta */}
            <div className="flex flex-col p-5 border-t border-line bg-surface z-10">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-1">
                {entry.category}
              </span>
              <h3 className="text-base font-medium text-ink mb-1">{entry.name}</h3>
              <p className="text-sm text-ink-muted line-clamp-2 leading-relaxed">
                {entry.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
