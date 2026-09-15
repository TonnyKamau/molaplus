import { NextResponse } from "next/server";
import { apiError, checkOrigin, configured, endSession, jsonBody, limitLogin, sessionCookie, sessionSeconds, startSession, validPassword } from "../../../../lib/studio/auth";
import { StudioError } from "../../../../lib/studio/validation";

export async function POST(request: Request) {
  try {
    checkOrigin(request);
    if (!configured()) throw new StudioError("Studio access has not been configured. Ask the site owner to run the studio setup command.", 503);
    limitLogin(request);
    const data = await jsonBody(request);
    if (typeof data.email !== "string" || typeof data.password !== "string" || !validPassword(data.email, data.password)) throw new StudioError("Email or password is incorrect.", 401);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionCookie, startSession(), { httpOnly: true, secure: new URL(process.env.STUDIO_ORIGIN || request.url).protocol === "https:", sameSite: "strict", path: "/", maxAge: sessionSeconds });
    return response;
  } catch (error) { return apiError(error); }
}
export async function DELETE(request: Request) {
  try { checkOrigin(request); await endSession(); const response = NextResponse.json({ ok: true }); response.cookies.set(sessionCookie, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 }); return response; }
  catch (error) { return apiError(error); }
}
