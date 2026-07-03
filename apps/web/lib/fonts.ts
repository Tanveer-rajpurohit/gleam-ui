import { Inter, EB_Garamond, JetBrains_Mono } from "next/font/google";

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--gl-font-sans",
});

export const fontDisplay = EB_Garamond({
  subsets: ["latin"],
  variable: "--gl-font-display",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--gl-font-mono",
});
