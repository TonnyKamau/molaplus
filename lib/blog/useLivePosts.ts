import { useEffect, useState } from "react";

import { summarize, type Post, type PostSummary } from "../../app/blog/posts";
import { minuteUrl } from "./live";

/**
 * Starts with the posts baked in at build time (instant paint, SEO), then swaps
 * in the live published list so Studio articles appear without a redeploy.
 */
export function useLivePosts(initial: PostSummary[]) {
  const [posts, setPosts] = useState(initial);
  useEffect(() => {
    const controller = new AbortController();
    fetch(minuteUrl("/api/blog/posts"), { signal: controller.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const live: Post[] = Array.isArray(data?.posts) ? data.posts : [];
        if (live.length) setPosts(live.map((p) => summarize(p)));
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return posts;
}
