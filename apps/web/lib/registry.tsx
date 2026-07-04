import type { ComponentType } from "react";
import type { Control } from "./controls";

export interface PropRow {
  prop: string;
  type: string;
  default?: string;
  description: string;
}

export type DemoProps = Record<string, any>;

export interface RegistryEntry {
  slug: string;
  name: string;
  category: string;
  description: string;
  status: "ready" | "planned";
  /** Source file, relative to packages/ui/src — shown verbatim in the Code tab. */
  source?: string;
  importPath?: string;
  exportName?: string;
  demo?: ComponentType<DemoProps>;
  props?: PropRow[];
  /** Live playground controls rendered under the preview. */
  controls?: Control[];
  /** Demos that animate on mount/scroll get remounted when values change. */
  remountOnChange?: boolean;
  /**
   * Showcase stage layout: `"center"` — demo centered on a fullscreen stage;
   * `"fill"` — demo covers the entire viewport (backgrounds, shaders);
   * `"scroll"` — a scrollable narrative page (scroll-driven components).
   * @default "center"
   */
  stage?: "center" | "fill" | "scroll";
  /** Alternate demo composition for the fullscreen showcase stage. */
  showcaseDemo?: ComponentType<DemoProps>;
}

export const CATEGORIES = [
  "Text Animations",
  "3D & Shaders",
  "Buttons & CTAs",
  "Cards",
  "Backgrounds",
  "Sections",
  "Navigation",
  "Scroll Effects",
  "Loaders & Feedback",
] as const;

