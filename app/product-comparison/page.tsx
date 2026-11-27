import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { categories, productsIn } from "../../lib/products";
import { breadcrumbSchema, jsonLd, pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Product Guide — Which MolaPlus Product Do I Need?",
  description:
    "Find the right MolaPlus product for your dairy cows, calves, beef cattle, poultry, pigs, sheep or crops: what each product is for, its pack sizes and how it is used.",
  path: "/product-comparison",
  keywords: ["which feed supplement", "best dairy supplement Kenya", "poultry feed guide", "pig probiotics", "crop fertilizer guide"],
});

const pageSchema = jsonLd({
  "@graph": [breadcrumbSchema([["Product Guide", "/product-comparison"]])],
});

/**
 * Generated from lib/products.ts (the official dealer guide), so this page can
 * never disagree with the product cards.
 */
export default function ProductGuidePage() {
  return (
    <div className="editorial-page overflow-x-hidden bg-surface text-on-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageSchema }} />
      {/* Hero */}
      <section className="mp-scene mp-grain relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-container-max-width px-margin-mobile py-14 text-white md:px-margin-desktop md:py-20">
          <span className="mp-eyebrow text-primary-fixed-dim">Product guide</span>
          <h1 className="mp-display mt-5 max-w-3xl">Which product do I need?</h1>
          <p className="text-pretty mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
            Every MolaPlus product at a glance: what it is for, the pack sizes and
            how it is used. Choose your animals or crops below.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <a className="guide-jump" href={`#${category.id}`} key={category.id}>
                {category.eyebrow}
              </a>
            ))}
          </div>
        </div>
      </section>

      {categories.map((category) => (
        <section className="bg-surface py-14 md:py-20" id={category.id} key={category.id}>
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="mb-8 max-w-2xl" data-reveal>
              <span className="mp-eyebrow text-secondary">{category.eyebrow}</span>
              <h2 className="mp-display-sm mt-3 text-ink-black">{category.name}</h2>
            </div>
            <div className="guide-table" role="table" aria-label={category.name}>
              <div className="guide-row guide-row--head" role="row">
                <span role="columnheader">Product</span>
                <span role="columnheader">What it&apos;s for</span>
                <span role="columnheader">Pack sizes</span>
                <span role="columnheader">How it&apos;s used</span>
              </div>
              {productsIn(category.id).map((product) => (
                <Link className="guide-row" href={`/products#${product.id}`} key={product.id} role="row">
                  <span className="guide-product" role="cell">
                    <span className="guide-thumb">
                      <Image alt="" className="object-contain p-1" fill sizes="56px" src={product.image} />
                    </span>
                    <strong>{product.name}</strong>
                  </span>
                  <span role="cell" data-label="What it's for">{product.summary}</span>
                  <span role="cell" data-label="Pack sizes" className="guide-sizes">{product.sizes.join(" · ")}</span>
                  <span role="cell" data-label="How it's used">{product.usage[0]}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-outline-variant bg-surface-container-low p-8 text-center md:flex-row md:p-12 md:text-left" data-reveal>
            <div className="max-w-xl">
              <span className="mp-eyebrow text-secondary">Need advice?</span>
              <h2 className="mp-display-sm mt-3 text-ink-black">Not sure which product fits your farm?</h2>
              <p className="mt-4 text-on-surface-variant">Tell us about your animals or crops and we&apos;ll recommend the right products and feeding programme.</p>
            </div>
            <a className="range-card__btn range-card__btn--order" href="https://wa.me/254724968847" rel="noopener noreferrer" target="_blank">
              <span className="material-symbols-outlined notranslate text-[18px]">chat</span>
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
