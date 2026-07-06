"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function Dropdown({ label, value, options, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null)
  
  const tl = useRef<gsap.core.Timeline | undefined>(undefined);

  const highlightRef = useRef<HTMLDivElement>(null)
  const moveHl = useRef<((v: number) => void) | undefined>(undefined)

  useGSAP(()=>{

    gsap.set(menuRef.current, {autoAlpha: 0, y: -5, transformOrigin: "top right"})
    gsap.set(".dropdown-item", {autoAlpha: 0, y: -5})
    gsap.set(highlightRef.current, { autoAlpha: 0 })

    tl.current = gsap.timeline({paused: true , defaults: { ease: "power3.out" }})
      .to(menuRef.current, {autoAlpha: 1, duration: 0.3, y:0}, 0)
      .to(chevronRef.current, {rotate: 180, duration: 0.3}, 0)
      .to(".dropdown-item", { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.06}, "-=0.15")


     moveHl.current = gsap.quickTo(highlightRef.current, "y", { duration: 0.3, ease: "power3" })

  }, {scope: dropdownRef})


  const restToSelected = (instant = false) => {
    const sel = menuRef.current?.querySelector<HTMLElement>('[data-selected="true"]');
    if (!sel || !highlightRef.current) return;
    gsap.set(highlightRef.current, { height: sel.offsetHeight, autoAlpha: 1 });
    if (instant) gsap.set(highlightRef.current, { y: sel.offsetTop });
    else moveHl.current?.(sel.offsetTop);
  };

  useEffect(() => {
    if (isOpen) {
      tl.current?.restart();
      restToSelected(true);
    } else {
      gsap.to(menuRef.current,{ autoAlpha: 0, y: -5, duration: 0.35, ease: "power3.in" });
      gsap.to(chevronRef.current, { rotate: 0, duration: 0.35, ease: "power3.in" });
    }
  }, [isOpen]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-gl border border-line bg-surface py-2 px-4 text-body-sm font-medium transition-colors hover:border-line-strong hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-accent/20"
      >
        <span className="font-normal text-ink-muted">{label}</span>
        <span className="text-ink">{value}</span>
        <div ref={chevronRef} >
          <ChevronDown
            className={`h-4 w-4 text-ink-muted `}
            strokeWidth={2}                                                                                    
          />  
        </div>
      </button>
      
        <div 
        ref={menuRef}
        className="absolute right-0 top-full mt-2 w-52 origin-top-right rounded-gl border border-line-strong bg-surface-2/90 backdrop-blur-xl p-1.5 shadow-gl-2 z-50 invisible opacity-0">
          <ul className="relative flex flex-col gap-0.5"
           onMouseLeave={() => restToSelected()}
          >
            <div
              ref={highlightRef}
              className="pointer-events-none absolute inset-x-0 top-0 rounded-lg bg-ink/[0.06] backdrop-blur-md backdrop-saturate-150 ring-1 ring-inset ring-ink/10 shadow-sm"
            />
              {options.map((option) => (
                <li key={option} data-selected={value === option} className="dropdown-item">
                  <button
                    onMouseEnter={(e) => {
                      const li = e.currentTarget.closest("li") as HTMLElement;
                      gsap.set(highlightRef.current, { height: li.offsetHeight });
                      moveHl.current?.(li.offsetTop);
                      gsap.to(highlightRef.current, { autoAlpha: 1, duration: 0.15 });
                    }}

                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`relative z-10 w-full rounded-md px-3 py-2 text-left text-body-sm transition-colors ${
                      value === option ? "text-accent font-medium" : "text-ink"
                    }`}
                  >
                    {option}
                  </button>
                </li>
              ))}
          </ul>
        </div>
    
      
    </div>
  );
}
