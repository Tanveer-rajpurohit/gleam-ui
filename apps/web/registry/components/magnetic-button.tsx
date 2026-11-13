"use client";

import { useRef, type ButtonHTMLAttributes } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
  variant?: "solid" | "outline";
}

export function MagneticButton({
  strength = 0.4,
  variant = "solid",
  className = "",
  children,
  ...rest
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const button = buttonRef.current;
      const label = labelRef.current;
      if (!button || !label) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const spring = { duration: 0.9, ease: "elastic.out(1, 0.35)" };
      const moveX = gsap.quickTo(button, "x", spring);
      const moveY = gsap.quickTo(button, "y", spring);
      const labelX = gsap.quickTo(label, "x", spring);
      const labelY = gsap.quickTo(label, "y", spring);

      const onMove = (event: PointerEvent) => {
        const rect = button.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        moveX(dx * strength);
        moveY(dy * strength);
        labelX(dx * strength * 0.5);
        labelY(dy * strength * 0.5);
      };
      const onLeave = () => {
        moveX(0);
        moveY(0);
        labelX(0);
        labelY(0);
      };

      button.addEventListener("pointermove", onMove);
      button.addEventListener("pointerleave", onLeave);
      return () => {
        button.removeEventListener("pointermove", onMove);
        button.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [strength] },
  );

  const look =
    variant === "solid"
      ? "bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
      : "border border-current bg-transparent";

  return (
    <button
      ref={buttonRef}
      className={`inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-medium will-change-transform active:scale-[0.97] ${look} ${className}`}
      {...rest}
    >
      <span ref={labelRef} className="inline-block will-change-transform">
        {children}
      </span>
    </button>
  );
}
