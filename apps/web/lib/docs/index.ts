export interface DocPage {
  slug: string;
  title: string;
  description: string;
}

export interface DocGroup {
  category: string;
  pages: DocPage[];
}

export const docGroups: DocGroup[] = [
  {
    category: "Getting Started",
    pages: [
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
    ],
  },
  {
    category: "Core Concepts",
    pages: [
      {
        slug: "theming",
        title: "Theming",
        description: "The Viridian design system and token scales.",
      },
      {
        slug: "usage",
        title: "How to Use",
        description: "Base guide for consuming components.",
      },
      {
        slug: "performance",
        title: "Performance",
        description: "Best practices for WebGL and animations.",
      },
    ],
  },
];
