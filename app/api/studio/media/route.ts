import sharp from "sharp";
import { apiError, readBody, requireEditor } from "../../../../lib/studio/auth";
import { isSupabaseStudio } from "../../../../lib/studio/backend";
import { addMedia, listMedia } from "../../../../lib/studio/db";
import { invokeStudioUpload, remoteMedia } from "../../../../lib/studio/remote";
import { StudioError } from "../../../../lib/studio/validation";

export async function GET() { try { if (isSupabaseStudio()) return Response.json(await remoteMedia(), { headers: { "Cache-Control": "no-store" } }); await requireEditor(); return Response.json({ media: listMedia() }, { headers: { "Cache-Control": "no-store" } }); } catch (error) { return apiError(error); } }
export async function POST(request: Request) {
  try {
    if (isSupabaseStudio()) {
      const contentType = request.headers.get("content-type") ?? "";
      if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) throw new StudioError("Upload a JPG, PNG or WebP image.");
      const input = await readBody(request, 5 * 1024 * 1024);
      return Response.json(await invokeStudioUpload(new Blob([input], { type: contentType }), decodeURIComponent(request.headers.get("x-file-name") || "Uploaded image")), { status: 201 });
    }
    await requireEditor(request);
    if (!["image/jpeg", "image/png", "image/webp"].includes(request.headers.get("content-type") ?? "")) throw new StudioError("Upload a JPG, PNG or WebP image.");
    const input = await readBody(request, 5 * 1024 * 1024);
    let output;
    try { output = await sharp(input, { limitInputPixels: 25_000_000 }).rotate().resize(1920, 1920, { fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer({ resolveWithObject: true }); }
    catch { throw new StudioError("This file could not be read as an image. Use a JPG, PNG or WebP under 5 MB and 25 megapixels."); }
    return Response.json({ media: addMedia((request.headers.get("x-file-name") || "Uploaded image").slice(0, 150), output.data, output.info.width, output.info.height) }, { status: 201 });
  } catch (error) { return apiError(error); }
}
