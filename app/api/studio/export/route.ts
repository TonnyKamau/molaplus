import { apiError, requireEditor } from "../../../../lib/studio/auth";
import { isSupabaseStudio } from "../../../../lib/studio/backend";
import { database, listPosts, listMedia, revisions } from "../../../../lib/studio/db";
import { invokeStudio } from "../../../../lib/studio/remote";

export async function GET() {
  try {
    if (isSupabaseStudio()) {
      const data = await invokeStudio({ action: "export" });
      return new Response(JSON.stringify(data, null, 2), { headers: { "Content-Type": "application/json", "Content-Disposition": 'attachment; filename="molaplus-blog-content.json"', "Cache-Control": "no-store" } });
    }
    await requireEditor();
    const posts = listPosts();
    const media = listMedia().map((item) => ({ ...item, encoding: "base64", mimeType: "image/webp", data: Buffer.from(database().prepare("SELECT data FROM media WHERE id = ?").get(item.id)!.data as Uint8Array).toString("base64") }));
    return new Response(JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), posts, media, revisions: posts.flatMap((post) => revisions(post.id)) }, null, 2), { headers: { "Content-Type": "application/json", "Content-Disposition": 'attachment; filename="molaplus-blog-content.json"', "Cache-Control": "no-store" } });
  }
  catch (error) { return apiError(error); }
}
