"use client";

import Link from "next/link";

import { useLivePosts } from "../../lib/blog/useLivePosts";
import { formatDate, type PostSummary } from "../blog/posts";

/** Featured story + story grid on /resources, kept in step with the Studio. */
export function ResourceStories({ initialPosts }: { initialPosts: PostSummary[] }) {
  const posts = useLivePosts(initialPosts);
  const featured = posts[0];
  return (
    <>
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
                <span className="material-symbols-outlined notranslate">arrow_forward</span>
              </span>
            </div>
          </Link>

          <div className="mt-10 grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4" data-reveal data-reveal-stagger>
            {posts.slice(1).map((post) => (
              <Link className="mp-hover-lift group flex flex-col rounded-3xl border border-outline-variant bg-surface-container-lowest p-7" href={`/blog/${post.slug}`} key={post.slug}>
                <div className="flex items-center justify-between">
                  <span className="mp-eyebrow rounded-full bg-primary/10 px-3 py-1.5 text-primary">{post.category}</span>
                  <span className="material-symbols-outlined notranslate text-2xl text-primary">article</span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold tracking-tight text-ink-black">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm text-on-surface-variant">{post.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-secondary transition-all group-hover:gap-3">
                  Read story · {formatDate(post.date)}
                  <span className="material-symbols-outlined notranslate text-[18px]">trending_flat</span>
                </span>
              </Link>
            ))}
          </div>
    </>
  );
}
