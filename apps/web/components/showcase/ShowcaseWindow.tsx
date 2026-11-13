"use client";

import { useEffect, useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ShowcaseWindowProps {
  title: string;
  subtitle?: string;
  isOpen: boolean;
  zIndex: number;
  origin: () => HTMLElement | null;
  place: () => WindowRect;
  onFocus: () => void;
  onClose: () => void;
  actions?: ReactNode;
  children: ReactNode;
}

const MIN_WIDTH = 320;
const MIN_HEIGHT = 240;

const centerOf = (element: HTMLElement | null) => {
  const rect = element?.getBoundingClientRect();
  if (!rect) return { x: window.innerWidth - 80, y: 40 };
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

export function ShowcaseWindow({ title, subtitle, isOpen, zIndex, origin, place, onFocus, onClose, actions, children }: ShowcaseWindowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const isPlacedRef = useRef(false);
  const callbacksRef = useRef({ onFocus, origin, place });

  useEffect(() => {
    callbacksRef.current = { onFocus, origin, place };
  });

  useEffect(() => {
    const root = rootRef.current;
    const handle = handleRef.current;
    if (!root || !handle) return;
    const [drag] = Draggable.create(root, {
      type: "x,y",
      trigger: handle,
      dragClickables: false,
      zIndexBoost: false,
      cursor: "grab",
      activeCursor: "grabbing",
      onPress() {
        callbacksRef.current.onFocus();
        const rect = root.getBoundingClientRect();
        this.applyBounds({ minX: 160 - rect.width, maxX: window.innerWidth - 160, minY: 0, maxY: window.innerHeight - 56 });
      },
    });
    return () => {
      drag?.kill();
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || wasOpenRef.current === isOpen) return;
    wasOpenRef.current = isOpen;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.killTweensOf(root, "scaleX,scaleY,autoAlpha");
    if (isOpen && !isPlacedRef.current) {
      gsap.set(root, callbacksRef.current.place());
      isPlacedRef.current = true;
    }
    const point = centerOf(callbacksRef.current.origin());
    const x = Number(gsap.getProperty(root, "x"));
    const y = Number(gsap.getProperty(root, "y"));
    gsap.set(root, { transformOrigin: `${point.x - x}px ${point.y - y}px` });

    if (isReduced) {
      gsap.set(root, { autoAlpha: isOpen ? 1 : 0, scaleX: 1, scaleY: 1 });
      return;
    }
    if (isOpen) {
      gsap
        .timeline()
        .fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16, ease: "power1.out" }, 0)
        .fromTo(root, { scaleY: 0.03 }, { scaleY: 1, duration: 0.55, ease: "expo.out" }, 0)
        .fromTo(root, { scaleX: 0.05 }, { scaleX: 1, duration: 0.62, ease: "expo.out" }, 0.06);
      return;
    }
    gsap
      .timeline()
      .to(root, { scaleX: 0.05, duration: 0.4, ease: "power3.in" }, 0)
      .to(root, { scaleY: 0.03, duration: 0.34, ease: "power3.in" }, 0.08)
      .to(root, { autoAlpha: 0, duration: 0.12, ease: "none" }, 0.3);
  }, [isOpen]);

  const startResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root) return;
    event.preventDefault();
    event.stopPropagation();
    onFocus();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = root.offsetWidth;
    const startHeight = root.offsetHeight;
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    const onMove = (moveEvent: PointerEvent) => {
      gsap.set(root, {
        width: Math.max(MIN_WIDTH, startWidth + moveEvent.clientX - startX),
        height: Math.max(MIN_HEIGHT, startHeight + moveEvent.clientY - startY),
      });
    };
    const onUp = () => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
  };

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label={title}
      onPointerDown={onFocus}
      className="invisible fixed left-0 top-0 flex flex-col overflow-hidden rounded-2xl border border-line bg-surface opacity-0 shadow-window will-change-transform"
      style={{ zIndex, width: 480, height: 480 }}
    >
      <div ref={handleRef} className="flex h-14 shrink-0 select-none items-center gap-3 border-b border-line pl-5 pr-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-upper uppercase text-ink-faint">{title}</p>
          {subtitle ? <p className="truncate font-mono text-[11px] text-ink-muted">{subtitle}</p> : null}
        </div>
        {actions}
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink active:scale-95"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div className="vd-scroll min-h-0 flex-1 overflow-auto">{children}</div>
      <div aria-hidden onPointerDown={startResize} className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize">
        <svg viewBox="0 0 20 20" className="h-full w-full text-ink-faint" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <path d="M15 9l-6 6M15 13l-2 2" />
        </svg>
      </div>
    </div>
  );
}
