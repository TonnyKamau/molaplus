import { StudioError } from "./validation";

export async function readBody(request: Request, max = 180000) {
  const reader = request.body?.getReader();
  if (!reader) throw new StudioError("Missing request body.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      throw new StudioError("This request is too large.", 413);
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function jsonBody(request: Request) {
  try {
    const result = JSON.parse((await readBody(request)).toString());
    if (!result || typeof result !== "object" || Array.isArray(result)) throw new StudioError("Invalid request.");
    return result as Record<string, unknown>;
  } catch (error) {
    if (error instanceof StudioError) throw error;
    throw new StudioError("Invalid JSON request.");
  }
}

export function apiError(error: unknown) {
  if (error instanceof StudioError) return Response.json({ error: error.message }, { status: error.status });
  console.error("Studio operation failed", error instanceof Error ? error.message : "Unknown error");
  return Response.json({ error: "The studio could not complete this request. Please try again." }, { status: 500 });
}
