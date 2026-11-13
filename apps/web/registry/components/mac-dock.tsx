"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface MacDockItem {
  id: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
}

export interface MacDockProps {
  items: MacDockItem[];
  onSelect?: (id: string, element: HTMLButtonElement) => void;
  size?: number;
  maxScale?: number;
  radius?: number;
  className?: string;
}

export function MacDock({ items, onSelect, size = 48, maxScale = 1.65, radius = 170, className = "" }: MacDockProps) {
  const dockRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const dock = dockRef.current;
      if (!dock) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const icons = gsap.utils.toArray<HTMLElement>("[data-dock-icon]", dock);
      const slots = gsap.utils.toArray<HTMLElement>("[data-dock-slot]", dock);
      if (icons.length === 0) return;

      gsap.set(icons, { transformOrigin: "50% 100%" });
      const tween = { duration: 0.22, ease: "power2.out" };
      const setScale = icons.map((icon) => gsap.quickTo(icon, "scale", tween));
      const setLift = icons.map((icon) => gsap.quickTo(icon, "y", tween));
      const setWidth = slots.map((slot) => gsap.quickTo(slot, "width", tween));
      const lift = -size * 0.55;

      const onMove = (event: PointerEvent) => {
        icons.forEach((icon, index) => {
          const rect = icon.getBoundingClientRect();
          const distance = Math.abs(event.clientX - (rect.left + rect.width / 2));
          const factor = distance < radius ? Math.cos((distance / radius) * (Math.PI / 2)) : 0;
          setScale[index]!(1 + (maxScale - 1) * factor);
          setLift[index]!(lift * factor);
          setWidth[index]!(size + size * 0.45 * factor);
        });
      };
      const onLeave = () => {
        icons.forEach((_, index) => {
          setScale[index]!(1);
          setLift[index]!(0);
          setWidth[index]!(size);
        });
      };

      dock.addEventListener("pointermove", onMove);
      dock.addEventListener("pointerleave", onLeave);
      return () => {
        dock.removeEventListener("pointermove", onMove);
        dock.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: dockRef, dependencies: [items.length, size, maxScale, radius] },
  );

  const bounce = (element: HTMLElement) => {
    const icon = element.querySelector("[data-dock-icon]");
    if (!icon) return;
    gsap.timeline().to(icon, { y: `-=${size * 0.4}`, duration: 0.18, ease: "power2.out" }).to(icon, {
      y: 0,
      duration: 0.5,
      ease: "bounce.out",
    });
  };

  return (
    <div
      ref={dockRef}
      role="toolbar"
      aria-label="Dock"
      className={`inline-flex select-none items-end gap-1 rounded-2xl border border-white/15 bg-neutral-900/90 px-2 pb-2 pt-2 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ${className}`}
      style={{ height: size + 16 }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          data-dock-slot
          aria-label={item.label}
          onClick={(event) => {
            bounce(event.currentTarget);
            onSelect?.(item.id, event.currentTarget);
          }}
          className="group relative flex shrink-0 items-end justify-center outline-offset-4"
          style={{ width: size, height: size }}
        >
          <span data-dock-icon className="block will-change-transform" style={{ width: size, height: size }}>
            {item.icon}
          </span>
          <span className="pointer-events-none absolute -top-10 whitespace-nowrap rounded-md bg-neutral-950 px-2 py-1 text-[11px] font-medium text-neutral-50 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
            {item.label}
          </span>
          {item.active ? <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-white/80" /> : null}
        </button>
      ))}
    </div>
  );
}
