"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export interface SmoothScrollProps {
  children: ReactNode;
  lerp?: number;
  wheelMultiplier?: number;
  smoothTouch?: boolean;
}

export function SmoothScroll({ children, lerp = 0.1, wheelMultiplier = 1, smoothTouch = false }: SmoothScrollProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({ lerp, wheelMultiplier, syncTouch: smoothTouch });
    const tick = (time: number) => instance.raf(time * 1000);
    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [lerp, wheelMultiplier, smoothTouch]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
