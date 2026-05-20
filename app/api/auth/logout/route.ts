import { NextRequest, NextResponse } from "next/server";
import { deleteSession, getExpiredSessionCookieOptions, sessionCookieName } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(sessionCookieName)?.value;

  await deleteSession(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName, "", getExpiredSessionCookieOptions());

  return response;
}
