import Link from "next/link";
import type { Metadata } from "next";
import { EMAIL_PRIMARY, EMAIL_SECONDARY, MAIN_CONTACT, TEAM } from "../../lib/contacts";
import { breadcrumbSchema, jsonLd, pageMetadata } from "../../lib/seo";

const departments = [
  ["engineering", "Technical Support", "Product usage, dosage, and livestock and crop nutrition advice.", "+254 724 968 847", "tel:+254724968847"],
  ["sell", "Sales & Bulk Orders", "Pricing, bulk quantities and delivery logistics.", "+254 724 968 847", "tel:+254724968847"],
  ["handshake", "Distributor Partnership", "Become a stockist and join our nationwide network.", "Browse the directory", "/distributors"],
];

export const metadata: Metadata = pageMetadata({
  title: "Contact MolaPlus — Orders, Farm Advice & Distributor Enquiries",
  description: "Contact MolaPlus by WhatsApp, phone (+254 724 968 847) or email (molaplus7@gmail.com, info@molaplus.org) to order feed supplements and fertilizers, get farm advice or become a distributor. M-Pesa Till 906520.",
  path: "/contact",
  keywords: ["MolaPlus contact","MolaPlus phone number","become a distributor","buy feed supplements"],
});

const pageSchema = jsonLd({
  "@graph": [
    breadcrumbSchema([["Contact", "/contact"]]),
  ],
});

export default function ContactPage() {
  return (
    <div className="editorial-page contact-page overflow-x-hidden bg-surface text-on-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageSchema }} />
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
              className="contact-card--recommended mp-hover-lift group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-secondary-container p-8 text-white sm:col-span-2 lg:col-span-1"
              href="https://wa.me/254724968847"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div>
                <span className="contact-card__badge mp-eyebrow rounded-full bg-white/20 px-3 py-1.5">Recommended</span>
                <span className="material-symbols-outlined notranslate mt-6 block text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Chat on WhatsApp</h2>
                <p className="mt-2 text-white/85">Message a real person on our team. Fastest way to get answers or place an order.</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-bold transition-all group-hover:gap-3">
                Start chat
                <span className="material-symbols-outlined notranslate">arrow_forward</span>
              </span>
            </a>

            {/* Call */}
            <a className="mp-hover-lift group flex flex-col justify-between rounded-3xl border border-outline-variant bg-surface-container-lowest p-8" href="tel:+254724968847">
              <div>
                <span className="material-symbols-outlined notranslate text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-black">Call us</h2>
                <p className="mt-2 text-on-surface-variant">Speak directly with our technical and sales team.</p>
              </div>
              <span className="mt-6 text-lg font-extrabold text-primary">{MAIN_CONTACT.display}</span>
            </a>

            {/* Email */}
            <div className="mp-hover-lift group flex flex-col justify-between rounded-3xl border border-outline-variant bg-surface-container-lowest p-8">
              <div>
                <span className="material-symbols-outlined notranslate text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-black">Email us</h2>
                <p className="mt-2 text-on-surface-variant">For detailed enquiries and documentation.</p>
              </div>
              <div className="mt-6">
                <a className="block break-all text-lg font-extrabold text-primary hover:underline" href={`mailto:${EMAIL_PRIMARY}`}>{EMAIL_PRIMARY}</a>
                <a className="mt-1 block break-all text-sm font-bold text-on-surface-variant hover:text-primary hover:underline" href={`mailto:${EMAIL_SECONDARY}`}>{EMAIL_SECONDARY}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct lines: team numbers only (no names or roles, by request) */}
      <section className="direct-lines mp-scene mp-grain relative overflow-hidden" id="team">
        <div className="relative z-10 mx-auto max-w-container-max-width px-margin-mobile py-14 md:px-margin-desktop md:py-20">
          <div className="direct-lines__head" data-reveal>
            <div>
              <span className="mp-eyebrow text-primary-fixed-dim">Direct lines</span>
              <h2 className="mp-display-sm mt-3 text-white">
                More lines. <em>Less waiting.</em>
              </h2>
            </div>
            <p className="direct-lines__intro">
              Line busy? Try the next one. Every line reaches the MolaPlus team for orders, prices, delivery and payments, by call or WhatsApp.
            </p>
          </div>
          <ol className="direct-lines__grid" data-reveal data-reveal-stagger>
            {TEAM.map((line, index) => (
              <li className="direct-line" key={line.tel}>
                <span className="direct-line__index">Line {String(index + 1).padStart(2, "0")}</span>
                <a className="direct-line__number" href={`tel:+${line.tel}`} aria-label={`Call ${line.display}`}>
                  {line.display}
                </a>
                <div className="direct-line__actions">
                  <a className="direct-line__btn direct-line__btn--call" href={`tel:+${line.tel}`} aria-label={`Call ${line.display}`}>
                    <span className="material-symbols-outlined notranslate text-[18px]">call</span>Call
                  </a>
                  <a className="direct-line__btn direct-line__btn--chat" href={`https://wa.me/${line.tel}`} rel="noopener noreferrer" target="_blank" aria-label={`WhatsApp ${line.display}`}>
                    <span className="material-symbols-outlined notranslate text-[18px]">chat</span>WhatsApp
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Office + M-Pesa */}
      <section className="bg-surface-container-low py-14 md:py-20">
        <div className="mx-auto grid max-w-container-max-width grid-cols-1 gap-gutter px-margin-mobile sm:grid-cols-3 md:px-margin-desktop" data-reveal>
          <div className="rounded-3xl border border-outline-variant bg-white p-7">
            <span className="material-symbols-outlined notranslate text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            <p className="mp-eyebrow mt-3 text-on-surface-variant">Head Office</p>
            <p className="text-xl font-extrabold text-ink-black">Sungura Road, Nakuru</p>
            <p className="mt-1 text-sm text-on-surface-variant">Between Bidco and Comply · P.O. Box 18100-20100, Kenya</p>
          </div>
          <div className="rounded-3xl border border-outline-variant bg-white p-7">
            <span className="material-symbols-outlined notranslate text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
            <p className="mp-eyebrow mt-3 text-on-surface-variant">Office Hours</p>
            <p className="text-base font-semibold text-ink-black">Reach us any time by phone, WhatsApp or email.</p>
          </div>
          <div className="rounded-3xl border border-outline-variant bg-white p-7">
            <span className="material-symbols-outlined notranslate text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            <p className="mp-eyebrow mt-3 text-on-surface-variant">Lipa na <span className="whitespace-nowrap" translate="no">M-Pesa</span></p>
            <p className="text-xl font-extrabold text-secondary"><span className="whitespace-nowrap" translate="no">Till No: 906520</span></p>
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
            {departments.map(([icon, title, body, cta, href]) => {
              const content = (
                <>
                  <span className="material-symbols-outlined notranslate text-3xl text-primary">{icon}</span>
                  <h3 className="mt-4 text-xl font-extrabold tracking-tight text-ink-black">{title}</h3>
                  <p className="mt-2 flex-1 text-on-surface-variant">{body}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-bold text-primary transition-all group-hover:gap-3">
                    {cta}
                    <span className="material-symbols-outlined notranslate text-[20px]">trending_flat</span>
                  </span>
                </>
              );
              const className = "mp-hover-lift group flex flex-col rounded-3xl border border-outline-variant bg-surface-container-lowest p-7";

              return href.startsWith("/") ? (
                <Link className={className} href={href} key={title}>{content}</Link>
              ) : (
                <a className={className} href={href} key={title}>{content}</a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
