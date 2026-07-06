"use client"

import Card from "@/components/componetsPage/Card";
import { Dropdown } from "@/components/utils/Dropdown";
import { readyEntries } from "@/lib/registry";
import { Search } from "lucide-react";
import { useState } from "react";

const Page = () => {

    const [sortBy, setSortBy] = useState<string>("All")

  return (
    <div className="w-full max-w-[1320px] mx-auto px-6 py-14 lg:px-12 xl:px-20">
      <div className="w-full space-y-4">
        <div className="flex w-full items-center justify-between">
          <h2 className="font-display text-display-sm text-ink tracking-tight">Components</h2>
          <Dropdown
            label="Sort by"
            value={sortBy}
            options={["All", "Buttons", "Text Animations", "3D & Shaders", "Loaders", "Others"]}
            onChange={(value) => {
                setSortBy(value)
            }}
          />
        </div>
       
        <div className="relative w-full group">
          
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint h-4 w-4 transition-colors group-focus-within:text-accent" 
            strokeWidth={1.5} 
          />
          
          <input
            type="text"
            placeholder="Search for components, primitives, or effects..."
            className="w-full rounded-gl border border-line bg-surface py-2.5 pl-12 pr-16 text-body-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
          />

        </div>
      </div>
      
      <div className="w-full mt-12">
        <div className="w-full grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {readyEntries.map((entry, i) => (
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
      </div>

    </div>
  );
};

export default Page;