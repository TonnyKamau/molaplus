import { apiError, readBody } from "../../../../lib/studio/http";
import { invokeStudioUpload, remoteMedia } from "../../../../lib/studio/remote";
import { StudioError } from "../../../../lib/studio/validation";

export async function GET() { try { return Response.json(await remoteMedia(), { headers: { "Cache-Control": "no-store" } }); } catch (error) { return apiError(error); } }
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) throw new StudioError("Upload a JPG, PNG or WebP image.");
    const input = await readBody(request, 5 * 1024 * 1024);
    return Response.json(await invokeStudioUpload(new Blob([input], { type: contentType }), decodeURIComponent(request.headers.get("x-file-name") || "Uploaded image")), { status: 201 });
  } catch (error) { return apiError(error); }
}
