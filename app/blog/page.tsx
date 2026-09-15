import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogLibrary } from "./BlogLibrary";
import { formatDate, readingMinutes, summarize } from "./posts";
import { publishedPosts } from "../../lib/studio/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Field Notes — The MolaPlus Blog | MolaPlus Africa",
  description: "Practical reading for better farming. Explore dairy, poultry, livestock and farm management stories from MolaPlus Africa.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/feed.xml" } },
  openGraph: { title: "Field Notes — The MolaPlus Blog", description: "Good knowledge. Better farming. Practical ideas for the everyday work of farming.", url: "/blog", images: [{ url: "/molaplus/service-cows.webp", alt: "A dairy cow and calf at pasture" }] },
  twitter: { card: "summary_large_image", title: "Field Notes — The MolaPlus Blog", description: "Practical ideas for the everyday work of farming.", images: ["/molaplus/service-cows.webp"] },
};

export default function BlogPage() {
  const posts = publishedPosts();
  const featured = posts[0];
  return (
    <main className="journal-shell">
      <header className="journal-masthead">
        <div><p className="journal-eyebrow"><span />Field notes / The MolaPlus blog</p><h1>Good knowledge.<br /><em>Better farming.</em></h1></div>
        <div className="journal-masthead__intro"><p>For the early starts, the daily decisions, and the farms that feed us. Practical ideas to take back to your farm.</p><a href="#stories">Find your next read <span aria-hidden="true">↓</span></a></div>
      </header>

      {featured && <section className="journal-featured" aria-label="Featured and latest stories">
        <article className="journal-lead">
          <Link href={`/blog/${featured.slug}`}>
            <Image src={featured.image} alt={featured.imageAlt} fill preload sizes="(min-width: 900px) 62vw, 92vw" />
            <span className="journal-lead__badge">The featured read</span>
            <div className="journal-lead__copy"><div className="journal-meta"><span>{featured.category}</span><span>{readingMinutes(featured)} min read</span></div><h2>{featured.title}</h2><div className="journal-lead__bottom"><p>{featured.excerpt}</p><span aria-hidden="true">↗</span></div></div>
          </Link>
        </article>
        <aside className="journal-latest" aria-labelledby="latest-heading"><div className="journal-latest__heading"><h2 id="latest-heading">On the reading list</h2><span>{Math.min(2, Math.max(0, posts.length - 1))} stories</span></div>
          {posts.slice(1, 3).map((post, index) => <article key={post.slug}><Link href={`/blog/${post.slug}`}><span className="journal-latest__number">0{index + 1}</span><div><div className="journal-meta"><span>{post.category}</span><span>{readingMinutes(post)} min</span></div><h3>{post.title}</h3><time dateTime={post.date}>{formatDate(post.date)}</time></div><span aria-hidden="true">↗</span></Link></article>)}
          <div className="journal-fieldnote"><span className="journal-eyebrow">Rooted in the everyday</span><p>Small steps.<br />Stronger farms.</p><a href="#stories">Explore the journal <span aria-hidden="true">↗</span></a><svg viewBox="0 0 100 110" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M50 110V23M50 81C13 81 8 58 8 47c31 0 42 14 42 34ZM50 61C87 61 92 38 92 27c-31 0-42 14-42 34ZM50 40C25 27 33 9 44 0c19 16 20 25 6 40Z" /></svg></div>
        </aside>
      </section>}

      <BlogLibrary posts={posts.map(summarize)} />
      <section className="journal-help"><div><p className="journal-eyebrow">Put knowledge into practice</p><h2>Your farm.<br /><em>Let’s talk about it.</em></h2><p>Every farm is different. Get guidance shaped around your animals, your routine and your goals.</p></div><Link className="journal-button journal-button--light" href="/consultancy">Talk to our team <span aria-hidden="true">↗</span></Link></section>
    </main>
  );
}