export const registry: RegistryEntry[] = [
  {
    slug: "pressure-text",
    name: "Pressure Text",
    category: "Text Animations",
    description:
      "Variable-font text that gains weight under the cursor, like keys being pressed. Falls back to an autonomous wave on touch devices.",
    status: "ready",
    source: "text/pressure-text.tsx",
    importPath: "gleam-ui/text",
    exportName: "PressureText",
    controls: [
      { prop: "text", type: "text", defaultValue: "Pressure" },
      { prop: "mode", type: "select", options: ["cursor", "wave", "static"], defaultValue: "cursor" },
      { prop: "minWeight", type: "range", min: 100, max: 700, step: 10, defaultValue: 400 },
      { prop: "maxWeight", type: "range", min: 400, max: 900, step: 10, defaultValue: 800 },
      { prop: "radius", type: "range", min: 60, max: 420, step: 10, defaultValue: 200 },
      { prop: "speed", type: "range", min: 0.2, max: 3, step: 0.1, defaultValue: 1 },
      { prop: "stretch", type: "boolean", defaultValue: true },
    ],
    props: [
      { prop: "text", type: "string", description: "The text to render." },
      { prop: "mode", type: '"cursor" | "wave" | "static"', default: '"cursor"', description: "Pressure driver. Cursor mode auto-falls back to wave on coarse pointers." },
      { prop: "minWeight", type: "number", default: "340", description: "Variable-font weight at rest." },
      { prop: "maxWeight", type: "number", default: "800", description: "Weight under full pressure." },
      { prop: "radius", type: "number", default: "180", description: "Pointer influence radius in px." },
      { prop: "speed", type: "number", default: "1", description: "Wave travel / cursor easing multiplier." },
      { prop: "curve", type: '"smooth" | "linear"', default: '"smooth"', description: "Pressure falloff curve." },
      { prop: "stretch", type: "boolean", default: "true", description: "Adds a slight vertical stretch under pressure." },
      { prop: "as", type: "ElementType", default: '"h2"', description: "Rendered element." },
    ],
  },
  {
    slug: "scramble-text",
    name: "Scramble Text",
    category: "Text Animations",
    description:
      "Characters flicker through a glyph pool and settle left-to-right into the target string. Layout is reserved up front — nothing shifts.",
    status: "ready",
    source: "text/scramble-text.tsx",
    importPath: "gleam-ui/text",
    exportName: "ScrambleText",
    remountOnChange: true,
    controls: [
      { prop: "text", type: "text", defaultValue: "Signal restored." },
      { prop: "mode", type: "select", options: ["loop", "hover", "inview", "mount"], defaultValue: "loop" },
      { prop: "speed", type: "range", min: 0.2, max: 3, step: 0.1, defaultValue: 1 },
      { prop: "loopDelay", type: "range", min: 0.5, max: 6, step: 0.1, defaultValue: 2.2 },
    ],
    props: [
      { prop: "text", type: "string", description: "The text to decode into." },
      { prop: "mode", type: '"inview" | "hover" | "loop" | "mount"', default: '"inview"', description: "When the scramble runs." },
      { prop: "speed", type: "number", default: "1", description: "Decode speed multiplier." },
      { prop: "characters", type: "string", default: '"!<>-_\\\\/[]{}—=+*^?#$%&"', description: "Glyph pool used while scrambled." },
      { prop: "loopDelay", type: "number", default: "2.5", description: "Seconds between runs in loop mode." },
      { prop: "delay", type: "number", default: "0", description: "Start delay in seconds." },
      { prop: "accentScramble", type: "boolean", default: "true", description: "Tint in-flight glyphs with the accent token." },
      { prop: "as", type: "ElementType", default: '"span"', description: "Rendered element." },
    ],
  },
  {
    slug: "reveal-text",
    name: "Reveal Text",
    category: "Text Animations",
    description:
      "Split-word scroll reveal — each word un-clips left-to-right with a small rise, like typesetting happening in front of you. GSAP ScrollTrigger under the hood.",
    status: "ready",
    source: "scroll/reveal-text.tsx",
    importPath: "gleam-ui/scroll",
    exportName: "RevealText",
    stage: "scroll",
    remountOnChange: true,
    controls: [
      { prop: "mode", type: "select", options: ["once", "scrub"], defaultValue: "once" },
      { prop: "stagger", type: "range", min: 0.01, max: 0.2, step: 0.01, defaultValue: 0.06 },
      { prop: "y", type: "range", min: 0, max: 60, step: 1, defaultValue: 14 },
      { prop: "blur", type: "boolean", defaultValue: true },
    ],
    props: [
      { prop: "children", type: "string", description: "Copy to reveal, split per word." },
      { prop: "mode", type: '"scrub" | "once"', default: '"once"', description: "Scroll-scrubbed (reversible) or play-once." },
      { prop: "start", type: "string", default: '"top 80%"', description: "ScrollTrigger start position." },
      { prop: "stagger", type: "number", default: "0.045", description: "Seconds between words." },
      { prop: "y", type: "number", default: "14", description: "Vertical drift per word in px." },
      { prop: "duration", type: "number", default: "0.5", description: "Per-word reveal duration." },
      { prop: "blur", type: "boolean", default: "false", description: "Clear a blur as each word reveals." },
      { prop: "ease", type: "string", default: '"power3.out"', description: "GSAP ease per word." },
      { prop: "as", type: "ElementType", default: '"p"', description: "Rendered element." },
    ],
  },
  { slug: "gradient-text", name: "Gradient Text", category: "Text Animations", description: "Animated gradient sweep through headline text.", status: "planned" },
  { slug: "typewriter-text", name: "Typewriter", category: "Text Animations", description: "Character-by-character typing with cursor.", status: "planned" },

  {
    slug: "particle-field",
    name: "Particle Field",
    category: "3D & Shaders",
    description:
      "A WebGL field of noise-driven particles in the Viridian greens — drifts organically, parts around the cursor, and re-samples its colors when the theme flips. Custom GLSL, ~3k particles at 60fps.",
    status: "ready",
    source: "three/particle-field.tsx",
    importPath: "gleam-ui/three",
    exportName: "ParticleField",
    stage: "fill",
    controls: [
      { prop: "count", type: "range", min: 400, max: 6000, step: 100, defaultValue: 2600 },
      { prop: "size", type: "range", min: 0.4, max: 3, step: 0.1, defaultValue: 1 },
      { prop: "speed", type: "range", min: 0.1, max: 3, step: 0.1, defaultValue: 1 },
      { prop: "intensity", type: "range", min: 0, max: 3, step: 0.1, defaultValue: 1.2 },
      { prop: "mode", type: "select", options: ["drift", "pulse"], defaultValue: "drift" },
      { prop: "opacity", type: "range", min: 0.1, max: 1, step: 0.05, defaultValue: 1 },
    ],
    props: [
      { prop: "count", type: "number", default: "3200", description: "Number of particles." },
      { prop: "colors", type: "[string, string]", default: "theme accent tokens", description: "Particle colors; auto-follows the theme when omitted." },
      { prop: "size", type: "number", default: "1", description: "Base particle size." },
      { prop: "speed", type: "number", default: "1", description: "Drift speed multiplier." },
      { prop: "intensity", type: "number", default: "1", description: "Cursor repulsion strength; 0 disables the push." },
      { prop: "interactive", type: "boolean", default: "true", description: "React to the cursor at all." },
      { prop: "mode", type: '"drift" | "pulse"', default: '"drift"', description: "Continuous drift, or drift with a slow breathing amplitude." },
      { prop: "opacity", type: "number", default: "1", description: "Overall field opacity." },
    ],
  },
  {
    slug: "noise-ink",
    name: "Noise Ink",
    category: "3D & Shaders",
    description:
      "A domain-warped noise shader rendered as ink, cloud, or contour rings. The cursor tears the pattern open where it moves; the field heals behind it. Theme-reactive colors, one fullscreen triangle of GLSL.",
    status: "ready",
    source: "three/noise-ink.tsx",
    importPath: "gleam-ui/three",
    exportName: "NoiseInk",
    stage: "fill",
    controls: [
      { prop: "mode", type: "select", options: ["ink", "cloud", "rings"], defaultValue: "ink" },
      { prop: "scale", type: "range", min: 1, max: 8, step: 0.1, defaultValue: 2.6 },
      { prop: "speed", type: "range", min: 0.1, max: 4, step: 0.1, defaultValue: 1 },
      { prop: "contrast", type: "range", min: 0, max: 1, step: 0.05, defaultValue: 0.5 },
      { prop: "intensity", type: "range", min: 0, max: 2, step: 0.1, defaultValue: 1 },
      { prop: "radius", type: "range", min: 0.05, max: 0.6, step: 0.01, defaultValue: 0.28 },
      { prop: "opacity", type: "range", min: 0.1, max: 1, step: 0.05, defaultValue: 0.55 },
      { prop: "customColors", type: "boolean", defaultValue: false },
      { prop: "colorA", type: "color", defaultValue: "#2f5d3a" },
      { prop: "colorB", type: "color", defaultValue: "#8fb996" },
    ],
    props: [
      { prop: "mode", type: '"ink" | "cloud" | "rings"', default: '"ink"', description: "Thresholded blots, the soft field, or contour lines." },
      { prop: "colors", type: "[string, string]", default: "theme accent tokens", description: "Field colors low → high; auto-follows the theme when omitted." },
      { prop: "scale", type: "number", default: "2.6", description: "Noise scale — higher is busier." },
      { prop: "speed", type: "number", default: "1", description: "Evolution speed multiplier." },
      { prop: "contrast", type: "number", default: "0.5", description: "Edge hardness / band density, 0–1." },
      { prop: "intensity", type: "number", default: "1", description: "Cursor tear strength." },
      { prop: "radius", type: "number", default: "0.28", description: "Cursor influence radius, 0–1 of the shorter edge." },
      { prop: "interactive", type: "boolean", default: "true", description: "React to the cursor at all." },
      { prop: "opacity", type: "number", default: "0.55", description: "Overall opacity." },
    ],
  },
  {
    slug: "pulse-circle",
    name: "Pulse Circle",
    category: "3D & Shaders",
    description:
      "An SDF shader circle with organically wobbling edges. Sonar mode expands fading rings from the center — drop it in as a loader; pulse mode breathes a single disc. The cursor bends and shatters the rings.",
    status: "ready",
    source: "three/pulse-circle.tsx",
    importPath: "gleam-ui/three",
    exportName: "PulseCircle",
    controls: [
      { prop: "mode", type: "select", options: ["sonar", "pulse"], defaultValue: "sonar" },
      { prop: "size", type: "range", min: 80, max: 360, step: 10, defaultValue: 200 },
      { prop: "rings", type: "range", min: 1, max: 6, step: 1, defaultValue: 3 },
      { prop: "speed", type: "range", min: 0.2, max: 3, step: 0.1, defaultValue: 1 },
      { prop: "thickness", type: "range", min: 0.3, max: 3, step: 0.1, defaultValue: 1 },
      { prop: "wobble", type: "range", min: 0, max: 1, step: 0.05, defaultValue: 0.5 },
      { prop: "customColor", type: "boolean", defaultValue: false },
      { prop: "color", type: "color", defaultValue: "#8fb996" },
    ],
    props: [
      { prop: "mode", type: '"pulse" | "sonar"', default: '"sonar"', description: "Expanding rings (loader-ready) or a breathing disc." },
      { prop: "size", type: "number", default: "160", description: "Rendered size in px — it's square." },
      { prop: "color", type: "string", default: "accent token", description: "Ring color; auto-follows the theme when omitted." },
      { prop: "rings", type: "number", default: "3", description: "Ring count in sonar mode, max 6." },
      { prop: "speed", type: "number", default: "1", description: "Animation speed multiplier." },
      { prop: "thickness", type: "number", default: "1", description: "Line thickness multiplier." },
      { prop: "wobble", type: "number", default: "0.5", description: "Organic edge wobble; 0 = perfect circles." },
      { prop: "interactive", type: "boolean", default: "true", description: "Bend and shatter near the cursor." },
      { prop: "opacity", type: "number", default: "1", description: "Overall opacity." },
    ],
  },
  {
    slug: "noise-sphere",
    name: "Noise Sphere",
    category: "3D & Shaders",
    description:
      "A sphere continuously displaced by layered simplex noise — the classic organic blob study as a drop-in component. Wireframe reads as a topographic survey, points as a particle shell, solid as a breathing organism. Swells toward the cursor.",
    status: "ready",
    source: "three/noise-sphere.tsx",
    importPath: "gleam-ui/three",
    exportName: "NoiseSphere",
    stage: "fill",
    controls: [
      { prop: "mode", type: "select", options: ["wireframe", "solid", "points"], defaultValue: "wireframe" },
      { prop: "amplitude", type: "range", min: 0.05, max: 1, step: 0.05, defaultValue: 0.35 },
      { prop: "frequency", type: "range", min: 0.5, max: 5, step: 0.1, defaultValue: 1.6 },
      { prop: "speed", type: "range", min: 0, max: 2, step: 0.05, defaultValue: 0.4 },
      { prop: "rotate", type: "range", min: 0, max: 1, step: 0.02, defaultValue: 0.12 },
    ],
    props: [
      { prop: "mode", type: '"wireframe" | "solid" | "points"', default: '"wireframe"', description: "Rendering style of the displaced shell." },
      { prop: "amplitude", type: "number", default: "0.35", description: "Displacement height along the normals." },
      { prop: "frequency", type: "number", default: "1.6", description: "Noise frequency — higher is more detailed relief." },
      { prop: "speed", type: "number", default: "0.4", description: "Field evolution speed." },
      { prop: "rotate", type: "number", default: "0.12", description: "Idle rotation speed; 0 disables." },
      { prop: "detail", type: "number", default: "96", description: "Sphere tessellation." },
      { prop: "colors", type: "[string, string]", default: "theme accent tokens", description: "Valley → peak colors; auto-follows the theme." },
      { prop: "interactive", type: "boolean", default: "true", description: "Swell when the cursor approaches." },
      { prop: "opacity", type: "number", default: "1", description: "Overall opacity." },
    ],
  },
  {
    slug: "ink-trail",
    name: "Ink Trail",
    category: "3D & Shaders",
    description:
      "The cursor drags a ribbon of ink across the page — it pools when you slow down, thins when you flick, and its edges wander like wet ink before evaporating. Offscreen brush buffer shaded in GLSL; ink color follows the theme.",
    status: "ready",
    source: "three/ink-trail.tsx",
    importPath: "gleam-ui/three",
    exportName: "InkTrail",
    stage: "fill",
    controls: [
      { prop: "size", type: "range", min: 10, max: 90, step: 2, defaultValue: 34 },
      { prop: "fade", type: "range", min: 0.7, max: 0.99, step: 0.01, defaultValue: 0.92 },
      { prop: "roughness", type: "range", min: 0, max: 1, step: 0.05, defaultValue: 0.6 },
      { prop: "opacity", type: "range", min: 0.2, max: 1, step: 0.05, defaultValue: 0.9 },
    ],
    props: [
      { prop: "color", type: "string", default: "theme text token", description: "Core ink color — real ink on the current paper." },
      { prop: "tint", type: "string", default: "accent-strong token", description: "Thin-edge tint." },
      { prop: "size", type: "number", default: "34", description: "Brush radius in px at rest speed." },
      { prop: "fade", type: "number", default: "0.92", description: "Trail persistence 0–1 — higher lingers longer." },
      { prop: "roughness", type: "number", default: "0.6", description: "Edge irregularity — 0 clean ribbon, 1 wet ink." },
      { prop: "opacity", type: "number", default: "0.9", description: "Overall opacity." },
      { prop: "fixed", type: "boolean", default: "false", description: "Cover the viewport instead of the parent." },
    ],
  },
  { slug: "floating-shapes", name: "Floating Shapes", category: "3D & Shaders", description: "Slow-orbiting 3D primitives with shader-noise materials.", status: "planned" },
  { slug: "model-viewer", name: "Model Viewer", category: "3D & Shaders", description: "Interactive glTF product viewer with studio lighting.", status: "planned" },

  {
    slug: "magnetic-button",
    name: "Magnetic Button",
    category: "Buttons & CTAs",
    description:
      "Pulled toward the cursor inside an invisible radius; the label drifts slightly further than the body for two-layer parallax, then releases on a weighted spring.",
    status: "ready",
    source: "buttons/magnetic-button.tsx",
    importPath: "gleam-ui/buttons",
    exportName: "MagneticButton",
    controls: [
      { prop: "variant", type: "select", options: ["solid", "outline", "ghost"], defaultValue: "solid" },
      { prop: "strength", type: "range", min: 0, max: 1, step: 0.05, defaultValue: 0.35 },
      { prop: "radius", type: "range", min: 20, max: 240, step: 10, defaultValue: 90 },
      { prop: "speed", type: "range", min: 0.3, max: 3, step: 0.1, defaultValue: 1 },
    ],
    props: [
      { prop: "strength", type: "number", default: "0.35", description: "Pull toward the cursor, 0–1." },
      { prop: "radius", type: "number", default: "90", description: "Attraction radius in px beyond the button edge." },
      { prop: "speed", type: "number", default: "1", description: "Spring responsiveness." },
      { prop: "variant", type: '"solid" | "outline" | "ghost"', default: '"solid"', description: "Visual style." },
      { prop: "...rest", type: "ButtonHTMLAttributes", description: "All native button props pass through." },
    ],
  },
  {
    slug: "shine-button",
    name: "Shine Button",
    category: "Buttons & CTAs",
    description:
      "A periodic light sweep across a premium CTA, or a rotating gradient border. Restrained by design — one sheen, long interval, no rainbow.",
    status: "ready",
    source: "buttons/shine-button.tsx",
    importPath: "gleam-ui/buttons",
    exportName: "ShineButton",
    controls: [
      { prop: "variant", type: "select", options: ["solid", "border"], defaultValue: "solid" },
      { prop: "mode", type: "select", options: ["auto", "hover", "off"], defaultValue: "auto" },
      { prop: "speed", type: "range", min: 0.8, max: 8, step: 0.1, defaultValue: 2.8 },
    ],
    props: [
      { prop: "variant", type: '"solid" | "border"', default: '"solid"', description: "Filled CTA with sheen, or gradient border ring." },
      { prop: "mode", type: '"auto" | "hover" | "off"', default: '"auto"', description: "When the sheen sweeps." },
      { prop: "speed", type: "number", default: "2.8", description: "Seconds per sweep." },
      { prop: "asChild", type: "boolean", default: "false", description: "Render the child element instead (Radix Slot) — e.g. a Next.js Link." },
    ],
  },
  {
    slug: "theme-toggle",
    name: "Theme Toggle",
    category: "Buttons & CTAs",
    description:
      "Icon-morph light/dark toggle — the sun's core scales into the moon while a masking circle carves the crescent and the rays collapse. Wired to the Viridian ThemeProvider.",
    status: "ready",
    source: "theme/theme-toggle.tsx",
    importPath: "gleam-ui/theme",
    exportName: "ThemeToggle",
    controls: [
      { prop: "size", type: "range", min: 12, max: 48, step: 2, defaultValue: 18 },
      { prop: "speed", type: "range", min: 0.3, max: 3, step: 0.1, defaultValue: 1 },
    ],
    props: [
      { prop: "size", type: "number", default: "18", description: "Icon size in px." },
      { prop: "speed", type: "number", default: "1", description: "Morph speed multiplier." },
      { prop: "className", type: "string", description: "Extra classes for the button." },
    ],
  },
  {
    slug: "theme-toggles",
    name: "Theme Toggle Set",
    category: "Buttons & CTAs",
    description:
      "Five icon-morph light/dark switches — half-moon spin, eclipse, dotted rays, lightbulb filament, crescent slide — all wired to the Viridian ThemeProvider so they flip the real site theme. Adapted from toggles.dev, rebuilt with Framer Motion.",
    status: "ready",
    source: "theme/theme-toggles.tsx",
    importPath: "gleam-ui/theme",
    exportName: "ThemeToggleHalf … ThemeToggleCrescent",
    controls: [
      { prop: "size", type: "range", min: 32, max: 80, step: 4, defaultValue: 48 },
      { prop: "speed", type: "range", min: 0.15, max: 1, step: 0.05, defaultValue: 0.35 },
    ],
    props: [
      { prop: "className", type: "string", description: "Size/spacing utilities for the button." },
      { prop: "speed", type: "number", default: "0.35", description: "Morph duration in seconds." },
      { prop: "exports", type: "5 components", description: "ThemeToggleHalf, ThemeToggleEclipse, ThemeToggleDotted, ThemeToggleBulb, ThemeToggleCrescent." },
    ],
  },
  { slug: "icon-morph-button", name: "Icon-morph Button", category: "Buttons & CTAs", description: "Generic two-state SVG morph button.", status: "planned" },

  {
    slug: "tilt-card",
    name: "Tilt Card",
    category: "Cards",
    description:
      "Tilts toward the cursor on a weighted spring with a moving glare highlight. Content sits on its own transform layer, so it reads as a physical object.",
    status: "ready",
    source: "cards/tilt-card.tsx",
    importPath: "gleam-ui/cards",
    exportName: "TiltCard",
    controls: [
      { prop: "maxTilt", type: "range", min: 2, max: 30, step: 1, defaultValue: 12 },
      { prop: "scale", type: "range", min: 1, max: 1.15, step: 0.01, defaultValue: 1.02 },
      { prop: "glare", type: "range", min: 0, max: 0.6, step: 0.02, defaultValue: 0.18 },
      { prop: "speed", type: "range", min: 0.3, max: 3, step: 0.1, defaultValue: 1 },
      { prop: "perspective", type: "range", min: 400, max: 2000, step: 50, defaultValue: 900 },
      { prop: "depth", type: "boolean", defaultValue: true },
    ],
    props: [
      { prop: "maxTilt", type: "number", default: "10", description: "Maximum tilt in degrees per axis." },
      { prop: "scale", type: "number", default: "1.02", description: "Scale while hovered." },
      { prop: "glare", type: "number", default: "0.18", description: "Glare strength 0–1; 0 removes the layer." },
      { prop: "speed", type: "number", default: "1", description: "Spring responsiveness." },
      { prop: "perspective", type: "number", default: "900", description: "CSS perspective in px — lower is more dramatic." },
      { prop: "depth", type: "boolean", default: "true", description: "Lift children with translateZ for real parallax." },
    ],
  },
  {
    slug: "spotlight-card",
    name: "Spotlight Card",
    category: "Cards",
    description:
      "A soft radial light follows the cursor across the surface, brightening the border as it passes. CSS custom properties updated outside React — 60fps on a full grid.",
    status: "ready",
    source: "cards/spotlight-card.tsx",
    importPath: "gleam-ui/cards",
    exportName: "SpotlightCard",
    controls: [
      { prop: "radius", type: "range", min: 100, max: 700, step: 20, defaultValue: 320 },
      { prop: "intensity", type: "range", min: 0.1, max: 1, step: 0.05, defaultValue: 0.5 },
      { prop: "mode", type: "select", options: ["hover", "always"], defaultValue: "hover" },
      { prop: "borderGlow", type: "boolean", defaultValue: true },
    ],
    props: [
      { prop: "radius", type: "number", default: "320", description: "Spotlight radius in px." },
      { prop: "intensity", type: "number", default: "0.5", description: "Peak light strength, 0–1." },
      { prop: "color", type: "string", default: "var(--vd-glow)", description: "Spotlight color." },
      { prop: "mode", type: '"hover" | "always"', default: '"hover"', description: "Light on hover only, or always on." },
      { prop: "borderGlow", type: "boolean", default: "true", description: "Brighten the border near the cursor." },
    ],
  },
  {
    slug: "image-tilt-card",
    name: "Image Tilt Card",
    category: "Cards",
    description:
      "A photo that behaves like a physical print — tilts toward the cursor on weighted springs, the image scales subtly, and a caption trails the pointer, leaning into its direction of travel.",
    status: "ready",
    source: "cards/image-tilt-card.tsx",
    importPath: "gleam-ui/cards",
    exportName: "ImageTiltCard",
    controls: [
      { prop: "caption", type: "text", defaultValue: "Viridian — deep forest" },
      { prop: "size", label: "size (px)", type: "range", min: 200, max: 420, step: 10, defaultValue: 300 },
      { prop: "maxTilt", type: "range", min: 2, max: 30, step: 1, defaultValue: 12 },
      { prop: "scale", type: "range", min: 1, max: 1.3, step: 0.01, defaultValue: 1.08 },
      { prop: "speed", type: "range", min: 0.3, max: 3, step: 0.1, defaultValue: 1 },
    ],
    props: [
      { prop: "src", type: "string", description: "Image source." },
      { prop: "alt", type: "string", description: "Image alt text." },
      { prop: "caption", type: "string", description: "Caption that trails the cursor. Omit to disable." },
      { prop: "overlay", type: "ReactNode", description: "Rendered on top of the image — a name plate, a badge." },
      { prop: "width / height", type: "number | string", default: "300", description: "Card dimensions." },
      { prop: "maxTilt", type: "number", default: "12", description: "Maximum tilt in degrees per axis." },
      { prop: "scale", type: "number", default: "1.08", description: "Image scale while hovered." },
      { prop: "speed", type: "number", default: "1", description: "Spring responsiveness." },
      { prop: "radiusClassName", type: "string", default: '"rounded-2xl"', description: "Corner radius class for the frame." },
    ],
  },
  { slug: "bento-grid", name: "Bento Grid", category: "Cards", description: "Composable bento layout with per-cell motion.", status: "planned" },
  { slug: "pricing-cards", name: "Pricing Cards", category: "Cards", description: "Stripe-calibre pricing surface: plan toggle, feature comparison, restrained glow.", status: "planned" },

  {
    slug: "grain-overlay",
    name: "Grain Overlay",
    category: "Backgrounds",
    description:
      "Animated film-grain over any section — the subtle texture that separates 'flat web page' from 'printed matter'. SVG turbulence, zero JS per frame.",
    status: "ready",
    source: "backgrounds/grain-overlay.tsx",
    importPath: "gleam-ui/backgrounds",
    exportName: "GrainOverlay",
    stage: "fill",
    controls: [
      { prop: "opacity", type: "range", min: 0, max: 0.35, step: 0.01, defaultValue: 0.14 },
      { prop: "scale", type: "range", min: 0.4, max: 3, step: 0.1, defaultValue: 1 },
      { prop: "animate", type: "boolean", defaultValue: true },
      { prop: "speed", type: "range", min: 0.2, max: 3, step: 0.1, defaultValue: 0.9 },
    ],
    props: [
      { prop: "opacity", type: "number", default: "0.06", description: "Grain strength — keep under 0.1." },
      { prop: "scale", type: "number", default: "1", description: "Noise scale; higher is finer grain." },
      { prop: "animate", type: "boolean", default: "true", description: "Shift the grain like film stock." },
      { prop: "speed", type: "number", default: "0.9", description: "Seconds per shift cycle." },
      { prop: "blend", type: "mix-blend-mode", default: '"overlay"', description: "Blend mode of the grain layer." },
      { prop: "fixed", type: "boolean", default: "false", description: "Cover the viewport instead of the parent." },
    ],
  },
  { slug: "aurora", name: "Aurora", category: "Backgrounds", description: "Slow-moving aurora gradients in the green range.", status: "planned" },
  { slug: "gradient-mesh", name: "Gradient Mesh", category: "Backgrounds", description: "Animated mesh-gradient canvas background.", status: "planned" },

  {
    slug: "info-section",
    name: "Info Section",
    category: "Sections",
    description:
      "A ready-to-drop editorial statement section. Ghost pills mark where the copy will land; as you scroll, each word un-clips left-to-right over its placeholder, scrubbed to the scrollbar. Replace the words, keep the choreography.",
    status: "ready",
    source: "sections/info-section.tsx",
    importPath: "gleam-ui/sections",
    exportName: "InfoSection",
    stage: "scroll",
    remountOnChange: true,
    controls: [
      { prop: "skeleton", type: "boolean", defaultValue: true },
      { prop: "skeletonOpacity", type: "range", min: 0, max: 0.4, step: 0.02, defaultValue: 0.12 },
      { prop: "stagger", type: "range", min: 0.01, max: 0.15, step: 0.01, defaultValue: 0.05 },
    ],
    props: [
      { prop: "paragraphs", type: "ReactNode[][]", description: "One array of words per paragraph — strings or elements. Drop an <InfoBadge> anywhere in the flow." },
      { prop: "skeleton", type: "boolean", default: "true", description: "Show ghost pill placeholders where the words will land." },
      { prop: "skeletonOpacity", type: "number", default: "0.12", description: "Skeleton pill opacity." },
      { prop: "stagger", type: "number", default: "0.05", description: "Seconds between each word inside the scrub window." },
      { prop: "start / end", type: "string", default: '"top 70%" / "top 40%"', description: "ScrollTrigger scrub window per paragraph." },
      { prop: "textClassName", type: "string", description: "Classes for the copy — size, weight, color." },
      { prop: "children", type: "ReactNode", description: "Rendered after the copy — a CTA, a link." },
    ],
  },
  { slug: "hero-section", name: "Hero Section", category: "Sections", description: "Full hero: shader background, pressure headline, reveal subcopy, CTAs.", status: "planned" },
  { slug: "footer-section", name: "Footer Section", category: "Sections", description: "Editorial footer with magnetic contact CTA.", status: "planned" },

  { slug: "scroll-navbar", name: "Scroll Navbar", category: "Navigation", description: "Navbar that condenses and gains a surface on scroll.", status: "planned" },
  { slug: "mega-menu", name: "Mega Menu", category: "Navigation", description: "Radix-based mega menu with staggered panel reveal.", status: "planned" },
  { slug: "mobile-drawer", name: "Mobile Drawer", category: "Navigation", description: "Accessible slide-in drawer with spring physics.", status: "planned" },

  {
    slug: "smooth-scroll",
    name: "Smooth Scroll",
    category: "Scroll Effects",
    description:
      "Lenis-powered inertial scrolling for the whole page, wired into GSAP's ticker so ScrollTrigger animations stay frame-accurate. Wrap your app once; respects reduced motion automatically.",
    status: "ready",
    source: "scroll/smooth-scroll.tsx",
    importPath: "gleam-ui/scroll",
    exportName: "SmoothScroll",
    props: [
      { prop: "lerp", type: "number", default: "0.1", description: "Interpolation factor per frame — lower is floatier." },
      { prop: "wheelMultiplier", type: "number", default: "1", description: "Scroll multiplier for mouse wheels." },
      { prop: "smoothTouch", type: "boolean", default: "false", description: "Smooth touch scrolling too (usually leave off)." },
      { prop: "gsapSync", type: "boolean", default: "true", description: "Keep GSAP ScrollTrigger in sync with Lenis." },
      { prop: "useLenis()", type: "hook", description: "Returns the live Lenis instance anywhere under the provider." },
    ],
  },
  { slug: "scatter-gallery", name: "Scatter Gallery", category: "Scroll Effects", description: "Pinned, scrubbed photo scatter/assembly — images fly in from the edges into deliberate layouts.", status: "planned" },
  { slug: "sticky-stack", name: "Sticky Stack", category: "Scroll Effects", description: "Pinned card stack that splits, gaps, and flips on scroll.", status: "planned" },
  { slug: "clip-reveal", name: "Clip Reveal", category: "Scroll Effects", description: "Scroll-driven polygon clip-path image reveals.", status: "planned" },

  {
    slug: "loading-screen",
    name: "Loading Screen",
    category: "Loaders & Feedback",
    description:
      "A full-viewport curtain that cycles greetings in different languages, then sweeps away. Mount above your page, unmount in onComplete. Respects reduced motion by exiting almost immediately.",
    status: "ready",
    source: "overlays/loading-screen.tsx",
    importPath: "gleam-ui/overlays",
    exportName: "LoadingScreen",
    controls: [
      { prop: "exit", type: "select", options: ["up", "down", "fade"], defaultValue: "up" },
      { prop: "wordDuration", type: "range", min: 0.1, max: 0.5, step: 0.02, defaultValue: 0.22 },
    ],
    props: [
      { prop: "onComplete", type: "() => void", description: "Called when the exit finishes — unmount the component here." },
      { prop: "words", type: "string[]", default: "multilingual greetings", description: "Words cycled while loading." },
      { prop: "wordDuration", type: "number", default: "0.22", description: "Seconds each word is held." },
      { prop: "exit", type: '"up" | "down" | "fade"', default: '"up"', description: "How the curtain leaves." },
      { prop: "exitDuration", type: "number", default: "0.8", description: "Exit duration in seconds." },
      { prop: "children", type: "ReactNode", description: "Renders under the cycling word — a logo mark, a hint." },
    ],
  },
  { slug: "skeleton-shimmer", name: "Skeleton Shimmer", category: "Loaders & Feedback", description: "Token-driven skeleton with a restrained sheen.", status: "planned" },
  { slug: "toast", name: "Toast", category: "Loaders & Feedback", description: "Radix-based toast with spring entrance.", status: "planned" },
];

export const readyEntries = registry.filter((e) => e.status === "ready");

export function getEntry(slug: string) {
  return registry.find((e) => e.slug === slug);
}

export function byCategory() {
  return CATEGORIES.map((category) => ({
    category,
    items: registry.filter((e) => e.category === category),
  }));
}
