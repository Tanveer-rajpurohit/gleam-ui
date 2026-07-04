interface ControlBase {
  prop: string;
  label?: string;
}

export type Control = ControlBase &
  (
    | { type: "range"; min: number; max: number; step?: number; defaultValue: number }
    | { type: "select"; options: string[]; defaultValue: string }
    | { type: "boolean"; defaultValue: boolean }
    | { type: "color"; defaultValue: string }
    | { type: "text"; defaultValue: string }
  );

export type ControlValues = Record<string, string | number | boolean>;

export function controlDefaults(controls: Control[] | undefined): ControlValues {
  const values: ControlValues = {};
  for (const c of controls ?? []) values[c.prop] = c.defaultValue;
  return values;
}
