import type { Metadata } from "next";

/**
 * Shared SEO settings. Every page builds its metadata through `pageMetadata`
 * so titles, descriptions, canonical URLs and social cards stay consistent.
 *
 * Keep copy factual (see the content-integrity rule): describe real products
 * and services only.
 */
export const SITE_URL = "https://molaplus.org";
export const SITE_NAME = "MolaPlus";

/** Searches the site should be found for. Used in metadata and structured data. */
export const SITE_KEYWORDS = [
  "MolaPlus",
  "animal feed supplements Kenya",
  "livestock feed",
  "dairy feed",
  "milk booster",
  "Super Milk Booster",
  "dairy cow mineral supplement",
  "mineral lick",
  "calf weaner meal",
  "bovine meal",
  "poultry feed",
  "layer mash",
  "poultry probiotics",
  "pig feed supplement",
  "livestock probiotics",
  "farm probiotics",
  "organic fertilizer Kenya",
  "foliar fertilizer",
  "crop nutrition",
  "effective microorganisms",
  "animal nutrition East Africa",
  "farm consultancy Kenya",
  "agrovet products",
  "Côte d'Ivoire",
  "aliments pour bétail",
  "engrais organique",
];

type PageSeo = {
  /** Short page title; the root layout appends " | MolaPlus". */
  title: string;
  description: string;
  /** Path of the page's main URL, e.g. "/products". Duplicates point here. */
  path: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
};

export function pageMetadata({ title, description, path, keywords = [], image = "/og.jpg", imageAlt, type = "website" }: PageSeo): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const images = [{ url: image, width: 1200, height: 630, alt: imageAlt ?? fullTitle }];
  return {
    title,
    description,
    keywords: [...keywords, ...SITE_KEYWORDS],
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images,
      locale: "en_KE",
      alternateLocale: ["fr_CI"],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}

/** Breadcrumb trail for structured data: [["Products", "/products"], ...]. */
export function breadcrumbSchema(trail: [string, string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"] as [string, string], ...trail].map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${SITE_URL}${path === "/" ? "/" : `${path.replace(/\/$/, "")}/`}`,
    })),
  };
}

/** Serialize JSON-LD safely for a <script> tag. */
export function jsonLd(data: object) {
  return JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c");
}
