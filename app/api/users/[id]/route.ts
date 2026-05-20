import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromToken, sessionCookieName } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { parseUserManagementInput } from "@/lib/validation/user-input";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get(sessionCookieName)?.value;
    const currentUser = await getCurrentUserFromToken(token);

    if (!currentUser) {
      return NextResponse.json({ message: "Autenticacao obrigatoria." }, { status: 401 });
    }

    if (currentUser.role !== "admin") {
      return NextResponse.json({ message: "Acesso restrito a administradores." }, { status: 403 });
    }

    const { id } = await params;
    const input = parseUserManagementInput(await request.json());
    const adminCount = await prisma.user.count({
      where: {
        role: "admin",
        isActive: true,
      },
    });
    const target = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    if (!target) {
      return NextResponse.json({ message: "Usuario nao encontrado." }, { status: 404 });
    }

    if (target.role === "admin" && target.isActive && (input.role !== "admin" || !input.isActive) && adminCount <= 1) {
      return NextResponse.json({ message: "Mantenha pelo menos um administrador ativo." }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: input,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!input.isActive) {
      await prisma.session.deleteMany({
        where: {
          userId: id,
        },
      });
    }

    return NextResponse.json({
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel atualizar o usuario.";

    return NextResponse.json({ message }, { status: 400 });
  }
}
