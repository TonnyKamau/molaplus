"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-reveal driven from JS so no-JS users always see content. Page sections
 * (and anything tagged `data-reveal` / `data-reveal-stagger`) fade and slide in
 * as they reach the viewport. If the compositor never runs (background tab, no
 * paint) a rAF probe detects it and forces everything visible, so content can
 * never stay hidden. Disabled under reduced-motion.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Auto-tag page sections so JSX and injected static pages both animate.
    document.querySelectorAll<HTMLElement>("main section").forEach((el) => {
      if (!el.hasAttribute("data-reveal") && !el.hasAttribute("data-reveal-stagger")) {
        el.setAttribute("data-reveal", "");
      }
    });

    const all = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-stagger]")
      );
    const pending = () => all().filter((el) => !el.classList.contains("mp-in"));

    const forceVisible = (el: HTMLElement) => {
      el.classList.add("mp-in");
      el.style.opacity = "1";
      el.style.transform = "none";
    };

    if (reduce) {
      all().forEach(forceVisible);
      return;
    }

    let ticking = false;
    const revealVisible = () => {
      ticking = false;
      const line = window.innerHeight * 0.9;
      pending().forEach((el) => {
        if (el.getBoundingClientRect().top < line) {
          el.classList.add("mp-in");
        }
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(revealVisible);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Run the first pass after a frame so layout is measured correctly.
    let painted = false;
    const raf = requestAnimationFrame(() => {
      painted = true;
      revealVisible();
    });

    // If the compositor never painted (frozen/background), guarantee visibility.
    const safety = window.setTimeout(() => {
      if (!painted) {
        all().forEach(forceVisible);
      }
    }, 1200);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, [pathname]);

  return null;
}
