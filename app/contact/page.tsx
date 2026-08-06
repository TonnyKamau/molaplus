import Link from "next/link";

const departments = [
  ["engineering", "Technical Support", "Product usage, dosage and livestock nutrition advice.", "+254 724 968 847", "tel:+254724968847"],
  ["sell", "Sales & Bulk Orders", "Pricing, bulk quantities and delivery logistics.", "+254 724 968 847", "tel:+254724968847"],
  ["handshake", "Distributor Partnership", "Become a stockist and join our nationwide network.", "Browse the directory", "/distributors"],
];

export default function ContactPage() {
  return (
    <div className="overflow-x-hidden bg-surface text-on-surface">
      {/* Hero */}
      <section className="mp-scene mp-grain relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-container-max-width px-margin-mobile py-14 text-white md:px-margin-desktop md:py-20">
          <span className="mp-eyebrow inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-growth-green" />
            We respond within 24 hours
          </span>
          <h1 className="mp-display mt-6 max-w-3xl">Get in touch</h1>
          <p className="text-pretty mt-5 max-w-2xl text-base text-white/80 sm:text-lg md:text-xl">
            Our scientific nutrition team is ready to help you optimize growth and
            maximize yield. Reach us any time by WhatsApp, phone or email.
          </p>
        </div>
      </section>

      {/* Primary channels */}
      <section className="bg-surface py-14 md:py-20">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3" data-reveal data-reveal-stagger>
            {/* WhatsApp (recommended) */}
            <a
              className="mp-hover-lift group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-secondary-container p-8 text-white sm:col-span-2 lg:col-span-1"
              href="https://wa.me/254724968847"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div>
                <span className="mp-eyebrow rounded-full bg-white/20 px-3 py-1.5">Recommended</span>
                <span className="material-symbols-outlined mt-6 block text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Chat on WhatsApp</h2>
                <p className="mt-2 text-white/85">Message a real person on our team. Fastest way to get answers or place an order.</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-bold transition-all group-hover:gap-3">
                Start chat
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </a>

            {/* Call */}
            <a className="mp-hover-lift group flex flex-col justify-between rounded-3xl border border-outline-variant bg-surface-container-lowest p-8" href="tel:+254724968847">
              <div>
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-black">Call us</h2>
                <p className="mt-2 text-on-surface-variant">Speak directly with our technical and sales team.</p>
              </div>
              <span className="mt-6 text-lg font-extrabold text-primary">+254 724 968 847</span>
            </a>

            {/* Email */}
            <a className="mp-hover-lift group flex flex-col justify-between rounded-3xl border border-outline-variant bg-surface-container-lowest p-8" href="mailto:info@molaplusafrica.com">
              <div>
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-black">Email us</h2>
                <p className="mt-2 text-on-surface-variant">For detailed enquiries and documentation.</p>
              </div>
              <span className="mt-6 break-all text-lg font-extrabold text-primary">info@molaplusafrica.com</span>
            </a>
          </div>
        </div>
      </section>

      {/* Office + M-Pesa */}
      <section className="bg-surface-container-low py-14 md:py-20">
        <div className="mx-auto grid max-w-container-max-width grid-cols-1 gap-gutter px-margin-mobile sm:grid-cols-3 md:px-margin-desktop" data-reveal>
          <div className="rounded-3xl border border-outline-variant bg-white p-7">
            <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            <p className="mp-eyebrow mt-3 text-on-surface-variant">Head Office</p>
            <p className="text-xl font-extrabold text-ink-black">Kenya</p>
          </div>
          <div className="rounded-3xl border border-outline-variant bg-white p-7">
            <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
            <p className="mp-eyebrow mt-3 text-on-surface-variant">Office Hours</p>
            <p className="text-base font-semibold text-ink-black">Reach us any time by phone, WhatsApp or email.</p>
          </div>
          <div className="rounded-3xl border border-outline-variant bg-white p-7">
            <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            <p className="mp-eyebrow mt-3 text-on-surface-variant">Lipa na M-Pesa</p>
            <p className="text-xl font-extrabold text-secondary">Till No: 906520</p>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="bg-surface py-14 md:py-20">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="mb-10 max-w-2xl" data-reveal>
            <span className="mp-eyebrow text-secondary">Who to talk to</span>
            <h2 className="mp-display-sm mt-3 text-ink-black">Reach the right team</h2>
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3" data-reveal data-reveal-stagger>
            {departments.map(([icon, title, body, cta, href]) => (
              <Link className="mp-hover-lift group flex flex-col rounded-3xl border border-outline-variant bg-surface-container-lowest p-7" href={href} key={title}>
                <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
                <h3 className="mt-4 text-xl font-extrabold tracking-tight text-ink-black">{title}</h3>
                <p className="mt-2 flex-1 text-on-surface-variant">{body}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-bold text-primary transition-all group-hover:gap-3">
                  {cta}
                  <span className="material-symbols-outlined text-[20px]">trending_flat</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
