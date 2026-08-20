import Image from "next/image";
import Link from "next/link";

type Size = { size: string; blurb: string; img: string };

type Group = {
  id: string;
  eyebrow: string;
  name: string;
  tagline: string;
  sizes: Size[];
  href: string;
};

const groups: Group[] = [
  {
    id: "super-milk-booster",
    eyebrow: "Dairy",
    name: "Super Milk Booster",
    tagline:
      "Advanced formula for enhanced milk production in dairy animals, ensuring optimal nutritional balance.",
    href: "/products/super-milk-booster",
    sizes: [
      { size: "1KG Package", blurb: "Ideal for small-scale dairy farms and individual homesteads.", img: "/molaplus/milkbooster-1kg.webp" },
      { size: "2KG Package", blurb: "Perfect for medium-sized dairy operations seeking efficiency.", img: "/molaplus/milkbooster-2kg.webp" },
      { size: "5KG Package", blurb: "Designed for large commercial dairy farms and bulk buyers.", img: "/molaplus/milk-booster-5kg-cutout.webp" },
    ],
  },
  {
    id: "poultry-microbes",
    eyebrow: "Growth & Health",
    name: "Poultry Microbes",
    tagline:
      "Specialized probiotic solution for optimal poultry health, weight gain, and disease resistance.",
    href: "/product-comparison",
    sizes: [
      { size: "500ml Solution", blurb: "For small poultry flocks", img: "/molaplus/poultry-500ml.webp" },
      { size: "1 Litre Solution", blurb: "For medium-sized farms", img: "/molaplus/poultry-microbes-1l-bottle.webp" },
      { size: "5 Litre Solution", blurb: "For large operations", img: "/molaplus/poultry-5ltr.webp" },
      { size: "10 Litre Solution", blurb: "For high-volume poultry operations", img: "/molaplus/poultry-microbes-10l.webp" },
    ],
  },
  {
    id: "dairy-young-stock",
    eyebrow: "Dairy & Young Stock",
    name: "Farm Essentials",
    tagline:
      "Practical mineral and early-development nutrition for productive dairy animals and stronger young stock.",
    href: "/contact",
    sizes: [
      {
        size: "Dairy Ultra Mineral Lick — 2KG",
        blurb: "A high-fertility, high-milk mineral formula for dairy cows, heifers and bulls.",
        img: "/molaplus/dairy-ultra-mineral-lick-2kg.webp",
      },
      {
        size: "Early Calf-Weaner Meal — 10KG",
        blurb: "Supports early rumen development, steady growth and a confident transition to solid feed.",
        img: "/molaplus/early-calf-weaner-10kg.webp",
      },
    ],
  },
  {
    id: "pig-microbes",
    eyebrow: "Livestock",
    name: "Pig Microbes",
    tagline:
      "Multi-strain probiotic for pigs and livestock \u2014 improving digestion, gut health and feed efficiency.",
    href: "/product-comparison",
    sizes: [
      { size: "1 Litre Solution", blurb: "1 Litre - Small Farms", img: "/molaplus/pig-1ltr.webp" },
      { size: "5 Litre Solution", blurb: "5 Litre - Commercial", img: "/molaplus/pig-5ltr.webp" },
      { size: "20 Litre Solution", blurb: "20 Litre - Large Scale", img: "/molaplus/pig-20ltr.webp" },
      { size: "10 Litre Solution", blurb: "10 Litre - Growing Farms", img: "/molaplus/pig-microbes-10l.webp" },
    ],
  },
  {
    id: "steaming-formula",
    eyebrow: "Dairy support",
    name: "MolaPlus Steaming Formula",
    tagline: "Targeted nutritional support for dairy cows approaching calving and the demanding transition into lactation.",
    href: "/contact",
    sizes: [
      { size: "5KG Bucket", blurb: "A practical dairy formula for pre-calving and transition support.", img: "/molaplus/steaming-formula-5kg.webp" },
    ],
  },
  {
    id: "complete-feeds",
    eyebrow: "Complete feeds",
    name: "Farm Feeds",
    tagline:
      "Purpose-built rations for productive dairy animals and reliable commercial egg production.",
    href: "/contact",
    sizes: [
      {
        size: "MolaPlus Bovine Meal",
        blurb: "A protein-rich feed for lactating cows, growing animals and breeding bulls.",
        img: "/molaplus/molaplus-bovine-meal.webp",
      },
      {
        size: "MolaPlus Layer Mash — 50KG",
        blurb: "A complete layer ration formulated for sustained production and strong egg quality.",
        img: "/molaplus/molaplus-layer-mash-50kg.webp",
      },
    ],
  },
  {
    id: "crop-nutrition",
    eyebrow: "Crop nutrition",
    name: "MazaoBoost Crop Solutions",
    tagline:
      "Practical crop nutrition and beneficial microbial products for stronger plants, healthier soils and better farm yields.",
    href: "/contact",
    sizes: [
      {
        size: "Mazao Cereals — 250ML",
        blurb: "Concentrated foliar nutrition for maize, wheat and other cereal crops.",
        img: "/molaplus/mazao-cereals-250ml.webp",
      },
      {
        size: "Mazao Cereals — 500ML",
        blurb: "A larger cereal-crop pack for broader acreage and repeat applications.",
        img: "/molaplus/mazao-cereals-500ml.webp",
      },
      {
        size: "Mazao Organic Fertilizer",
        blurb: "Organic planting fertilizer with beneficial soil probiotics and locked nutrient release.",
        img: "/molaplus/mazao-organic-fertilizer.webp",
      },
      {
        size: "MolaPlus V-EM Mbolea",
        blurb: "Effective microorganisms for organic and conventional crop production.",
        img: "/molaplus/v-em-mbolea.webp",
      },
    ],
  },
];

