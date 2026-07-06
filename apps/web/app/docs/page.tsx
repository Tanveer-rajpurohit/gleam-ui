import { CodeBlock } from "@/components/utils/CodeBlock";
import { highlight } from "@/lib/highlight";

export default async function DocsPage() {
  const npmInstall = "npm install gleam-ui";
  const npmInstallHtml = await highlight(npmInstall, "bash");

  const quickStart = `import { ThemeProvider } from "gleam-ui/theme";
import "gleam-ui/styles";

export default function App({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}`;
  const quickStartHtml = await highlight(quickStart, "tsx");

  const peerDeps = "npm install framer-motion gsap @gsap/react three @react-three/fiber";
  const peerDepsHtml = await highlight(peerDeps, "bash");

  return (
    <div className="max-w-3xl">
      <p className="text-caption-upper uppercase text-accent">
        Documentation
      </p>
      <h1 className="mt-3 font-display text-display-lg text-ink">
        Getting started
      </h1>
      <p className="mt-4 text-body-md text-ink-muted">
        Gleam UI is a motion-first React component library built on the Viridian design
        system. Every component is animated, accessible, and production-ready.
      </p>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="font-display text-display-sm text-ink mb-3">Installation</h2>
          <CodeBlock code={npmInstall} html={npmInstallHtml} language="bash" />
        </section>

        <section>
          <h2 className="font-display text-display-sm text-ink mb-3">Quick start</h2>
          <CodeBlock
            code={quickStart}
            html={quickStartHtml}
            language="tsx"
          />
        </section>

        <section>
          <h2 className="font-display text-display-sm text-ink mb-3">Peer dependencies</h2>
          <CodeBlock code={peerDeps} html={peerDepsHtml} language="bash" />
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">
            Only install what you use. Components declare their peer dependency in
            the registry so you know exactly what each one needs.
          </p>
        </section>
      </div>
    </div>
  );
}
