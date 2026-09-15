import { database } from "../../../../../lib/studio/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return new Response(null, { status: 404 });
  const row = database().prepare("SELECT data FROM media WHERE id = ?").get(id);
  if (!row) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(row.data as Uint8Array), { headers: { "Content-Type": "image/webp", "X-Content-Type-Options": "nosniff", "Cache-Control": "public, max-age=31536000, immutable" } });
}
