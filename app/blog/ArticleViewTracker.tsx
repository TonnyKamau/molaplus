"use client";

import { useEffect, useState } from "react";

export function ArticleViewTracker({ slug, initialViews = 0 }: { slug: string; initialViews?: number }) {
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

  return <span>{views.toLocaleString()} {views === 1 ? "view" : "views"}</span>;
}
