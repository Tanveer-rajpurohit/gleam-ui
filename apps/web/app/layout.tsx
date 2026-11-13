import type { Metadata } from "next";
import { ThemeScript } from "@/lib/theme";
import { fontDisplay, fontMono, fontSans } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

const DESCRIPTION = "Animated React components delivered as single files: shaders, text effects, galleries and docks you paste and edit.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Gleam UI: motion components you own", template: "%s | Gleam UI" },
  description: DESCRIPTION,
  applicationName: "Gleam UI",
  authors: [{ name: "Tanveer Singh", url: "https://tanveer-singh.vercel.app" }],
  openGraph: { type: "website", siteName: "Gleam UI", title: "Gleam UI: motion components you own", description: DESCRIPTION },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-bg">
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col">
          <SiteChrome>
            <Navbar />
          </SiteChrome>
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteChrome>
            <Footer />
          </SiteChrome>
        </div>
      </body>
    </html>
  );
}
