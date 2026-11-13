"use client";

import { useEffect, useRef } from "react";

export interface WarpStarsProps {
  count?: number;
  speed?: number;
  color?: string;
  className?: string;
}

export function WarpStars({ count = 600, speed = 1, color = "#ffffff", className = "" }: WarpStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const depth = 1000;
    const stars = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * depth,
    }));
    const steer = { x: 0, y: 0, tx: 0, ty: 0 };
    let boost = 1;
    let targetBoost = 1;
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
      steer.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      steer.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onDown = () => (targetBoost = 6);
    const onUp = () => (targetBoost = 1);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      boost += (targetBoost - boost) * 0.06;
      steer.x += (steer.tx - steer.x) * 0.05;
      steer.y += (steer.ty - steer.y) * 0.05;
      context.clearRect(0, 0, width, height);
      context.strokeStyle = color;
      context.lineCap = "round";
      const cx = width / 2 + steer.x * width * 0.2;
      const cy = height / 2 + steer.y * height * 0.2;
      const focal = Math.max(width, height) * 0.5;
      const step = reduce ? 0 : 4 * speed * boost;

      for (const star of stars) {
        const previousZ = star.z;
        star.z -= step;
        if (star.z <= 1) {
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
          star.z = depth;
          continue;
        }
        const x = cx + (star.x / star.z) * focal;
        const y = cy + (star.y / star.z) * focal;
        const px = cx + (star.x / (previousZ + step * 1.5)) * focal;
        const py = cy + (star.y / (previousZ + step * 1.5)) * focal;
        const nearness = 1 - star.z / depth;
        context.globalAlpha = nearness;
        context.lineWidth = 0.4 + nearness * 2;
        context.beginPath();
        context.moveTo(px, py);
        context.lineTo(x, y);
        context.stroke();
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [count, speed, color]);

  return <canvas ref={canvasRef} aria-hidden className={`block h-full w-full ${className}`} />;
}
