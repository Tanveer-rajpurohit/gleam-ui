"use client"

import Card from "@/components/componetsPage/Card";
import { Dropdown } from "@/components/utils/Dropdown";
import { CATEGORIES, readyEntries } from "@/lib/registry";
import { Search } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { matchSorter } from "match-sorter";
import { useMemo, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

const Page = () => {

    const [sortBy, setSortBy] = useState<string>("All")
    const [input, setInput] = useState<string>("")

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
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for components, primitives, or effects..."
            className="search-box w-full rounded-gl border border-line bg-surface py-2.5 pl-12 pr-16 text-body-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
          />

        </div>
      </div>
      
      <div className="w-full mt-16">
        <div ref={gridRef} className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry, i) => (
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