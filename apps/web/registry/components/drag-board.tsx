"use client";

import { useImperativeHandle, useRef, type ReactNode, type Ref } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin);

export interface DragBoardHandle {
  reset: () => void;
  scatter: () => void;
}

export interface DragBoardProps {
  children: ReactNode;
  snap?: number;
  tilt?: number;
  ref?: Ref<DragBoardHandle>;
  className?: string;
}

export function DragBoard({ children, snap = 10, tilt = 4, ref, className = "" }: DragBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  const items = () => gsap.utils.toArray<HTMLElement>("[data-drag]", boardRef.current);

  useImperativeHandle(ref, () => ({
    reset: () => {
      gsap.to(items(), { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.6, stagger: 0.05, ease: "back.out(1.2)" });
    },
    scatter: () => {
      const board = boardRef.current;
      if (!board) return;
      const bounds = board.getBoundingClientRect();
      const padding = 24;
      items().forEach((item) => {
        const rect = item.getBoundingClientRect();
        const baseLeft = rect.left - bounds.left - Number(gsap.getProperty(item, "x"));
        const baseTop = rect.top - bounds.top - Number(gsap.getProperty(item, "y"));
        gsap.to(item, {
          x: gsap.utils.random(padding - baseLeft, bounds.width - rect.width - padding - baseLeft),
          y: gsap.utils.random(padding - baseTop, bounds.height - rect.height - padding - baseTop),
          rotation: gsap.utils.random(-10, 10),
          duration: 0.7,
          ease: "expo.out",
        });
      });
    },
  }));

  useGSAP(
    () => {
      const board = boardRef.current;
      if (!board) return;
      let topZ = 10;

      const instances = items().flatMap((item) => {
        const rotateTo = gsap.quickTo(item, "rotation", { duration: 0.15, ease: "power2.out" });
        const lean = () => rotateTo(gsap.utils.clamp(-tilt, tilt, InertiaPlugin.getVelocity(item, "x") * 0.003));

        return Draggable.create(item, {
          type: "x,y",
          bounds: board,
          edgeResistance: 0.55,
          inertia: true,
          snap: snap > 0 ? (value: number) => Math.round(value / snap) * snap : undefined,
          onPress() {
            gsap.set(item, { zIndex: ++topZ });
            gsap.to(item, { scale: 1.03, duration: 0.2, ease: "power2.out" });
          },
          onDrag: lean,
          onThrowUpdate: lean,
          onRelease() {
            gsap.to(item, { scale: 1, duration: 0.35, ease: "back.out(1.5)" });
            if (!this.tween) rotateTo(0);
          },
          onThrowComplete: () => rotateTo(0),
        });
      });

      return () => instances.forEach((instance) => instance.kill());
    },
    { scope: boardRef, dependencies: [snap, tilt] },
  );

  return (
    <div ref={boardRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
