import type { Metadata } from "next";
import { buildTimePosts } from "../../../lib/blog/published";
import { BlogArticle } from "../BlogArticle";

type Props = { params: Promise<{ slug: string }> };

// Build a static shell for every known post, plus a "_" fallback shell that
// Apache serves for posts added later (they render client-side from the API).
export function generateStaticParams() {
  return [...buildTimePosts().map((post) => ({ slug: post.slug })), { slug: "_" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = buildTimePosts().find((p) => p.slug === slug);
  if (!post) return { title: { absolute: "MolaPlus Field Notes" } };
  return {
    title: { absolute: `${post.seoTitle || post.title} | MolaPlus Field Notes` },
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, url: `/blog/${post.slug}`, publishedTime: post.date, images: [{ url: post.image, alt: post.imageAlt }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [post.image] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = buildTimePosts().find((p) => p.slug === slug) ?? null;
  return <BlogArticle initialSlug={slug} initialPost={post} />;
}
