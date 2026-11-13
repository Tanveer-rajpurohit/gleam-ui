"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";

export interface ThemeToggleProps {
  speed?: number;
  className?: string;
}

const STORAGE_KEY = "gleam-theme";

function useDocumentTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setIsDark(root.dataset.theme === "dark");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      return;
    }
  };

  return { isDark, toggle };
}

const frame =
  "inline-flex size-12 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-900 transition-transform duration-150 active:scale-95 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50";

export function ThemeToggleHalf({ speed = 0.35, className = "" }: ThemeToggleProps) {
  const { isDark, toggle } = useDocumentTheme();
  const transition = { ease: "easeInOut" as const, duration: speed };
  return (
    <button type="button" aria-label="Toggle theme" aria-pressed={isDark} onClick={toggle} className={`${frame} ${className}`}>
      <svg viewBox="0 0 240 240" className="size-7" fill="none" aria-hidden>
        <motion.g animate={{ rotate: isDark ? -180 : 0 }} transition={transition} style={{ originX: "50%", originY: "50%" }}>
          <path d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5" fill="currentColor" opacity="0.25" />
          <path d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5" fill="currentColor" />
        </motion.g>
        <motion.path
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={transition}
          style={{ originX: "50%", originY: "50%" }}
          d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}

export function ThemeToggleEclipse({ speed = 0.35, className = "" }: ThemeToggleProps) {
  const { isDark, toggle } = useDocumentTheme();
  const clipId = useId();
  const transition = { ease: "easeInOut" as const, duration: speed };
  return (
    <button type="button" aria-label="Toggle theme" aria-pressed={isDark} onClick={toggle} className={`${frame} ${className}`}>
      <svg viewBox="0 0 32 32" className="size-7" fill="currentColor" strokeLinecap="round" aria-hidden>
        <clipPath id={clipId}>
          <motion.path animate={{ y: isDark ? 10 : 0, x: isDark ? -12 : 0 }} transition={transition} d="M0-5h30a1 1 0 0 0 9 13v24H0Z" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <motion.circle initial={false} animate={{ r: isDark ? 10 : 8 }} transition={transition} cx="16" cy="16" r="8" />
          <motion.g
            animate={{ rotate: isDark ? -100 : 0, scale: isDark ? 0.5 : 1, opacity: isDark ? 0 : 1 }}
            transition={transition}
            style={{ originX: "50%", originY: "50%" }}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M16 5.5v-4" />
            <path d="M16 30.5v-4" />
            <path d="M1.5 16h4" />
            <path d="M26.5 16h4" />
            <path d="m23.4 8.6 2.8-2.8" />
            <path d="m5.7 26.3 2.9-2.9" />
            <path d="m5.8 5.8 2.8 2.8" />
            <path d="m23.4 23.4 2.9 2.9" />
          </motion.g>
        </g>
      </svg>
    </button>
  );
}

export function ThemeToggleDotted({ speed = 0.35, className = "" }: ThemeToggleProps) {
  const { isDark, toggle } = useDocumentTheme();
  const clipId = useId();
  const transition = { ease: "easeInOut" as const, duration: speed };
  return (
    <button type="button" aria-label="Toggle theme" aria-pressed={isDark} onClick={toggle} className={`${frame} ${className}`}>
      <svg viewBox="0 0 32 32" className="size-7" fill="currentColor" aria-hidden>
        <clipPath id={clipId}>
          <motion.path animate={{ y: isDark ? 14 : 0, x: isDark ? -11 : 0 }} transition={transition} d="M0-11h25a1 1 0 0017 13v30H0Z" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <motion.circle initial={false} animate={{ r: isDark ? 10 : 8 }} transition={transition} cx="16" cy="16" r="8" />
          <motion.g animate={{ scale: isDark ? 0.5 : 1, opacity: isDark ? 0 : 1 }} transition={transition} style={{ originX: "50%", originY: "50%" }}>
            <path d="M18.3 3.2c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3S14.7.9 16 .9s2.3 1 2.3 2.3zm-4.6 25.6c0-1.3 1-2.3 2.3-2.3s2.3 1 2.3 2.3-1 2.3-2.3 2.3-2.3-1-2.3-2.3zm15.1-10.5c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zM3.2 13.7c1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3S.9 17.3.9 16s1-2.3 2.3-2.3zm5.8-7C9 7.9 7.9 9 6.7 9S4.4 8 4.4 6.7s1-2.3 2.3-2.3S9 5.4 9 6.7zm16.3 21c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zm2.4-21c0 1.3-1 2.3-2.3 2.3S23 7.9 23 6.7s1-2.3 2.3-2.3 2.4 1 2.4 2.3zM6.7 23C8 23 9 24 9 25.3s-1 2.3-2.3 2.3-2.3-1-2.3-2.3 1-2.3 2.3-2.3z" />
          </motion.g>
        </g>
      </svg>
    </button>
  );
}

export function ThemeToggleBulb({ speed = 0.35, className = "" }: ThemeToggleProps) {
  const { isDark, toggle } = useDocumentTheme();
  const transition = { ease: "easeInOut" as const, duration: speed };
  return (
    <button type="button" aria-label="Toggle theme" aria-pressed={isDark} onClick={toggle} className={`${frame} ${className}`}>
      <svg viewBox="0 0 32 32" className="size-7" strokeWidth="0.7" stroke="currentColor" fill="currentColor" strokeLinecap="round" aria-hidden>
        <path
          strokeWidth="0"
          d="M9.4 9.9c1.8-1.8 4.1-2.7 6.6-2.7 5.1 0 9.3 4.2 9.3 9.3 0 2.3-.8 4.4-2.3 6.1-.7.8-2 2.8-2.5 4.4 0 .2-.2.4-.5.4-.2 0-.4-.2-.4-.5v-.1c.5-1.8 2-3.9 2.7-4.8 1.4-1.5 2.1-3.5 2.1-5.6 0-4.7-3.7-8.5-8.4-8.5-2.3 0-4.4.9-5.9 2.5-1.6 1.6-2.5 3.7-2.5 6 0 2.1.7 4 2.1 5.6.8.9 2.2 2.9 2.7 4.9 0 .2-.1.5-.4.5h-.1c-.2 0-.4-.1-.4-.4-.5-1.7-1.8-3.7-2.5-4.5-1.5-1.7-2.3-3.9-2.3-6.1 0-2.3 1-4.7 2.7-6.5z"
        />
        <path d="M19.8 28.3h-7.6" />
        <path d="M19.8 29.5h-7.6" />
        <path d="M19.8 30.7h-7.6" />
        <motion.path
          animate={{ pathLength: isDark ? 0 : 1, opacity: isDark ? 0 : 1 }}
          transition={transition}
          fill="none"
          d="M14.6 27.1c0-3.4 0-6.8-.1-10.2-.2-1-1.1-1.7-2-1.7-1.2-.1-2.3 1-2.2 2.3.1 1 .9 1.9 2.1 2h7.2c1.1-.1 2-1 2.1-2 .1-1.2-1-2.3-2.2-2.3-.9 0-1.7.7-2 1.7 0 3.4 0 6.8-.1 10.2"
        />
        <motion.g animate={{ scale: isDark ? 0.5 : 1, opacity: isDark ? 0 : 1 }} transition={transition} style={{ originX: "50%", originY: "50%" }}>
          <path d="M16 6.4V1.3" />
          <path d="M26.3 15.8h5.1" />
          <path d="m22.6 9 3.7-3.6" />
          <path d="M9.4 9 5.7 5.4" />
          <path d="M5.7 15.8H.6" />
        </motion.g>
      </svg>
    </button>
  );
}

export function ThemeToggleCrescent({ speed = 0.35, className = "" }: ThemeToggleProps) {
  const { isDark, toggle } = useDocumentTheme();
  const clipId = useId();
  const transition = { ease: "easeInOut" as const, duration: speed };
  return (
    <button type="button" aria-label="Toggle theme" aria-pressed={isDark} onClick={toggle} className={`${frame} ${className}`}>
      <svg viewBox="0 0 32 32" className="size-7" fill="currentColor" aria-hidden>
        <clipPath id={clipId}>
          <motion.path animate={{ y: isDark ? 5 : 0, x: isDark ? -20 : 0 }} transition={transition} d="M0-5h55v37h-55zm32 12a1 1 0 0025 0 1 1 0 00-25 0" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <circle cx="16" cy="16" r="15" />
        </g>
      </svg>
    </button>
  );
}
