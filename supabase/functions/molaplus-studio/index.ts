import "jsr:@supabase/functions-js@2.116.0/edge-runtime.d.ts";
import { withSupabase } from "npm:@supabase/server@1.5.3";

type Source = { title: string; href: string };
type Post = {
  body?: string;
  author?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  slug: string;
  title: string;
  category: "Dairy" | "Poultry" | "Livestock" | "Farm management";
  excerpt: string;
  image: string;
  imageAlt: string;
  date: string;
  takeaway: string;
  sections: unknown[];
  sources?: Source[];
  relatedHref: string;
  relatedLabel: string;
};
type StudioPost = {
  id: string;
  draft: Post;
  published: Post | null;
  scheduled: Post | null;
  scheduledAt: string | null;
  archived: boolean;
  revision: number;
  updatedAt: string;
  createdAt: string;
};

class StudioError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

const uuid = /^[a-f0-9-]{36}$/;
const categories = ["Dairy", "Poultry", "Livestock", "Farm management"];
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "private, no-store" } });
const nowIso = () => new Date().toISOString();
function postColumns(record: StudioPost) {
  return {
    slug: record.draft.slug || null,
    record,
    revision: record.revision,
    archived: record.archived,
    published: !!record.published,
    published_at: record.published?.date ?? null,
    updated_at: record.updatedAt,
    created_at: record.createdAt,
  };
}

function allowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  const configured = (Deno.env.get("MOLAPLUS_ALLOWED_ORIGINS") || "https://molaplusafrica.com").split(",").map((value) => value.trim()).filter(Boolean);
  return configured.includes(origin);
}

