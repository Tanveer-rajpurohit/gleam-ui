"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ThemeToggleBulb, ThemeToggleCrescent, ThemeToggleDotted, ThemeToggleEclipse, ThemeToggleHalf } from "./components/theme-toggles";
import { InfoBadge } from "./components/info-section";
import type { ControlValues } from "./index";
import { DOCK_ICONS } from "./dock-icons";
import { DragBoard, type DragBoardHandle } from "./components/drag-board";


const LiquidChrome = dynamic(() => import("./components/liquid-chrome").then((m) => m.LiquidChrome), { ssr: false });
const WaterRipple = dynamic(() => import("./components/water-ripple").then((m) => m.WaterRipple), { ssr: false });
const CloudShader = dynamic(() => import("./components/cloud-shader").then((m) => m.CloudShader), { ssr: false });
const NoiseInk = dynamic(() => import("./components/noise-ink").then((m) => m.NoiseInk), { ssr: false });
const DitherWave = dynamic(() => import("./components/dither-wave").then((m) => m.DitherWave), { ssr: false });
const SpiralGallery = dynamic(() => import("./components/spiral-gallery").then((m) => m.SpiralGallery), { ssr: false });

const MacDock = dynamic(() => import("./components/mac-dock").then((m) => m.MacDock), { ssr: false });
const GlideSelect = dynamic(() => import("./components/glide-select").then((m) => m.GlideSelect), { ssr: false });
const MacWindow = dynamic(() => import("./components/mac-window").then((m) => m.MacWindow), { ssr: false });
const CurtainLoader = dynamic(() => import("./components/curtain-loader").then((m) => m.CurtainLoader), { ssr: false });
const ScrambleText = dynamic(() => import("./components/scramble-text").then((m) => m.ScrambleText), { ssr: false });
const PressureText = dynamic(() => import("./components/pressure-text").then((m) => m.PressureText), { ssr: false });
const SplitReveal = dynamic(() => import("./components/split-reveal").then((m) => m.SplitReveal), { ssr: false });
const MagneticButton = dynamic(() => import("./components/magnetic-button").then((m) => m.MagneticButton), { ssr: false });
const TiltCard = dynamic(() => import("./components/tilt-card").then((m) => m.TiltCard), { ssr: false });
const DotField = dynamic(() => import("./components/dot-field").then((m) => m.DotField), { ssr: false });
const WarpStars = dynamic(() => import("./components/warp-stars").then((m) => m.WarpStars), { ssr: false });
const VaporTrail = dynamic(() => import("./components/vapor-trail").then((m) => m.VaporTrail), { ssr: false });
const GrainOverlay = dynamic(() => import("./components/grain-overlay").then((m) => m.GrainOverlay), { ssr: false });
const PulseCircle = dynamic(() => import("./components/pulse-circle").then((m) => m.PulseCircle), { ssr: false });
const NoiseSphere = dynamic(() => import("./components/noise-sphere").then((m) => m.NoiseSphere), { ssr: false });
const InkTrail = dynamic(() => import("./components/ink-trail").then((m) => m.InkTrail), { ssr: false });
const ParticleField = dynamic(() => import("./components/particle-field").then((m) => m.ParticleField), { ssr: false });
const DotGrid = dynamic(() => import("./components/dot-grid").then((m) => m.DotGrid), { ssr: false });
const ShineButton = dynamic(() => import("./components/shine-button").then((m) => m.ShineButton), { ssr: false });
const SpotlightCard = dynamic(() => import("./components/spotlight-card").then((m) => m.SpotlightCard), { ssr: false });
const ImageTiltCard = dynamic(() => import("./components/image-tilt-card").then((m) => m.ImageTiltCard), { ssr: false });
const GreetingLoader = dynamic(() => import("./components/greeting-loader").then((m) => m.GreetingLoader), { ssr: false });
const RevealText = dynamic(() => import("./components/reveal-text").then((m) => m.RevealText), { ssr: false });
const PerspectiveText = dynamic(() => import("./components/perspective-text").then((m) => m.PerspectiveText), { ssr: false });
const StickyCards = dynamic(() => import("./components/sticky-cards").then((m) => m.StickyCards), { ssr: false });
const InfoSection = dynamic(() => import("./components/info-section").then((m) => m.InfoSection), { ssr: false });
const SmoothScroll = dynamic(() => import("./components/smooth-scroll").then((m) => m.SmoothScroll), { ssr: false });

