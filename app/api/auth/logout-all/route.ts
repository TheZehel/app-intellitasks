import { NextRequest, NextResponse } from "next/server";
import {
  deleteUserSessions,
  getCurrentUserFromToken,
  getExpiredSessionCookieOptions,
  sessionCookieName,
} from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(sessionCookieName)?.value;
  const currentUser = await getCurrentUserFromToken(token);

  if (!currentUser) {
    return NextResponse.json({ message: "Autenticacao obrigatoria." }, { status: 401 });
  }

  await deleteUserSessions(currentUser.id);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName, "", getExpiredSessionCookieOptions());

  return response;
}
