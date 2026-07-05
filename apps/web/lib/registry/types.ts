import type { ComponentType } from "react";

export interface PropRow {
  prop: string;
  type: string;
  default?: string;
  description: string;
}

export type DemoProps = Record<string, unknown>;

export interface Control {
  label?: string;
  prop: string;
  type: "range" | "select" | "boolean" | "color" | "text";
  defaultValue: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export type ControlValues = Record<string, string | number | boolean>;

export interface RegistryEntry {
  slug: string;
  name: string;
  category: string;
  description: string;
  status: "ready" | "planned";

  source?: string;
  importPath?: string;
  exportName?: string;

  demo?: ComponentType<DemoProps>;
  controls?: Control[];
  remountOnChange?: boolean;

  stage?: "center" | "fill" | "scroll";
  previewVideo?: string;
  previewImage?: string;

  props?: PropRow[];
}

export const CATEGORIES = [
  "Text Animations",
  "3D & Shaders",
  "Buttons & CTAs",
  "Cards",
  "Backgrounds",
  "Loaders & Feedback",
] as const;
