import { RegistryEntry } from "./types";

export const buttonComponents: RegistryEntry[] = [
  {
    slug: "magnetic-button",
    name: "Magnetic Button",
    category: "Buttons & CTAs",
    description: "Pulled toward the cursor inside an invisible radius.",
    status: "ready",
    previewImage: "/demos/demo-6.png",
    previewVideo: "/demos/demo-6.mp4",
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
];
