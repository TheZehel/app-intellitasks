import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSession,
  getSessionCookieOptions,
  normalizeEmail,
  sessionCookieName,
} from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { parseLoginInput } from "@/lib/validation/auth-input";

export async function POST(request: Request) {
  try {
    const input = parseLoginInput(await request.json());
    const user = await prisma.user.findUnique({
      where: {
        email: normalizeEmail(input.email),
      },
    });

    if (!user || !verifyPassword(input.password, user.passwordHash)) {
      return NextResponse.json({ message: "Email ou senha invalidos." }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ message: "Esta conta esta inativa." }, { status: 403 });
    }

    const session = await createSession(user.id);
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
      },
    });

    response.cookies.set(sessionCookieName, session.token, getSessionCookieOptions(session.expiresAt));

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel entrar.";

    return NextResponse.json({ message }, { status: 400 });
  }
}
