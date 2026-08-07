"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/consultancy", label: "Consultancy" },
  { href: "/resources", label: "Resources" },
  { href: "/about-us", label: "About" },
  { href: "/contact", label: "Contact" },
];

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

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 w-full px-3 pt-3 md:px-margin-desktop md:pt-4">
        <div
          className={`mx-auto flex h-16 w-full max-w-container-max-width items-center justify-between rounded-full pl-4 pr-2 transition-all duration-300 md:pl-6 md:pr-3 ${
            scrolled
              ? "border border-outline-variant/70 bg-surface shadow-lg shadow-primary/5 lg:bg-surface/80 lg:backdrop-blur-xl"
              : "border border-transparent bg-surface lg:bg-surface/40 lg:backdrop-blur-md"
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              aria-label="Open menu"
              className="-ml-1 rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high active:opacity-80 lg:hidden"
              onClick={() => setOpen(true)}
              type="button"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <Link className="flex items-center" href="/">
              <Image
                alt="MolaPlus Africa"
                className="h-9 w-auto md:h-10"
                height={243}
                priority
                sizes="220px"
                src="/logo.png"
                width={1028}
              />
            </Link>
          </div>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
            {primaryNav.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  className={
                    active
                      ? "rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary"
                      : "rounded-full px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
                  }
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link
            className="group hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-container hover:shadow-md lg:inline-flex"
            href="/distributors"
          >
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            Find Distributors
          </Link>

          <a
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white lg:hidden"
            href="tel:+254724968847"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            Call
          </a>
        </div>
      </header>
      {/* Spacer to offset the fixed header on every page */}
      <div aria-hidden className="h-[76px] md:h-20" />

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] bg-ink-black/50 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <nav
        aria-label="Main menu"
        className={`fixed inset-y-0 left-0 z-[65] flex h-full w-[85%] max-w-sm flex-col rounded-r-3xl bg-surface-container-lowest shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-outline-variant p-5">
          <div className="flex items-center">
            <Image alt="MolaPlus Africa" className="h-8 w-auto" height={243} sizes="200px" src="/logo.png" width={1028} />
          </div>
          <button
            aria-label="Close menu"
            className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high"
            onClick={() => setOpen(false)}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <ul className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {drawerLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  className={
                    active
                      ? "flex items-center gap-4 rounded-2xl bg-primary-container px-4 py-3 font-bold text-on-primary-container"
                      : "flex items-center gap-4 rounded-2xl px-4 py-3 text-on-surface-variant transition-all hover:bg-surface-container-high"
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
        <div className="border-t border-outline-variant p-4">
          <a
            className="flex items-center justify-center gap-2 rounded-full bg-secondary-container px-5 py-3 font-bold text-white transition-opacity hover:opacity-90"
            href="tel:+254724968847"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            +254 724 968 847
          </a>
        </div>
      </nav>
    </>
  );
}

