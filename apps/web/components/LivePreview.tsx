"use client";

import { defaultValues, type RegistryEntry } from "@/registry";
import { demos } from "@/registry/demos";

interface LivePreviewProps {
  entry: RegistryEntry;
  width: number;
  height: number;
  scale: number;
  centered?: boolean;
}

export function LivePreview({ entry, width, height, scale, centered = true }: LivePreviewProps) {
  const Demo = demos[entry.slug];
  if (!Demo) return null;
  const isDark = entry.dark === true;

  return (
    <div
      aria-hidden
      inert
      className={`pointer-events-none absolute select-none overflow-hidden ${isDark ? "bg-[#080808]" : ""} ${
        entry.stage === "center" ? "flex items-center justify-center" : ""
      }`}
      style={{
        width,
        height,
        left: centered ? "50%" : 0,
        top: centered ? "50%" : 0,
        transform: centered ? `translate(-50%, -50%) scale(${scale})` : `scale(${scale})`,
        transformOrigin: centered ? "center" : "top left",
      }}
    >
      {entry.stage === "center" ? (
        <Demo values={defaultValues(entry)} compact />
      ) : (
        <div className="absolute inset-0">
          <Demo values={defaultValues(entry)} compact />
        </div>
      )}
    </div>
  );
}
