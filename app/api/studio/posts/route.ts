import { apiError, jsonBody, requireEditor } from "../../../../lib/studio/auth";
import { isSupabaseStudio } from "../../../../lib/studio/backend";
import { createPost, listPosts } from "../../../../lib/studio/db";
import { remoteCreate, remotePosts } from "../../../../lib/studio/remote";

export async function GET() { try { if (isSupabaseStudio()) return Response.json(await remotePosts(), { headers: { "Cache-Control": "no-store" } }); await requireEditor(); return Response.json({ posts: listPosts() }, { headers: { "Cache-Control": "no-store" } }); } catch (error) { return apiError(error); } }
export async function POST(request: Request) {
  try { const body = await jsonBody(request); if (isSupabaseStudio()) return Response.json(await remoteCreate(typeof body.copyId === "string" ? body.copyId : undefined), { status: 201 }); await requireEditor(request); return Response.json({ post: createPost(typeof body.copyId === "string" ? body.copyId : undefined) }, { status: 201 }); }
  catch (error) { return apiError(error); }
}
