import { RegistryEntry } from "./types";

export const cardComponents: RegistryEntry[] = [
  {
    slug: "tilt-card",
    name: "Tilt Card",
    category: "Cards",
    description: "Tilts toward the cursor on a weighted spring with a moving glare highlight.",
    status: "ready",
    previewImage: "/demos/demo-3.png",
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
];
