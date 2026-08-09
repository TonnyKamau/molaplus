import Link from "next/link";

const guides = [
  ["DAIRY", "Calf Rearing Guide", "Early stage nutritional protocols for optimal growth.", "pets"],
  ["POULTRY", "Layer Performance", "Maximizing egg quality through microbial gut health.", "egg"],
  ["LIVESTOCK", "Microbial Strains", "Technical specifications of MolaPlus unique cultures.", "biotech"],
  ["RESEARCH", "Feed Analysis Guide", "How to interpret laboratory nutritional reports.", "analytics"],
];

export default function ResourcesPage() {
  return (
    <div className="editorial-page overflow-x-hidden bg-surface text-on-surface">
      {/* Hero */}
      <section className="mp-scene mp-grain relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-container-max-width px-margin-mobile py-14 text-white md:px-margin-desktop md:py-20">
          <span className="mp-eyebrow text-primary-fixed-dim">Scientific Animal Nutrition</span>
          <h1 className="mp-display mt-5 max-w-3xl">Knowledge Hub</h1>
          <p className="text-pretty mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
            Empowering farmers and livestock professionals through science-backed
            nutrition strategies, rigorous laboratory analysis, and industry-leading
            technical documentation.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-8 py-4 font-bold text-white transition-all hover:bg-secondary" href="#library">
              Technical Documentation
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
            <a className="glass-effect inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-primary" href="#library">
              View All Resources
            </a>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-surface py-16 md:py-24" id="library">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <Link className="mp-hover-lift group relative block overflow-hidden rounded-[2rem]" data-reveal href="/contact">
            <div className="mp-scene mp-grain absolute inset-0" />
            <div className="relative z-10 flex flex-col justify-between gap-8 p-8 md:flex-row md:items-end md:p-12">
              <div className="max-w-xl text-white">
                <div className="flex flex-wrap gap-2">
                  <span className="resource-guide-badge resource-guide-badge--primary mp-eyebrow rounded-full bg-secondary-container px-3 py-1.5 text-white">Feeding Guide</span>
                  <span className="resource-guide-badge resource-guide-badge--secondary mp-eyebrow rounded-full bg-white/15 px-3 py-1.5 text-white">Technical Guide</span>
                </div>
                <h2 className="mp-display-sm mt-5">Simply Feeding Dairy</h2>
                <p className="mt-4 text-white/80">
                  The comprehensive 2024 manual on maximizing milk yield through
                  precision probiotic supplementation and microbial balance. Includes
                  updated dosage charts for Holstein and Jersey breeds.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-primary transition-all group-hover:gap-3">
                Read the guide
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </div>
          </Link>

          <div className="mt-10 grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4" data-reveal data-reveal-stagger>
            {guides.map(([tag, title, body, icon]) => (
              <Link className="mp-hover-lift group flex flex-col rounded-3xl border border-outline-variant bg-surface-container-lowest p-7" href="/contact" key={title}>
                <div className="flex items-center justify-between">
                  <span className="mp-eyebrow rounded-full bg-primary/10 px-3 py-1.5 text-primary">{tag}</span>
                  <span className="material-symbols-outlined text-2xl text-primary">{icon}</span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold tracking-tight text-ink-black">{title}</h3>
                <p className="mt-2 flex-1 text-sm text-on-surface-variant">{body}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-secondary transition-all group-hover:gap-3">
                  Request access
                  <span className="material-symbols-outlined text-[18px]">trending_flat</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface-container-low py-16 md:py-24">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-outline-variant bg-white p-8 text-center md:flex-row md:p-12 md:text-left" data-reveal>
            <div className="max-w-xl">
              <span className="mp-eyebrow text-secondary">Support</span>
              <h2 className="mp-display-sm mt-3 text-ink-black">Need expert guidance?</h2>
              <p className="mt-4 text-on-surface-variant">
                Connect with our livestock specialists to develop a tailored
                nutritional strategy for your farm.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-bold text-white transition-all hover:bg-primary-container" href="/contact">
                Contact for Support
              </Link>
              <Link className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-7 py-3.5 font-bold text-primary transition-colors hover:bg-surface-container-high" href="/distributors">
                <span className="material-symbols-outlined text-[20px]">location_on</span>
                Find a Distributor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
