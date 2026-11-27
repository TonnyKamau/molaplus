"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const packages = [
  { label: "1kg", img: "/molaplus/milkbooster-1kg.webp" },
  { label: "2kg", img: "/molaplus/milkbooster-2kg.webp" },
  { label: "5kg", img: "/molaplus/milkbooster-5kg.webp" },
];

const benefits = [
  ["water_drop", "Milk Production", "Significant yield increase"],
  ["shield", "Boosts Immunity", "Enhanced disease resistance"],
  ["favorite", "Supports Fertility", "Better conception rates"],
  ["trending_up", "Speeds Growth", "Optimal weight gain"],
];

// As described in the MolaPlus Group dealer guide (2026).
const ingredients = ["Energy", "Protein", "Minerals", "Vitamins"];

export default function SuperMilkBoosterPage() {
  const [active, setActive] = useState(1);

  return (
    <div className="editorial-page product-detail-page overflow-x-hidden bg-surface text-on-surface">
      {/* Hero / detail */}
      <section className="product-detail-hero bg-surface py-10 md:py-16">
        <div className="product-detail-hero__grid mx-auto grid max-w-container-max-width grid-cols-1 gap-10 px-margin-mobile lg:grid-cols-2 lg:gap-16 md:px-margin-desktop">
          {/* Image */}
          <div className="product-detail-hero__media mp-scene mp-grain relative flex items-center justify-center overflow-hidden rounded-[2rem] p-8">
            <span className="absolute left-6 top-6 z-10 rounded-full bg-secondary-container px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
              Best Seller
            </span>
            <div className="relative h-72 w-full md:h-96">
              <Image
                alt={`Super Milk Booster ${packages[active].label}`}
                className="object-contain drop-shadow-2xl"
                fill
                fetchPriority="high"
                loading="eager"
                sizes="(min-width: 1024px) 560px, 100vw"
                src={packages[active].img}
              />
            </div>
          </div>

          {/* Details */}
          <div className="product-detail-hero__details flex flex-col justify-center">
            <nav className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant">
              <Link className="hover:text-primary" href="/products">Products</Link>
              <span className="material-symbols-outlined notranslate text-[16px]">chevron_right</span>
              <span className="text-primary">Dairy Nutrition</span>
            </nav>
            <h1 className="mp-display-sm mt-4 text-ink-black">Super Milk Booster</h1>
            <p className="mt-4 max-w-md text-on-surface-variant">
              Our signature mineral and probiotic blend for more milk, better body
              condition and healthier dairy cows.
            </p>

            {/* Size selector */}
            <div className="mt-8">
              <p className="mp-eyebrow mb-3 text-secondary">Select Package Size</p>
              <div className="flex flex-wrap gap-3">
                {packages.map((p, idx) => (
                  <button
                    className={
                      active === idx
                        ? "rounded-2xl border-2 border-[#0c432c] bg-[#0c432c] px-6 py-3 font-extrabold text-white"
                        : "rounded-2xl border-2 border-outline-variant bg-white px-6 py-3 font-bold text-on-surface-variant transition-colors hover:border-primary/40"
                    }
                    key={p.label}
                    onClick={() => setActive(idx)}
                    type="button"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm font-semibold text-on-surface-variant">Also available in 10 kg and 20 kg packs.</p>
            </div>

            {/* Benefits */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {benefits.map(([icon, title, meta]) => (
                <div className="flex items-start gap-3 rounded-2xl border border-outline-variant bg-surface-container-lowest p-4" key={title}>
                  <span className="material-symbols-outlined notranslate text-2xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {icon}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-ink-black">{title}</p>
                    <p className="text-xs text-on-surface-variant">{meta}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Buy panel */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-primary p-5 text-white">
                <p className="mp-eyebrow text-white/60">Buy via <span className="whitespace-nowrap" translate="no">M-Pesa</span></p>
                <p className="mt-1 text-2xl font-extrabold text-secondary-fixed-dim"><span className="whitespace-nowrap" translate="no">Till No: 906520</span></p>
              </div>
              <a className="flex flex-col justify-center rounded-2xl border border-outline-variant bg-white p-5 transition-colors hover:border-primary/40" href="tel:+254724968847">
                <p className="mp-eyebrow text-on-surface-variant">Call for Logistics</p>
                <p className="mt-1 text-lg font-extrabold text-primary">+254 724 968 847</p>
                <p className="mt-1 text-xs text-on-surface-variant">Nationwide delivery for commercial quantities.</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Technical specs */}
      <section className="bg-surface-container-low py-16 md:py-24">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="mb-10" data-reveal>
            <span className="mp-eyebrow text-secondary">Technical Specifications</span>
            <h2 className="mp-display-sm mt-3 text-ink-black">What&apos;s inside</h2>
          </div>
          <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
            <div className="rounded-3xl border border-outline-variant bg-white p-8" data-reveal>
              <h3 className="text-lg font-extrabold text-ink-black">Ingredients</h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {ingredients.map((ing) => (
                  <span className="rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 text-sm font-semibold text-on-surface-variant" key={ing}>
                    {ing}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-outline-variant bg-white p-8" data-reveal>
              <h3 className="text-lg font-extrabold text-ink-black">Dosage Instructions</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-on-surface-variant">
                <li>Put a handful (about 60 g) in the trough at every milking and let the cow lick it, then give the dairy meal.</li>
                <li>Feed twice a day if the cow is milked twice, three times if milked three times.</li>
                <li>Designed to be fed on its own; if you need to mix it, blend 2.5 kg into 70 kg of dairy meal.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 pt-4 md:pb-28">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="mp-scene mp-grain relative overflow-hidden rounded-[2.5rem] p-8 text-center text-white md:p-16">
            <div className="relative z-10 mx-auto max-w-2xl">
              <h2 className="mp-display-sm">Ready to transform your herd&apos;s productivity?</h2>
              <p className="text-pretty mx-auto mt-5 max-w-xl text-lg text-white/80">
                Join farmers across Africa who trust MolaPlus for advanced animal
                nutrition.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
                <Link className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-8 py-4 font-bold text-white shadow-xl transition-all hover:bg-secondary" href="/distributors">
                  <span className="material-symbols-outlined notranslate">location_on</span>
                  Find a Distributor
                </Link>
                <Link className="glass-effect inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-primary" href="/resources">
                  Download Technical Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
