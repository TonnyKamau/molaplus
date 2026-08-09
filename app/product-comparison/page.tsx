import Link from "next/link";
import Image from "next/image";

const products = [
  {
    name: "Milk Booster",
    tag: "Dairy",
    img: "/molaplus/milkbooster-2kg.png",
    nutrient: "Vitamins A, D3, E + Essential Minerals",
    method: "Top-dress on fodder (50g/day)",
    href: "/products/super-milk-booster",
  },
  {
    name: "Poultry Microbes",
    tag: "Poultry",
    img: "/molaplus/poultry-5ltr.png",
    nutrient: "Probiotic blend + Amino Acids",
    method: "Water medication (1ml/L)",
    href: "/products#poultry-microbes",
  },
  {
    name: "Pig Microbes",
    tag: "Livestock",
    img: "/molaplus/pig-20ltr.png",
    nutrient: "Concentrated Microbes + Trace Elements",
    method: "Mixed in liquid feed or water",
    href: "/products#pig-microbes",
  },
];

export default function ComparisonPage() {
  return (
    <div className="editorial-page overflow-x-hidden bg-surface text-on-surface">
      {/* Hero */}
      <section className="mp-scene mp-grain relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-container-max-width px-margin-mobile py-14 text-white md:px-margin-desktop md:py-20">
          <span className="mp-eyebrow text-primary-fixed-dim">Product Technical Specs</span>
          <h1 className="mp-display mt-5 max-w-3xl">Scientific Comparison</h1>
          <p className="text-pretty mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
            Analyze technical specifications and farm-fit for our high-performance
            livestock nutritional supplements.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3" data-reveal data-reveal-stagger>
            {products.map((p) => (
              <div className="flex flex-col overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest" key={p.name}>
                <div className="relative h-48 w-full bg-surface-container-low">
                  <Image alt={p.name} className="object-contain p-6" fill sizes="(min-width: 768px) 380px, 100vw" src={p.img} />
                  <span className="absolute left-5 top-5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">{p.tag}</span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h2 className="text-2xl font-extrabold tracking-tight text-ink-black">{p.name}</h2>

                  <div className="mt-6 space-y-5">
                    <div>
                      <p className="mp-eyebrow text-secondary">Nutrient Profile</p>
                      <p className="mt-1 font-semibold text-ink-black">{p.nutrient}</p>
                    </div>
                    <div className="border-t border-outline-variant pt-5">
                      <p className="mp-eyebrow text-secondary">Application Method</p>
                      <p className="mt-1 font-semibold text-ink-black">{p.method}</p>
                    </div>
                    <div className="border-t border-outline-variant pt-5">
                      <p className="mp-eyebrow text-secondary">Farm ROI Analysis</p>
                      <p className="mt-1 text-sm italic text-on-surface-variant">Inquire for a tailored analysis</p>
                    </div>
                  </div>

                  <Link className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white transition-all hover:bg-primary-container" href={p.href}>
                    View product
                    <span className="material-symbols-outlined text-[20px]">trending_flat</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface-container-low py-16 md:py-24">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-outline-variant bg-white p-8 text-center md:flex-row md:p-12 md:text-left" data-reveal>
            <div className="max-w-xl">
              <span className="mp-eyebrow text-secondary">Related Research</span>
              <h2 className="mp-display-sm mt-3 text-ink-black">Need a custom analysis?</h2>
              <p className="mt-4 text-on-surface-variant">
                Our nutritionists can provide a tailored feeding program based on
                your herd&apos;s specific data.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-bold text-white transition-all hover:bg-primary-container" href="/contact">
                Talk to a Specialist
              </Link>
              <Link className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-7 py-3.5 font-bold text-primary transition-colors hover:bg-surface-container-high" href="/resources">
                Technical Resources
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
