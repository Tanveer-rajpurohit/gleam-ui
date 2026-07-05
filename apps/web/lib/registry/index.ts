import { CATEGORIES, RegistryEntry } from "./types";
export * from "./types";
import { textComponents } from "./text";
import { shaderComponents } from "./shaders";
import { buttonComponents } from "./buttons";
import { cardComponents } from "./cards";
import { backgroundComponents } from "./backgrounds";
import { loaderComponents } from "./loaders";

export const registry: RegistryEntry[] = [
  ...textComponents,
  ...shaderComponents,
  ...buttonComponents,
  ...cardComponents,
  ...backgroundComponents,
  ...loaderComponents,
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