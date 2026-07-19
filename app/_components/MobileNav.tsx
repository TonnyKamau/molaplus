"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const drawerLinks = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/products", label: "Products", icon: "science" },
  { href: "/products/super-milk-booster", label: "Super Milk Booster", icon: "water_drop" },
  { href: "/product-comparison", label: "Compare Products", icon: "compare_arrows" },
  { href: "/consultancy", label: "Consultancy", icon: "model_training" },
  { href: "/resources", label: "Resources", icon: "library_books" },
  { href: "/distributors", label: "Distributors", icon: "location_on" },
  { href: "/about-us", label: "About Us", icon: "info" },
  { href: "/contact", label: "Contact", icon: "contact_support" },
];

const bottomLinks = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/products", label: "Products", icon: "inventory_2" },
  { href: "/resources", label: "Resources", icon: "library_books" },
  { href: "/distributors", label: "Distributors", icon: "location_on" },
  { href: "/about-us", label: "About", icon: "info" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!window.matchMedia("(max-width: 767px)").matches) {
        setOpen(false);
        return;
      }

      const target = event.target as HTMLElement | null;
      const trigger = target?.closest("button, .material-symbols-outlined");
      if (trigger?.textContent?.trim() === "menu") {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 z-[55] bg-black/40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <nav
        aria-label="Main menu"
        className={`fixed inset-y-0 left-0 z-[60] flex h-full w-80 flex-col rounded-r-xl bg-surface-container-lowest shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="overflow-y-auto p-6">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image alt="MolaPlus Africa logo" className="h-9 w-9 rounded-full object-contain" height={36} src="/molaplus/logo.png" width={36} />
              <h2 className="font-headline-md text-headline-md text-primary" suppressHydrationWarning>
                MolaPlus Africa
              </h2>
            </div>
            <button
              aria-label="Close menu"
              className="rounded-full p-2 transition-colors hover:bg-surface-container-high"
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-outlined text-primary">close</span>
            </button>
          </div>
          <ul className="flex flex-col gap-2">
            {drawerLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    className={
                      active
                        ? "mx-2 flex items-center gap-4 rounded-full bg-primary-container px-4 py-3 font-bold text-on-primary-container"
                        : "mx-2 flex items-center gap-4 px-4 py-3 text-on-surface-variant transition-all hover:bg-surface-container-high"
                    }
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    <span className="material-symbols-outlined">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      <nav
        aria-label="Bottom navigation"
        className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t border-outline-variant bg-surface-container-lowest px-2 py-2 shadow-lg md:hidden"
      >
        {bottomLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              className={
                active
                  ? "flex flex-col items-center justify-center rounded-full bg-primary-container px-4 py-1 text-on-primary-container"
                  : "flex flex-col items-center justify-center text-on-surface-variant"
              }
              href={link.href}
              key={link.href}
              onClick={() => setOpen(false)}
            >
              <span
                className="material-symbols-outlined"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {link.icon}
              </span>
              <span className="text-[10px] font-bold">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
