"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  html?: string;
  language?: string;
}

export function CodeBlock({ code, html, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="group relative rounded-xl border border-line bg-surface px-5 py-4">
      <button
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        title="Copy"
        className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 text-ink-faint hover:text-ink transition-colors"
      >
        {copied ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
      <div className="overflow-x-auto thin-scrollbar pr-8">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="text-ink whitespace-pre text-[13px] font-mono leading-relaxed">
            <code data-language={language}>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
