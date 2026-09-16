import { NextResponse } from "next/server";
import { apiError } from "../../../../lib/studio/http";
import { remoteSignOut } from "../../../../lib/studio/remote";

export async function POST() {
  return Response.json({ error: "Use Supabase Auth to sign in." }, { status: 410 });
}
export async function DELETE() {
  try {
    await remoteSignOut();
    return NextResponse.json({ ok: true });
  }
  catch (error) { return apiError(error); }
}
