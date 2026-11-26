"use client";

import Image from "next/image";
import Link from "next/link";

import { useLivePosts } from "../../lib/blog/useLivePosts";
import type { PostSummary } from "../blog/posts";

/** Homepage "Field notes" grid: the three newest published articles, live. */
export function HomeJournal({ initialPosts }: { initialPosts: PostSummary[] }) {
  const posts = useLivePosts(initialPosts);
  return (
    <div className="support-v2__grid">
      {posts.slice(0, 3).map((post) => (
        <Link href={`/blog/${post.slug}`} key={post.slug}>
          <div className="support-v2__image">
            <Image src={post.image} alt={post.imageAlt} fill sizes="(min-width: 800px) 30vw, 100vw" />
          </div>
          <p className="home-journal__meta">{post.category} · {post.minutes} min read</p>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <b>Read the story ↗</b>
        </Link>
      ))}
    </div>
  );
}
