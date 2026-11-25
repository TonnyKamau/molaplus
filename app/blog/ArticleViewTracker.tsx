"use client";

import { useEffect, useState } from "react";

import { useT } from "../../lib/i18n";

export function ArticleViewTracker({ slug, initialViews = 0 }: { slug: string; initialViews?: number }) {
  const t = useT();
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const key = `molaplus:viewed:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    const controller = new AbortController();
    fetch("/api/blog/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      signal: controller.signal,
    })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (typeof data?.views === "number") setViews(data.views);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [slug]);

  // Live count: native French, never handed to Google.
  return <span translate="no">{t(`${views.toLocaleString()} ${views === 1 ? "view" : "views"}`, `${views.toLocaleString("fr-FR")} ${views === 1 ? "vue" : "vues"}`)}</span>;
}
