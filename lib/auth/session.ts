import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { AuthUserDTO } from "@/lib/domain/types";

export const sessionCookieName = "intellitasks_session";

const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

export type AuthUser = AuthUserDTO;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function createSessionExpiration() {
  return new Date(Date.now() + sessionMaxAgeSeconds * 1000);
}

export function getSessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  };
}

export function getExpiredSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = createSessionExpiration();

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

async function ensureFirstAdmin(userId: string) {
  const admin = await prisma.user.findFirst({
    where: {
      role: "admin",
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (admin) {
    return null;
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role: "admin", isActive: true },
    select: {
      role: true,
      isActive: true,
    },
  });
}

export async function getCurrentUserFromToken(token?: string): Promise<AuthUser | null> {
  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({ where: { token } }).catch(() => undefined);
    return null;
  }

  if (!session.user.isActive) {
    await prisma.session.delete({ where: { token } }).catch(() => undefined);
    return null;
  }

  const promotedUser = await ensureFirstAdmin(session.user.id);

  return {
    ...session.user,
    role: promotedUser?.role ?? session.user.role,
    isActive: promotedUser?.isActive ?? session.user.isActive,
    createdAt: session.user.createdAt.toISOString(),
  };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  return getCurrentUserFromToken(token);
}

export async function deleteSession(token?: string) {
  if (!token) {
    return;
  }

  await prisma.session.delete({ where: { token } }).catch(() => undefined);
}

export async function deleteUserSessions(userId: string, exceptToken?: string) {
  const where = exceptToken
    ? {
        userId,
        token: { not: exceptToken },
      }
    : {
        userId,
      };

  await prisma.session.deleteMany({
    where,
  });
}
