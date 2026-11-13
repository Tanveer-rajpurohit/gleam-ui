import type { Metadata } from "next";
import Link from "next/link";
import { registry } from "@/registry";
import { DocHeader, DocSection } from "@/components/docs/Prose";

export const metadata: Metadata = {
  title: "Introduction",
  description: "What Gleam UI is, how its components are delivered, and what each one guarantees.",
  alternates: { canonical: "/docs" },
};

export default function DocsPage() {
  const standalone = registry.filter((entry) => entry.dependencies.length === 0).length;

  return (
    <>
      <DocHeader
        title="Introduction"
        lead="Gleam UI is a set of animated React components that you copy into your project as source files. There is no runtime package to install or keep up to date."
      />

      <DocSection title="What you get">
        <p>
          There are <strong>{registry.length} components</strong> today. Each one is a single <code>.tsx</code> file.{" "}
          <strong>{standalone}</strong> depend on React alone, including every shader, which talks to WebGL directly
          instead of going through three.js. The rest use GSAP.
        </p>
        <p>
          Because the file lives in your repo, you can change an easing curve, a duration or a line of GLSL without
          forking anything.
        </p>
      </DocSection>

      <DocSection title="What every component does">
        <ul className="list-disc space-y-2 pl-5">
          <li>Takes a <code>className</code> and sizes itself to its parent.</li>
          <li>Checks <code>prefers-reduced-motion</code> and holds still or skips the effect when it is set.</li>
          <li>Removes its listeners, animation frames and WebGL context when it unmounts.</li>
          <li>Is marked <code>&quot;use client&quot;</code>, so it can be imported from a server component.</li>
          <li>Pauses its render loop while it is off screen, where it has one.</li>
        </ul>
      </DocSection>

      <DocSection title="Requirements">
        <p>
          React 19 and Tailwind CSS 4. Components that list GSAP need <code>gsap</code> 3.13 or newer and{" "}
          <code>@gsap/react</code>. Water Ripple needs WebGL 2.
        </p>
        <p>
          Next:{" "}
          <Link href="/docs/installation" className="text-accent-ink underline underline-offset-4">
            install your first component
          </Link>
          .
        </p>
      </DocSection>
    </>
  );
}
