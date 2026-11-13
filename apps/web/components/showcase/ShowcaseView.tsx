"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { defaultValues, getEntry, registry, type ControlValues, type RegistryEntry } from "@/registry";
import { demos } from "@/registry/demos";
import { installCommand } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LivePreview } from "@/components/LivePreview";
import { ControlsPanel } from "./ControlsPanel";
import { ShowcaseWindow, type WindowRect } from "./ShowcaseWindow";

type WindowId = "info" | "code" | "controls";

const WINDOW_TITLES: Record<WindowId, string> = { info: "Details", code: "Source", controls: "Playground" };

function interactionRows(entry: RegistryEntry): [string, string][] {
  const rows: [string, string][] = [];
  if (entry.stage === "scroll") {
    rows.push(["Scroll", "Progress is tied to the scrollbar and reverses when you scroll back up."]);
  } else if (entry.category === "Shaders" || entry.category === "Backgrounds") {
    rows.push(["Pointer", "The field reacts where the cursor moves and settles once it leaves."]);
    rows.push(["Idle", "Keeps moving on its own and stops rendering while off screen."]);
  } else if (entry.category === "Text") {
    rows.push(["Mount", "Plays when it enters the page."]);
    rows.push(["Hover", "Some modes replay or react under the cursor."]);
  } else if (entry.category === "Navigation") {
    rows.push(["Click", "Opens and closes from its trigger with a spatial animation."]);
    rows.push(["Keyboard", "Arrow keys, Enter and Escape are handled."]);
  } else if (entry.category === "Overlays") {
    rows.push(["Mount", "Plays once when mounted, then calls back so you can unmount it."]);
  } else if (entry.category === "Gallery") {
    rows.push(["Drag", "Throw with momentum. Wheel and touch work too."]);
    rows.push(["Hover", "Highlights the item under the cursor."]);
  } else {
    rows.push(["Hover", "Responds to the pointer while it is over the element."]);
    rows.push(["Press", "A short tactile scale on click."]);
  }
  rows.push(["Reduced motion", "Honours prefers-reduced-motion and falls back to a still state."]);
  return rows;
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback((key: string, text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(key);
        window.setTimeout(() => setCopied((current) => (current === key ? null : current)), 1400);
      })
      .catch((error: unknown) => console.warn("Clipboard write failed", error));
  }, []);
  return { copied, copy };
}

function CopyIcon({ isDone }: { isDone: boolean }) {
  return isDone ? (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 5 5 9-10" />
    </svg>
  ) : (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h8" />
    </svg>
  );
}

