import { RegistryEntry } from "./types";

export const backgroundComponents: RegistryEntry[] = [
  {
    slug: "grain-overlay",
    name: "Grain Overlay",
    category: "Backgrounds",
    description: "Animated film-grain over any section. SVG turbulence, zero JS per frame.",
    status: "ready",
    previewImage: "/demos/demo-1.png",
    previewVideo: "/demos/demo-1.mp4",
    source: "backgrounds/grain-overlay.tsx",
    importPath: "gleam-ui/backgrounds",
    exportName: "GrainOverlay",
    stage: "fill",
    controls: [
      { prop: "opacity", type: "range", min: 0, max: 0.35, step: 0.01, defaultValue: 0.14 },
      { prop: "speed", type: "range", min: 0.2, max: 3, step: 0.1, defaultValue: 0.9 },
    ],
    props: [
      { prop: "opacity", type: "number", default: "0.06", description: "Grain strength — keep under 0.1." },
      { prop: "speed", type: "number", default: "0.9", description: "Seconds per shift cycle." },
    ],
  },
];
