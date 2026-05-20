import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromToken, sessionCookieName } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(sessionCookieName)?.value;
  const currentUser = await getCurrentUserFromToken(token);

  if (!currentUser) {
    return NextResponse.json({ message: "Autenticacao obrigatoria." }, { status: 401 });
  }

  if (currentUser.role !== "admin") {
    return NextResponse.json({ message: "Acesso restrito a administradores." }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
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

  return NextResponse.json({
    users: users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })),
  });
}
