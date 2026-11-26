import Link from "next/link";

import { buildTimePosts } from "../../lib/blog/published";
import { summarize } from "../blog/posts";
import { ResourceStories } from "./ResourceStories";
import type { Metadata } from "next";
import { breadcrumbSchema, jsonLd, pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Farming Guides & Resources — Dairy, Poultry, Pig & Crops",
  description: "Free MolaPlus farming guides: practical advice on dairy feeding, poultry house routines, livestock health, record keeping and getting the most from feed supplements and fertilizers.",
  path: "/resources",
  keywords: ["farming guides","dairy feeding tips","poultry management guide","livestock farming tips"],
});

const pageSchema = jsonLd({
  "@graph": [
    breadcrumbSchema([["Resources", "/resources"]]),
  ],
});

export default function ResourcesPage() {
  const posts = buildTimePosts();
  return (
    <div className="editorial-page overflow-x-hidden bg-surface text-on-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageSchema }} />
      {/* Hero */}
      <section className="mp-scene mp-grain relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-container-max-width px-margin-mobile py-14 text-white md:px-margin-desktop md:py-20">
          <span className="mp-eyebrow text-primary-fixed-dim">Scientific Animal Nutrition</span>
          <h1 className="mp-display mt-5 max-w-3xl">Knowledge Hub</h1>
          <p className="text-pretty mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
            Practical articles for the daily work of farming. Explore routines,
            record keeping and questions to discuss with your farm adviser.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-primary" href="/blog">Read the blog <span aria-hidden="true">↗</span></Link>
            <a className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-8 py-4 font-bold text-white transition-all hover:bg-secondary" href="#library">
              Explore farm guides
              <span className="material-symbols-outlined notranslate">arrow_forward</span>
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
          <ResourceStories initialPosts={posts.map((post) => summarize(post))} />
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
                <span className="material-symbols-outlined notranslate text-[20px]">location_on</span>
                Find a Distributor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
