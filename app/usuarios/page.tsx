import { redirect } from "next/navigation";
import UsersManagement from "@/components/users-management";
import { getCurrentUser } from "@/lib/auth/session";
import type { ManagedUserDTO } from "@/lib/domain/types";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }

  if (currentUser.role !== "admin") {
    redirect("/perfil");
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
  const mappedUsers: ManagedUserDTO[] = users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }));

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background px-4 py-6 text-on-background sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <UsersManagement currentUserId={currentUser.id} initialUsers={mappedUsers} />
      </div>
    </main>
  );
}
