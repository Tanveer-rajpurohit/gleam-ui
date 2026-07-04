export default function DocsPage() {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent mb-4">
        Documentation
      </p>
      <h1 className="font-display text-4xl font-medium text-ink mb-4 leading-tight">
        Getting started
      </h1>
      <p className="text-ink-muted text-base leading-relaxed mb-12">
        Gleam UI is a motion-first React component library built on the Viridian design
        system. Every component is animated, accessible, and production-ready.
      </p>

      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-semibold text-ink mb-3">Installation</h2>
          <div className="rounded-xl border border-line bg-code-bg px-5 py-4 font-mono text-sm text-code-text">
            npm install gleam-ui
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink mb-3">Quick start</h2>
          <div className="rounded-xl border border-line bg-code-bg px-5 py-4 font-mono text-sm text-code-text leading-relaxed whitespace-pre">
{`import { ThemeProvider } from "gleam-ui/theme";
import "gleam-ui/styles";

export default function App({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}`}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink mb-3">Peer dependencies</h2>
          <div className="rounded-xl border border-line bg-code-bg px-5 py-4 font-mono text-sm text-code-text">
            npm install framer-motion gsap @gsap/react three @react-three/fiber
          </div>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            Only install what you use. Components declare their peer dependency in
            the registry so you know exactly what each one needs.
          </p>
        </section>
      </div>
    </div>
  );
}
