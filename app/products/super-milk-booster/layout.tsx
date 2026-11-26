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
      "@type": "Product",
      "@id": `${SITE_URL}/products/super-milk-booster#product`,
      name: "Super Milk Booster",
      description:
        "Advanced formula for enhanced milk production in dairy animals, ensuring optimal nutritional balance. Available in 1 kg, 2 kg and 5 kg packages.",
      image: [
        `${SITE_URL}/molaplus/milk-booster-5kg-cutout.webp`,
        `${SITE_URL}/molaplus/milkbooster-2kg.webp`,
        `${SITE_URL}/molaplus/milkbooster-1kg.webp`,
      ],
      brand: { "@type": "Brand", name: SITE_NAME },
      category: "Dairy nutrition",
      url: `${SITE_URL}/products/super-milk-booster`,
      manufacturer: { "@id": `${SITE_URL}/#organization` },
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
