import type { MetadataRoute } from "next";
import { buildTimePosts } from "../lib/blog/published";
import { SITE_URL } from "../lib/seo";

export const dynamic = "force-static";

/** Main URLs only; aliases (/about, /outlets, /products/compare) point here via canonical tags. */
const pages: [path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
  ["", 1, "weekly"],
  ["/products", 0.9, "weekly"],
  ["/products/super-milk-booster", 0.9, "monthly"],
  ["/order", 0.8, "monthly"],
  ["/distributors", 0.8, "weekly"],
  ["/product-comparison", 0.7, "monthly"],
  ["/consultancy", 0.7, "monthly"],
  ["/resources", 0.7, "weekly"],
  ["/blog", 0.7, "weekly"],
  ["/about-us", 0.6, "monthly"],
  ["/contact", 0.6, "monthly"],
  ["/privacy", 0.2, "yearly"],
  ["/terms", 0.2, "yearly"],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const built = new Date();
  const posts = buildTimePosts();
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({
      url: `${SITE_URL}${path}/`.replace(/\/\/$/, "/"),
      lastModified: built,
      changeFrequency,
      priority,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}/`,
      lastModified: new Date(`${post.date}T09:00:00+03:00`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
