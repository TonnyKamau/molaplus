import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api/studio/"] }, sitemap: "https://molaplusafrica.com/sitemap.xml" };
}
