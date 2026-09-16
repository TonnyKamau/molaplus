import { apiError } from "../../../../lib/studio/http";
import { invokeStudio } from "../../../../lib/studio/remote";

export async function GET() {
  try {
    const data = await invokeStudio({ action: "export" });
    return new Response(JSON.stringify(data, null, 2), { headers: { "Content-Type": "application/json", "Content-Disposition": 'attachment; filename="molaplus-blog-content.json"', "Cache-Control": "no-store" } });
  }
  catch (error) { return apiError(error); }
}
