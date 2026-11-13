import localFont from "next/font/local";
import { EB_Garamond } from "next/font/google";

export const fontDisplay = EB_Garamond({
  subsets: ["latin"],
  variable: "--gl-font-display",
  display: "swap",
});

export const fontSans = localFont({
  variable: "--gl-font-sans",
  display: "swap",
  src: [
    { path: "../fonts/PPNeueMontrealText-Book.otf", weight: "400", style: "normal" },
    { path: "../fonts/PPNeueMontreal-Regular.otf", weight: "500", style: "normal" },
    { path: "../fonts/PPNeueMontreal-Semibold.otf", weight: "600", style: "normal" },
  ],
});

export const fontMono = localFont({
  variable: "--gl-font-mono",
  display: "swap",
  src: "../fonts/KodeMono-VariableFont_wght.ttf",
  weight: "400 700",
});
