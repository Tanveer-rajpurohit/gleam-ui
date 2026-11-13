"use client";

import type { ControlValue, ControlValues, PropSpec } from "@/registry";

interface ControlsPanelProps {
  specs: PropSpec[];
  values: ControlValues;
  onChange: (name: string, value: ControlValue) => void;
  onReset: () => void;
}

export function ControlsPanel({ specs, values, onChange, onReset }: ControlsPanelProps) {
  const controls = specs.filter((prop) => prop.control);

  return (
    <div className="text-left">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-caption-upper uppercase text-ink-faint">Playground</p>
        <button
          type="button"
          onClick={onReset}
          className="rounded border border-line px-2.5 py-1 text-[11px] font-medium text-ink-muted transition-colors duration-150 hover:border-line-strong hover:text-ink active:scale-95"
        >
          Reset
        </button>
      </div>

      {controls.length === 0 ? (
        <p className="text-body-sm text-ink-muted">This one is driven by props in code. Interact with the stage.</p>
      ) : null}

      <div className="grid gap-y-5">
        {controls.map((prop) => {
          const control = prop.control!;
          const value = values[prop.name];

          if (control.type === "range") {
            return (
              <label key={prop.name} className="block">
                <span className="flex items-baseline justify-between text-caption text-ink-muted">
                  <span className="font-mono">{prop.name}</span>
                  <span className="font-mono text-[11px] text-accent">{Number(value)}</span>
                </span>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={Number(value)}
                  onChange={(event) => onChange(prop.name, Number(event.target.value))}
                  className="vd-range mt-2 w-full"
                />
              </label>
            );
          }

          if (control.type === "select") {
            return (
              <div key={prop.name}>
                <p className="font-mono text-caption text-ink-muted">{prop.name}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {control.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={value === option}
                      onClick={() => onChange(prop.name, option)}
                      className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors duration-150 ${
                        value === option
                          ? "border-accent bg-accent-soft text-accent-strong"
                          : "border-line text-ink-muted hover:border-line-strong hover:text-ink"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          if (control.type === "boolean") {
            return (
              <div key={prop.name} className="flex items-center justify-between gap-4">
                <span className="font-mono text-caption text-ink-muted">{prop.name}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={Boolean(value)}
                  aria-label={prop.name}
                  onClick={() => onChange(prop.name, !value)}
                  className={`relative h-5 w-9 rounded-full border transition-colors duration-200 ${
                    value ? "border-accent bg-accent" : "border-line bg-surface-2"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-0.5 h-3.5 w-3.5 rounded-full bg-bg transition-transform duration-200 ${
                      value ? "translate-x-[18px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            );
          }

          if (control.type === "color") {
            return (
              <label key={prop.name} className="flex items-center justify-between gap-4">
                <span className="font-mono text-caption text-ink-muted">{prop.name}</span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-ink-faint">{String(value)}</span>
                  <input
                    type="color"
                    value={String(value)}
                    onChange={(event) => onChange(prop.name, event.target.value)}
                    className="h-6 w-9 cursor-pointer rounded border border-line bg-transparent p-0.5"
                  />
                </span>
              </label>
            );
          }

          return (
            <label key={prop.name} className="block">
              <span className="font-mono text-caption text-ink-muted">{prop.name}</span>
              <input
                type="text"
                value={String(value)}
                maxLength={40}
                onChange={(event) => onChange(prop.name, event.target.value)}
                className="mt-2 w-full rounded-md border border-line bg-bg px-3 py-2 font-mono text-code text-ink"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
