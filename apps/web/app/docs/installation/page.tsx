import type { Metadata } from "next";
import { highlight } from "@/lib/highlight";
import { installCommand } from "@/lib/site";
import { CodeBlock } from "@/components/utils/CodeBlock";
import { DocHeader, DocSection } from "@/components/docs/Prose";

export const metadata: Metadata = {
  title: "Installation",
  description: "Add a Gleam UI component with the shadcn CLI, or copy the file by hand.",
  alternates: { canonical: "/docs/installation" },
};

const USAGE = `import { MagneticButton } from "@/components/gleam/magnetic-button";

export default function Page() {
  return <MagneticButton strength={0.4}>Get started</MagneticButton>;
}`;

export default async function InstallationPage() {
  const cli = installCommand("magnetic-button");
  const manual = "pnpm add gsap @gsap/react";
  const [cliHtml, manualHtml, usageHtml] = await Promise.all([
    highlight(cli, "bash"),
    highlight(manual, "bash"),
    highlight(USAGE, "tsx"),
  ]);

  return (
    <>
      <DocHeader
        title="Installation"
        lead="Components are served in the shadcn registry format, so the shadcn CLI can add them. You can also copy the file yourself."
      />

      <DocSection title="With the CLI">
        <p>
          Your project needs a <code>components.json</code>. If it does not have one, run{" "}
          <code>npx shadcn@latest init</code> first. Then add a component by its URL:
        </p>
        <CodeBlock code={cli} html={cliHtml} />
        <p>
          The file is written to <code>components/gleam/magnetic-button.tsx</code> and any npm dependencies it lists are
          installed.
        </p>
      </DocSection>

      <DocSection title="By hand">
        <p>
          Open the component page, copy the Source block into a file in your project, and install the dependencies shown
          at the top of that page. For a GSAP component that is:
        </p>
        <CodeBlock code={manual} html={manualHtml} />
      </DocSection>

      <DocSection title="Use it">
        <CodeBlock code={USAGE} html={usageHtml} />
        <p>
          Canvas and shader components fill their parent, so give the parent a height. Components never set a font, so
          text effects inherit yours.
        </p>
      </DocSection>
    </>
  );
}