export interface DemoProps {
  values: ControlValues;
  compact?: boolean;
}

function ScrollBox({ compact, children }: { compact?: boolean; children: (scroller?: RefObject<HTMLElement | null>) => ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = boxRef.current;
    if (!compact || !box) return;
    const tween = gsap.to(box, {
      scrollTop: () => box.scrollHeight - box.clientHeight,
      duration: 8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.8,
      delay: 0.6,
    });
    return () => {
      tween.kill();
    };
  }, [compact]);
  if (!compact) return <>{children(undefined)}</>;
  return (
    <div ref={boxRef} className="no-scrollbar absolute inset-0 overflow-hidden">
      {children(boxRef)}
    </div>
  );
}

const num = (value: unknown, fallback: number) => (typeof value === "number" ? value : fallback);
const str = (value: unknown, fallback: string) => (typeof value === "string" ? value : fallback);

const TITLES = ["Valley", "Ridge", "Lake", "Mist", "Forest", "Meadow", "Falls", "Trail"];

const spiralItems = TITLES.map((title, index) => ({ title, src: `/gallery/0${index + 1}.jpg` }));

function SpiralGalleryDemo({ values }: DemoProps) {
  const [title, setTitle] = useState<string | null>(null);
  return (
    <div className="relative h-full w-full bg-[#080808]">
      <SpiralGallery
        items={spiralItems}
        perTurn={num(values.perTurn, 8)}
        gap={num(values.gap, 0.5)}
        speed={num(values.speed, 0.15)}
        onHover={(item) => setTitle(item?.title ?? null)}
      />
      <p
        aria-live="polite"
        className={`pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-md bg-[#ecedee] px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-[#080808] transition-opacity duration-200 ${
          title ? "opacity-100" : "opacity-0"
        }`}
      >
        {title ?? "Gallery"}
      </p>
    </div>
  );
}

const dockItems = Object.entries(DOCK_ICONS).map(([id, icon]) => ({
  id,
  label: id[0]!.toUpperCase() + id.slice(1),
  icon,
}));

function DragBoardDemo({ values }: DemoProps) {
  const boardRef = useRef<DragBoardHandle>(null);
  return (
    <div className="grid-paper relative h-full w-full bg-[#f0f5fa] text-[#0b0d10]">
      <DragBoard ref={boardRef} snap={num(values.snap, 10)} tilt={num(values.tilt, 4)}>
        <div data-drag className="absolute left-[8%] top-[12%] w-40 rotate-0 bg-[#ffd44f] p-4 font-mono text-xs shadow-lg">
          Throw me. I keep my momentum.
        </div>
        <div data-drag className="absolute right-[10%] top-[18%] w-44 rounded-xl bg-[#0b0d10] p-4 text-[#f0f5fa] shadow-lg">
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">Ticket</p>
          <p className="mt-2 text-lg font-semibold">Inertia, 10px snap</p>
        </div>
        <div data-drag className="absolute bottom-[16%] left-[34%] h-28 w-28 rounded-full bg-[#a3b5cc] shadow-lg" />
      </DragBoard>
      <div className="absolute bottom-3 left-3 flex gap-2 font-mono text-xs">
        <button type="button" onClick={() => boardRef.current?.scatter()} className="rounded-md bg-[#0b0d10] px-3 py-1.5 text-[#f0f5fa] active:scale-95">
          Scatter
        </button>
        <button type="button" onClick={() => boardRef.current?.reset()} className="rounded-md border border-[#0b0d10]/30 px-3 py-1.5 active:scale-95">
          Reset
        </button>
      </div>
    </div>
  );
}

function GlideSelectDemo() {
  const [value, setValue] = useState("Featured");
  return <GlideSelect label="Sort" value={value} options={["Featured", "A to Z", "Shaders first", "No dependencies"]} onChange={setValue} />;
}

function MacWindowDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState<HTMLElement | null>(null);
  return (
    <div className="relative flex h-full w-full items-end justify-center p-6">
      <MacWindow
        open={isOpen}
        onClose={() => setIsOpen(false)}
        origin={origin}
        title="readme.md"
        className="absolute inset-x-6 top-6 bottom-20 mx-auto max-w-md"
      >
        <p className="p-5 font-mono text-xs leading-relaxed">
          This window grew out of the button below and will collapse back into it. Press the red dot or Escape.
        </p>
      </MacWindow>
      <button
        type="button"
        onClick={(event) => {
          setOrigin(event.currentTarget);
          setIsOpen((open) => !open);
        }}
        className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-bg active:scale-95"
      >
        {isOpen ? "Close window" : "Open window"}
      </button>
    </div>
  );
}

function CurtainLoaderDemo({ values }: DemoProps) {
  const [run, setRun] = useState(0);
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#f0f5fa] text-[#0b0d10]">
      <button type="button" onClick={() => setRun((count) => count + 1)} className="rounded-lg bg-[#0b0d10] px-4 py-2 text-sm font-medium text-[#f0f5fa] active:scale-95">
        Replay loader
      </button>
      <CurtainLoader key={run} duration={num(values.duration, 1.8)} exit={values.exit === "down" ? "down" : "up"} />
    </div>
  );
}

function ScrambleDemo({ values }: DemoProps) {
  const [run, setRun] = useState(0);
  return (
    <button type="button" onClick={() => setRun((count) => count + 1)} className="font-mono text-2xl font-medium sm:text-4xl" aria-label="Replay scramble">
      <ScrambleText
        key={run}
        text={str(values.text, "Signal restored.")}
        speed={num(values.speed, 1)}
        trigger={values.trigger === "hover" ? "hover" : "mount"}
      />
    </button>
  );
}

function SplitRevealDemo({ values }: DemoProps) {
  const [run, setRun] = useState(0);
  return (
    <button type="button" onClick={() => setRun((count) => count + 1)} className="text-4xl font-semibold tracking-tight sm:text-6xl" aria-label="Replay reveal">
      <SplitReveal
        key={run}
        text={str(values.text, "Made to move")}
        by={values.by === "words" ? "words" : "chars"}
        stagger={num(values.stagger, 0.03)}
        duration={num(values.duration, 0.9)}
      />
    </button>
  );
}

const bool = (value: unknown, fallback: boolean) => (typeof value === "boolean" ? value : fallback);

