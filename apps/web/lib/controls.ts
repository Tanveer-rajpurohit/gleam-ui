import { Control, ControlValues } from "./registry/types";

export function controlDefaults(controls: Control[] | undefined): ControlValues {
  const values: ControlValues = {};
  for (const c of controls ?? []) values[c.prop] = c.defaultValue;
  return values;
}
