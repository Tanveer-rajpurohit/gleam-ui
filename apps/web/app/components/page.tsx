"use client"

import Card from "@/components/componetsPage/Card";
import { Dropdown } from "@/components/utils/Dropdown";
import { CATEGORIES, readyEntries } from "@/lib/registry";
import { ChevronDown, Search } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { matchSorter } from "match-sorter";
import { useMemo, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

const PAGE_SIZE = 6

const Page = () => {

    const [sortBy, setSortBy] = useState<string>("All")
    const [input, setInput] = useState<string>("")
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    const rootRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", clearProps: "transform" } })
        
        tl.from(".intro-head", { y: 16, autoAlpha: 0, duration: 0.5 })
          .from(".intro-search", { y: 12, autoAlpha: 0, duration: 0.5 }, "-=0.35")
          
          .from(gridRef.current!.children, {autoAlpha: 0, duration: 0.6, stagger: 0.099 }, "-=0.35")
      })
    }, { scope: rootRef })

   
    const filtered = useMemo(() => {
      const byCategory = sortBy === "All" ? readyEntries : readyEntries.filter((e) => e.category === sortBy)
      const q = input.trim()
      return q ? matchSorter(byCategory, q, { keys: ["name", "category", "description"] }) : byCategory
    }, [input, sortBy])

    const visible = filtered.slice(0, visibleCount)
    const hasMore = filtered.length > visibleCount

    
    const firstRun = useRef(true)
    useGSAP(() => {
      if (firstRun.current) { firstRun.current = false; return }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      if (!gridRef.current) return
      gsap.fromTo(
        gridRef.current.children,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.04, overwrite: true, clearProps: "transform" },
      )
    }, { dependencies: [sortBy], scope: rootRef })

    
    const prevCount = useRef(PAGE_SIZE)
    useGSAP(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { prevCount.current = visibleCount; return }
      const kids = gridRef.current ? Array.from(gridRef.current.children) : []
      const fresh = kids.slice(prevCount.current)
      if (fresh.length) {
        gsap.from(fresh, { autoAlpha: 0, y: 16, duration: 0.5, ease: "power3.out", stagger: 0.05, clearProps: "transform" })
      }
      prevCount.current = visibleCount
    }, { dependencies: [visibleCount], scope: rootRef })

  return (
    <div ref={rootRef} className="w-full max-w-[1320px] mx-auto px-6 py-14 lg:px-12 xl:px-20">
      <div className="w-full space-y-4">
        <div className="intro-head flex w-full items-center justify-between">
          <h2 className="font-display text-display-sm text-ink tracking-tight">Components</h2>
          <Dropdown
            label="Sort by"
            value={sortBy}
            options={["All", ...CATEGORIES]}
            onChange={(value) => {
              setSortBy(value)
              setVisibleCount(PAGE_SIZE)
            }}
          />
        </div>
       
        <div className="intro-search relative w-full group">
          
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint h-4 w-4 transition-colors group-focus-within:text-accent" 
            strokeWidth={1.5} 
          />
          
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setVisibleCount(PAGE_SIZE)
            }}
            placeholder="Search for components, primitives, or effects..."
            className="search-box w-full rounded-gl border border-line bg-surface py-2.5 pl-12 pr-16 text-body-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
          />

        </div>
      </div>
      
      <div className="w-full mt-16">
        <div ref={gridRef} className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((entry, i) => (
            <Card
              key={entry.slug}
              name={entry.name}
              category={entry.category}
              image={entry.previewImage}
              video={entry.previewVideo}
              index={i}
            />
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-accent px-7 py-2.5 text-body-sm font-medium text-accent transition-colors duration-300 hover:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-y-100"
              />
              <span className="relative z-10">Load more</span>
              <ChevronDown
                className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                strokeWidth={2}
              />
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
            <p className="text-title-sm text-ink">No components found</p>
            <p className="text-body-sm text-ink-muted">
              Nothing matches &ldquo;{input}&rdquo;. Try a different search or category.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Page;