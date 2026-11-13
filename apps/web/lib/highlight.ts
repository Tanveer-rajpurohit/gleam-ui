import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createHighlighter } from "shiki";

const highlighterPromise = createHighlighter({
  themes: ["vitesse-light", "vitesse-dark"],
  langs: ["tsx", "bash", "css", "json"],
});

export async function highlight(code: string, lang: "tsx" | "bash" | "css" | "json" = "tsx") {
  const highlighter = await highlighterPromise;
  return highlighter.codeToHtml(code, {
    lang,
    themes: { light: "vitesse-light", dark: "vitesse-dark" },
    defaultColor: "light",
  });
}

export async function readComponentSource(slug: string) {
  return readFile(join(process.cwd(), "registry", "components", `${slug}.tsx`), "utf8");
}
