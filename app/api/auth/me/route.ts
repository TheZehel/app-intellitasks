import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromToken, sessionCookieName } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(sessionCookieName)?.value;
  const user = await getCurrentUserFromToken(token);

  return NextResponse.json({ user });
}
