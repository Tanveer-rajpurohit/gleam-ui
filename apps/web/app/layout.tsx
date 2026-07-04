import type { Metadata } from "next";
import { ThemeProvider, ThemeScript } from "@/lib/theme";
import { fontSans, fontDisplay, fontMono } from "../lib/fonts";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: {
    default: "Gleam UI — Motion-first React components",
    template: "%s — Gleam UI",
  },
  description:
    "A collection of polished, animated and 3D React components built with GSAP, Motion and React Three Fiber.",
  applicationName: "Gleam UI",
  keywords: [
    "Gleam UI",
    "React components",
    "animated components",
    "3D components",
    "GSAP",
    "Motion",
    "React Three Fiber",
    "Three.js",
    "WebGL",
    "TypeScript",
    "UI component library",
  ],
  authors: [
    {
      name: "Tanveer Rajpurohit",
      url: "https://tanveer-singh.vercel.app",
    },
  ],
  creator: "Tanveer Rajpurohit",
  publisher: "Gleam UI",
  openGraph: {
    type: "website",
    siteName: "Gleam UI",
    title: "Gleam UI — Motion-first React components",
    description:
      "Polished, animated and 3D React components for expressive interfaces.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SmoothScroll>
            <div className="relative flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
