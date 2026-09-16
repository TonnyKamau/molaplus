import { publishedPosts } from "../../../lib/studio/content";

export const dynamic = "force-dynamic";
const escape = (value: string) => value.replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]!);

export async function GET() {
  const base = "https://molaplusafrica.com";
  const items = (await publishedPosts()).sort((a, b) => b.date.localeCompare(a.date)).map((post) => `<item><title>${escape(post.title)}</title><link>${base}/blog/${post.slug}</link><guid>${base}/blog/${post.slug}</guid><description>${escape(post.excerpt)}</description><category>${escape(post.category)}</category><pubDate>${new Date(`${post.date}T09:00:00+03:00`).toUTCString()}</pubDate></item>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>MolaPlus Field Notes</title><link>${base}/blog</link><description>Practical ideas for better farming.</description><language>en-ke</language>${items}</channel></rss>`, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "no-store" } });
}
