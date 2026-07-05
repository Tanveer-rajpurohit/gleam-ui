import { RegistryEntry } from "./types";

export const shaderComponents: RegistryEntry[] = [
  {
    slug: "particle-field",
    name: "Particle Field",
    category: "3D & Shaders",
    description: "A WebGL field of noise-driven particles in the Viridian greens.",
    status: "ready",
    source: "three/particle-field.tsx",
    importPath: "gleam-ui/three",
    exportName: "ParticleField",
    stage: "fill",
    controls: [
      { prop: "count", type: "range", min: 400, max: 6000, step: 100, defaultValue: 2600 },
      { prop: "speed", type: "range", min: 0.1, max: 3, step: 0.1, defaultValue: 1 },
    ],
    props: [
      { prop: "count", type: "number", default: "3200", description: "Number of particles." },
      { prop: "speed", type: "number", default: "1", description: "Drift speed multiplier." },
    ],
  },
  {
    slug: "noise-ink",
    name: "Noise Ink",
    category: "3D & Shaders",
    description: "A domain-warped noise shader rendered as ink, cloud, or contour rings.",
    status: "ready",
    source: "three/noise-ink.tsx",
    importPath: "gleam-ui/three",
    exportName: "NoiseInk",
    stage: "fill",
    controls: [
      { prop: "mode", type: "select", options: ["ink", "cloud", "rings"], defaultValue: "ink" },
      { prop: "speed", type: "range", min: 0.1, max: 4, step: 0.1, defaultValue: 1 },
    ],
    props: [
      { prop: "mode", type: '"ink" | "cloud" | "rings"', default: '"ink"', description: "Thresholded blots, the soft field, or contour lines." },
      { prop: "speed", type: "number", default: "1", description: "Evolution speed multiplier." },
    ],
  }
];
