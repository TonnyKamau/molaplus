"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const primaryNav = [
  { href: "/products", label: "Products" },
  { href: "/consultancy", label: "Consultancy" },
  { href: "/resources", label: "Resources" },
  { href: "/distributors", label: "Distributors" },
  { href: "/about-us", label: "Our story" },
];

const drawerLinks = [
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
  const drawerLinksRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) drawerLinksRef.current?.scrollTo({ top: 0 });
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`site-header fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${scrolled ? "is-scrolled" : ""}`}>
        <div
          className="site-header__inner"
        >
          <div className="site-header__brand">
            <Link aria-label="MolaPlus home" className="site-header__logo" href="/">
              <Image
                alt="MolaPlus Africa"
                className="h-8 w-auto sm:h-10"
                height={243}
                priority
                sizes="190px"
                src="/molaplus-brand.png"
                width={1028}
              />
            </Link>
          </div>

          <nav className="site-header__nav hidden lg:flex">
            {primaryNav.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  className={
                    active
                      ? "site-header__link is-active"
                      : "site-header__link"
                  }
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link className="site-header__contact hidden lg:inline-flex" href="/contact">
              Talk to an expert <span aria-hidden>↗</span>
            </Link>
            <a aria-label="Call MolaPlus" className="grid h-10 w-10 place-items-center border border-[#173b2b]/20 text-[#0c432c] lg:hidden" href="tel:+254724968847"><span className="material-symbols-outlined text-[20px]">call</span></a>
            <button aria-label="Open menu" className="grid h-10 w-10 place-items-center bg-[#0c432c] text-white transition-colors hover:bg-[#ef5b2a] lg:hidden" onClick={() => setOpen(true)} type="button"><span className="material-symbols-outlined">menu</span></button>
          </div>
        </div>
      </header>
      {/* Spacer to offset the fixed header on every page */}
      <div aria-hidden className="h-[82px]" />

      {/* Mobile drawer */}
      <div
        className={`mobile-drawer__backdrop fixed inset-0 z-[60] bg-ink-black/50 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <nav
        aria-label="Main menu"
        className={`mobile-drawer fixed inset-y-0 left-0 z-[65] flex h-full w-[88%] max-w-sm flex-col bg-surface-container-lowest shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mobile-drawer__header flex items-center justify-between border-b border-outline-variant p-5">
          <div className="flex items-center">
            <Image alt="MolaPlus Africa" className="h-8 w-auto" height={243} sizes="200px" src="/molaplus-brand.png" width={1028} />
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
        <ul className="mobile-drawer__links flex flex-1 flex-col gap-1 overflow-y-auto p-4" ref={drawerLinksRef}>
          {drawerLinks.map((link, index) => {
            const active = link.href === "/products" ? pathname === "/products" : isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  className={`mobile-drawer__link ${active ? "is-active" : ""}`}
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  <span className="mobile-drawer__index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="material-symbols-outlined mobile-drawer__icon">{link.icon}</span>
                  <span>{link.label}</span>
                  <span className="material-symbols-outlined mobile-drawer__arrow">arrow_outward</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mobile-drawer__footer border-t border-outline-variant p-4">
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

