"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function Dropdown({ label, value, options, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        <ChevronDown     
          className={`h-4 w-4 text-ink-muted transition-transform duration-200 ${isOpen ? "rotate-180" :""}`}
          strokeWidth={2}                                                                                    
        />  
      </button>

    <AnimatePresence>
      
      {isOpen && (
        <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -5 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-gl border border-line bg-surface p-1 shadow-gl-2 z-50">
          <ul className="flex flex-col gap-0.5">
            {options.map((option) => (
              <li key={option}>
                <button
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full rounded-md px-3 py-2 text-left text-body-sm transition-colors ${
                    value === option
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-ink hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    
    </AnimatePresence>  
      
    </div>
  );
}
