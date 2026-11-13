import { Sidebar } from "@/components/docs/Sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1320px] px-4 sm:px-6 md:grid md:grid-cols-[220px_1fr] md:gap-10 lg:px-8">
      <aside className="border-b border-line md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:border-b-0 md:border-r">
        <Sidebar />
      </aside>
      <article className="min-w-0 max-w-3xl py-10 md:py-14">{children}</article>
    </div>
  );
}
