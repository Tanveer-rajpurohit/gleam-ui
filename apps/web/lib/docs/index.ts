export interface DocPage {
  slug: string;
  title: string;
  description: string;
}

export const docPages: DocPage[] = [
  {
    slug: "introduction",
    title: "Introduction",
    description: "What Gleam UI is and the philosophy behind it.",
  },
  {
    slug: "installation",
    title: "Installation",
    description: "How to add Gleam UI to your project.",
  },
  {
    slug: "theming",
    title: "Theming",
    description: "The Viridian design system and token scales.",
  },
];
