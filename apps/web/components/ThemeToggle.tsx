"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const EASE = [0.22, 1, 0.36, 1] as const;
const RAYS = Array.from({ length: 8 }, (_, index) => (index * Math.PI) / 4);

export function ThemeToggle({ className = "h-9 w-9 border border-line" }: { className?: string }) {
  const [isDark, setIsDark] = useState(true);
  const isReduced = useReducedMotion();
  const duration = isReduced ? 0 : 0.45;

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setIsDark(root.dataset.theme !== "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (error) {
      console.warn("Theme preference was not saved", error);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`relative inline-flex items-center justify-center rounded-full text-ink transition-colors duration-200 hover:border-line-strong hover:bg-surface active:scale-95 ${className}`}
    >
      <motion.svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        initial={false}
        animate={{ rotate: isDark ? -40 : 0 }}
        transition={{ duration, ease: EASE }}
      >
        <motion.circle cx="12" cy="12" r="8" fill="currentColor" stroke="none" initial={false} animate={{ r: isDark ? 8 : 4.5 }} transition={{ duration, ease: EASE }} />
        <motion.circle
          cx="17"
          cy="7"
          r="7"
          stroke="none"
          style={{ fill: "var(--gl-bg)" }}
          initial={false}
          animate={{ cx: isDark ? 17 : 30, cy: isDark ? 7 : 0 }}
          transition={{ duration, ease: EASE }}
        />
        {RAYS.map((angle, index) => (
          <motion.line
            key={angle}
            x1={12 + Math.cos(angle) * 7.2}
            y1={12 + Math.sin(angle) * 7.2}
            x2={12 + Math.cos(angle) * 9.4}
            y2={12 + Math.sin(angle) * 9.4}
            initial={false}
            animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.4 : 1 }}
            style={{ transformOrigin: "12px 12px" }}
            transition={{ duration: duration * 0.7, delay: isDark ? 0 : duration * 0.35 + index * 0.015 }}
          />
        ))}
      </motion.svg>
    </button>
  );
}
