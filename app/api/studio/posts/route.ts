import { apiError, jsonBody } from "../../../../lib/studio/http";
import { remoteCreate, remotePosts } from "../../../../lib/studio/remote";

export async function GET() { try { return Response.json(await remotePosts(), { headers: { "Cache-Control": "no-store" } }); } catch (error) { return apiError(error); } }
export async function POST(request: Request) {
  try { const body = await jsonBody(request); return Response.json(await remoteCreate(typeof body.copyId === "string" ? body.copyId : undefined), { status: 201 }); }
  catch (error) { return apiError(error); }
}
