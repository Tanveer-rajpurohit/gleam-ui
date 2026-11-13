export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001").replace(/\/$/, "");

export const GITHUB_URL = "https://github.com/Tanveer-rajpurohit/gleam-ui";

export function installCommand(slug: string) {
  return `npx shadcn@latest add ${SITE_URL}/r/${slug}.json`;
}

export const DOC_PAGES = [
  { href: "/docs", title: "Introduction", description: "What Gleam UI is and how it is delivered." },
  { href: "/docs/installation", title: "Installation", description: "Add a component with the CLI or by hand." },
  { href: "/docs/theming", title: "Theming", description: "Colours, fonts and reduced motion." },
] as const;
