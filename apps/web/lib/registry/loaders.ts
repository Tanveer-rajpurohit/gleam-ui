import { RegistryEntry } from "./types";

export const loaderComponents: RegistryEntry[] = [
  {
    slug: "loading-screen",
    name: "Loading Screen",
    category: "Loaders & Feedback",
    description: "A full-viewport curtain that cycles greetings in different languages, then sweeps away.",
    status: "ready",
    source: "overlays/loading-screen.tsx",
    importPath: "gleam-ui/overlays",
    exportName: "LoadingScreen",
    controls: [
      { prop: "exit", type: "select", options: ["up", "down", "fade"], defaultValue: "up" },
    ],
    props: [
      { prop: "wordDuration", type: "number", default: "0.22", description: "Seconds each word is held." },
    ],
  },
  { 
    slug: "skeleton-shimmer", 
    name: "Skeleton Shimmer", 
    category: "Loaders & Feedback", 
    description: "Token-driven skeleton with a restrained sheen.", 
    status: "planned",
    controls: []
  }
];
