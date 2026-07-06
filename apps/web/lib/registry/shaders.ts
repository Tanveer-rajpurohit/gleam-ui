import { RegistryEntry } from "./types";

export const shaderComponents: RegistryEntry[] = [
  {
    slug: "particle-field",
    name: "Particle Field",
    category: "3D & Shaders",
    description: "A WebGL field of noise-driven particles that parts around the cursor.",
    status: "ready",
    previewImage: "/demos/demo-4.png",
    previewVideo: "/demos/demo-4.mp4",
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
    previewImage: "/demos/demo-5.png",
    previewVideo: "/demos/demo-5.mp4",
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
  },
];
