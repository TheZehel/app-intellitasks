import { NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma/client";
import { hashPassword } from "@/lib/auth/password";
import {
  createSession,
  getSessionCookieOptions,
  normalizeEmail,
  sessionCookieName,
} from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { parseRegisterInput } from "@/lib/validation/auth-input";

export async function POST(request: Request) {
  try {
    const input = parseRegisterInput(await request.json());
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: normalizeEmail(input.email),
        passwordHash: hashPassword(input.password),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    const session = await createSession(user.id);
    const response = NextResponse.json({ user }, { status: 201 });

    response.cookies.set(sessionCookieName, session.token, getSessionCookieOptions(session.expiresAt));

    return response;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "Este email ja esta cadastrado." }, { status: 409 });
    }

    const message = error instanceof Error ? error.message : "Nao foi possivel criar a conta.";

    return NextResponse.json({ message }, { status: 400 });
  }
}
