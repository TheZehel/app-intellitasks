import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromToken, sessionCookieName } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { parseProfileInput } from "@/lib/validation/user-input";

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get(sessionCookieName)?.value;
    const currentUser = await getCurrentUserFromToken(token);

    if (!currentUser) {
      return NextResponse.json({ message: "Autenticacao obrigatoria." }, { status: 401 });
    }

    const input = parseProfileInput(await request.json());
    const user = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: input.name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel atualizar o perfil.";

    return NextResponse.json({ message }, { status: 400 });
  }
}
