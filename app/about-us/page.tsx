import Link from "next/link";

const values = [
  ["science", "Scientific Rigor", "Every formulation is grounded in research, fermentation science and testing."],
  ["diversity_3", "Farmer-Centricity", "Solutions designed around the real needs of East African farmers."],
  ["verified", "Integrity & Transparency", "Honest guidance and dependable products, season after season."],
];

const impact = [
  ["swap_horiz", "Import Substitution", "Reducing reliance on expensive imported additives with high-performance local alternatives."],
  ["eco", "Sustainability", "Promoting animal health through natural probiotics rather than prophylactic antibiotics."],
];

export default function AboutPage() {
  return (
    <div className="editorial-page overflow-x-hidden bg-surface text-on-surface">
      {/* Hero */}
      <section className="mp-scene mp-grain relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-container-max-width px-margin-mobile py-14 text-white md:px-margin-desktop md:py-20">
          <span className="mp-eyebrow text-primary-fixed-dim">About MolaPlus</span>
          <h1 className="mp-display mt-5 max-w-4xl">
            Science-driven nutrition for a sustainable future
          </h1>
          <p className="text-pretty mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
            Pioneering biotechnology and probiotic solutions to empower East
            Africa&apos;s livestock industry.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-8 py-4 font-bold text-white transition-all hover:bg-secondary" href="/products">
              Explore Solutions
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link className="glass-effect inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-primary" href="/resources">
              Our Research
            </Link>
          </div>
        </div>
      </section>

      {/* Evolution */}
      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto grid max-w-container-max-width grid-cols-1 gap-12 px-margin-mobile lg:grid-cols-12 md:px-margin-desktop">
          <div className="lg:col-span-4" data-reveal>
            <span className="mp-eyebrow text-secondary">Our Evolution</span>
            <h2 className="mp-display-sm mt-3 text-ink-black">Innovation in animal nutrition</h2>
          </div>
          <div className="space-y-6 text-lg text-on-surface-variant lg:col-span-8" data-reveal>
            <p>
              MolaPlus Africa emerged from a critical need to address nutritional
              gaps in regional livestock production. What started as a local
              initiative has evolved into a leading biotechnology powerhouse,
              specializing in high-performance probiotic feed additives.
            </p>
            <p>
              Our journey has been defined by a commitment to the &apos;One
              Health&apos; approach&mdash;optimizing animal health to ensure human
              food security and environmental sustainability. By leveraging
              indigenous micro-organisms and modern fermentation science, we&apos;ve
              revolutionized how farmers across the continent approach feed
              efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-surface-container-low py-20 md:py-28">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="mb-12 max-w-2xl" data-reveal>
            <span className="mp-eyebrow text-secondary">Our Core Pillars</span>
            <h2 className="mp-display-sm mt-3 text-ink-black">
              The principles that guide our research, production, and partnerships
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2" data-reveal data-reveal-stagger>
            <div className="rounded-3xl border border-outline-variant bg-white p-8">
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
              <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-ink-black">Our Mission</h3>
              <p className="mt-3 text-on-surface-variant">
                To provide innovative, cost-effective, and scientifically-proven
                nutritional solutions that enhance livestock productivity and
                farmer livelihoods.
              </p>
            </div>
            <div className="rounded-3xl border border-outline-variant bg-white p-8">
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
              <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-ink-black">Our Vision</h3>
              <p className="mt-3 text-on-surface-variant">
                To be the foremost provider of biotechnology-driven animal health
                solutions in Africa, setting the standard for sustainable
                agriculture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="mb-12 text-center" data-reveal>
            <span className="mp-eyebrow text-secondary">Core Values</span>
            <h2 className="mp-display-sm mx-auto mt-3 max-w-2xl text-ink-black">What we stand for</h2>
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3" data-reveal data-reveal-stagger>
            {values.map(([icon, title, body]) => (
              <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 text-center" key={title}>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
                <h3 className="mt-5 text-xl font-extrabold tracking-tight text-primary">{title}</h3>
                <p className="mt-3 text-on-surface-variant">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local impact */}
      <section className="bg-surface-container-low py-20 md:py-28">
        <div className="mx-auto grid max-w-container-max-width grid-cols-1 gap-12 px-margin-mobile lg:grid-cols-2 md:px-margin-desktop">
          <div data-reveal>
            <span className="mp-eyebrow text-secondary">Global standards, local impact</span>
            <h2 className="mp-display-sm mt-3 text-ink-black">Built for East African farming</h2>
            <p className="mt-5 text-lg text-on-surface-variant">
              While we adhere to strict manufacturing and biotechnology safety
              practices, our focus remains localized. We understand the specific
              challenges of East African climates, forages, and breeds.
            </p>
          </div>
          <div className="space-y-4" data-reveal>
            {impact.map(([icon, title, body]) => (
              <div className="flex items-start gap-4 rounded-2xl border border-outline-variant bg-white p-6" key={title}>
                <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                <div>
                  <p className="text-lg font-extrabold text-ink-black">{title}</p>
                  <p className="mt-1 text-on-surface-variant">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 pt-4 md:pb-28">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="mp-scene mp-grain relative overflow-hidden rounded-[2.5rem] p-8 text-center text-white md:p-16" data-reveal>
            <div className="relative z-10 mx-auto max-w-2xl">
              <h2 className="mp-display-sm">Partner with the pioneers</h2>
              <p className="text-pretty mx-auto mt-5 max-w-xl text-lg text-white/80">
                Ready to experience the science of superior nutrition? Connect with
                our technical experts today.
              </p>
              <Link className="mt-9 inline-flex items-center gap-2 rounded-full bg-secondary-container px-8 py-4 font-bold text-white shadow-xl transition-all hover:bg-secondary" href="/contact">
                Request a Consultation
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
