import type { Metadata } from "next";

import { SITE_NAME, SITE_URL, breadcrumbSchema, jsonLd, pageMetadata } from "../../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Super Milk Booster — Dairy Cow Supplement for More Milk (1, 2 & 5 kg)",
  description:
    "Super Milk Booster is a MolaPlus dairy supplement with minerals and probiotics for better milk production and condition in dairy cows. Available in 1 kg, 2 kg and 5 kg packs. Order online or find a stockist.",
  path: "/products/super-milk-booster",
  keywords: ["milk booster for cows", "dairy supplement Kenya", "increase milk production", "dairy minerals"],
  image: "/molaplus/milk-booster-5kg-cutout.webp",
  imageAlt: "MolaPlus Super Milk Booster 5 kg pack",
});

const schema = jsonLd({
  "@graph": [
    breadcrumbSchema([
      ["Products", "/products"],
      ["Super Milk Booster", "/products/super-milk-booster"],
    ]),
    {
      // Described as a product page rather than a priced "Product" (Google
      // requires a price, rating or review for those; none are published).
      "@type": "WebPage",
      "@id": `${SITE_URL}/products/super-milk-booster/#page`,
      url: `${SITE_URL}/products/super-milk-booster/`,
      name: `Super Milk Booster | ${SITE_NAME}`,
      description:
        "Advanced formula for enhanced milk production in dairy animals, ensuring optimal nutritional balance. Available in 1 kg, 2 kg and 5 kg packages.",
      primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/molaplus/milk-booster-5kg-cutout.webp` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
});

export default function SuperMilkBoosterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      {children}
    </>
  );
}
