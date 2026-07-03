"use client";

import React, { useEffect, useRef } from "react";
import { Search, FileText, Type } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEARCH_RESULTS = [
  { id: 1, title: "Introduction", category: "Get Started", icon: FileText },
  { id: 2, title: "Installation", category: "Get Started", icon: FileText },
  { id: 3, title: "MCP", category: "Get Started", icon: FileText },
  { id: 4, title: "Split Text", category: "Text Animations", icon: Type },
  { id: 5, title: "Blur Text", category: "Text Animations", icon: Type },
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useGSAP(() => {
    if (isOpen) {
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(modalRef.current, { opacity: 0, scale: 0.95, y: -20 });
      gsap.set(itemsRef.current, { opacity: 0, x: -10 });

      const tl = gsap.timeline();
      
      tl.to(backdropRef.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      })
      .to(modalRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "back.out(1.5)",
      }, "-=0.1")
      .to(itemsRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.out",
      }, "-=0.1");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
    >
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl bg-surface border border-line rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
          <Search className="w-5 h-5 text-ink-muted" />
          <input 
            type="text"
            placeholder="Search components, categories, or keywords..."
            className="flex-1 bg-transparent border-none outline-none text-ink text-[15px] placeholder:text-ink-muted/50"
            autoFocus
          />
          <button 
            onClick={onClose}
            className="px-2 py-1 text-[11px] font-medium rounded-md border border-line bg-surface-2 text-ink-muted hover:text-ink transition-colors"
          >
            esc
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
          <div className="flex flex-col gap-1 overflow-hidden">
            {SEARCH_RESULTS.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  ref={(el) => { itemsRef.current[index] = el; }}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-2 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[8px] bg-surface-2 border border-line flex items-center justify-center text-accent group-hover:bg-surface transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold tracking-wide text-ink">{item.title}</span>
                      <span className="text-[12px] text-ink-muted mt-0.5">in {item.category}</span>
                    </div>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2 text-ink-muted">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 10 4 15 9 20"></polyline>
                      <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
