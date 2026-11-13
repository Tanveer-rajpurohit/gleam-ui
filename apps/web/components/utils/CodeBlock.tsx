"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  html: string;
  maxHeight?: number;
  className?: string;
}

export function CodeBlock({ code, html, maxHeight, className = "" }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1500);
    } catch (error) {
      console.warn("Copy failed", error);
    }
  };

  return (
    <div className={`relative rounded-gl border border-line bg-surface ${className}`}>
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 z-10 rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[11px] text-ink-muted hover:border-line-strong hover:text-ink active:scale-95"
      >
        {isCopied ? "Copied" : "Copy"}
      </button>
      <div
        tabIndex={0}
        className="overflow-auto px-4 py-4 pr-20"
        style={maxHeight ? { maxHeight } : undefined}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
