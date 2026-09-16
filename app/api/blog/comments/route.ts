import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "../../../../lib/supabase/public";

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function validSlug(value: string) {
  return slugPattern.test(value);
}

function comments(data: unknown) {
  if (!Array.isArray(data)) return [];
  return data.map((comment) => {
    const value = comment as { id?: unknown; author_name?: unknown; body?: unknown; created_at?: unknown };
    return {
      id: String(value.id || ""),
      authorName: String(value.author_name || ""),
      body: String(value.body || ""),
      createdAt: String(value.created_at || ""),
    };
  });
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")?.trim() || "";
  if (!validSlug(slug)) return NextResponse.json({ error: "Invalid article." }, { status: 400 });

  const { data, error } = await createPublicClient().rpc("get_blog_post_comments", { post_slug: slug });
  if (error) {
    console.error("Could not load blog comments", error.message);
    return NextResponse.json({ error: "Could not load comments." }, { status: 500 });
  }

  return NextResponse.json({ comments: comments(data) });
}

export async function POST(request: NextRequest) {
  let body: { slug?: unknown; authorName?: unknown; body?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const slug = String(body.slug || "").trim();
  const authorName = String(body.authorName || "").trim();
  const commentBody = String(body.body || "").trim();
  if (!validSlug(slug) || authorName.length < 2 || authorName.length > 80 || commentBody.length < 2 || commentBody.length > 2000) {
    return NextResponse.json({ error: "Add a name and a comment under 2,000 characters." }, { status: 400 });
  }

  const { data, error } = await createPublicClient().rpc("create_blog_post_comment", {
    post_slug: slug,
    post_author_name: authorName,
    post_body: commentBody,
  });
  if (error) {
    console.error("Could not save blog comment", error.message);
    return NextResponse.json({ error: "Could not save comment." }, { status: 500 });
  }

  const created = comments(data)[0];
  return NextResponse.json({ comment: created }, { status: 201 });
}