import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEntry, registry } from "@/registry";
import { highlight, readComponentSource } from "@/lib/highlight";
import { SITE_URL, installCommand } from "@/lib/site";
import { ShowcaseView } from "@/components/showcase/ShowcaseView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return registry.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  return {
    title: `${entry.name} showcase`,
    description: entry.description,
    alternates: { canonical: `/components/${entry.slug}` },
    openGraph: { title: `${entry.name} | Gleam UI`, description: entry.description, url: `/components/${entry.slug}` },
  };
}

export default async function ComponentShowcasePage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const code = await readComponentSource(entry.slug);
  const usage = `import { ${entry.exportName} } from "@/components/gleam/${entry.slug}";\n\n${entry.usage}`;
  const [codeHtml, usageHtml] = await Promise.all([highlight(code, "tsx"), highlight(usage, "tsx")]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: entry.name,
    description: entry.description,
    programmingLanguage: "TypeScript",
    runtimePlatform: "React",
    codeRepository: SITE_URL,
    url: `${SITE_URL}/components/${entry.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article className="sr-only">
        <h1>{entry.name}</h1>
        <p>{entry.description}</p>
        <p>Install with {installCommand(entry.slug)}</p>
        <h2>Props</h2>
        <ul>
          {entry.props.map((prop) => (
            <li key={prop.name}>
              {prop.name} ({prop.type}): {prop.description}
            </li>
          ))}
        </ul>
      </article>
      <ShowcaseView slug={entry.slug} code={code} codeHtml={codeHtml} usageHtml={usageHtml} />
    </>
  );
}
