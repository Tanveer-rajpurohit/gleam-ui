"use client";

import { useEffect, useRef } from "react";

export interface VaporTrailProps {
  core?: string;
  mist?: string;
  spread?: number;
  life?: number;
  className?: string;
}

interface Puff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  decay: number;
}

const rgb = (hex: string) => {
  const value = parseInt(hex.replace("#", ""), 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
};

export function VaporTrail({ core = "#ffffff", mist = "#a3b5cc", spread = 18, life = 1, className = "" }: VaporTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const puffs: Puff[] = [];
    const coreRgb = rgb(core);
    const mistRgb = rgb(mist);
    let last: { x: number; y: number } | null = null;
    let width = 0;
    let height = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        last = null;
        return;
      }
      if (!last) {
        last = { x, y };
        return;
      }
      const dx = x - last.x;
      const dy = y - last.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 1.5) return;
      const fast = distance > 18;
      const steps = Math.min(8, Math.ceil(distance / 5));
      const nx = -dy / distance;
      const ny = dx / distance;
      for (let step = 0; step < steps; step++) {
        const t = step / steps;
        for (const side of [-1, 1]) {
          puffs.push({
            x: last.x + dx * t + nx * side * spread * 0.5,
            y: last.y + dy * t + ny * side * spread * 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -0.4 - Math.random() * 0.3,
            radius: fast ? 3 : 2,
            maxRadius: fast ? spread * 1.25 : spread * 0.8,
            alpha: 0.55,
            decay: (fast ? 0.025 : 0.016) / life,
          });
        }
      }
      last = { x, y };
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      context.clearRect(0, 0, width, height);
      for (let index = puffs.length - 1; index >= 0; index--) {
        const puff = puffs[index]!;
        puff.x += puff.vx;
        puff.y += puff.vy;
        puff.radius += (puff.maxRadius - puff.radius) * 0.04;
        puff.alpha -= puff.decay;
        if (puff.alpha <= 0) {
          puffs.splice(index, 1);
          continue;
        }
        const gradient = context.createRadialGradient(puff.x, puff.y, 0, puff.x, puff.y, puff.radius);
        gradient.addColorStop(0, `rgba(${coreRgb}, ${puff.alpha * 0.85})`);
        gradient.addColorStop(0.5, `rgba(${mistRgb}, ${puff.alpha * 0.35})`);
        gradient.addColorStop(1, `rgba(${mistRgb}, 0)`);
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(puff.x, puff.y, puff.radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [core, mist, spread, life]);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none block h-full w-full ${className}`} />;
}
