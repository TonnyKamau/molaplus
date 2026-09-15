import { apiError, jsonBody, requireEditor } from "../../../../../lib/studio/auth";
import { findPost, mutatePost, revisions } from "../../../../../lib/studio/db";
import { StudioError } from "../../../../../lib/studio/validation";

type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, { params }: Context) {
  try { await requireEditor(); const { id } = await params; const post = findPost(id); if (!post) throw new StudioError("Article not found.", 404); return Response.json({ post, revisions: revisions(id) }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return apiError(error); }
}
export async function PATCH(request: Request, { params }: Context) {
  try { await requireEditor(request); const body = await jsonBody(request); if (!Number.isInteger(body.revision) || typeof body.action !== "string") throw new StudioError("Missing article revision or action.");
    const post = mutatePost((await params).id, { revision: Number(body.revision), action: body.action, post: body.post, scheduledAt: typeof body.scheduledAt === "string" ? body.scheduledAt : undefined, revisionId: typeof body.revisionId === "number" ? body.revisionId : undefined });
    return Response.json({ post });
  } catch (error) { return apiError(error); }
}
