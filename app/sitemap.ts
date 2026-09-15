import type { MetadataRoute } from "next";
import { publishedPosts } from "../lib/studio/db";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = publishedPosts();
  const base = "https://molaplusafrica.com";
  const pages = ["", "/products", "/products/super-milk-booster", "/product-comparison", "/consultancy", "/resources", "/blog", "/distributors", "/about-us", "/contact", "/order", "/privacy", "/terms"];
  return [
    ...pages.map((path) => ({ url: `${base}${path}` })),
    ...posts.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: new Date(`${post.date}T09:00:00+03:00`) })),
  ];
}
