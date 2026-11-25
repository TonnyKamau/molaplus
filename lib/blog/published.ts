import { posts as seed, type Post } from "../../app/blog/posts";

/**
 * Build-time published posts for static export (no network).
 * The static HTML is generated from this seed set for SEO + instant paint;
 * the browser then refreshes from the live PHP API (/api/blog/posts) so
 * posts added in the Studio appear in realtime without a rebuild.
 */
export function buildTimePosts(): Post[] {
  return [...seed]
    .filter(Boolean)
    .sort(
      (a, b) =>
        Number(b.featured ?? false) - Number(a.featured ?? false) ||
        b.date.localeCompare(a.date),
    )
    .map((post) => ({ ...post, views: post.views ?? 0 }));
}
