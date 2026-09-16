import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "../BlogCard";
import { ShareArticle } from "../ShareArticle";
import { formatDate, readingMinutes, summarize } from "../posts";
import { publishedPosts } from "../../../lib/studio/content";
import { postBody, postHeadings } from "../../../lib/studio/model";
import { ArticleBody } from "../ArticleBody";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await publishedPosts()).find((p) => p.slug === slug);
  if (!post) return { title: "Story not found | MolaPlus Africa" };
  return {
    title: `${post.seoTitle || post.title} | MolaPlus Field Notes`, description: post.seoDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, url: `/blog/${post.slug}`, publishedTime: post.date, images: [{ url: post.image, alt: post.imageAlt }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [post.image] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const posts = await publishedPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const related = posts.filter((item) => item.slug !== post.slug).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 3);
  const schema = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt, datePublished: `${post.date}T09:00:00+03:00`, image: `https://molaplusafrica.com${post.image}`, mainEntityOfPage: `https://molaplusafrica.com/blog/${post.slug}`, publisher: { "@type": "Organization", name: "MolaPlus Africa", url: "https://molaplusafrica.com" } };
  return (
    <main className="journal-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <nav className="journal-breadcrumb" aria-label="Breadcrumb"><Link href="/blog">← All stories</Link><span aria-hidden="true">/</span><span>{post.category}</span></nav>
      <article>
        <header className="journal-article-header"><p className="journal-eyebrow">Field notes / {post.category}</p><h1>{post.title}</h1><p className="journal-article-deck">{post.excerpt}</p><div className="journal-byline"><span className="journal-monogram" aria-hidden="true">m<span>+</span></span><div><strong>{post.author || "MolaPlus Africa"}</strong><span><time dateTime={post.date}>{formatDate(post.date)}</time><span aria-hidden="true"> · </span>{readingMinutes(post)} min read</span></div></div></header>
        <figure className={`journal-article-image ${post.image.includes("cutout") || post.image.includes("full-product") ? "journal-article-image--product" : ""}`}><Image src={post.image} alt={post.imageAlt} fill preload sizes="(min-width: 1400px) 1280px, 92vw" /></figure>
        <div className="journal-reading-layout">
          <aside className="journal-reading-sidebar"><nav aria-label="In this article"><p className="journal-eyebrow">In this article</p><ol>{postHeadings(postBody(post)).map((section, index) => <li key={section.id}><a href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a></li>)}</ol></nav><ShareArticle title={post.title} slug={post.slug} /></aside>
          <div className="journal-prose">{post.takeaway && <div className="journal-takeaway"><p className="journal-eyebrow">The takeaway</p><p>{post.takeaway}</p></div>}
            <ArticleBody body={postBody(post)} />
            {!!post.tags?.length && <div className="journal-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
            {!!post.sources?.length && <section className="journal-sources"><h2>Further reading</h2><ul>{post.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.title} <span aria-label="opens in a new tab">↗</span></a></li>)}</ul></section>}
            {post.relatedHref && <div className="journal-article-cta"><p className="journal-eyebrow">Your next step</p><h2>Make it work for your farm.</h2><p>Explore the range or speak to our team about your needs.</p><Link className="journal-button" href={post.relatedHref}>{post.relatedLabel}<span aria-hidden="true">↗</span></Link></div>}
          </div>
        </div>
      </article>
      <section className="journal-related" aria-labelledby="related-heading"><div className="journal-section-heading"><div><p className="journal-eyebrow">Keep exploring</p><h2 id="related-heading">A little more know-how.</h2></div><Link href="/blog">All stories <span aria-hidden="true">↗</span></Link></div><div className="journal-grid">{related.map((item) => <BlogCard post={summarize(item)} key={item.slug} />)}</div></section>
    </main>
  );
}
