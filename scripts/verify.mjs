import assert from "node:assert/strict";
import { randomBytes, scryptSync } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

// Isolated production-server verification. Never uses real credentials or sends SMS.
mkdirSync("test-results", { recursive: true });
const directory = mkdtempSync(path.resolve("test-results", "studio-"));
const origin = "http://localhost:3101";
const password = randomBytes(24).toString("hex"), salt = randomBytes(16).toString("hex");
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", "3101"], {
  env: { ...process.env, STUDIO_DATA_DIR: directory, STUDIO_ORIGIN: origin, STUDIO_EMAIL: "test@example.com", STUDIO_PASSWORD_HASH: `${salt}:${scryptSync(password, salt, 64).toString("hex")}`, AFRICASTALKING_API_KEY: "", AFRICASTALKING_USERNAME: "", MOLAPLUS_ORDER_SMS_TO: "" },
  stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
});
let logs = "", cookie = "", checks = 0;
server.stdout.on("data", (data) => { logs += data; }); server.stderr.on("data", (data) => { logs += data; });
async function request(url, { method = "GET", body, status = 200, authenticated = true, headers = {} } = {}) {
  const response = await fetch(`${origin}${url}`, { method, headers: { Origin: origin, ...(cookie && authenticated ? { Cookie: cookie } : {}), ...(body ? { "Content-Type": "application/json" } : {}), ...headers }, body: body ? JSON.stringify(body) : undefined });
  assert.equal(response.status, status, `${method} ${url}: ${await response.clone().text().then((text) => text.slice(0, 300))}`);
  checks++;
  return response;
}
try {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (server.exitCode !== null) throw new Error(`Test server stopped: ${logs}`);
    try { if ((await fetch(`${origin}/studio`)).ok) break; } catch {}
    if (attempt === 79) throw new Error(`Test server did not start: ${logs}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  for (const route of ["/", "/blog", "/resources", "/products", "/products/super-milk-booster", "/product-comparison", "/consultancy", "/distributors", "/contact", "/about-us", "/order", "/privacy", "/terms", "/sitemap.xml", "/robots.txt", "/blog/feed.xml"]) await request(route);
  await request("/api/studio/posts", { authenticated: false, status: 401 });
  await request("/api/studio/session", { method: "POST", body: { email: "test@example.com", password }, headers: { Origin: "https://unrelated.example" }, status: 403 });
  await request("/api/studio/session", { method: "POST", body: { email: "test@example.com", password: "wrong" }, status: 401 });
  const login = await request("/api/studio/session", { method: "POST", body: { email: "test@example.com", password } });
  assert.match(login.headers.get("set-cookie"), /HttpOnly/i); cookie = login.headers.get("set-cookie").split(";")[0];
  const list = await (await request("/api/studio/posts")).json();
  for (const item of list.posts) {
    if (item.published) { await request(`/blog/${item.published.slug}`); await request(item.published.image); }
  }
  let post = (await (await request("/api/studio/posts", { method: "POST", body: {}, status: 201 })).json()).post;
  async function mutate(action, extra = {}, status = 200) {
    const result = await (await request(`/api/studio/posts/${post.id}`, { method: "PATCH", body: { action, revision: post.revision, post: post.draft, ...extra }, status })).json();
    if (result.post) post = result.post;
    return result;
  }
  await mutate("publish", {}, 400);
  post.draft = { ...post.draft, title: "Verification story", slug: "verification-story", excerpt: "A story used by the isolated verification suite.", image: "/molaplus/service-cows.webp", imageAlt: "Cow at pasture", body: "## First section\n\nA useful paragraph.\n\n## First section\n\nAnother paragraph.", sources: [{ title: "", href: "https://" }] };
  await mutate("save"); // Incomplete sources must not block draft saves.
  await mutate("publish", {}, 400);
  post.draft.sources = [];
  await mutate("publish");
  assert.equal(post.published.title, "Verification story");
  const article = await (await request("/blog/verification-story")).text();
  assert.match(article, /id="first-section"/); assert.match(article, /id="first-section-2"/);
  post.draft.title = "A revised title";
  await mutate("save");
  assert.equal(post.published.title, "Verification story", "Draft saves must preserve the live article");
  await mutate("save", { revision: post.revision - 1 }, 409);
  await mutate("save", { post: { ...post.draft, slug: "changed-url" } }, 400);
  await mutate("publish"); assert.equal(post.published.title, "A revised title");
  const duplicate = (await (await request("/api/studio/posts", { method: "POST", body: { copyId: post.id }, status: 201 })).json()).post;
  assert.equal(duplicate.published, null); assert.equal(duplicate.draft.slug, "");
  await request(`/api/studio/posts/${duplicate.id}`, { method: "PATCH", body: { action: "save", revision: duplicate.revision, post: post.draft }, status: 409 });
  const history = (await (await request(`/api/studio/posts/${post.id}`)).json()).revisions;
  assert.ok(history.length);
  await mutate("restore-revision", { revisionId: history.at(-1).id });
  assert.equal(post.published.title, "A revised title");
  post.draft = { ...post.published };
  await mutate("schedule", { scheduledAt: new Date(Date.now() + 120000).toISOString() });
  assert.ok(post.scheduledAt);
  await mutate("cancel-schedule"); assert.equal(post.scheduledAt, null);
  await mutate("schedule", { scheduledAt: new Date(Date.now() + 120000).toISOString() });
  const db = new DatabaseSync(path.join(directory, "blog.sqlite"));
  const due = JSON.parse(db.prepare("SELECT record FROM posts WHERE id = ?").get(post.id).record);
  due.scheduledAt = new Date(Date.now() - 1000).toISOString();
  db.prepare("UPDATE posts SET record = ? WHERE id = ?").run(JSON.stringify(due), post.id); db.close();
  await mutate("save", {}, 409); // A due publication must prevent a stale editor overwrite.
  post = (await (await request(`/api/studio/posts/${post.id}`)).json()).post;
  assert.equal(post.scheduledAt, null);
  await mutate("unpublish"); assert.equal(post.published, null);
  await request("/blog/verification-story", { status: 404 });
  await mutate("archive"); assert.equal(post.archived, true);
  await mutate("save", {}, 400); await mutate("restore"); assert.equal(post.archived, false);
  const uploaded = await fetch(`${origin}/api/studio/media`, { method: "POST", headers: { Cookie: cookie, Origin: origin, "Content-Type": "image/webp", "X-File-Name": "test.webp" }, body: readFileSync("public/molaplus/service-cows.webp") });
  assert.equal(uploaded.status, 201); checks++;
  const media = (await uploaded.json()).media;
  const asset = await request(media.url); assert.match(asset.headers.get("content-type"), /image\/webp/);
  const exported = await (await request("/api/studio/export")).json();
  assert.ok(exported.media.some((item) => item.id === media.id && item.data)); assert.ok(exported.revisions.length);
  await request("/api/orders", { method: "POST", body: [], status: 400 });
  const order = { name: "Verification", phone: "0722656142", items: [{ name: "Unknown product", quantity: 1 }], county: "Nakuru", town: "Njoro", address: "Test only" };
  await request("/api/orders", { method: "POST", body: order, status: 400 });
  order.items[0].name = "Super Milk Booster — 1KG";
  await request("/api/orders", { method: "POST", body: order, status: 503 });
  await request("/api/studio/session", { method: "DELETE" });
  await request("/api/studio/posts", { status: 401 });
  console.log(`PASS: ${checks} route and API checks. Isolated data: ${directory}`);
} catch (error) { console.error(error); console.error(logs.slice(-4000)); process.exitCode = 1; }
finally { server.kill(); }
