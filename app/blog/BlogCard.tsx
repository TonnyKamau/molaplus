import Image from "next/image";
import Link from "next/link";
import { formatDate, type PostSummary } from "./posts";

export function BlogCard({ post }: { post: PostSummary }) {
  return (
    <article className="journal-card">
      <Link href={`/blog/${post.slug}`} className="journal-card__link">
        <div className={`journal-card__image ${post.image.includes("cutout") || post.image.includes("full-product") ? "journal-card__image--product" : ""}`}>
          <Image src={post.image} alt={post.imageAlt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw" />
          <span className="journal-card__arrow" aria-hidden="true">↗</span>
        </div>
        <div className="journal-meta"><span>{post.category}</span><span>{post.minutes} min read</span><span>{(post.views ?? 0).toLocaleString()} views</span></div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </Link>
    </article>
  );
}
