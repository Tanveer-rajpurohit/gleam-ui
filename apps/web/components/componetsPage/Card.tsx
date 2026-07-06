"use client";

import gsap from "gsap";
import Image from "next/image";
import { useRef, type MouseEvent } from "react";

export interface CardProps {
  name: string;
  category: string;
  image?: string;
  video?: string;
  index: number;
}


export default function Card({ name, category, image, video, index }: CardProps) {
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const num = String(index + 1).padStart(2, "0");

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const onEnter = () => {
    videoRef.current?.play().catch(() => {});
    gsap.to(videoRef.current, {autoAlpha: 1, duration: reduce ? 0 : 0.3, ease: "power2.out", overwrite: true})
  };

  const onLeave = () => {
    gsap.to(videoRef.current,{
      autoAlpha: 0, duration: reduce ? 0 : 0.4, ease: "power2.out", overwrite: true,
      onComplete: () => { const v = videoRef.current; if (v) { v.pause(); v.currentTime = 0; } }
    })
  };
  

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative w-full rounded-gl-lg border border-line bg-surface p-2.5 transition-[transform,border-color] "
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-gl-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--mx) var(--my), var(--gl-glow), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-gl-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx) var(--my), var(--gl-accent), transparent 60%)",
          padding: 1,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div className="relative z-10">
        <div className="relative aspect-[16/10] overflow-hidden rounded-gl bg-surface-2 ring-1 ring-line">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-2 to-surface">
              <span className="font-mono text-caption text-ink-faint">Preview soon</span>
            </div>
          )}

          {video && (
            <video
              ref={videoRef}
              src={video}
              muted
              loop
              playsInline
              preload="none"
              poster={image}
              className="absolute inset-0 h-full w-full object-cover opacity-0"
            />
          )}
        </div>

        <div className="mt-3.5 flex items-end justify-between gap-3 px-0.5">
          <div className="min-w-0">
            <p className="text-caption-upper uppercase text-ink-faint">{category}</p>
            <h3 className="mt-1 truncate text-title-sm text-ink">{name}</h3>
          </div>
          <span className="shrink-0 font-mono text-caption text-ink-faint transition-colors duration-300 group-hover:text-accent">
            {num}
          </span>
        </div>
      </div>
    </article>
  );
}
