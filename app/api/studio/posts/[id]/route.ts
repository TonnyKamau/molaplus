import { apiError, jsonBody } from "../../../../../lib/studio/http";
import { remoteGet, remoteMutate } from "../../../../../lib/studio/remote";
import { StudioError } from "../../../../../lib/studio/validation";

type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, { params }: Context) {
  try { const { id } = await params; return Response.json(await remoteGet(id), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return apiError(error); }
}
export async function PATCH(request: Request, { params }: Context) {
  try { const body = await jsonBody(request); if (!Number.isInteger(body.revision) || typeof body.action !== "string") throw new StudioError("Missing article revision or action.");
    return Response.json(await remoteMutate({ id: (await params).id, ...body }));
  } catch (error) { return apiError(error); }
}
