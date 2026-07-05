import { highlight } from "@/lib/highlight";

const TOKENS = `:root, [data-theme="light"] {
  --gl-bg: var(--white-premium);        /* #fefdf4 — warm parchment, never #fff */
  --gl-surface: var(--surface-light);
  --gl-text: #2c2c28;
  --gl-accent: var(--mist-400);         /* #819bb9 — dusty mist blue */
  --gl-glow: rgba(129, 155, 185, 0.2);
}

[data-theme="dark"] {
  --gl-bg: var(--black-premium);        /* #09090b — near black, never #000 */
  --gl-surface: var(--surface-dark);
  --gl-text: #e8e6d8;
  --gl-accent: var(--mist-300);         /* #a3b5cc — moonlit mist */
  --gl-glow: rgba(163, 181, 204, 0.15);
}`;

const OVERRIDE = `/* Rebrand without touching a component: override the tokens. */
[data-theme="dark"] {
  --gl-accent: #c9a86a;      /* switch the accent to brass */
  --gl-glow: rgba(201, 168, 106, 0.25);
}`;

const HOOK = `import { useTheme } from "gleam-ui/theme";

function Toolbar() {
  const { theme, preference, setTheme, toggle } = useTheme();
  return <button onClick={toggle}>Now: {theme}</button>;
}`;

export const metadata = { title: "Theming" };

export default async function ThemingPage() {
  const [tokensHtml, overrideHtml, hookHtml] = await Promise.all([
    highlight(TOKENS, "css"),
    highlight(OVERRIDE, "css"),
    highlight(HOOK, "tsx"),
  ]);

  const swatches = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  return (
    <article className="max-w-3xl">
      <p className="text-caption-upper uppercase text-accent">Documentation</p>
      <h1 className="mt-3 font-display text-display-lg text-ink">Theming</h1>
      <p className="mt-4 text-body-md text-ink-muted">
        Every component reads CSS variables, never raw hex. Light and dark are two
        sets of token values on <code className="font-mono text-code text-accent">data-theme</code>,
        so switching themes — or rebranding entirely — is a token override, not a rebuild.
      </p>

      <h2 className="mt-12 font-display text-display-sm text-ink">The mist scale</h2>
      <p className="mt-3 text-body-md text-ink-muted">
        A dusty, desaturated blue ramp on warm parchment — premium stationery, not
        SaaS-dashboard blue. Mist is the single accent: CTAs, active states, glow.
        Never painted everywhere.
      </p>
      <div className="mt-5 flex overflow-hidden rounded-lg border border-line">
        {swatches.map((stop) => (
          <div
            key={stop}
            className="group relative h-20 flex-1"
            style={{ background: `var(--mist-${stop})` }}
          >
            <span
              className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[10px]"
              style={{ color: stop >= 400 ? "var(--white-premium)" : "var(--mist-900)" }}
            >
              {stop}
            </span>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-display-sm text-ink">Semantic tokens</h2>
      <div
        className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface p-5"
        dangerouslySetInnerHTML={{ __html: tokensHtml }}
      />

      <h2 className="mt-12 font-display text-display-sm text-ink">Override to rebrand</h2>
      <div
        className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface p-5"
        dangerouslySetInnerHTML={{ __html: overrideHtml }}
      />

      <h2 className="mt-12 font-display text-display-sm text-ink">useTheme</h2>
      <div
        className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface p-5"
        dangerouslySetInnerHTML={{ __html: hookHtml }}
      />

      <h2 className="mt-12 font-display text-display-sm text-ink">Typography</h2>
      <p className="mt-3 text-body-md text-ink-muted">
        Two-typeface editorial system: EB Garamond for display (the brand voice),
        Inter for body and UI, JetBrains Mono for code. The full scale ships as
        Tailwind <code className="font-mono text-code text-accent">fontSize</code> tokens —
        <code className="font-mono text-code text-accent"> text-display-xl</code> through{" "}
        <code className="font-mono text-code text-accent">text-caption-upper</code>.
      </p>
      <div className="mt-5 space-y-4 rounded-lg border border-line p-6">
        <p className="font-display text-display-md text-ink">Display — EB Garamond</p>
        <p className="text-title-md text-ink">Title — Inter Medium</p>
        <p className="text-body-md text-ink-muted">
          Body — Inter Regular at a comfortable 1.55 line height for long-form reading.
        </p>
        <p className="font-mono text-code text-ink-muted">code — JetBrains Mono</p>
        <p className="text-caption-upper uppercase text-ink-faint">Caption upper — tracked wide</p>
      </div>
    </article>
  );
}
