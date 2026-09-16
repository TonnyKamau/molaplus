import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "../../../../lib/supabase/public";

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const visitorKeyPattern = /^[a-zA-Z0-9_-]{16,128}$/;
const reactions = ["helpful", "not_helpful"] as const;
type Reaction = (typeof reactions)[number];

function validSlug(value: string) {
  return slugPattern.test(value);
}

function counts(data: unknown) {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== "object") return { helpful: 0, notHelpful: 0 };
  const values = row as { helpful?: unknown; not_helpful?: unknown };
  return {
    helpful: Number(values.helpful) || 0,
    notHelpful: Number(values.not_helpful) || 0,
  };
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")?.trim() || "";
  if (!validSlug(slug)) return NextResponse.json({ error: "Invalid article." }, { status: 400 });

  const { data, error } = await createPublicClient().rpc("get_blog_post_reactions", { post_slug: slug });
  if (error) {
    console.error("Could not load blog reactions", error.message);
    return NextResponse.json({ error: "Could not load reactions." }, { status: 500 });
  }

  return NextResponse.json(counts(data));
}

export async function POST(request: NextRequest) {
  let body: { slug?: unknown; reaction?: unknown; visitorKey?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const slug = String(body.slug || "").trim();
  const reaction = String(body.reaction || "").trim() as Reaction;
  const visitorKey = String(body.visitorKey || "").trim();
  if (!validSlug(slug) || !reactions.includes(reaction) || !visitorKeyPattern.test(visitorKey)) {
    return NextResponse.json({ error: "Invalid reaction." }, { status: 400 });
  }

  const { data, error } = await createPublicClient().rpc("record_blog_post_reaction", {
    post_slug: slug,
    post_reaction: reaction,
    post_visitor_key: visitorKey,
  });
  if (error) {
    console.error("Could not record blog reaction", error.message);
    return NextResponse.json({ error: "Could not record reaction." }, { status: 500 });
  }

  return NextResponse.json(counts(data));
}