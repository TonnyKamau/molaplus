import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { categories, products, productsIn } from "../../lib/products";
import { SITE_NAME, SITE_URL, breadcrumbSchema, jsonLd, pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Animal Feeds, Supplements, Probiotics & Crop Fertilizers",
  description:
    "The full MolaPlus range: Super Milk Booster, dairy and beef minerals, High Yield Dairy Meal, Ranch Cubes, Premium DDGS, calf feeds, layer, broiler and Kienyeji mash, Poultry and Pig Microbes, Sheep Mineral Salts, Carbovet, Mazao fertilizers and Biochar+.",
  path: "/products",
  keywords: [
    "buy animal feed supplements", "dairy cow supplements", "dairy meal", "ranch cubes", "DDGS animal feed",
    "calf pellets", "layer mash", "broiler starter", "kienyeji mash", "poultry probiotics", "pig microbes",
    "sheep mineral salts", "activated charcoal for livestock", "organic fertilizer", "biochar",
  ],
  image: "/molaplus/full-product-range.webp",
  imageAlt: "The MolaPlus range of animal feeds, supplements and crop fertilizers",
});

/** First pack size of a product, used to preselect it on the order form. */
const orderHref = (name: string, size: string) => `/order?product=${encodeURIComponent(`${name} — ${size}`)}`;

const productsSchema = jsonLd({
  "@graph": [
    breadcrumbSchema([["Products", "/products"]]),
    {
      // A plain catalogue list. Not typed as "Product": Google requires a
      // price, rating or review for those and flags every item without one.
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/products/#page`,
      url: `${SITE_URL}/products/`,
      name: "MolaPlus animal nutrition and crop products",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntity: {
        "@type": "ItemList",
        name: `${SITE_NAME} product range`,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `MolaPlus ${product.name}`,
          description: product.summary,
          image: `${SITE_URL}${product.image}`,
          url: `${SITE_URL}${product.detailHref ? `${product.detailHref}/` : `/products/#${product.id}`}`,
        })),
      },
    },
  ],
});

