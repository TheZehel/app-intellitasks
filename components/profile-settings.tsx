"use client";

import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/client-api";
import type { AuthUserDTO } from "@/lib/domain/types";

type ApiResponse = {
  user?: AuthUserDTO;
  message?: string;
  ok?: boolean;
};

const roleLabels = {
  admin: "Administrador",
  manager: "Gestor",
  member: "Membro",
};

export default function ProfileSettings({ initialUser }: { initialUser: AuthUserDTO }) {
  const [user, setUser] = useState(initialUser);
  const [name, setName] = useState(initialUser.name);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingProfile(true);
    setProfileError("");
    setProfileMessage("");

    try {
      const response = await apiFetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.user) {
        throw new Error(data.message ?? "Nao foi possivel salvar o perfil.");
      }

      setUser(data.user);
      setName(data.user.name);
      setProfileMessage("Perfil atualizado.");
      window.dispatchEvent(new Event("auth-user-updated"));
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Nao foi possivel salvar o perfil.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingPassword(true);
    setPasswordError("");
    setPasswordMessage("");

    try {
      const response = await apiFetch("/api/profile/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordForm),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.message ?? "Nao foi possivel atualizar a senha.");
      }

      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordMessage("Senha atualizada. Outras sessoes foram encerradas.");
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Nao foi possivel atualizar a senha.");
    } finally {
      setIsSavingPassword(false);
    }
  }

  async function handleLogoutAll() {
    await apiFetch("/api/auth/logout-all", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-outline-variant pb-6">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Perfil</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-on-surface">Minha conta</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
          Gerencie seus dados de acesso e seguranca dentro do IntelliTasks.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="app-card rounded-lg p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-container text-lg font-bold text-on-primary-container">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-on-surface">{user.name}</h2>
              <p className="text-sm text-on-surface-variant">{user.email}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            <InfoRow label="Papel" value={roleLabels[user.role]} />
            <InfoRow label="Status" value={user.isActive ? "Ativo" : "Inativo"} />
            <InfoRow label="Criado em" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "-"} />
          </div>
        </div>

        <form className="app-card rounded-lg p-5" onSubmit={handleProfileSubmit}>
          <h2 className="text-lg font-semibold text-on-surface">Dados pessoais</h2>
          <label className="mt-5 block">
            <span className="text-sm font-medium text-on-surface-variant">Nome</span>
            <input
              className="mt-1 w-full rounded-md border border-outline-variant bg-background px-3 py-2 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          {profileError ? <Alert tone="error" message={profileError} /> : null}
          {profileMessage ? <Alert tone="success" message={profileMessage} /> : null}
          <button
            className="mt-5 rounded-md bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container transition hover:bg-primary"
            disabled={isSavingProfile}
            type="submit"
          >
            {isSavingProfile ? "Salvando..." : "Salvar perfil"}
          </button>
        </form>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <form className="app-card rounded-lg p-5" onSubmit={handlePasswordSubmit}>
          <h2 className="text-lg font-semibold text-on-surface">Senha</h2>
          <div className="mt-5 grid gap-4">
            <PasswordField
              label="Senha atual"
              value={passwordForm.currentPassword}
              onChange={(value) => setPasswordForm((current) => ({ ...current, currentPassword: value }))}
            />
            <PasswordField
              label="Nova senha"
              value={passwordForm.newPassword}
              onChange={(value) => setPasswordForm((current) => ({ ...current, newPassword: value }))}
            />
            <PasswordField
              label="Confirmar nova senha"
              value={passwordForm.confirmPassword}
              onChange={(value) => setPasswordForm((current) => ({ ...current, confirmPassword: value }))}
            />
          </div>
          {passwordError ? <Alert tone="error" message={passwordError} /> : null}
          {passwordMessage ? <Alert tone="success" message={passwordMessage} /> : null}
          <button
            className="mt-5 rounded-md bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container transition hover:bg-primary"
            disabled={isSavingPassword}
            type="submit"
          >
            {isSavingPassword ? "Atualizando..." : "Atualizar senha"}
          </button>
        </form>

        <div className="app-card rounded-lg p-5">
          <h2 className="text-lg font-semibold text-on-surface">Sessoes</h2>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            Encerre todas as sessoes ativas se voce usou o app em outro navegador ou computador.
          </p>
          <button
            className="mt-5 rounded-md border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
            type="button"
            onClick={handleLogoutAll}
          >
            Sair de todos os dispositivos
          </button>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-outline-variant/60 pb-2 last:border-b-0 last:pb-0">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-semibold text-on-surface">{value}</span>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-on-surface-variant">{label}</span>
      <input
        className="mt-1 w-full rounded-md border border-outline-variant bg-background px-3 py-2 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20"
        minLength={6}
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </label>
  );
}

function Alert({ message, tone }: { message: string; tone: "success" | "error" }) {
  const className =
    tone === "success"
      ? "border-primary/30 bg-surface-container-high text-primary"
      : "border-secondary/30 bg-surface-container-high text-on-surface";

  return <div className={`mt-4 rounded-md border px-4 py-3 text-sm font-medium ${className}`}>{message}</div>;
}
