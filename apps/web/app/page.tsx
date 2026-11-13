import Link from "next/link";
import { registry } from "@/registry";
import { highlight, readComponentSource } from "@/lib/highlight";
import { installCommand } from "@/lib/site";
import { Showcase, type ShowcaseApp } from "@/components/home/Showcase";
import { FeaturedTiles, InView, IntroLoader } from "@/components/home/HomeClient";
import { ParticleField } from "@/registry/components/particle-field";
import { PressureText } from "@/registry/components/pressure-text";
import { RevealText } from "@/registry/components/reveal-text";
import { ShineButton } from "@/registry/components/shine-button";
import { MagneticButton } from "@/registry/components/magnetic-button";
import { ScrambleText } from "@/registry/components/scramble-text";
import { DotGrid } from "@/registry/components/dot-grid";
import { InfoBadge, InfoSection } from "@/registry/components/info-section";
import { ImageTiltCard } from "@/registry/components/image-tilt-card";
import { PulseCircle } from "@/registry/components/pulse-circle";
import { TiltCard } from "@/registry/components/tilt-card";

const DOCK_APPS = [
  { id: "shader", slug: "water-ripple" },
  { id: "text", slug: "scramble-text" },
  { id: "gallery", slug: "spiral-gallery" },
  { id: "cursor", slug: "magnetic-button" },
  { id: "window", slug: "drag-board" },
  { id: "stars", slug: "warp-stars" },
  { id: "loader", slug: "curtain-loader" },
];

