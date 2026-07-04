import { CodeBlock } from "@/components/CodeBlock";

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
          <CodeBlock code="npm install gleam-ui" />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink mb-3">Quick start</h2>
          <CodeBlock
            language="tsx"
            code={`import { ThemeProvider } from "gleam-ui/theme";
import "gleam-ui/styles";

export default function App({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}`}
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink mb-3">Peer dependencies</h2>
          <CodeBlock code="npm install framer-motion gsap @gsap/react three @react-three/fiber" />
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            Only install what you use. Components declare their peer dependency in
            the registry so you know exactly what each one needs.
          </p>
        </section>
      </div>
    </div>
  );
}
