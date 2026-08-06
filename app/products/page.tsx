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
      { size: "1KG Package", blurb: "Ideal for small-scale dairy farms and individual homesteads.", img: "/molaplus/milkbooster-1kg.png" },
      { size: "2KG Package", blurb: "Perfect for medium-sized dairy operations seeking efficiency.", img: "/molaplus/milkbooster-2kg.png" },
      { size: "5KG Package", blurb: "Designed for large commercial dairy farms and bulk buyers.", img: "/molaplus/milkbooster-5kg.png" },
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
      { size: "500ml Solution", blurb: "For small poultry flocks", img: "/molaplus/poultry-500ml.png" },
      { size: "1 Litre Solution", blurb: "For medium-sized farms", img: "/molaplus/poultry-1ltr.png" },
      { size: "5 Litre Solution", blurb: "For large operations", img: "/molaplus/poultry-5ltr.png" },
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
      { size: "1 Litre Solution", blurb: "1 Litre - Small Farms", img: "/molaplus/pig-1ltr.png" },
      { size: "5 Litre Solution", blurb: "5 Litre - Commercial", img: "/molaplus/pig-5ltr.png" },
      { size: "20 Litre Solution", blurb: "20 Litre - Large Scale", img: "/molaplus/pig-20ltr.png" },
    ],
  },
];

export default function ProductsPage() {
  return (
    <div className="overflow-x-hidden bg-surface text-on-surface">
      {/* Hero */}
      <section className="mp-scene mp-grain relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-container-max-width px-margin-mobile py-14 text-white md:px-margin-desktop md:py-20">
          <span className="mp-eyebrow text-primary-fixed-dim">The Range</span>
          <h1 className="mp-display mt-5 max-w-3xl">Our Products</h1>
          <p className="text-pretty mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
            Scientifically formulated feed supplements and probiotics for dairy,
            poultry, and swine &mdash; available in package sizes for every scale
            of operation.
          </p>

          <div className="mt-10 inline-flex flex-wrap items-center gap-x-8 gap-y-4 rounded-3xl border border-white/20 bg-white/10 px-7 py-5 backdrop-blur-sm">
            <div>
              <p className="mp-eyebrow text-white/60">Buy online &amp; pay via M-Pesa</p>
              <p className="text-2xl font-extrabold text-secondary-fixed-dim">Till no: 906520</p>
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
                {group.id === "super-milk-booster" ? "View details" : "Compare products"}
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_outward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3" data-reveal data-reveal-stagger>
              {group.sizes.map((s) => (
                <div
                  className="mp-hover-lift group flex flex-col overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest"
                  key={s.size}
                >
                  <div className="relative h-56 w-full overflow-hidden bg-surface-container-low">
                    <Image
                      alt={`${group.name} ${s.size}`}
                      className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
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
                        href="tel:+254724968847"
                      >
                        Order now
                        <span className="material-symbols-outlined text-[18px]">trending_flat</span>
                      </a>
                      <a
                        className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-surface-container-high"
                        href="https://wa.me/254724968847"
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
