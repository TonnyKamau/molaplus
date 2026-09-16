import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "../../../../lib/supabase/public";

export async function POST(request: NextRequest) {
  let slug = "";
  try {
    const body = await request.json();
    slug = String(body.slug || "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ error: "Invalid article." }, { status: 400 });
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("increment_blog_post_view", { post_slug: slug });
  if (error) {
    console.error("Could not record blog view", error.message);
    return NextResponse.json({ error: "Could not record view." }, { status: 500 });
  }

  return NextResponse.json({ views: Number(data) || 0 });
}
