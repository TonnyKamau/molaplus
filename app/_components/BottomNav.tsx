"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const bottomLinks = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/products", label: "Products", icon: "inventory_2" },
  { href: "/resources", label: "Guides", icon: "library_books" },
  { href: "/distributors", label: "Outlets", icon: "location_on" },
  { href: "/contact", label: "Contact", icon: "contact_support" },
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
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-around rounded-full border border-outline-variant/70 bg-surface/85 px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        {bottomLinks.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <Link
              className={
                active
                  ? "flex flex-col items-center justify-center gap-0.5 rounded-full bg-primary px-4 py-1.5 text-white"
                  : "flex flex-col items-center justify-center gap-0.5 rounded-full px-3 py-1.5 text-on-surface-variant transition-colors hover:text-primary"
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
      </div>
    </nav>
  );
}
