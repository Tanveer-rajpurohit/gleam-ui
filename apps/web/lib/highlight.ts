import { createHighlighter } from "shiki";
import { join } from "path";
import { readFileSync } from "fs";

// Initialize the highlighter once per server instance
const highlighterPromise = createHighlighter({
  themes: ["vitesse-light", "vitesse-dark"],
  langs: ["tsx", "typescript", "bash", "css", "json"],
});

export async function highlight(
  code: string,
  lang: "tsx" | "bash" | "css" | "json" = "tsx"
) {
  const highlighter = await highlighterPromise;
  
  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
    defaultColor: "light",
  });
}

export function readComponentSource(relativePath: string): string {
  // relativePath should be from packages/ui/src, e.g., 'text/pressure-text.tsx'
  const absolutePath = join(process.cwd(), "../../packages/ui/src", relativePath);
  
  try {
    return readFileSync(absolutePath, "utf8");
  } catch {
    return `// Source file not found: ${relativePath}`;
  }
}
