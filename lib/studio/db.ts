import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { posts } from "../../app/blog/posts";
import { emptyPost, postBody, type StudioPost, type Revision, type Media } from "./model";
import { StudioError, validatePost } from "./validation";

let connection: DatabaseSync | undefined;
export function database() {
  if (connection) return connection;
  const directory = process.env.STUDIO_DATA_DIR || path.join(process.cwd(), ".studio");
  if (process.env.VERCEL && !process.env.STUDIO_DATA_DIR) throw new Error("Studio requires durable storage. Configure a persistent Node server before deploying.");
  mkdirSync(directory, { recursive: true });
  const db = new DatabaseSync(path.join(directory, "blog.sqlite"));
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, slug TEXT UNIQUE, record TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS revisions (id INTEGER PRIMARY KEY AUTOINCREMENT, postId TEXT NOT NULL, content TEXT NOT NULL, createdAt TEXT NOT NULL, action TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY, name TEXT NOT NULL, data BLOB NOT NULL, createdAt TEXT NOT NULL, width INTEGER NOT NULL, height INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER NOT NULL, fingerprint TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);`);
  db.exec("BEGIN IMMEDIATE");
  try {
    if (!db.prepare("SELECT value FROM settings WHERE key = 'seeded'").get()) {
      for (const [index, seed] of posts.entries()) {
        const content = { ...seed, body: postBody(seed), sections: [], author: "MolaPlus Africa", tags: [], seoTitle: "", seoDescription: "", featured: index === 0, sources: seed.sources ?? [] };
        const time = `${seed.date}T06:00:00.000Z`;
        const record: StudioPost = { id: randomUUID(), draft: content, published: content, scheduled: null, scheduledAt: null, archived: false, revision: 1, createdAt: time, updatedAt: time };
        db.prepare("INSERT INTO posts (id, slug, record) VALUES (?, ?, ?)").run(record.id, seed.slug, JSON.stringify(record));
      }
      db.prepare("INSERT INTO settings VALUES ('seeded', '1')").run();
    }
    db.exec("COMMIT");
  } catch (error) { db.exec("ROLLBACK"); db.close(); throw error; }
  connection = db;
  return db;
}
function decode(row: Record<string, unknown> | undefined): StudioPost | undefined { return row ? JSON.parse(row.record as string) : undefined; }
function save(record: StudioPost) { database().prepare("UPDATE posts SET slug = ?, record = ? WHERE id = ?").run(record.draft.slug || null, JSON.stringify(record), record.id); }
function transaction<T>(work: () => T): T { const db = database(); db.exec("BEGIN IMMEDIATE"); try { const result = work(); db.exec("COMMIT"); return result; } catch (error) { db.exec("ROLLBACK"); throw error; } }
function revision(record: StudioPost, action: string) {
  database().prepare("INSERT INTO revisions (postId, content, createdAt, action) VALUES (?, ?, ?, ?)").run(record.id, JSON.stringify(record.draft), new Date().toISOString(), action);
  database().prepare("DELETE FROM revisions WHERE postId = ? AND id NOT IN (SELECT id FROM revisions WHERE postId = ? ORDER BY id DESC LIMIT 30)").run(record.id, record.id);
}
function publishDue() {
  transaction(() => {
    for (const row of database().prepare("SELECT record FROM posts").all()) {
      const record = decode(row)!;
      if (!record.archived && record.scheduled && record.scheduledAt && Date.parse(record.scheduledAt) <= Date.now()) {
        record.published = record.scheduled; record.scheduled = null; record.scheduledAt = null; record.revision++; record.updatedAt = new Date().toISOString(); save(record);
      }
    }
  });
}
export function listPosts() { publishDue(); return database().prepare("SELECT record FROM posts").all().map((row) => decode(row)!).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)); }
export function publishedPosts() { return listPosts().filter((p) => !p.archived && p.published).map((p) => p.published!).sort((a,b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date)); }
export function findPost(id: string) { publishDue(); return decode(database().prepare("SELECT record FROM posts WHERE id = ?").get(id)); }
export function createPost(copyId?: string) {
  return transaction(() => {
    const original = copyId ? decode(database().prepare("SELECT record FROM posts WHERE id = ?").get(copyId)) : undefined;
    if (copyId && !original) throw new StudioError("Article not found.", 404);
    const draft = original ? { ...original.draft, title: `${original.draft.title} (copy)`, slug: "", featured: false } : emptyPost();
    const now = new Date().toISOString();
    const record: StudioPost = { id: randomUUID(), draft, published: null, scheduled: null, scheduledAt: null, archived: false, revision: 1, updatedAt: now, createdAt: now };
    database().prepare("INSERT INTO posts (id, slug, record) VALUES (?, NULL, ?)").run(record.id, JSON.stringify(record));
    return record;
  });
}
export function mutatePost(id: string, input: { revision: number; action: string; post?: unknown; scheduledAt?: string; revisionId?: number }) {
  publishDue();
  return transaction(() => {
    const record = decode(database().prepare("SELECT record FROM posts WHERE id = ?").get(id));
    if (!record) throw new StudioError("Article not found.", 404);
    if (record.revision !== input.revision) throw new StudioError("This article changed in another window. Reload before saving to avoid overwriting changes.", 409);
    const actions = ["save", "publish", "schedule", "cancel-schedule", "unpublish", "archive", "restore", "restore-revision"];
    if (!actions.includes(input.action)) throw new StudioError("Unknown action.");
    if (record.archived && input.action !== "restore") throw new StudioError("Restore this article before editing it.");
    revision(record, input.action);
    if (["save", "publish", "schedule"].includes(input.action)) {
      const post = validatePost(input.post, input.action !== "save");
      // Keep published addresses stable so saved links and search results continue to work.
      if ((record.published || record.scheduled) && post.slug !== record.draft.slug) throw new StudioError("Unpublish and cancel scheduling before changing the URL slug.");
      if (post.slug && database().prepare("SELECT id FROM posts WHERE slug = ? AND id != ?").get(post.slug, id)) throw new StudioError("Another article already uses this URL slug.", 409);
      record.draft = post;
    }
    if (input.action === "publish") { record.published = record.draft; record.scheduled = null; record.scheduledAt = null; }
    if (input.action === "schedule") {
      const timestamp = Date.parse(input.scheduledAt ?? "");
      if (!Number.isFinite(timestamp) || timestamp < Date.now() + 60000) throw new StudioError("Choose a publication time at least one minute in the future.");
      record.scheduled = { ...record.draft, date: new Date(timestamp).toISOString().slice(0,10) }; record.scheduledAt = new Date(timestamp).toISOString();
    }
    if (input.action === "cancel-schedule") { record.scheduled = null; record.scheduledAt = null; }
    if (input.action === "unpublish" || input.action === "archive") { record.published = null; record.scheduled = null; record.scheduledAt = null; }
    if (input.action === "archive") record.archived = true;
    if (input.action === "restore") record.archived = false;
    if (input.action === "restore-revision") {
      const row = database().prepare("SELECT content FROM revisions WHERE id = ? AND postId = ?").get(input.revisionId ?? -1, id);
      if (!row) throw new StudioError("Revision not found.", 404);
      const restored = JSON.parse(row.content as string);
      record.draft = { ...restored, slug: record.draft.slug };
    }
    record.revision++; record.updatedAt = new Date().toISOString(); save(record); return record;
  });
}
export function revisions(id: string): Revision[] { return database().prepare("SELECT * FROM revisions WHERE postId = ? ORDER BY id DESC LIMIT 30").all(id).map((row) => ({ ...row, content: JSON.parse(row.content as string) })) as Revision[]; }
export function listMedia(): Media[] { return database().prepare("SELECT id, name, createdAt, width, height FROM media ORDER BY createdAt DESC").all().map((row) => ({ ...row, url: `/api/blog/media/${row.id}` })) as Media[]; }
export function addMedia(name: string, data: Buffer, width: number, height: number) { const id = randomUUID(); const createdAt = new Date().toISOString(); database().prepare("INSERT INTO media VALUES (?, ?, ?, ?, ?, ?)").run(id, name, data, createdAt, width, height); return { id, name, createdAt, width, height, url: `/api/blog/media/${id}` }; }
