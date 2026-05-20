"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/client-api";
import type { AuthUserDTO } from "@/lib/domain/types";
import ProfileSettings from "@/components/profile-settings";

type MeResponse = {
  user?: AuthUserDTO | null;
};

export default function ProfilePageClient() {
  const [user, setUser] = useState<AuthUserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const response = await apiFetch("/api/auth/me", { cache: "no-store" }).catch(() => null);
      const data = response ? ((await response.json()) as MeResponse) : { user: null };

      if (!data.user) {
        window.location.href = "/";
        return;
      }

      setUser(data.user);
      setIsLoading(false);
    }

    void loadUser();
  }, []);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background px-4 py-6 text-on-background sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {isLoading || !user ? (
          <div className="app-card rounded-lg p-5 text-sm font-semibold text-on-surface-variant">Carregando perfil...</div>
        ) : (
          <ProfileSettings initialUser={user} />
        )}
      </div>
    </main>
  );
}
