import Link from "next/link";
import { readyEntries } from "@/lib/registry";

export function Hero() {
  return (
    <div className="w-full relative min-h-[85vh] flex flex-col justify-between py-12 px-6 md:px-12 border-b border-line">
      {/* Top section with Title and Description */}
      <div className="flex flex-col relative z-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
            Gleam UI v1.0
          </span>
        </div>
        
        <h1 className="font-display text-6xl md:text-8xl font-medium text-ink leading-[0.95] tracking-tight max-w-4xl mb-6">
          Motion-first React components.
        </h1>
        
        <p className="text-ink-muted text-lg md:text-xl leading-relaxed max-w-2xl font-sans mb-10">
          An open-source library built on the Viridian design system. 
          Every component is animated, accessible, and production-ready for your next project.
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/docs"
            className="px-6 py-3 rounded-full bg-accent text-accent-fg text-sm font-medium transition-all hover:scale-105 active:scale-95"
          >
            Explore components
          </Link>
          <a
            href="https://github.com/Tanveer-rajpurohit/gleam-ui"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full border border-line text-ink text-sm font-medium transition-all hover:bg-surface hover:border-line-strong active:scale-95"
          >
            View on GitHub
          </a>
        </div>
      </div>

      {/* Floating Cards (Airix style inspiration) */}
      <div className="absolute top-[15%] right-[5%] md:right-[15%] hidden lg:flex flex-col gap-4 pointer-events-none z-10">
        <div className="relative w-[220px] rounded-[16px] border border-line bg-surface/50 backdrop-blur-md flex flex-col p-3 shadow-gl-1">
            <div className="px-1 pb-2 border-b border-line">
                <h3 className="text-[12px] font-medium font-sans text-ink tracking-wide">
                    System Status
                </h3>
            </div>
            <div className="w-full mt-2.5 px-1 pb-1.5 flex flex-col gap-3">
                <div className="flex flex-col">
                    <span className="text-ink-muted text-[9px] font-semibold uppercase tracking-widest">Available Components</span>
                    <span className="text-ink text-[14px] font-medium font-sans mt-0.5">{readyEntries.length} Ready</span>
                </div>
            </div>
        </div>
      </div>
      
      {/* Bottom section with subtle details */}
      <div className="flex items-end justify-between relative z-20 mt-20">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-widest text-ink-faint">Architecture</span>
          <span className="text-[13px] font-medium text-ink-muted">Next.js 16 + React 19</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[10px] font-medium uppercase tracking-widest text-ink-faint">Styling</span>
          <span className="text-[13px] font-medium text-ink-muted">Tailwind v4 CSS-native</span>
        </div>
      </div>
    </div>
  );
}