export default async function HomePage() {
  const apps = await Promise.all(
    DOCK_APPS.map(async (app): Promise<ShowcaseApp> => ({
      ...app,
      html: await highlight(await readComponentSource(app.slug), "tsx"),
    })),
  );
  const cli = installCommand("liquid-chrome").replace(/^npx shadcn@latest add /, "npx shadcn add ");
  const standalone = registry.filter((entry) => entry.dependencies.length === 0).length;

  return (
    <>
      <IntroLoader />

      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden px-6">
        <InView className="absolute inset-0" rootMargin="0px">
          <ParticleField className="absolute inset-0" count={2600} size={1.1} opacity={0.9} near="#c1cee0" far="#5f7d9e" />
        </InView>
        <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
          <p className="text-caption-upper uppercase text-accent">Motion-first React components</p>
          <h1 className="mt-6 font-display text-[clamp(4.5rem,15vw,10rem)] leading-none text-ink">
            <PressureText text="Gleam" minWeight={400} maxWeight={800} radius={240} />
          </h1>
          <RevealText
            start="top 98%"
            stagger={0.04}
            className="mt-8 max-w-xl justify-center text-title-md font-normal text-ink-muted"
          >
            Shaders, scroll scenes, docks and galleries that feel alive. Each one is a single file you install with one command and then own.
          </RevealText>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <ShineButton href="/components">Browse components</ShineButton>
            <MagneticButton variant="outline" strength={0.3} className="font-mono text-[13px]">
              <ScrambleText text={cli.length > 48 ? "npx shadcn add gleam" : cli} trigger="hover" />
            </MagneticButton>
          </div>
        </div>
        <p className="absolute bottom-8 z-10 text-caption text-ink-faint">
          {registry.length} components · {standalone} need nothing but React
        </p>
      </section>

      <section className="border-t border-line px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-caption-upper uppercase text-accent">Selected</p>
              <RevealText as="h2" stagger={0.04} className="mt-4 max-w-2xl font-display text-display-md text-ink">
                Running live in your browser, not recorded.
              </RevealText>
            </div>
            <Link href="/components" className="text-nav-link text-ink-muted transition-colors hover:text-ink">
              All {registry.length} components →
            </Link>
          </div>
          <FeaturedTiles />
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-line">
        <InView className="absolute inset-0">
          <DotGrid className="absolute inset-0" mode="push" density={46} dotSize={0.3} color="#819bb9" opacity={0.55} />
        </InView>
        <div className="pointer-events-none relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 py-32 text-center sm:py-44">
          <p className="text-caption-upper uppercase text-accent">GLSL, not GIFs</p>
          <RevealText as="h2" stagger={0.05} className="mt-4 max-w-2xl justify-center font-display text-display-md text-ink">
            Shader backgrounds from a single file.
          </RevealText>
          <p className="mx-auto mt-5 max-w-xl text-body-md text-ink-muted">
            Raw WebGL, no three.js. Every canvas pauses off screen and respects reduced motion. Move your pointer across this
            section and the grid parts around it.
          </p>
          <Link
            href="/components/dot-grid"
            className="pointer-events-auto mt-10 rounded-full border border-line-strong px-7 py-3 text-button text-ink transition-colors hover:bg-surface"
          >
            See it fullscreen
          </Link>
        </div>
      </section>

      <section className="border-t border-line px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-caption-upper uppercase text-accent">Desktop</p>
              <RevealText as="h2" stagger={0.04} className="mt-4 max-w-2xl font-display text-display-md text-ink">
                The dock and the window are components too.
              </RevealText>
            </div>
            <p className="max-w-sm text-body-sm text-ink-muted">Click an icon. The window grows out of it with a live preview and the source in the next tab.</p>
          </div>
          <Showcase apps={apps} />
        </div>
      </section>

      <section className="border-t border-line px-6 py-32 sm:py-44">
        <div className="mx-auto max-w-4xl">
          <InfoSection
            textClassName="justify-center text-center font-display text-display-sm font-normal text-ink sm:text-display-md"
            paragraphs={[
              [
                "We",
                "don't",
                "ship",
                <InfoBadge key="blocks">building blocks</InfoBadge>,
                "alone.",
                "We",
                "ship",
                "whole",
                <InfoBadge key="sections" variant="soft">
                  sections
                </InfoBadge>,
                "with",
                "the",
                "choreography",
                "built",
                "in.",
              ],
            ]}
          />
          <p className="mt-6 text-center text-caption text-ink-faint">
            This statement is the{" "}
            <Link href="/components/info-section" className="text-accent underline-offset-4 hover:underline">
              Info Section
            </Link>{" "}
            component. Replace the words, keep the reveal.
          </p>
        </div>
      </section>

      <section className="border-t border-line px-6 py-24 sm:py-32">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-14 lg:flex-row lg:items-center">
          <div className="max-w-md">
            <p className="text-caption-upper uppercase text-accent">Own the file</p>
            <h2 className="mt-4 font-display text-display-md text-ink">One command. One file. Yours to edit.</h2>
            <p className="mt-4 text-body-md text-ink-muted">
              The CLI writes the component into components/gleam and installs GSAP only when that component uses it. Easing,
              timing and shader code sit in plain view.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ShineButton href="/docs/installation" mode="hover">
                Install guide
              </ShineButton>
              <ShineButton href="/components/pulse-circle" variant="border">
                Showcase mode
              </ShineButton>
            </div>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-center gap-10">
            <ImageTiltCard
              src="/gallery/02.jpg"
              alt="A ridge line above the clouds"
              caption="Image Tilt Card"
              width={260}
              height={300}
              overlay={
                <div className="absolute left-4 top-4">
                  <p className="rounded-lg bg-black/55 px-3 py-1.5 text-caption text-white">Ridge</p>
                </div>
              }
            />
            <div className="flex flex-col items-center gap-8">
              <InView className="h-[150px] w-[150px]">
                <PulseCircle size={150} rings={3} color="#819bb9" />
              </InView>
              <ScrambleText text="Scramble Text" trigger="hover" className="font-mono text-title-md text-ink" />
            </div>
            <TiltCard className="w-60 rounded-xl" maxTilt={12}>
              <div className="flex h-40 flex-col justify-between rounded-xl border border-line bg-surface p-5 shadow-vd-1">
                <p className="text-caption-upper uppercase text-accent">Tilt Card</p>
                <p className="font-display text-title-lg text-ink">Weighted, glared, physical.</p>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>
    </>
  );
}
