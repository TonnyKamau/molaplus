"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { ScrollReveal } from "./ScrollReveal";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/studio" || pathname.startsWith("/studio/")) return children;
  return <><SiteHeader /><div className="flex min-h-[60vh] flex-col overflow-x-clip">{children}</div><SiteFooter /><ScrollReveal /></>;
}
