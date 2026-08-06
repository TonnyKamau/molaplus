import Link from "next/link";

const expertise = [
  [
    "water_drop",
    "Dairy Herd Management",
    "Optimizing metabolic pathways for sustained peak performance.",
    ["Milk yield & quality enhancement", "Fertility & reproductive health", "Metabolic disease prevention"],
  ],
  [
    "egg",
    "Poultry Optimization",
    "Precision feeding protocols for rapid growth and egg integrity.",
    ["Feed Conversion Ratio (FCR) tuning", "Egg shell strength & yolk quality", "Immune system fortification"],
  ],
  [
    "pets",
    "Pig Nutrition",
    "Advanced strategies for lean meat ratio and gut health.",
    ["Meat-to-fat ratio optimization", "Disease resistance strategies", "Growth cycle acceleration"],
  ],
] as const;

const training = [
  ["health_and_safety", "Disease Control & Biosecurity", "Protocols for preventing outbreaks and maintaining pristine herd health."],
  ["restaurant", "Optimal Feeding Practices", "Practical training on feed preparation, storage, and distribution schedules."],
  ["insights", "Modern Farming Analytics", "Data-driven management techniques for scaling agricultural output."],
];

const support = [
  ["support_agent", "Expert Hotline", "Immediate remote consultation for urgent health or nutritional queries."],
  ["home_work", "On-Site Visits", "Regular scheduled physical inspections and environmental audits."],
  ["biotech", "Lab Integration", "Direct connection to our laboratory for rapid sample testing and results."],
];

export default function ConsultancyPage() {
  return (
    <div className="overflow-x-hidden bg-surface text-on-surface">
      {/* Hero */}
      <section className="mp-scene mp-grain relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-container-max-width px-margin-mobile py-14 text-white md:px-margin-desktop md:py-20">
          <span className="mp-eyebrow text-primary-fixed-dim">Scientific Excellence</span>
          <h1 className="mp-display mt-4 max-w-4xl">Expert agricultural consultancy</h1>
          <p className="text-pretty mt-4 max-w-2xl text-base text-white/80 sm:text-lg md:mt-6 md:text-xl">
            Empowering commercial farmers through science-backed nutrition
            strategies and precision livestock management. We bridge the gap
            between laboratory innovation and field success.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary-container px-8 py-4 font-bold text-white transition-all hover:bg-secondary" href="#book">
              Book a Consultation
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
            <a className="glass-effect inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-primary" href="#expertise">
              View Expertise
            </a>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="bg-surface py-16 md:py-24" id="expertise">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="mb-10 max-w-2xl" data-reveal>
            <span className="mp-eyebrow text-secondary">Our Specialized Expertise</span>
            <h2 className="mp-display-sm mt-3 text-ink-black">
              Precision solutions for high-performance livestock
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3" data-reveal data-reveal-stagger>
            {expertise.map(([icon, title, blurb, bullets]) => (
              <div className="flex flex-col rounded-3xl border border-outline-variant bg-surface-container-lowest p-8" key={title}>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
                <h3 className="mt-5 text-xl font-extrabold tracking-tight text-ink-black">{title}</h3>
                <p className="mt-2 text-on-surface-variant">{blurb}</p>
                <ul className="mt-5 space-y-2.5 border-t border-outline-variant pt-5">
                  {bullets.map((b) => (
                    <li className="flex items-start gap-2 text-sm text-on-surface-variant" key={b}>
                      <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training */}
      <section className="bg-surface-container-low py-16 md:py-24">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="mb-10 max-w-2xl" data-reveal>
            <span className="mp-eyebrow text-secondary">Professional Training Programs</span>
            <h2 className="mp-display-sm mt-3 text-ink-black">Capacity building for your team</h2>
            <p className="mt-4 text-on-surface-variant">
              Intensive training for farm managers and staff, bridging the gap
              between cutting-edge research and daily field operations.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3" data-reveal data-reveal-stagger>
            {training.map(([icon, title, body]) => (
              <div className="rounded-3xl border border-outline-variant bg-white p-8" key={title}>
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                <h3 className="mt-5 text-xl font-extrabold tracking-tight text-ink-black">{title}</h3>
                <p className="mt-3 text-on-surface-variant">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="mb-10 max-w-2xl" data-reveal>
            <span className="mp-eyebrow text-secondary">Technical Field Support</span>
            <h2 className="mp-display-sm mt-3 text-ink-black">Support that keeps farms running</h2>
            <p className="mt-4 text-on-surface-variant">
              Beyond consultancy, we provide continuous on-site support and remote
              assistance to ensure your farm operates at peak efficiency.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3" data-reveal data-reveal-stagger>
            {support.map(([icon, title, body]) => (
              <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-8" key={title}>
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                <h3 className="mt-5 text-xl font-extrabold tracking-tight text-ink-black">{title}</h3>
                <p className="mt-3 text-on-surface-variant">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book (no form - direct channels) */}
      <section className="pb-20 pt-4 md:pb-28" id="book">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="mp-scene mp-grain relative overflow-hidden rounded-[2.5rem] p-8 text-white md:p-14" data-reveal>
            <div className="relative z-10">
              <div className="max-w-2xl">
                <span className="mp-eyebrow text-primary-fixed-dim">Secure your strategy</span>
                <h2 className="mp-display-sm mt-3">Book a discovery session</h2>
                <p className="text-pretty mt-4 max-w-xl text-white/80">
                  Tell our lead consultants about your farm and goals. Message us on
                  WhatsApp or call directly &mdash; we&apos;ll schedule your session.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <a className="mp-hover-lift flex flex-col rounded-3xl bg-secondary-container p-6 text-white" href="https://wa.me/254724968847" rel="noopener noreferrer" target="_blank">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                  <span className="mp-eyebrow mt-3 text-white/70">Recommended</span>
                  <span className="text-lg font-extrabold">WhatsApp us</span>
                </a>
                <a className="mp-hover-lift flex flex-col rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm" href="tel:+254724968847">
                  <span className="material-symbols-outlined text-3xl text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                  <span className="mp-eyebrow mt-3 text-white/60">Phone Support</span>
                  <span className="text-lg font-extrabold">+254 724 968 847</span>
                </a>
                <a className="mp-hover-lift flex flex-col rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm" href="mailto:info@molaplusafrica.com">
                  <span className="material-symbols-outlined text-3xl text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                  <span className="mp-eyebrow mt-3 text-white/60">Email Inquiry</span>
                  <span className="break-all text-lg font-extrabold">info@molaplusafrica.com</span>
                </a>
              </div>
              <p className="mt-6 inline-flex items-center gap-2 text-sm text-white/70">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                Headquarters: Kenya &middot; Nationwide field support
              </p>
              <div className="mt-6">
                <Link className="inline-flex items-center gap-2 font-bold text-white underline-offset-4 hover:underline" href="/distributors">
                  Prefer to visit a stockist? Find one near you
                  <span className="material-symbols-outlined text-[20px]">trending_flat</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