function safeLink(value: string) {
  return /^\/(?!\/)[a-zA-Z0-9/_?=&%#.,+-]*$/.test(value) || /^https:\/\/[^\s<>"\\]+$/.test(value);
}

function validImage(value: string) {
  const base = Deno.env.get("SUPABASE_URL")?.replace(/\/$/, "");
  return /^\/molaplus\/[a-z0-9-]+\.webp$/.test(value) ||
    /^\/api\/blog\/media\/[a-f0-9-]{36}$/.test(value) ||
    (!!base && value.startsWith(`${base}/storage/v1/object/public/molaplus-blog-images/`));
}

function text(value: unknown, max: number, field: string) {
  if (typeof value !== "string" || value.length > max) throw new StudioError(`${field} must be text under ${max} characters.`);
  return value.trim();
}

function validatePost(input: unknown, publishing = false): Post {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new StudioError("Invalid article.");
  const raw = input as Record<string, unknown>;
  const title = text(raw.title, 180, "Title");
  const slug = text(raw.slug, 100, "URL slug");
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new StudioError("The URL slug can contain lowercase letters, numbers and hyphens.");
  if (!categories.includes(raw.category as string)) throw new StudioError("Choose an article category.");
  const image = text(raw.image, 500, "Cover image");
  if (image && !validImage(image)) throw new StudioError("Choose a library image or upload a cover image.");
  const date = text(raw.date, 10, "Publication date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new StudioError("Enter a valid publication date.");
  const relatedHref = text(raw.relatedHref ?? "", 300, "Related link");
  if (relatedHref && !safeLink(relatedHref)) throw new StudioError("Related links must be a site path or an HTTPS address.");
  if (!Array.isArray(raw.tags) || raw.tags.length > 10) throw new StudioError("Use up to 10 tags.");
  if (!Array.isArray(raw.sources) || raw.sources.length > 12) throw new StudioError("Use up to 12 sources.");

  const sources = raw.sources.map((source) => {
    if (!source || typeof source !== "object") throw new StudioError("Invalid source.");
    const item = source as Record<string, unknown>;
    const href = text(item.href, 500, "Source address");
    if (publishing && !safeLink(href)) throw new StudioError("Source links must be a site path or an HTTPS address.");
    const title = text(item.title, 180, "Source title");
    if (publishing && !title) throw new StudioError("Give each source a title before publishing.");
    return { title, href };
  });
  const tags = [...new Set(raw.tags.map((tag) => text(tag, 40, "Tag")).filter(Boolean))];
  const post: Post = {
    title,
    slug,
    category: raw.category as Post["category"],
    excerpt: text(raw.excerpt, 500, "Excerpt"),
    image,
    imageAlt: text(raw.imageAlt, 200, "Image description"),
    date,
    takeaway: text(raw.takeaway, 500, "Takeaway"),
    body: text(raw.body, 100000, "Article body"),
    sections: [],
    author: text(raw.author, 100, "Author"),
    tags,
    seoTitle: text(raw.seoTitle ?? "", 180, "SEO title"),
    seoDescription: text(raw.seoDescription ?? "", 500, "SEO description"),
    featured: raw.featured === true,
    sources,
    relatedHref,
    relatedLabel: text(raw.relatedLabel ?? "", 100, "Related link label"),
  };
  if (publishing && (!post.title || !post.slug || !post.excerpt || !post.image || !post.imageAlt || !post.author || !post.body?.trim())) throw new StudioError("Add a title, URL slug, excerpt, cover image, image description, author and article text before publishing.");
  if (publishing && relatedHref && !post.relatedLabel) throw new StudioError("Give the related link a label.");
  return post;
}

function emptyPost(): Post {
  return { title: "", slug: "", excerpt: "", category: "Farm management", image: "", imageAlt: "", date: new Date().toISOString().slice(0, 10), takeaway: "", body: "", sections: [], sources: [], relatedHref: "/consultancy", relatedLabel: "Talk to our team", author: "MolaPlus Africa", tags: [], seoTitle: "", seoDescription: "", featured: false };
}

async function publishDue(studio: ReturnType<typeof withSupabase> extends never ? never : any) {
  const { data, error } = await studio.from("blog_posts").select("id, record").not("record->scheduledAt", "is", null);
  if (error) throw new StudioError("Could not refresh scheduled articles.", 503);
  const due = (data || []).map((row: { record: StudioPost }) => row.record).filter((record) => !record.archived && record.scheduled && record.scheduledAt && Date.parse(record.scheduledAt) <= Date.now());
  for (const record of due) {
    record.published = record.scheduled;
    record.scheduled = null;
    record.scheduledAt = null;
    record.revision++;
    record.updatedAt = nowIso();
    await studio.from("blog_posts").update(postColumns(record)).eq("id", record.id);
  }
}

async function revision(studio: any, record: StudioPost, action: string) {
  await studio.from("blog_revisions").insert({ post_id: record.id, content: record.draft, action });
  const { data } = await studio.from("blog_revisions").select("id").eq("post_id", record.id).order("id", { ascending: false }).range(30, 500);
  const oldIds = (data || []).map((row: { id: number }) => row.id);
  if (oldIds.length) await studio.from("blog_revisions").delete().in("id", oldIds);
}

const handler = {
  fetch: withSupabase({ auth: "user" }, async (request, context) => {
    try {
      if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
      if (!allowedOrigin(request)) return json({ error: "Use the MolaPlus studio from an approved website." }, 403);
      const editorId = context.userClaims?.id;
      if (!editorId || !uuid.test(editorId)) return json({ error: "Please sign in with an approved studio account." }, 401);
      const studio = context.supabaseAdmin;
      const { data: editor, error: accessError } = await studio.from("blog_editors").select("user_id").eq("user_id", editorId).maybeSingle();
      if (accessError) return json({ error: `The editor access table is unavailable (${accessError.code || "?"}).` }, 503);
      if (!editor) return json({ error: "This account does not have permission to manage MolaPlus articles." }, 403);

      if ((request.headers.get("content-type") || "").startsWith("multipart/form-data")) {
        const form = await request.formData();
        const file = form.get("file");
        const name = String(form.get("name") || "Uploaded image").slice(0, 150);
        if (!(file instanceof File) || !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size < 32 || file.size > 5 * 1024 * 1024) return json({ error: "Upload a JPG, PNG or WebP image under 5 MB." }, 400);
        const id = crypto.randomUUID();
        const extension = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
        const path = `${id}.${extension}`;
        const { error } = await studio.storage.from("molaplus-blog-images").upload(path, file, { contentType: file.type, upsert: false, cacheControl: "31536000" });
        if (error) return json({ error: "Image upload failed. Check the storage bucket and editor policy." }, 502);
        const { data: { publicUrl } } = studio.storage.from("molaplus-blog-images").getPublicUrl(path);
        return json({ media: { id, name, url: publicUrl, createdAt: nowIso(), width: 0, height: 0 } }, 201);
      }

      const input = await request.json().catch(() => null) as Record<string, unknown> | null;
      if (!input || typeof input !== "object") return json({ error: "Invalid request." }, 400);
      await publishDue(studio);

      if (input.action === "list") {
        const { data, error } = await studio.from("blog_posts").select("record").order("updated_at", { ascending: false });
        if (error) return json({ error: "Could not load studio articles." }, 503);
        return json({ posts: (data || []).map((row: { record: StudioPost }) => row.record) });
      }

      if (input.action === "media") {
        const { data, error } = await studio.storage.from("molaplus-blog-images").list("", { limit: 500, sortBy: { column: "created_at", order: "desc" } });
        if (error) return json({ error: "Could not load uploaded images." }, 503);
        const media = (data || []).map((item: { name: string; created_at?: string; metadata?: { size?: number } }) => {
          const { data: { publicUrl } } = studio.storage.from("molaplus-blog-images").getPublicUrl(item.name);
          const id = item.name.split(".")[0];
          return { id, name: item.name, url: publicUrl, createdAt: item.created_at || nowIso(), width: 0, height: 0 };
        });
        return json({ media });
      }

      if (input.action === "create") {
        let draft = emptyPost();
        if (typeof input.copyId === "string") {
          const { data } = await studio.from("blog_posts").select("record").eq("id", input.copyId).maybeSingle();
          if (!data) return json({ error: "Article not found." }, 404);
          draft = { ...(data.record as StudioPost).draft, title: `${(data.record as StudioPost).draft.title} (copy)`, slug: "", featured: false };
        }
        const createdAt = nowIso();
        const record: StudioPost = { id: crypto.randomUUID(), draft, published: null, scheduled: null, scheduledAt: null, archived: false, revision: 1, updatedAt: createdAt, createdAt };
        const { error } = await studio.from("blog_posts").insert({ id: record.id, ...postColumns(record) });
        if (error) return json({ error: "Could not create the article." }, 502);
        return json({ post: record }, 201);
      }

      if (input.action === "get") {
        if (typeof input.id !== "string") return json({ error: "Article id is required." }, 400);
        const { data } = await studio.from("blog_posts").select("record").eq("id", input.id).maybeSingle();
        if (!data) return json({ error: "Article not found." }, 404);
        const { data: revisions } = await studio.from("blog_revisions").select("id, post_id, content, created_at, action").eq("post_id", input.id).order("id", { ascending: false }).limit(30);
        return json({ post: data.record, revisions: (revisions || []).map((item: any) => ({ id: item.id, postId: item.post_id, content: item.content, createdAt: item.created_at, action: item.action })) });
      }

      if (input.action === "export") {
        const { data: posts } = await studio.from("blog_posts").select("record").order("updated_at", { ascending: false });
        const { data: revisions } = await studio.from("blog_revisions").select("id, post_id, content, created_at, action").order("id", { ascending: false });
        return json({ version: 3, exportedAt: nowIso(), posts: (posts || []).map((row: { record: StudioPost }) => row.record), revisions: revisions || [] });
      }

      if (typeof input.id !== "string" || typeof input.action !== "string" || !Number.isInteger(input.revision)) return json({ error: "Missing article revision or action." }, 400);
      const { data, error: loadError } = await studio.from("blog_posts").select("record").eq("id", input.id).maybeSingle();
      if (loadError || !data) return json({ error: "Article not found." }, 404);
      const record = data.record as StudioPost;
      if (record.revision !== Number(input.revision)) return json({ error: "This article changed in another window. Reload before saving to avoid overwriting changes." }, 409);
      if (record.archived && input.action !== "restore") return json({ error: "Restore this article before editing it." }, 400);
      await revision(studio, record, input.action);

      if (["save", "publish", "schedule"].includes(input.action)) {
        const post = validatePost(input.post, input.action !== "save");
        if ((record.published || record.scheduled) && post.slug !== record.draft.slug) throw new StudioError("Unpublish and cancel scheduling before changing the URL slug.");
        if (post.slug) {
          const { data: existing } = await studio.from("blog_posts").select("id").eq("slug", post.slug).neq("id", record.id).maybeSingle();
          if (existing) return json({ error: "Another article already uses this URL slug." }, 409);
        }
        record.draft = post;
      }
      if (input.action === "publish") { record.published = record.draft; record.scheduled = null; record.scheduledAt = null; }
      if (input.action === "schedule") {
        const timestamp = Date.parse(String(input.scheduledAt || ""));
        if (!Number.isFinite(timestamp) || timestamp < Date.now() + 60000) throw new StudioError("Choose a publication time at least one minute in the future.");
        record.scheduled = { ...record.draft, date: new Date(timestamp).toISOString().slice(0, 10) };
        record.scheduledAt = new Date(timestamp).toISOString();
      }
      if (input.action === "cancel-schedule") { record.scheduled = null; record.scheduledAt = null; }
      if (input.action === "unpublish" || input.action === "archive") { record.published = null; record.scheduled = null; record.scheduledAt = null; }
      if (input.action === "archive") record.archived = true;
      if (input.action === "restore") record.archived = false;
      if (input.action === "restore-revision") {
        const { data: restored } = await studio.from("blog_revisions").select("content").eq("id", input.revisionId).eq("post_id", record.id).maybeSingle();
        if (!restored) return json({ error: "Revision not found." }, 404);
        record.draft = { ...restored.content, slug: record.draft.slug };
      }
      record.revision++;
      record.updatedAt = nowIso();
      const { error: saveError } = await studio.from("blog_posts").update(postColumns(record)).eq("id", record.id);
      if (saveError) return json({ error: "Could not save the article. Your writing is still here." }, 502);
      return json({ post: record });
    } catch (error) {
      if (error instanceof StudioError) return json({ error: error.message }, error.status);
      console.error("molaplus-studio failed", error);
      return json({ error: "The studio could not complete this request. Please try again." }, 500);
    }
  }),
};

export default handler;
