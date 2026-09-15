import { apiError, jsonBody, requireEditor } from "../../../../lib/studio/auth";
import { createPost, listPosts } from "../../../../lib/studio/db";

export async function GET() { try { await requireEditor(); return Response.json({ posts: listPosts() }, { headers: { "Cache-Control": "no-store" } }); } catch (error) { return apiError(error); } }
export async function POST(request: Request) {
  try { await requireEditor(request); const body = await jsonBody(request); return Response.json({ post: createPost(typeof body.copyId === "string" ? body.copyId : undefined) }, { status: 201 }); }
  catch (error) { return apiError(error); }
}
