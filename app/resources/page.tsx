import Link from "next/link";

import { publishedPosts } from "../../lib/studio/db";
import { formatDate } from "../blog/posts";
export const dynamic = "force-dynamic";

export default function ResourcesPage() {
  const posts = publishedPosts();
  const featured = posts[0];
  return (
    <div className="editorial-page overflow-x-hidden bg-surface text-on-surface">
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
          <Link className="mp-hover-lift group relative block overflow-hidden rounded-[2rem]" data-reveal href={featured ? `/blog/${featured.slug}` : "/consultancy"}>
            <div className="mp-scene mp-grain absolute inset-0" />
            <div className="relative z-10 flex flex-col justify-between gap-8 p-8 md:flex-row md:items-end md:p-12">
              <div className="max-w-xl text-white">
                <div className="flex flex-wrap gap-2">
                  <span className="resource-guide-badge resource-guide-badge--primary mp-eyebrow rounded-full bg-secondary-container px-3 py-1.5 text-white">{featured?.category || "Farm support"}</span>
                  <span className="resource-guide-badge resource-guide-badge--secondary mp-eyebrow rounded-full bg-white/15 px-3 py-1.5 text-white">Field Notes</span>
                </div>
                <h2 className="mp-display-sm mt-5">{featured?.title || "Find guidance for your farm"}</h2>
                <p className="mt-4 text-white/80">
                  {featured?.excerpt || "Talk to our team about your animals, daily routine and goals."}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-primary transition-all group-hover:gap-3">
                {featured ? "Read the story" : "Talk to our team"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </div>
          </Link>

          <div className="mt-10 grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4" data-reveal data-reveal-stagger>
            {posts.slice(1).map((post) => (
              <Link className="mp-hover-lift group flex flex-col rounded-3xl border border-outline-variant bg-surface-container-lowest p-7" href={`/blog/${post.slug}`} key={post.slug}>
                <div className="flex items-center justify-between">
                  <span className="mp-eyebrow rounded-full bg-primary/10 px-3 py-1.5 text-primary">{post.category}</span>
                  <span className="material-symbols-outlined text-2xl text-primary">article</span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold tracking-tight text-ink-black">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm text-on-surface-variant">{post.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-secondary transition-all group-hover:gap-3">
                  Read story · {formatDate(post.date)}
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
