"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface ImageTiltCardProps {
  src: string;
  alt: string;
  caption?: string;
  overlay?: ReactNode;
  width?: number | string;
  height?: number | string;
  maxTilt?: number;
  scale?: number;
  speed?: number;
  className?: string;
}

export function ImageTiltCard({
  src,
  alt,
  caption,
  overlay,
  width = 300,
  height = 340,
  maxTilt = 12,
  scale = 1.08,
  speed = 1,
  className = "",
}: ImageTiltCardProps) {
  const figureRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const captionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const figure = figureRef.current;
      const frame = frameRef.current;
      const image = imageRef.current;
      if (!figure || !frame || !image) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const weight = { duration: 1.1 / speed, ease: "power3.out" };
      const tiltX = gsap.quickTo(frame, "rotationX", weight);
      const tiltY = gsap.quickTo(frame, "rotationY", weight);
      const zoom = gsap.quickTo(image, "scale", { duration: 0.8 / speed, ease: "power3.out" });
      const label = captionRef.current;
      const labelX = label ? gsap.quickTo(label, "x", { duration: 0.35, ease: "power3.out" }) : null;
      const labelY = label ? gsap.quickTo(label, "y", { duration: 0.35, ease: "power3.out" }) : null;
      const labelTurn = label ? gsap.quickTo(label, "rotation", { duration: 0.5, ease: "power3.out" }) : null;
      let lastX = 0;

      const onMove = (event: PointerEvent) => {
        const rect = figure.getBoundingClientRect();
        const px = event.clientX - rect.left;
        const py = event.clientY - rect.top;
        tiltX(-((py - rect.height / 2) / (rect.height / 2)) * maxTilt);
        tiltY(((px - rect.width / 2) / (rect.width / 2)) * maxTilt);
        labelX?.(px + 12);
        labelY?.(py - 36);
        labelTurn?.(Math.max(-24, Math.min(24, (px - lastX) * 0.6)));
        lastX = px;
      };
      const onEnter = (event: PointerEvent) => {
        lastX = event.clientX - figure.getBoundingClientRect().left;
        zoom(scale);
        if (label) gsap.to(label, { autoAlpha: 1, duration: 0.25 });
      };
      const onLeave = () => {
        tiltX(0);
        tiltY(0);
        zoom(1);
        labelTurn?.(0);
        if (label) gsap.to(label, { autoAlpha: 0, duration: 0.25 });
      };

      figure.addEventListener("pointermove", onMove);
      figure.addEventListener("pointerenter", onEnter);
      figure.addEventListener("pointerleave", onLeave);
      return () => {
        figure.removeEventListener("pointermove", onMove);
        figure.removeEventListener("pointerenter", onEnter);
        figure.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [maxTilt, scale, speed] },
  );

  return (
    <figure ref={figureRef} className={`relative [perspective:800px] ${className}`} style={{ width, height }}>
      <div
        ref={frameRef}
        className="relative h-full w-full overflow-hidden rounded-2xl border border-black/10 shadow-[0_24px_60px_rgba(0,0,0,0.25)] [transform-style:preserve-3d] will-change-transform dark:border-white/10"
      >
        <img ref={imageRef} src={src} alt={alt} draggable={false} className="h-full w-full select-none object-cover will-change-transform" />
        {overlay ? (
          <div className="absolute inset-0" style={{ transform: "translateZ(30px)" }}>
            {overlay}
          </div>
        ) : null}
      </div>
      {caption ? (
        <figcaption
          ref={captionRef}
          aria-hidden
          className="pointer-events-none invisible absolute left-0 top-0 z-10 whitespace-nowrap rounded-md bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-50 opacity-0 shadow-lg dark:bg-neutral-50 dark:text-neutral-950"
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
