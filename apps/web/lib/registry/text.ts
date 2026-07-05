import { RegistryEntry } from "./types";

export const textComponents: RegistryEntry[] = [
  {
    slug: "pressure-text",
    name: "Pressure Text",
    category: "Text Animations",
    description: "Variable-font text that gains weight under the cursor.",
    status: "ready",
    source: "text/pressure-text.tsx",
    importPath: "gleam-ui/text",
    exportName: "PressureText",
    controls: [
      { prop: "text", type: "text", defaultValue: "Pressure" },
      { prop: "minWeight", type: "range", min: 100, max: 700, step: 10, defaultValue: 400 },
      { prop: "maxWeight", type: "range", min: 400, max: 900, step: 10, defaultValue: 800 },
    ],
    props: [
      { prop: "text", type: "string", description: "The text to render." },
      { prop: "minWeight", type: "number", default: "340", description: "Variable-font weight at rest." },
      { prop: "maxWeight", type: "number", default: "800", description: "Weight under full pressure." },
    ],
  },
  {
    slug: "scramble-text",
    name: "Scramble Text",
    category: "Text Animations",
    description: "Characters flicker through a glyph pool and settle left-to-right.",
    status: "ready",
    source: "text/scramble-text.tsx",
    importPath: "gleam-ui/text",
    exportName: "ScrambleText",
    remountOnChange: true,
    controls: [
      { prop: "text", type: "text", defaultValue: "Signal restored." },
      { prop: "speed", type: "range", min: 0.2, max: 3, step: 0.1, defaultValue: 1 },
    ],
    props: [
      { prop: "text", type: "string", description: "The text to decode into." },
      { prop: "speed", type: "number", default: "1", description: "Decode speed multiplier." },
    ],
  }
];