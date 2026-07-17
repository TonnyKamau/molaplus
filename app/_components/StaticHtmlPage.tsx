"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function StaticHtmlPage({ html }: { html: string }) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }

    const images = Array.from(root.querySelectorAll("img"));
    images.forEach((image, index) => {
      image.loading = index === 0 ? "eager" : "lazy";
      image.decoding = "async";
      image.fetchPriority = index === 0 ? "high" : "low";
    });

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as HTMLElement | null)?.closest("a");
      if (!link || link.target || link.hasAttribute("download")) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      const url = new URL(href, window.location.href);
      if (url.hostname === "molaplusafrica.com" || url.hostname === "www.molaplusafrica.com") {
        event.preventDefault();
        router.push("/");
        return;
      }

      if (url.origin !== window.location.origin) {
        return;
      }

      event.preventDefault();
      const pathname = url.pathname === "/outlets" ? "/distributors" : url.pathname;
      router.push(`${pathname}${url.search}${url.hash}`);
    };

    const onSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      if (!form || !root.contains(form)) {
        return;
      }

      event.preventDefault();

      let status = form.querySelector<HTMLElement>("[data-form-status]");
      if (!status) {
        status = document.createElement("p");
        status.dataset.formStatus = "true";
        status.className = "mt-4 rounded-lg bg-primary-container px-4 py-3 text-sm font-bold text-on-primary-container";
        form.appendChild(status);
      }

      status.textContent = "Thanks. Your details are ready for the MolaPlus team. Please call or email us to complete the request.";
      status.setAttribute("role", "status");
    };

    root.addEventListener("click", onClick);
    root.addEventListener("submit", onSubmit);

    const scripts = Array.from(root.querySelectorAll("script"));
    const mountedScripts = scripts.map((script) => {
      const executableScript = document.createElement("script");
      for (const attribute of Array.from(script.attributes)) {
        executableScript.setAttribute(attribute.name, attribute.value);
      }
      executableScript.textContent = script.textContent;
      document.body.appendChild(executableScript);
      return executableScript;
    });

    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("submit", onSubmit);
      mountedScripts.forEach((script) => script.remove());
    };
  }, [html, router]);

  return (
    <div
      className="static-html-page"
      ref={ref}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
