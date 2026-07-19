"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
      <motion.nav
        aria-label="Main menu"
        animate={{ x: open ? 0 : "-100%" }}
        className="fixed inset-y-0 left-0 z-[60] flex h-full w-[min(21rem,88vw)] flex-col rounded-r-2xl border-r border-white/10 bg-[#07130c] text-white shadow-2xl md:hidden"
        initial={false}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="overflow-y-auto p-6">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image alt="MolaPlus Africa logo" className="h-9 w-9 rounded-full object-contain" height={36} src="/molaplus/logo.png" width={36} />
              <h2 className="font-headline-md text-headline-md text-primary-fixed" suppressHydrationWarning>
                MolaPlus Africa
              </h2>
            </div>
            <button
              aria-label="Close menu"
              className="rounded-full border border-white/10 bg-white/10 p-2 transition-colors hover:bg-white/15"
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-outlined text-primary-fixed">close</span>
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
                        ? "mx-1 flex items-center gap-4 rounded-full bg-white px-4 py-3 font-bold text-primary"
                        : "mx-1 flex items-center gap-4 rounded-full px-4 py-3 text-white/72 transition-all hover:bg-white/10 hover:text-white"
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
      </motion.nav>
      <nav
        aria-label="Bottom navigation"
        className="fixed bottom-3 left-1/2 z-50 flex w-[calc(100%-1.5rem)] -translate-x-1/2 items-center justify-between rounded-2xl border border-white/10 bg-[#07130c]/92 px-2 py-2 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl md:hidden"
      >
        {bottomLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              className={
                active
                  ? "flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl bg-white px-1 py-2 text-primary"
                  : "flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-2 text-white/65 transition-colors hover:text-white"
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
              <span className="max-w-full truncate text-[10px] font-bold leading-4">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
