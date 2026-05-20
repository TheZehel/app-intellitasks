import { NextRequest, NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { deleteUserSessions, getCurrentUserFromToken, sessionCookieName } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { parsePasswordInput } from "@/lib/validation/user-input";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(sessionCookieName)?.value;
    const currentUser = await getCurrentUserFromToken(token);

    if (!currentUser || !token) {
      return NextResponse.json({ message: "Autenticacao obrigatoria." }, { status: 401 });
    }

    const input = parsePasswordInput(await request.json());
    const user = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        passwordHash: true,
      },
    });

    if (!user || !verifyPassword(input.currentPassword, user.passwordHash)) {
      return NextResponse.json({ message: "Senha atual invalida." }, { status: 401 });
    }

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        passwordHash: hashPassword(input.newPassword),
      },
    });
    await deleteUserSessions(currentUser.id, token);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel atualizar a senha.";

    return NextResponse.json({ message }, { status: 400 });
  }
}
