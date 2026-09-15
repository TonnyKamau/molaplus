import type { Post } from "../../app/blog/posts";

export type StudioPost = { id: string; draft: Post; published: Post | null; scheduled: Post | null; scheduledAt: string | null; archived: boolean; revision: number; updatedAt: string; createdAt: string };
export type Revision = { id: number; postId: string; content: Post; createdAt: string; action: string };
export type Media = { id: string; name: string; url: string; createdAt: string; width: number; height: number };
export function slugify(value: string) { return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100); }
export function postBody(post: Post) {
  return post.body ?? post.sections.map((section) => `## ${section.title}\n\n${section.paragraphs.join("\n\n")}${section.checklist ? `\n\n${section.checklist.map((item) => `- ${item}`).join("\n")}` : ""}`).join("\n\n");
}
export function postHeadings(body: string) {
  const counts = new Map<string, number>();
  let fenced = false;
  return body.split("\n").flatMap((line) => {
    if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; return []; }
    const match = !fenced && /^##\s+(.+)$/.exec(line);
    if (!match) return [];
    const title = match[1].replace(/[*_`\[\]]/g, "").trim();
    const base = slugify(title) || "section";
    const count = counts.get(base) ?? 0; counts.set(base, count + 1);
    return [{ title, id: count ? `${base}-${count + 1}` : base }];
  });
}
export function emptyPost(): Post {
  return { title: "", slug: "", excerpt: "", category: "Farm management", image: "", imageAlt: "", date: new Date().toISOString().slice(0, 10), takeaway: "", body: "", sections: [], sources: [], relatedHref: "/consultancy", relatedLabel: "Talk to our team", author: "MolaPlus Africa", tags: [], seoTitle: "", seoDescription: "", featured: false };
}
export function postStatus(post: StudioPost) { return post.archived ? "Archived" : post.scheduledAt ? "Scheduled" : post.published ? "Published" : "Draft"; }
