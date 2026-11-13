"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const SHOWCASE_ROUTE = /^\/components\/[^/]+\/?$/;

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (SHOWCASE_ROUTE.test(pathname)) return null;
  return <>{children}</>;
}
