"use client";

import Image from "next/image";
import Link from "next/link";
import { plural, useT } from "../../lib/i18n";
import { categoryFr, formatDate, type PostSummary } from "./posts";

export function BlogCard({ post }: { post: PostSummary }) {
  const t = useT();
  const fr = t.lang === "fr";
  return (
    <article className="journal-card">
      <Link href={`/blog/${post.slug}`} className="journal-card__link">
        <div className={`journal-card__image ${post.image.includes("cutout") || post.image.includes("full-product") ? "journal-card__image--product" : ""}`}>
          <Image src={post.image} alt={post.imageAlt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw" />
          <span className="journal-card__arrow" aria-hidden="true">↗</span>
        </div>
        <div className="journal-meta" translate="no"><span>{fr ? categoryFr[post.category] ?? post.category : post.category}</span><span>{t(`${post.minutes} min read`, `${post.minutes} min de lecture`)}</span><span>{fr ? plural(post.views ?? 0, "vue", "vues", "fr") : `${(post.views ?? 0).toLocaleString()} views`}</span></div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </Link>
    </article>
  );
}
