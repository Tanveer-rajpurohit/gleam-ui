import type { Metadata } from "next";
import { highlight } from "@/lib/highlight";
import { CodeBlock } from "@/components/utils/CodeBlock";
import { DocHeader, DocSection } from "@/components/docs/Prose";

export const metadata: Metadata = {
  title: "Theming",
  description: "How Gleam UI components take colour, type and reduced-motion settings from your project.",
  alternates: { canonical: "/docs/theming" },
};

const COLOURS = `<LiquidChrome tint="#3b82f6" />
<DitherWave front="#f5f5f4" back="#0c0a09" />
<div className="text-emerald-600">
  <DotField />
</div>`;

const DARK = `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));`;

export default async function ThemingPage() {
  const [coloursHtml, darkHtml] = await Promise.all([highlight(COLOURS, "tsx"), highlight(DARK, "css")]);

  return (
    <>
      <DocHeader
        title="Theming"
        lead="Components do not ship a theme. They take colours as props or inherit them, and they use whatever font the surrounding text uses."
      />

      <DocSection title="Colour">
        <p>
          Shader and canvas components accept hex colours as props. Dot Field draws in <code>currentColor</code>, so a
          text colour class on the parent is enough.
        </p>
        <CodeBlock code={COLOURS} html={coloursHtml} />
      </DocSection>

      <DocSection title="Dark mode">
        <p>
          DOM components such as Mac Window and Glide Select use the Tailwind <code>dark:</code> variant. If your site
          switches theme with a <code>data-theme</code> attribute, as this one does, point the variant at it:
        </p>
        <CodeBlock code={DARK} html={darkHtml} />
      </DocSection>

      <DocSection title="Type">
        <p>
          Nothing sets a <code>font-family</code>. Pressure Text animates the <code>wght</code> axis, so it needs a
          variable font. This site pairs PP Neue Montreal with Kode Mono, and Kode Mono is the variable one used in that
          demo.
        </p>
      </DocSection>

      <DocSection title="Reduced motion">
        <p>
          When the visitor has reduced motion turned on, looping effects render a still frame, entrance animations jump
          to their end state, and pointer-driven effects such as Magnetic Button do nothing. You do not need to pass a
          prop for this.
        </p>
      </DocSection>
    </>
  );
}
