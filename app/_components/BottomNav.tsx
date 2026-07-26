"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const bottomLinks = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/products", label: "Products", icon: "inventory_2" },
  { href: "/resources", label: "Resources", icon: "library_books" },
  { href: "/distributors", label: "Distributors", icon: "location_on" },
  { href: "/about-us", label: "About", icon: "info" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-outline-variant bg-surface-container-lowest/95 px-2 py-2 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] backdrop-blur-md lg:hidden"
    >
      {bottomLinks.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            className={
              active
                ? "flex flex-col items-center justify-center gap-0.5 rounded-full bg-primary-container px-4 py-1 text-on-primary-container"
                : "flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-on-surface-variant transition-colors"
            }
            href={link.href}
            key={link.href}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {link.icon}
            </span>
            <span className="text-[10px] font-bold">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