function ToolbarButton({
  label,
  isActive,
  onClick,
  buttonRef,
  children,
}: {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  buttonRef?: (node: HTMLButtonElement | null) => void;
  children: ReactNode;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      title={label}
      aria-pressed={isActive}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150 active:scale-95 ${
        isActive ? "bg-accent text-accent-fg" : "text-ink-muted hover:bg-surface-2 hover:text-ink"
      }`}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

function ComponentList({ activeSlug, onNavigate }: { activeSlug: string; onNavigate: () => void }) {
  const [hovered, setHovered] = useState<{ entry: RegistryEntry; y: number } | null>(null);

  return (
    <>
      <div className="vd-scroll relative h-full overflow-y-auto px-7 pb-24 pt-24">
        <p className="mb-6 flex items-center gap-2 text-caption text-ink-faint">
          Sorted by category
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </p>
        <Link
          href="/components"
          onClick={onNavigate}
          className="group mb-4 flex items-center gap-4 text-body-md font-medium text-ink transition-colors hover:text-accent"
        >
          <span className="h-px w-7 bg-line-strong transition-all duration-200 group-hover:w-10 group-hover:bg-accent" />
          All Components
        </Link>
        <ul>
          {registry.map((item, index) => {
            const isActive = item.slug === activeSlug;
            return (
              <li key={item.slug}>
                <Link
                  href={`/components/${item.slug}`}
                  onClick={onNavigate}
                  onMouseEnter={(event) => setHovered({ entry: item, y: event.currentTarget.getBoundingClientRect().top })}
                  onMouseLeave={() => setHovered(null)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex items-center gap-4 py-[7px] text-body-md transition-colors duration-150 ${
                    isActive ? "text-accent" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <span
                    className={`h-px transition-all duration-200 ${
                      isActive ? "w-10 bg-accent" : "w-7 bg-line-strong group-hover:w-10 group-hover:bg-ink"
                    }`}
                  />
                  <span className="font-mono text-caption opacity-60">{String(index + 1).padStart(2, "0")}</span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />
      <AnimatePresence>
        {hovered ? (
          <motion.div
            key={hovered.entry.slug}
            initial={{ opacity: 0, x: -8, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="vd-dotgrid pointer-events-none fixed z-[60] hidden overflow-hidden rounded-xl border border-line bg-bg shadow-vd-2 md:block"
            style={{ left: 400, top: Math.min(Math.max(hovered.y - 70, 16), window.innerHeight - 226), width: 320, height: 210 }}
          >
            <LivePreview entry={hovered.entry} width={915} height={600} scale={0.35} centered={false} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

interface ShowcaseViewProps {
  slug: string;
  code: string;
  codeHtml: string;
  usageHtml: string;
}

export function ShowcaseView({ slug, code, codeHtml, usageHtml }: ShowcaseViewProps) {
  const entry = getEntry(slug)!;
  const Demo = demos[slug];
  const defaults = useMemo(() => defaultValues(entry), [entry]);
  const [values, setValues] = useState<ControlValues>(defaults);
  const [run, setRun] = useState(0);
  const [isListOpen, setIsListOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState<Record<WindowId, boolean>>({ info: false, code: false, controls: false });
  const [order, setOrder] = useState<WindowId[]>(["info", "code", "controls"]);
  const buttons = useRef<Partial<Record<WindowId, HTMLButtonElement | null>>>({});
  const { copied, copy } = useCopy();
  const cli = installCommand(slug);
  const fileLabel = `components/gleam/${slug}.tsx`;
  const lines = code.split("\n").length;
  const dependencies = entry.dependencies.length > 0 ? entry.dependencies : [];
  const manual = `pnpm add ${["react", ...dependencies].join(" ")}`;

  const focusWindow = useCallback((id: WindowId) => {
    setOrder((current) => (current[current.length - 1] === id ? current : [...current.filter((item) => item !== id), id]));
  }, []);

  const setWindow = useCallback((id: WindowId, isOpen: boolean) => {
    setOpenWindows((current) => ({ ...current, [id]: isOpen }));
  }, []);

  const toggleWindow = (id: WindowId) => {
    const isTop = order[order.length - 1] === id;
    if (openWindows[id] && isTop) {
      setWindow(id, false);
      return;
    }
    setWindow(id, true);
    focusWindow(id);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (isListOpen) {
        setIsListOpen(false);
        return;
      }
      const top = [...order].reverse().find((id) => openWindows[id]);
      if (top) setWindow(top, false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isListOpen, order, openWindows, setWindow]);

  const place = (id: WindowId) => (): WindowRect => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const top = 96;
    const height = viewportHeight - top - 24;
    if (viewportWidth < 760) return { x: 12, y: 84, width: viewportWidth - 24, height: viewportHeight - 108 };
    if (id === "controls") return { x: viewportWidth - 404, y: top, width: 380, height: Math.min(700, height) };
    if (id === "code") {
      const width = Math.min(860, Math.round(viewportWidth * 0.56));
      return { x: viewportWidth - width - 24, y: top, width, height };
    }
    return { x: 24, y: top, width: Math.min(620, Math.round(viewportWidth * 0.42)), height };
  };

  if (!Demo) return null;

  const stage =
    entry.stage === "fill" ? (
      <div className={`relative h-screen w-full overflow-hidden ${entry.dark ? "bg-[#080808]" : ""}`}>
        <Demo key={run} values={values} />
      </div>
    ) : entry.stage === "center" ? (
      <div className="vd-dotgrid relative flex h-screen w-full items-center justify-center overflow-hidden p-6 sm:p-16">
        <Demo key={run} values={values} />
      </div>
    ) : (
      <div>
        <section className="flex h-screen flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="text-caption-upper uppercase text-accent">{entry.category}</p>
          <h1 className="font-display text-[clamp(3rem,9vw,7rem)] leading-none text-ink">{entry.name}</h1>
          <p className="max-w-md text-body-md text-ink-muted">{entry.description}</p>
          <div className="mt-10 flex flex-col items-center gap-3 text-ink-faint">
            <p className="text-caption-upper uppercase">Scroll</p>
            <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M12 4v16m0 0-6-6m6 6 6-6" />
              </svg>
            </motion.span>
          </div>
        </section>
        <section className="relative">
          <Demo key={run} values={values} />
        </section>
        <section className="flex h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
          <p className="font-display text-display-sm text-ink">Scrubbed to your scrollbar.</p>
          <p className="max-w-sm text-body-sm text-ink-muted">
            Scroll back up and the animation reverses with you. Open the playground to retune it, or the source to take the file.
          </p>
        </section>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-bg">
      {stage}

      <div className="pointer-events-none fixed bottom-6 left-7 z-40">
        <p className="text-caption-upper uppercase text-ink-faint">{entry.category}</p>
        <p className="mt-1 font-display text-title-lg text-ink">{entry.name}</p>
      </div>

      <div className="fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 md:block">
        <button
          type="button"
          onClick={() => copy("cli", cli)}
          className="flex max-w-[52vw] items-center gap-3 rounded-full border border-line bg-surface py-2 pl-4 pr-2 font-mono text-[12px] text-ink-muted shadow-vd-1 transition-colors hover:border-line-strong hover:text-ink"
        >
          <span className="text-accent">$</span>
          <span className="truncate">{cli}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-ink">
            <CopyIcon isDone={copied === "cli"} />
          </span>
          <span className="sr-only">{copied === "cli" ? "Copied" : "Copy install command"}</span>
        </button>
      </div>

      <div className="fixed left-6 top-6 z-[70] rounded-2xl border border-line bg-surface/90 p-1.5 shadow-vd-1 backdrop-blur-md">
        <ToolbarButton label="All components" isActive={isListOpen} onClick={() => setIsListOpen((open) => !open)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <path d="M9.5 4v16" />
          </svg>
        </ToolbarButton>
      </div>

      <div className="fixed right-6 top-6 z-[70] flex items-center gap-0.5 rounded-2xl border border-line bg-surface/90 p-1.5 shadow-vd-1 backdrop-blur-md">
        <ToolbarButton
          label="Details"
          isActive={openWindows.info}
          onClick={() => toggleWindow("info")}
          buttonRef={(node) => {
            buttons.current.info = node;
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          label="Playground controls"
          isActive={openWindows.controls}
          onClick={() => toggleWindow("controls")}
          buttonRef={(node) => {
            buttons.current.controls = node;
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M4 8h10M18 8h2M4 16h2M10 16h10" />
            <circle cx="16" cy="8" r="2" />
            <circle cx="8" cy="16" r="2" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          label="View source"
          isActive={openWindows.code}
          onClick={() => toggleWindow("code")}
          buttonRef={(node) => {
            buttons.current.code = node;
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
          </svg>
        </ToolbarButton>
        <ToolbarButton label="Replay" onClick={() => setRun((count) => count + 1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </ToolbarButton>
        <ThemeToggle className="h-10 w-10" />
        <Link
          href="/components"
          title="Exit to the components grid"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-surface-2 hover:text-ink"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 3v6H3M15 21v-6h6M21 9h-6V3M3 15h6v6" />
          </svg>
          <span className="sr-only">Exit to the components grid</span>
        </Link>
      </div>

      <AnimatePresence>
        {isListOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close component list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsListOpen(false)}
              className="fixed inset-0 z-[65] cursor-default bg-black/20 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 left-0 top-0 z-[66] w-[380px] max-w-[85vw] border-r border-line bg-surface"
            >
              <ComponentList activeSlug={slug} onNavigate={() => setIsListOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <ShowcaseWindow
        title={WINDOW_TITLES.info}
        subtitle={fileLabel}
        isOpen={openWindows.info}
        zIndex={50 + order.indexOf("info")}
        origin={() => buttons.current.info ?? null}
        place={place("info")}
        onFocus={() => focusWindow("info")}
        onClose={() => setWindow("info", false)}
      >
        <div className="px-7 pb-10 pt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">{entry.name}</p>
          <p className="mt-4 text-title-lg font-medium leading-relaxed text-ink">{entry.description}</p>

          <div className="mt-12 flex items-center gap-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">Dependencies</p>
            <button
              type="button"
              onClick={() => copy("deps", manual)}
              title="Copy install command for dependencies"
              className="flex h-6 w-6 items-center justify-center rounded-md text-ink-faint hover:bg-surface-2 hover:text-ink"
            >
              <CopyIcon isDone={copied === "deps"} />
            </button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {["react", ...dependencies].map((name) => (
              <li key={name} className="rounded-lg bg-surface-2 px-3 py-1.5 font-mono text-[12px] text-ink">
                {name}
              </li>
            ))}
          </ul>

          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">Interaction type</p>
          <dl className="mt-3 divide-y divide-line border-y border-line">
            {interactionRows(entry).map(([type, detail]) => (
              <div key={type} className="grid grid-cols-[120px_1fr] gap-4 py-3.5">
                <dt className="text-body-sm font-medium text-ink">{type}</dt>
                <dd className="text-body-sm text-ink-muted">{detail}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">Install</p>
          <button
            type="button"
            onClick={() => copy("info-cli", cli)}
            className="mt-3 flex w-full items-center gap-3 rounded-xl border border-line bg-bg px-4 py-3 text-left font-mono text-[12px] text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            <span className="text-accent">$</span>
            <span className="min-w-0 flex-1 truncate">{cli}</span>
            <CopyIcon isDone={copied === "info-cli"} />
          </button>

          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">Usage</p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-line bg-bg p-4" dangerouslySetInnerHTML={{ __html: usageHtml }} />

          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">Props</p>
          <div className="mt-3 overflow-hidden rounded-xl border border-line">
            <div className="grid grid-cols-[1fr_1fr_80px] gap-3 border-b border-line bg-surface-2 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
              <span>Prop</span>
              <span>Type</span>
              <span>Default</span>
            </div>
            {[...entry.props, { name: "className", type: "string", description: "Classes for the root element." }].map((prop) => (
              <div key={prop.name} className="border-b border-line px-4 py-3 last:border-b-0">
                <div className="grid grid-cols-[1fr_1fr_80px] gap-3 font-mono text-[12px]">
                  <span className="text-ink">{prop.name}</span>
                  <span className="break-words text-accent">{prop.type}</span>
                  <span className="truncate text-ink-faint">{"value" in prop && prop.value !== undefined ? JSON.stringify(prop.value) : "none"}</span>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{prop.description}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">File</p>
          <p className="mt-3 font-mono text-[12px] text-ink">
            {fileLabel} <span className="text-ink-faint">· {lines} lines · one file, no wrapper package</span>
          </p>
        </div>
      </ShowcaseWindow>

      <ShowcaseWindow
        title={WINDOW_TITLES.code}
        subtitle={fileLabel}
        isOpen={openWindows.code}
        zIndex={50 + order.indexOf("code")}
        origin={() => buttons.current.code ?? null}
        place={place("code")}
        onFocus={() => focusWindow("code")}
        onClose={() => setWindow("code", false)}
        actions={
          <button
            type="button"
            onClick={() => copy("code", code)}
            className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-ink-muted transition-colors hover:border-line-strong hover:text-ink active:scale-95"
          >
            <CopyIcon isDone={copied === "code"} />
            {copied === "code" ? "Copied" : "Copy"}
          </button>
        }
      >
        <div className="p-5" dangerouslySetInnerHTML={{ __html: codeHtml }} />
      </ShowcaseWindow>

      <ShowcaseWindow
        title={WINDOW_TITLES.controls}
        subtitle={entry.name}
        isOpen={openWindows.controls}
        zIndex={50 + order.indexOf("controls")}
        origin={() => buttons.current.controls ?? null}
        place={place("controls")}
        onFocus={() => focusWindow("controls")}
        onClose={() => setWindow("controls", false)}
      >
        <div className="p-6">
          <ControlsPanel
            specs={entry.props}
            values={values}
            onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))}
            onReset={() => {
              setValues(defaults);
              setRun((count) => count + 1);
            }}
          />
        </div>
      </ShowcaseWindow>
    </div>
  );
}