function GreetingLoaderDemo({ values, compact }: DemoProps) {
  const [run, setRun] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  useEffect(() => {
    if (isPlaying || !compact) return;
    const timer = window.setTimeout(() => {
      setRun((count) => count + 1);
      setIsPlaying(true);
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [isPlaying, compact]);
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden [transform:translateZ(0)]">
      <button
        type="button"
        onClick={() => {
          setRun((count) => count + 1);
          setIsPlaying(true);
        }}
        className="rounded-full bg-ink px-6 py-3 text-button text-bg active:scale-95"
      >
        Replay loader
      </button>
      {isPlaying ? (
        <GreetingLoader
          key={run}
          wordDuration={num(values.wordDuration, 0.2)}
          exitDuration={num(values.exitDuration, 0.8)}
          exit={values.exit === "down" ? "down" : values.exit === "fade" ? "fade" : "up"}
          onComplete={() => setIsPlaying(false)}
        />
      ) : null}
    </div>
  );
}

const STICKY_ITEMS = [
  { src: "/gallery/01.jpg", label: "Valley" },
  { src: "/gallery/04.jpg", label: "Mist" },
  { src: "/gallery/03.jpg", label: "Lake" },
  { src: "/gallery/06.jpg", label: "Meadow" },
];

const LOREM = [
  "Motion is a material.",
  "It has weight, it has friction, it settles.",
  "Every component here ships as one file you own.",
  "Read it, change it, delete half of it.",
  "Nothing hides behind a package boundary.",
];

const extraDemos: Record<string, ComponentType<DemoProps>> = {
  "pulse-circle": ({ values, compact }) => (
    <PulseCircle
      mode={values.mode === "pulse" ? "pulse" : "sonar"}
      size={compact ? Math.min(num(values.size, 220), 360) : num(values.size, 220) * 1.6}
      rings={num(values.rings, 3)}
      speed={num(values.speed, 1)}
      thickness={num(values.thickness, 1)}
      wobble={num(values.wobble, 0.5)}
      color={str(values.color, "#819bb9")}
    />
  ),
  "noise-sphere": ({ values }) => (
    <div className="h-full w-full bg-[#080808]">
      <NoiseSphere
        mode={values.mode === "solid" ? "solid" : values.mode === "points" ? "points" : "wireframe"}
        amplitude={num(values.amplitude, 0.35)}
        frequency={num(values.frequency, 1.6)}
        speed={num(values.speed, 0.4)}
        rotate={num(values.rotate, 0.12)}
        detail={num(values.detail, 96)}
        valley={str(values.valley, "#44607f")}
        peak={str(values.peak, "#dfe7f1")}
      />
    </div>
  ),
  "ink-trail": ({ values }) => (
    <div className="relative flex h-full w-full items-center justify-center bg-[#f0f5fa] text-[#1f2a38]">
      <p className="select-none text-center font-display text-[clamp(2.5rem,7vw,6rem)] leading-none opacity-20">Write with the pointer</p>
      <InkTrail
        className="absolute inset-0"
        size={num(values.size, 34)}
        fade={num(values.fade, 0.92)}
        roughness={num(values.roughness, 0.6)}
        color={str(values.color, "#0b0d10")}
        tint={str(values.tint, "#44607f")}
        opacity={num(values.opacity, 0.9)}
      />
    </div>
  ),
  "particle-field": ({ values, compact }) => (
    <div className="relative flex h-full w-full items-center justify-center bg-[#080808]">
      <ParticleField
        className="absolute inset-0"
        count={compact ? 1800 : num(values.count, 3200)}
        mode={values.mode === "pulse" ? "pulse" : "drift"}
        size={num(values.size, 1.2)}
        speed={num(values.speed, 1)}
        intensity={num(values.intensity, 1)}
        near={str(values.near, "#dfe7f1")}
        far={str(values.far, "#819bb9")}
      />
      <p className="pointer-events-none relative font-display text-[clamp(3rem,9vw,7rem)] leading-none text-[#ecedee]">Drift</p>
    </div>
  ),
  "dot-grid": ({ values }) => (
    <div className="relative h-full w-full bg-surface">
      <DotGrid
        className="absolute inset-0"
        mode={values.mode === "push" ? "push" : "vanish"}
        density={num(values.density, 40)}
        dotSize={num(values.dotSize, 0.35)}
        radius={num(values.radius, 0.22)}
        intensity={num(values.intensity, 1)}
        color={str(values.color, "#44607f")}
      />
    </div>
  ),
  "shine-button": ({ values }) => {
    const variant = values.variant === "border" ? "border" : "solid";
    const mode = values.mode === "hover" ? "hover" : values.mode === "off" ? "off" : "auto";
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <ShineButton variant={variant} mode={mode} speed={num(values.speed, 2.8)} accent={str(values.accent, "#819bb9")}>
          Browse components
        </ShineButton>
        <ShineButton variant={variant === "solid" ? "border" : "solid"} mode={mode} speed={num(values.speed, 2.8)} accent={str(values.accent, "#819bb9")}>
          Read the docs
        </ShineButton>
      </div>
    );
  },
  "theme-toggles": ({ values }) => {
    const speed = num(values.speed, 0.35);
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <ThemeToggleHalf speed={speed} />
        <ThemeToggleEclipse speed={speed} />
        <ThemeToggleDotted speed={speed} />
        <ThemeToggleBulb speed={speed} />
        <ThemeToggleCrescent speed={speed} />
      </div>
    );
  },
  "spotlight-card": ({ values }) => (
    <SpotlightCard
      className="w-[340px] p-8"
      radius={num(values.radius, 320)}
      intensity={num(values.intensity, 0.6)}
      mode={values.mode === "hover" ? "hover" : "always"}
      borderGlow={bool(values.borderGlow, true)}
      edge={str(values.edge, "#819bb9")}
    >
      <p className="font-mono text-caption text-ink-faint">01</p>
      <h3 className="mt-4 text-title-lg text-ink">Light that follows you</h3>
      <p className="mt-3 text-body-sm leading-relaxed text-ink-muted">
        Two radial gradients driven by CSS variables. The pointer never triggers a React render.
      </p>
    </SpotlightCard>
  ),
  "image-tilt-card": ({ values }) => (
    <ImageTiltCard
      src="/gallery/03.jpg"
      alt="A still lake under mountains"
      caption={str(values.caption, "Open story")}
      maxTilt={num(values.maxTilt, 12)}
      scale={num(values.scale, 1.08)}
      speed={num(values.speed, 1)}
      width={280}
      height={340}
      overlay={
        <div className="absolute left-4 top-4">
          <p className="rounded-lg bg-black/55 px-3 py-1.5 text-caption text-white">Still Lake</p>
        </div>
      }
    />
  ),
  "greeting-loader": GreetingLoaderDemo,
  "reveal-text": ({ values, compact }) => (
    <ScrollBox compact={compact}>
      {(scroller) => (
        <div className="px-8 py-[45vh] sm:px-16">
          {LOREM.map((line) => (
            <RevealText
              key={line}
              as="h2"
              scroller={scroller}
              mode={values.mode === "once" ? "once" : "scrub"}
              stagger={num(values.stagger, 0.045)}
              y={num(values.y, 14)}
              blur={bool(values.blur, false)}
              className="mx-auto mb-24 max-w-3xl justify-center text-center font-display text-display-lg text-ink"
            >
              {line}
            </RevealText>
          ))}
        </div>
      )}
    </ScrollBox>
  ),
  "perspective-text": ({ values, compact }) => (
    <ScrollBox compact={compact}>
      {(scroller) => (
        <PerspectiveText
          scroller={scroller}
          height={compact ? "1800px" : "300vh"}
          angle={num(values.angle, 30)}
          travel={num(values.travel, 480)}
          depth={num(values.depth, 200)}
          fade="var(--gl-bg)"
          textClassName="font-display text-accent"
        >
          A long time ago, in a component library far away, every effect shipped as a single file you could read end to end.
        </PerspectiveText>
      )}
    </ScrollBox>
  ),
  "sticky-cards": ({ values, compact }) => (
    <ScrollBox compact={compact}>
      {(scroller) => (
        <StickyCards
          scroller={scroller}
          items={STICKY_ITEMS}
          rotate={num(values.rotate, 100)}
          margin={num(values.margin, 10)}
          falloff={compact ? 3000 : num(values.falloff, 10000)}
          header={<p className="font-mono text-caption-upper uppercase text-ink-faint">Scroll to stack</p>}
        />
      )}
    </ScrollBox>
  ),
  "info-section": ({ values, compact }) => (
    <ScrollBox compact={compact}>
      {(scroller) => (
        <div className="mx-auto max-w-4xl px-8 py-[60vh]">
          <InfoSection
            scroller={scroller}
            skeleton={bool(values.skeleton, true)}
            skeletonOpacity={num(values.skeletonOpacity, 0.16)}
            stagger={num(values.stagger, 0.05)}
            skeletonColor={str(values.skeletonColor, "#a3b5cc")}
            textClassName="justify-center text-center font-display font-normal text-ink"
            paragraphs={[
              ["We", "don't", "ship", <InfoBadge key="a">building blocks</InfoBadge>, "alone.", "We", "ship", "whole", <InfoBadge key="b" variant="soft">sections</InfoBadge>, "with", "the", "choreography", "built", "in."],
            ]}
          />
        </div>
      )}
    </ScrollBox>
  ),
  "smooth-scroll": ({ compact }) => {
    const body = (
      <div className="mx-auto max-w-2xl px-8 py-[30vh]">
        {LOREM.concat(LOREM).map((line, index) => (
          <p key={index} className="mb-20 font-display text-display-md text-ink">
            <span className="mr-4 font-mono text-caption text-ink-faint">{String(index + 1).padStart(2, "0")}</span>
            {line}
          </p>
        ))}
      </div>
    );
    if (compact) return <ScrollBox compact>{() => body}</ScrollBox>;
    return <SmoothScroll>{body}</SmoothScroll>;
  },
};

