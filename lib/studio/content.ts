import "server-only";
import type { Post } from "../../app/blog/posts";
import { createPublicClient } from "../supabase/public";

type Row = { record: { published: Post | null; archived: boolean } };
type ViewRow = { slug: string; views: number };

export async function publishedPosts() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("record")
    .eq("published", true)
    .eq("archived", false)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Could not load Supabase blog posts", error.message);
    return [];
  }

  const posts = ((data || []) as Row[])
    .map((row) => row.record.published)
    .filter((post): post is Post => Boolean(post))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date));

  if (!posts.length) return posts;

  const { data: views, error: viewsError } = await supabase
    .from("blog_post_views")
    .select("slug, views")
    .in("slug", posts.map((post) => post.slug));

  if (viewsError) {
    console.error("Could not load Supabase blog views", viewsError.message);
    return posts;
  }

  const bySlug = new Map(((views || []) as ViewRow[]).map((row) => [row.slug, Number(row.views) || 0]));
  return posts.map((post) => ({ ...post, views: bySlug.get(post.slug) ?? 0 }));
}