export default function ProductsPage() {
  return (
    <div className="editorial-page overflow-x-hidden bg-surface text-on-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productsSchema }} />
      {/* Hero */}
      <section className="mp-scene mp-grain relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-container-max-width px-margin-mobile py-14 text-white md:px-margin-desktop md:py-20">
          <span className="mp-eyebrow text-primary-fixed-dim">The Range</span>
          <h1 className="mp-display mt-5 max-w-3xl">Our Products</h1>
          <p className="text-pretty mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
            Scientifically formulated feeds, supplements, probiotics and crop
            nutrition for livestock and farming operations of every scale.
          </p>

          <div className="mt-10 inline-flex flex-wrap items-center gap-x-8 gap-y-4 rounded-3xl border border-white/20 bg-white/10 px-7 py-5">
            <div>
              <p className="mp-eyebrow text-white/60">Buy online &amp; pay via <span className="whitespace-nowrap" translate="no">M-Pesa</span></p>
              <p className="text-2xl font-extrabold text-secondary-fixed-dim"><span className="whitespace-nowrap" translate="no">Till no: 906520</span></p>
            </div>
            <div className="hidden h-10 w-px bg-white/20 sm:block" />
            <div>
              <p className="mp-eyebrow text-white/60">Logistics &amp; prices call</p>
              <a className="text-2xl font-extrabold text-white transition-opacity hover:opacity-80" href="tel:+254724968847">
                +254 724 968 847
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Complete range showcase */}
      <section className="bg-surface py-12 md:py-20">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="overflow-hidden rounded-[2rem] border border-outline-variant bg-surface-container-lowest" data-reveal>
            <div className="relative aspect-[16/9] w-full md:aspect-[2/1]">
              <Image
                alt="MolaPlus complete animal nutrition product range"
                className="object-cover"
                fetchPriority="high"
                fill
                loading="eager"
                sizes="(min-width: 1280px) 1280px, 100vw"
                src="/molaplus/full-product-range.webp"
              />
            </div>
            <div className="flex flex-col justify-between gap-5 p-7 md:flex-row md:items-center md:p-10">
              <div>
                <span className="mp-eyebrow text-secondary">The complete MolaPlus range</span>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-black md:text-4xl">Nutrition for every stage of the farm.</h2>
              </div>
              <Link className="inline-flex shrink-0 items-center gap-2 font-bold text-primary" href="/contact">
                Ask about availability
                <span className="material-symbols-outlined notranslate">arrow_outward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Jump to a category */}
      <nav aria-label="Product categories" className="product-cats bg-surface pb-4">
        <div className="mx-auto flex max-w-container-max-width flex-wrap gap-2 px-margin-mobile md:px-margin-desktop">
          {categories.map((category) => (
            <a className="product-cats__chip" href={`#${category.id}`} key={category.id}>
              {category.eyebrow}
              <span className="product-cats__count">{productsIn(category.id).length}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Products by category */}
      {categories.map((category, i) => (
        <section
          className={i % 2 === 1 ? "bg-surface-container-low py-16 md:py-24" : "bg-surface py-16 md:py-24"}
          id={category.id}
          key={category.id}
        >
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="mb-10 max-w-2xl" data-reveal>
              <span className="mp-eyebrow text-secondary">{category.eyebrow}</span>
              <h2 className="mp-display-sm mt-3 text-ink-black">{category.name}</h2>
              <p className="mt-4 text-on-surface-variant">{category.tagline}</p>
            </div>

            <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
              {productsIn(category.id).map((product) => (
                <article className="range-card" id={product.id} key={product.id}>
                  <div className="range-card__media">
                    <Image
                      alt={`MolaPlus ${product.name}`}
                      className="object-contain p-6"
                      fill
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                      src={product.image}
                    />
                  </div>
                  <div className="range-card__body">
                    <h3 className="range-card__title">{product.name}</h3>
                    <ul className="range-card__sizes" aria-label="Pack sizes">
                      {product.sizes.map((size) => (
                        <li key={size}>{size}</li>
                      ))}
                    </ul>
                    <p className="range-card__summary">{product.summary}</p>
                    <ul className="range-card__results">
                      {product.results.slice(0, 3).map((result) => (
                        <li key={result}>{result}</li>
                      ))}
                    </ul>
                    <details className="range-card__usage">
                      <summary>How to use</summary>
                      <ul>
                        {product.usage.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ul>
                    </details>
                    <div className="range-card__actions">
                      <Link className="range-card__btn range-card__btn--order" href={orderHref(product.name, product.sizes[0])}>
                        Order now
                        <span className="material-symbols-outlined notranslate text-[18px]">trending_flat</span>
                      </Link>
                      {product.detailHref ? (
                        <Link className="range-card__btn" href={product.detailHref}>
                          Details
                        </Link>
                      ) : (
                        <a
                          className="range-card__btn"
                          href={`https://wa.me/254724968847?text=${encodeURIComponent(`Hello MolaPlus, I'd like to ask about ${product.name}.`)}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="material-symbols-outlined notranslate text-[18px]">chat</span>
                          Ask on WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Compare CTA */}
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-outline-variant bg-surface-container-low p-8 text-center md:flex-row md:p-12 md:text-left" data-reveal>
            <div className="max-w-xl">
              <span className="mp-eyebrow text-secondary">Product guide</span>
              <h2 className="mp-display-sm mt-3 text-ink-black">Not sure which product fits your farm?</h2>
              <p className="mt-4 text-on-surface-variant">
                See every product at a glance by animal or crop: what it is for,
                pack sizes and how it is used. Or talk to our team for advice.
              </p>
            </div>
            <Link
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-primary-container"
              href="/product-comparison"
            >
              <span className="material-symbols-outlined notranslate">menu_book</span>
              Open the product guide
              <span className="material-symbols-outlined notranslate transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
