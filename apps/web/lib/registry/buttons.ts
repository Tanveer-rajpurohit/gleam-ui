import { RegistryEntry } from "./types";

export const buttonComponents: RegistryEntry[] = [
  {
    slug: "magnetic-button",
    name: "Magnetic Button",
    category: "Buttons & CTAs",
    description: "Pulled toward the cursor inside an invisible radius.",
    status: "ready",
    source: "buttons/magnetic-button.tsx",
    importPath: "gleam-ui/buttons",
    exportName: "MagneticButton",
    controls: [
      { prop: "variant", type: "select", options: ["solid", "outline", "ghost"], defaultValue: "solid" },
      { prop: "strength", type: "range", min: 0, max: 1, step: 0.05, defaultValue: 0.35 },
    ],
    props: [
      { prop: "strength", type: "number", default: "0.35", description: "Pull toward the cursor, 0–1." },
      { prop: "variant", type: '"solid" | "outline" | "ghost"', default: '"solid"', description: "Visual style." },
    ],
  },
  {
    slug: "shine-button",
    name: "Shine Button",
    category: "Buttons & CTAs",
    description: "A periodic light sweep across a premium CTA, or a rotating gradient border.",
    status: "ready",
    source: "buttons/shine-button.tsx",
    importPath: "gleam-ui/buttons",
    exportName: "ShineButton",
    controls: [
      { prop: "variant", type: "select", options: ["solid", "border"], defaultValue: "solid" },
      { prop: "speed", type: "range", min: 0.8, max: 8, step: 0.1, defaultValue: 2.8 },
    ],
    props: [
      { prop: "variant", type: '"solid" | "border"', default: '"solid"', description: "Filled CTA with sheen, or gradient border ring." },
      { prop: "speed", type: "number", default: "2.8", description: "Seconds per sweep." },
    ],
  }
];
