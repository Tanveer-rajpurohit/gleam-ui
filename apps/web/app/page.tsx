
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { ComponentGrid } from "@/components/home/ComponentGrid";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Marquee />
      <ComponentGrid />
    </div>
  );
}
