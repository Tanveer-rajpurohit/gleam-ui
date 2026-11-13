"use client";

import { useEffect, useRef } from "react";

export interface DotFieldProps {
  gap?: number;
  dotSize?: number;
  radius?: number;
  strength?: number;
  color?: string;
  className?: string;
}

export function DotField({
  gap = 22,
  dotSize = 1.4,
  radius = 140,
  strength = 26,
  color = "currentColor",
  className = "",
}: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -9999, y: -9999 };
    let dots: { x: number; y: number; ox: number; oy: number; vx: number; vy: number }[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = gap / 2; y < height; y += gap) {
        for (let x = gap / 2; x < width; x += gap) {
          dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
        }
      }
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      context.clearRect(0, 0, width, height);
      context.fillStyle = color === "currentColor" ? getComputedStyle(canvas).color : color;
      for (const dot of dots) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (!reduce && distance < radius && distance > 0.01) {
          const force = (1 - distance / radius) * strength * 0.06;
          dot.vx += (dx / distance) * force;
          dot.vy += (dy / distance) * force;
        }
        dot.vx += (dot.ox - dot.x) * 0.045;
        dot.vy += (dot.oy - dot.y) * 0.045;
        dot.vx *= 0.86;
        dot.vy *= 0.86;
        dot.x += dot.vx;
        dot.y += dot.vy;
        const shift = Math.min(1, Math.hypot(dot.x - dot.ox, dot.y - dot.oy) / strength);
        context.globalAlpha = 0.28 + shift * 0.72;
        context.beginPath();
        context.arc(dot.x, dot.y, dotSize * (1 + shift * 1.4), 0, Math.PI * 2);
        context.fill();
      }
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const observer = new ResizeObserver(build);
    observer.observe(canvas);
    build();
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [gap, dotSize, radius, strength, color]);

  return <canvas ref={canvasRef} aria-hidden className={`block h-full w-full ${className}`} />;
}
