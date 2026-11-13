"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface TiltCardProps {
  children: ReactNode;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
  className?: string;
}

export function TiltCard({ children, maxTilt = 12, scale = 1.03, glare = true, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(card, { transformPerspective: 900, transformStyle: "preserve-3d" });
      const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
      const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        rotateX((0.5 - py) * 2 * maxTilt);
        rotateY((px - 0.5) * 2 * maxTilt);
        if (glareRef.current) {
          glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.35), transparent 55%)`;
        }
      };
      const onEnter = () => {
        gsap.to(card, { scale, duration: 0.4, ease: "power3.out" });
        gsap.to(glareRef.current, { opacity: 1, duration: 0.3 });
      };
      const onLeave = () => {
        rotateX(0);
        rotateY(0);
        gsap.to(card, { scale: 1, duration: 0.6, ease: "power3.out" });
        gsap.to(glareRef.current, { opacity: 0, duration: 0.4 });
      };

      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
      return () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [maxTilt, scale] },
  );

  return (
    <div ref={cardRef} className={`relative overflow-hidden will-change-transform ${className}`}>
      {children}
      {glare ? (
        <div ref={glareRef} aria-hidden className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light" />
      ) : null}
    </div>
  );
}
