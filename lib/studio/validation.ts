import { categories, type Post } from "../../app/blog/posts";
import { postBody } from "./model";

export class StudioError extends Error { constructor(message: string, public status = 400) { super(message); } }
export function safeLink(value: string) {
  return /^\/(?!\/)[a-zA-Z0-9/_?=&%#.,+-]*$/.test(value) || /^https:\/\/[^\s<>"\\]+$/.test(value);
}
export function validImage(value: string) { return /^\/molaplus\/[a-z0-9-]+\.webp$/.test(value) || /^\/api\/blog\/media\/[a-f0-9-]{36}$/.test(value); }
function str(value: unknown, max: number, field: string) {
  if (typeof value !== "string" || value.length > max) throw new StudioError(`${field} must be text under ${max} characters.`);
  return value.trim();
}
export function validatePost(input: unknown, publishing = false): Post {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new StudioError("Invalid article.");
  const p = input as Record<string, unknown>;
  const title = str(p.title, 180, "Title");
  const slug = str(p.slug, 100, "URL slug");
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new StudioError("The URL slug can contain lowercase letters, numbers and hyphens.");
  if (!categories.slice(1).includes(p.category as Post["category"])) throw new StudioError("Choose an article category.");
  const image = str(p.image, 200, "Cover image");
  if (image && !validImage(image)) throw new StudioError("Choose a library image or upload a cover image.");
  const date = str(p.date, 10, "Publication date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0,10) !== date) throw new StudioError("Enter a valid publication date.");
  const relatedHref = str(p.relatedHref ?? "", 300, "Related link");
  if (relatedHref && !safeLink(relatedHref)) throw new StudioError("Related links must be a site path or an HTTPS address.");
  if (!Array.isArray(p.tags) || p.tags.length > 10) throw new StudioError("Use up to 10 tags.");
  if (!Array.isArray(p.sources) || p.sources.length > 12) throw new StudioError("Use up to 12 sources.");
  const sources = p.sources.map((source) => {
    if (!source || typeof source !== "object") throw new StudioError("Invalid source.");
    const item = source as Record<string, unknown>;
    const href = str(item.href, 500, "Source address");
    if (publishing && !safeLink(href)) throw new StudioError("Source links must be a site path or an HTTPS address.");
    const title = str(item.title, 180, "Source title");
    if (publishing && !title) throw new StudioError("Give each source a title before publishing.");
    return { title, href };
  });
  const post: Post = { title, slug, category: p.category as Post["category"], excerpt: str(p.excerpt, 500, "Excerpt"), image, imageAlt: str(p.imageAlt, 200, "Image description"), date, takeaway: str(p.takeaway, 500, "Takeaway"), body: str(p.body, 100000, "Article body"), sections: [], author: str(p.author, 100, "Author"), tags: [...new Set(p.tags.map((tag) => str(tag, 40, "Tag")).filter(Boolean))], seoTitle: str(p.seoTitle ?? "", 180, "SEO title"), seoDescription: str(p.seoDescription ?? "", 500, "SEO description"), featured: p.featured === true, sources, relatedHref, relatedLabel: str(p.relatedLabel ?? "", 100, "Related link label") };
  if (publishing && (!title || !slug || !post.excerpt || !image || !post.imageAlt || !post.author || !postBody(post).trim())) throw new StudioError("Add a title, URL slug, excerpt, cover image, image description, author and article text before publishing.");
  if (publishing && relatedHref && !post.relatedLabel) throw new StudioError("Give the related link a label.");
  return post;
}