export const demos: Record<string, ComponentType<DemoProps>> = {
  "liquid-chrome": ({ values }) => (
    <div className="h-full w-full bg-[#080808]">
      <LiquidChrome speed={num(values.speed, 1)} tint={str(values.tint, "#a3b5cc")} />
    </div>
  ),
  "water-ripple": ({ values, compact }) => (
    <WaterRipple
      text={str(values.text, "Gleam")}
      background={str(values.background, "#a3b5cc")}
      color={str(values.color, "#0b0d10")}
      font={`600 ${compact ? 90 : 190}px sans-serif`}
    />
  ),
  "cloud-shader": ({ values }) => (
    <CloudShader
      speed={num(values.speed, 1)}
      scale={num(values.scale, 8)}
      deep={str(values.deep, "#001a66")}
      mid={str(values.mid, "#0099cc")}
      light={str(values.light, "#cce6ff")}
    />
  ),
  "noise-ink": ({ values }) => (
    <NoiseInk
      speed={num(values.speed, 1)}
      mode={values.mode === "cloud" ? "cloud" : values.mode === "rings" ? "rings" : "ink"}
      ink={str(values.ink, "#0b0d10")}
      paper={str(values.paper, "#f0f5fa")}
    />
  ),
  "dither-wave": ({ values }) => (
    <DitherWave
      speed={num(values.speed, 1)}
      pixel={num(values.pixel, 4)}
      front={str(values.front, "#a3b5cc")}
      back={str(values.back, "#0b0d10")}
    />
  ),
  "spiral-gallery": SpiralGalleryDemo,
  "drag-board": DragBoardDemo,
  "mac-dock": ({ values, compact }) => (
    <MacDock
      items={compact ? dockItems.slice(0, 5) : dockItems}
      size={compact ? 36 : num(values.size, 48)}
      maxScale={num(values.maxScale, 1.65)}
      radius={num(values.radius, 170)}
    />
  ),
  "glide-select": GlideSelectDemo,
  "mac-window": MacWindowDemo,
  "curtain-loader": CurtainLoaderDemo,
  "scramble-text": ScrambleDemo,
  "pressure-text": ({ values }) => (
    <PressureText
      text={str(values.text, "Pressure")}
      minWeight={num(values.minWeight, 400)}
      maxWeight={num(values.maxWeight, 700)}
      radius={num(values.radius, 160)}
      className="font-mono text-5xl sm:text-7xl"
    />
  ),
  "split-reveal": SplitRevealDemo,
  "magnetic-button": ({ values }) => (
    <MagneticButton strength={num(values.strength, 0.4)} variant={values.variant === "outline" ? "outline" : "solid"}>
      Hover near me
    </MagneticButton>
  ),
  "tilt-card": ({ values }) => (
    <TiltCard
      maxTilt={num(values.maxTilt, 12)}
      scale={num(values.scale, 1.03)}
      glare={values.glare !== false}
      className="flex h-52 w-40 flex-col justify-between rounded-2xl bg-[#0b0d10] p-5 text-[#f0f5fa] shadow-xl"
    >
      <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">No. 016</span>
      <span className="text-2xl font-semibold leading-tight">Tilt card</span>
    </TiltCard>
  ),
  "dot-field": ({ values }) => (
    <DotField
      gap={num(values.gap, 22)}
      dotSize={num(values.dotSize, 1.4)}
      radius={num(values.radius, 140)}
      strength={num(values.strength, 26)}
    />
  ),
  "warp-stars": ({ values }) => (
    <div className="h-full w-full bg-[#05060a]">
      <WarpStars count={num(values.count, 600)} speed={num(values.speed, 1)} color={str(values.color, "#ffffff")} />
    </div>
  ),
  "vapor-trail": ({ values }) => (
    <div className="relative flex h-full w-full items-center justify-center bg-[#10202e] font-mono text-xs uppercase tracking-widest text-white/50">
      Move the pointer
      <VaporTrail
        className="absolute inset-0"
        core={str(values.core, "#ffffff")}
        mist={str(values.mist, "#a3b5cc")}
        spread={num(values.spread, 18)}
        life={num(values.life, 1)}
      />
    </div>
  ),
  "grain-overlay": ({ values }) => (
    <div className="relative flex h-full w-full items-center justify-center bg-[#44607f] text-3xl font-semibold text-[#f0f5fa]">
      Film grain
      <GrainOverlay opacity={num(values.opacity, 0.14)} speed={num(values.speed, 0.9)} frequency={num(values.frequency, 0.8)} />
    </div>
  ),
  ...extraDemos,
};
