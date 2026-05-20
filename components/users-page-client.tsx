"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/client-api";
import type { AuthUserDTO, ManagedUserDTO } from "@/lib/domain/types";
import UsersManagement from "@/components/users-management";

type MeResponse = {
  user?: AuthUserDTO | null;
};

type UsersResponse = {
  users?: ManagedUserDTO[];
  message?: string;
};

export default function UsersPageClient() {
  const [currentUser, setCurrentUser] = useState<AuthUserDTO | null>(null);
  const [users, setUsers] = useState<ManagedUserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const meResponse = await apiFetch("/api/auth/me", { cache: "no-store" });
        const meData = (await meResponse.json()) as MeResponse;

        if (!meData.user) {
          window.location.href = "/";
          return;
        }

        if (meData.user.role !== "admin") {
          window.location.href = "/perfil";
          return;
        }

        const usersResponse = await apiFetch("/api/users", { cache: "no-store" });
        const usersData = (await usersResponse.json()) as UsersResponse;

        if (!usersResponse.ok || !usersData.users) {
          throw new Error(usersData.message ?? "Nao foi possivel carregar os usuarios.");
        }

        setCurrentUser(meData.user);
        setUsers(usersData.users);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Nao foi possivel carregar os usuarios.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadUsers();
  }, []);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background px-4 py-6 text-on-background sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {error ? (
          <div className="rounded-lg border border-primary/30 bg-surface-container-high px-4 py-3 text-sm font-semibold text-on-surface">
            {error}
          </div>
        ) : null}
        {isLoading || !currentUser ? (
          <div className="app-card rounded-lg p-5 text-sm font-semibold text-on-surface-variant">Carregando usuarios...</div>
        ) : (
          <UsersManagement currentUserId={currentUser.id} initialUsers={users} />
        )}
      </div>
    </main>
  );
}