export default function ProductsPage() {
  return (
    <div className="editorial-page overflow-x-hidden bg-surface text-on-surface">
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
              <p className="mp-eyebrow text-white/60">Buy online &amp; pay via M-Pesa</p>
              <p className="text-2xl font-extrabold text-secondary-fixed-dim">Till no: 906520</p>
            </div>
            <div className="hidden h-10 w-px bg-white/20 sm:block" />
            <div>
              <p className="mp-eyebrow text-white/60">Logistics &amp; prices call</p>
              <a className="text-2xl font-extrabold text-white transition-opacity hover:opacity-80" href="tel:+254722656142">
                +254 722 656 142
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
                <span className="material-symbols-outlined">arrow_outward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product groups */}
      {groups.map((group, i) => (
        <section
          className={i % 2 === 1 ? "bg-surface-container-low py-16 md:py-24" : "bg-surface py-16 md:py-24"}
          id={group.id}
          key={group.id}
        >
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end" data-reveal>
              <div className="max-w-2xl">
                <span className="mp-eyebrow text-secondary">{group.eyebrow}</span>
                <h2 className="mp-display-sm mt-3 text-ink-black">{group.name}</h2>
                <p className="mt-4 text-on-surface-variant">{group.tagline}</p>
              </div>
              <Link
                className="group inline-flex items-center gap-1 whitespace-nowrap font-bold text-primary underline-offset-4 hover:underline"
                href={group.href}
              >
                {group.id === "super-milk-booster" ? "View details" : group.href === "/contact" ? "Ask our team" : "Compare products"}
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_outward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3" data-reveal data-reveal-stagger>
              {group.sizes.map((s) => (
                <div
                  className="mp-hover-lift group flex flex-col overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest"
                  key={s.size}
                >
                  <div className="product-card__media relative h-72 w-full overflow-hidden">
                    <Image
                      alt={`${group.name} ${s.size}`}
                      className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                      fill
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                      src={s.img}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-extrabold tracking-tight text-ink-black">{s.size}</h3>
                    <p className="mt-2 flex-1 text-sm text-on-surface-variant">{s.blurb}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <a
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-container"
                        href="tel:+254722656142"
                      >
                        Order now
                        <span className="material-symbols-outlined text-[18px]">trending_flat</span>
                      </a>
                      <a
                        className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-surface-container-high"
                        href="https://wa.me/254722656142"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
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
              <span className="mp-eyebrow text-secondary">Compare</span>
              <h2 className="mp-display-sm mt-3 text-ink-black">Not sure which product fits your farm?</h2>
              <p className="mt-4 text-on-surface-variant">
                Compare nutrient profiles and application methods side by side, or
                talk to our team for a tailored recommendation.
              </p>
            </div>
            <Link
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-primary-container"
              href="/product-comparison"
            >
              <span className="material-symbols-outlined">analytics</span>
              Compare products
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
