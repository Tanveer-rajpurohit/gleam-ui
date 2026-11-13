import { NextResponse } from "next/server";
import { getEntry, registry } from "@/registry";
import { readComponentSource } from "@/lib/highlight";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return registry.map((entry) => ({ name: `${entry.slug}.json` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const entry = getEntry(name.replace(/\.json$/, ""));
  if (!entry) return NextResponse.json({ error: "Unknown component" }, { status: 404 });

  return NextResponse.json({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: entry.slug,
    type: "registry:component",
    title: entry.name,
    description: entry.description,
    dependencies: entry.dependencies,
    files: [
      {
        path: `components/gleam/${entry.slug}.tsx`,
        type: "registry:component",
        content: await readComponentSource(entry.slug),
      },
    ],
  });
}
