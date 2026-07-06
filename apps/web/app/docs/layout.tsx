import { Sidebar } from "@/components/docs/Sidebar";
import { docGroups } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full px-8">
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r border-line md:block">
        <Sidebar groups={docGroups} />
      </aside>
      <main className="min-w-0 flex-1 py-12 px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
