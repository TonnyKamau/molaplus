"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogCard } from "./BlogCard";
import { ArticleViewTracker } from "./ArticleViewTracker";
import { ArticleFeedback } from "./ArticleFeedback";
import { ArticleComments } from "./ArticleComments";
import { ShareArticle } from "./ShareArticle";
import { ArticleBody } from "./ArticleBody";
import { formatDate, readingMinutes, summarize, type Post } from "./posts";
import { postBody, postHeadings } from "../../lib/studio/model";
import { freshUrl, minuteUrl } from "../../lib/blog/live";

/** Derive the slug from the URL when a fallback shell renders an unknown post. */
function slugFromLocation(fallback: string) {
  if (typeof window === "undefined") return fallback;
  const parts = window.location.pathname.replace(/\/+$/, "").split("/");
  const last = parts[parts.length - 1];
  return last && last !== "_" ? decodeURIComponent(last) : fallback;
}

export function BlogArticle({ initialSlug, initialPost }: { initialSlug: string; initialPost: Post | null }) {
  const [slug, setSlug] = useState(initialSlug);
  const [post, setPost] = useState<Post | null>(initialPost);
  const [posts, setPosts] = useState<Post[]>(initialPost ? [initialPost] : []);
  const [state, setState] = useState<"idle" | "loading" | "missing">(initialPost ? "idle" : "loading");

  useEffect(() => {
    const resolved = slugFromLocation(initialSlug);
    setSlug(resolved);
  }, [initialSlug]);

  useEffect(() => {
    // "_" is the placeholder of the shared article shell, not a real article:
    // wait for the real slug from the address bar instead of looking it up.
    if (!slug || slug === "_") return;
    const controller = new AbortController();
    if (!post) setState("loading");
    fetch(minuteUrl("/api/blog/posts"), { signal: controller.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then(async (data) => {
        const live: Post[] = Array.isArray(data?.posts) ? data.posts : [];
        if (live.length) setPosts(live);
        let found = live.find((p) => p.slug === slug) ?? null;
        // Published moments ago? The shared list may be up to a minute old,
        // so ask for this one article directly before saying it is missing.
        if (!found) {
          const direct = await fetch(freshUrl(`/api/blog/posts?slug=${encodeURIComponent(slug)}`), { signal: controller.signal, cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null);
          if (direct?.post?.slug === slug) found = direct.post as Post;
        }
        if (controller.signal.aborted) return;
        if (found) {
          setPost(found);
          setState("idle");
        } else if (!post) {
          setState("missing");
        }
      })
      .catch(() => {
        // A cancelled lookup (the page moved on) is not a missing article.
        if (controller.signal.aborted) return;
        if (!post) setState("missing");
      });
    return () => controller.abort();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state === "loading") {
    return (
      <main className="journal-shell journal-skeleton" aria-busy="true" role="status" aria-label="Loading story">
        <div className="journal-breadcrumb"><span className="sk" style={{ width: "120px", height: "12px" }} /></div>
        <div className="journal-article-header">
          <span className="sk" style={{ width: "150px", height: "12px" }} />
          <span className="sk" style={{ width: "92%", height: "42px", marginTop: "18px" }} />
          <span className="sk" style={{ width: "68%", height: "42px" }} />
          <span className="sk" style={{ width: "80%", height: "16px", marginTop: "20px" }} />
        </div>
        <span className="sk sk-image" />
        <div className="journal-prose">
          {["100%", "96%", "90%", "98%", "84%", "93%"].map((w, i) => (
            <span className="sk" key={i} style={{ width: w, height: "14px", margin: "12px 0" }} />
          ))}
        </div>
      </main>
    );
  }

  if (state === "missing" || !post) {
    return (
      <main className="journal-shell">
        <nav className="journal-breadcrumb" aria-label="Breadcrumb"><Link href="/blog">← All stories</Link></nav>
        <header className="journal-article-header"><h1>Story not found.</h1><p className="journal-article-deck">This article may have moved or is no longer published.</p></header>
        <div className="journal-article-cta"><Link className="journal-button" href="/blog">Browse all stories<span aria-hidden="true">↗</span></Link></div>
      </main>
    );
  }

  const related = posts
    .filter((item) => item.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);
  const schema = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt, datePublished: `${post.date}T09:00:00+03:00`, image: `https://molaplus.org${post.image}`, mainEntityOfPage: `https://molaplus.org/blog/${post.slug}`, publisher: { "@type": "Organization", name: "MolaPlus", url: "https://molaplus.org" } };

  return (
    <main className="journal-shell journal-article-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <nav className="journal-breadcrumb" aria-label="Breadcrumb"><Link href="/blog">← All stories</Link><span aria-hidden="true">/</span><span>{post.category}</span></nav>
      <article>
        <header className="journal-article-header"><p className="journal-eyebrow">Field notes / {post.category}</p><h1>{post.title}</h1><p className="journal-article-deck">{post.excerpt}</p><div className="journal-byline"><span className="journal-monogram" aria-hidden="true">m<span>+</span></span><div><strong>{post.author || "MolaPlus"}</strong><span><time dateTime={post.date}>{formatDate(post.date)}</time><span aria-hidden="true"> · </span>{readingMinutes(post)} min read<span aria-hidden="true"> · </span><ArticleViewTracker slug={post.slug} initialViews={post.views ?? 0} /></span></div></div><ShareArticle title={post.title} slug={post.slug} /></header>
        <figure className={`journal-article-image ${post.image.includes("cutout") || post.image.includes("full-product") ? "journal-article-image--product" : ""}`}><Image src={post.image} alt={post.imageAlt} fill sizes="(min-width: 1400px) 1280px, 92vw" /></figure>
        <div className="journal-reading-layout">
          <aside className="journal-reading-sidebar"><nav aria-label="In this article"><p className="journal-eyebrow">In this article</p><ol>{postHeadings(postBody(post)).map((section, index) => <li key={section.id}><a href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a></li>)}</ol></nav></aside>
          <div className="journal-prose">{post.takeaway && <div className="journal-takeaway"><p className="journal-eyebrow">The takeaway</p><p>{post.takeaway}</p></div>}
            <ArticleBody body={postBody(post)} />
            <ArticleFeedback slug={post.slug} />
            <ArticleComments slug={post.slug} />
            {!!post.tags?.length && <div className="journal-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
            {!!post.sources?.length && <section className="journal-sources"><h2>Further reading</h2><ul>{post.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.title} <span aria-label="opens in a new tab">↗</span></a></li>)}</ul></section>}
            {post.relatedHref && <div className="journal-article-cta"><p className="journal-eyebrow">Your next step</p><h2>Make it work for your farm.</h2><p>Explore the range or speak to our team about your needs.</p><Link className="journal-button" href={post.relatedHref}>{post.relatedLabel}<span aria-hidden="true">↗</span></Link></div>}
          </div>
        </div>
      </article>
      {related.length > 0 && <section className="journal-related" aria-labelledby="related-heading"><div className="journal-section-heading"><div><p className="journal-eyebrow">Keep exploring</p><h2 id="related-heading">A little more know-how.</h2></div><Link href="/blog">All stories <span aria-hidden="true">↗</span></Link></div><div className="journal-grid">{related.map((item) => <BlogCard post={summarize(item)} key={item.slug} />)}</div></section>}
    </main>
  );
}
