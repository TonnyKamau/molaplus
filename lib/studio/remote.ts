import "server-only";
import { createClient } from "../supabase/server";
import type { Media, Revision, StudioPost } from "./model";
import { StudioError } from "./validation";

const functionName = "molaplus-studio";

type InvokeResult<T> = { data: T | null; error: { message?: string; context?: { json?: () => Promise<unknown> } } | null };

async function edgeError(error: InvokeResult<unknown>["error"], fallback: string) {
  const context = error?.context;
  if (context?.json) {
    try {
      const body = await context.json();
      if (body && typeof body === "object" && "error" in body && typeof body.error === "string") return body.error;
    } catch {}
  }
  return error?.message || fallback;
}

export async function invokeStudio<T>(body: Record<string, unknown>) {
  const supabase = await createClient();
  const result = await supabase.functions.invoke(functionName, { body }) as InvokeResult<T>;
  if (result.error) throw new StudioError(await edgeError(result.error, "The studio request failed."), 502);
  return result.data as T;
}

export async function invokeStudioUpload(file: Blob, name: string) {
  const supabase = await createClient();
  const form = new FormData();
  form.append("file", file, name);
  form.append("name", name);
  const result = await supabase.functions.invoke(functionName, {
    body: form,
  }) as InvokeResult<{ media: Media }>;
  if (result.error) throw new StudioError(await edgeError(result.error, "Image upload failed."), 502);
  return result.data as { media: Media };
}

export async function remoteAuthenticated() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  return !error && !!data?.claims?.sub;
}

export async function remoteSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
}

export async function remotePosts() {
  return invokeStudio<{ posts: StudioPost[] }>({ action: "list" });
}

export async function remoteMedia() {
  return invokeStudio<{ media: Media[] }>({ action: "media" });
}

export async function remoteCreate(copyId?: string) {
  return invokeStudio<{ post: StudioPost }>({ action: "create", copyId });
}

export async function remoteGet(id: string) {
  return invokeStudio<{ post: StudioPost; revisions: Revision[] }>({ action: "get", id });
}

export async function remoteMutate(input: Record<string, unknown>) {
  return invokeStudio<{ post: StudioPost }>(input);
}
