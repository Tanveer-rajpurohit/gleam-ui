import { RegistryEntry } from "./types";

export const cardComponents: RegistryEntry[] = [
  {
    slug: "tilt-card",
    name: "Tilt Card",
    category: "Cards",
    description: "Tilts toward the cursor on a weighted spring with a moving glare highlight.",
    status: "ready",
    source: "cards/tilt-card.tsx",
    importPath: "gleam-ui/cards",
    exportName: "TiltCard",
    controls: [
      { prop: "maxTilt", type: "range", min: 2, max: 30, step: 1, defaultValue: 12 },
      { prop: "scale", type: "range", min: 1, max: 1.15, step: 0.01, defaultValue: 1.02 },
    ],
    props: [
      { prop: "maxTilt", type: "number", default: "10", description: "Maximum tilt in degrees per axis." },
      { prop: "scale", type: "number", default: "1.02", description: "Scale while hovered." },
    ],
  },
  {
    slug: "spotlight-card",
    name: "Spotlight Card",
    category: "Cards",
    description: "A soft radial light follows the cursor across the surface.",
    status: "ready",
    source: "cards/spotlight-card.tsx",
    importPath: "gleam-ui/cards",
    exportName: "SpotlightCard",
    controls: [
      { prop: "radius", type: "range", min: 100, max: 700, step: 20, defaultValue: 320 },
      { prop: "intensity", type: "range", min: 0.1, max: 1, step: 0.05, defaultValue: 0.5 },
    ],
    props: [
      { prop: "radius", type: "number", default: "320", description: "Spotlight radius in px." },
      { prop: "intensity", type: "number", default: "0.5", description: "Peak light strength, 0–1." },
    ],
  }
];
