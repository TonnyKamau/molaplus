import "server-only";
import type { Post } from "../../app/blog/posts";
import { createPublicClient } from "../supabase/public";

type Row = { record: { published: Post | null; archived: boolean } };

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

  return ((data || []) as Row[])
    .map((row) => row.record.published)
    .filter((post): post is Post => Boolean(post))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date));
}
