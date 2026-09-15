import "server-only";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { database } from "./db";
import { StudioError } from "./validation";

export const sessionCookie = "molaplus_studio";
export const sessionSeconds = 60 * 60 * 12;
export function configured() { return /^[a-f0-9]{32}:[a-f0-9]{128}$/.test(process.env.STUDIO_PASSWORD_HASH ?? ""); }
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
export function validPassword(email: string, password: string) {
  if (!configured() || password.length > 256) return false;
  const [salt, expected] = process.env.STUDIO_PASSWORD_HASH!.split(":");
  const result = scryptSync(password, salt, 64);
  const passwordMatches = timingSafeEqual(result, Buffer.from(expected, "hex"));
  return passwordMatches && email.toLowerCase() === (process.env.STUDIO_EMAIL ?? "admin@molaplusafrica.com").toLowerCase();
}
export async function authenticated() {
  if (!configured()) return false;
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  const record = database().prepare("SELECT expires, fingerprint FROM sessions WHERE token = ?").get(hash(token));
  return Boolean(record && Number(record.expires) > Date.now() && record.fingerprint === hash(process.env.STUDIO_PASSWORD_HASH!));
}
export function startSession() {
  const token = randomBytes(32).toString("hex");
  const db = database();
  db.prepare("DELETE FROM sessions WHERE expires < ?").run(Date.now());
  db.prepare("INSERT INTO sessions VALUES (?, ?, ?)").run(hash(token), Date.now() + sessionSeconds * 1000, hash(process.env.STUDIO_PASSWORD_HASH!));
  return token;
}
export async function endSession() { const token = (await cookies()).get(sessionCookie)?.value; if (token) database().prepare("DELETE FROM sessions WHERE token = ?").run(hash(token)); }
export function checkOrigin(request: Request) {
  const expected = process.env.STUDIO_ORIGIN || new URL(request.url).origin;
  if (request.headers.get("origin") !== expected) throw new StudioError("This request did not come from the studio. Reload and try again.", 403);
}
export async function requireEditor(request?: Request) {
  if (request) checkOrigin(request);
  if (!await authenticated()) throw new StudioError("Please sign in to the studio again.", 401);
}
export function limitLogin(request: Request) {
  const key = hash(request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local");
  const db = database(); const now = Date.now();
  db.prepare("DELETE FROM attempts WHERE expires < ?").run(now);
  for (const [id, max] of [[key, 8], ["global", 100]] as const) {
    db.prepare("INSERT INTO attempts VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count=count+1").run(id, now + 15 * 60 * 1000);
    if (Number(db.prepare("SELECT count FROM attempts WHERE key = ?").get(id)?.count) > max) throw new StudioError("Too many sign-in attempts. Please try again in 15 minutes.", 429);
  }
}
export async function readBody(request: Request, max = 180000) {
  const reader = request.body?.getReader();
  if (!reader) throw new StudioError("Missing request body.");
  const chunks: Uint8Array[] = []; let size = 0;
  for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > max) { await reader.cancel(); throw new StudioError("This request is too large.", 413); } chunks.push(value); }
  return Buffer.concat(chunks);
}
export async function jsonBody(request: Request) {
  try { const result = JSON.parse((await readBody(request)).toString()); if (!result || typeof result !== "object" || Array.isArray(result)) throw new StudioError("Invalid request."); return result as Record<string, unknown>; }
  catch (error) { if (error instanceof StudioError) throw error; throw new StudioError("Invalid JSON request."); }
}
export function apiError(error: unknown) {
  if (error instanceof StudioError) return Response.json({ error: error.message }, { status: error.status });
  console.error("Studio operation failed", error instanceof Error ? error.message : "Unknown error");
  return Response.json({ error: "The studio could not complete this request. Your changes have not been published. Please try again." }, { status: 500 });
}
