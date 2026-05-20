"use client";

import { useState } from "react";
import type { ManagedUserDTO, UserRole } from "@/lib/domain/types";

type ApiResponse = {
  user?: ManagedUserDTO;
  message?: string;
};

const roleLabels: Record<UserRole, string> = {
  admin: "Administrador",
  manager: "Gestor",
  member: "Membro",
};

const roleOptions: UserRole[] = ["admin", "manager", "member"];

export default function UsersManagement({
  initialUsers,
  currentUserId,
}: {
  initialUsers: ManagedUserDTO[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  async function updateUser(user: ManagedUserDTO, input: { role: UserRole; isActive: boolean }) {
    setSavingId(user.id);
    setError("");

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.user) {
        throw new Error(data.message ?? "Nao foi possivel atualizar o usuario.");
      }

      setUsers((current) => current.map((item) => (item.id === data.user?.id ? data.user : item)));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Nao foi possivel atualizar o usuario.");
    } finally {
      setSavingId("");
    }
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-outline-variant pb-6">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Usuarios</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-on-surface">Gestao de usuarios</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
          Controle papeis de acesso e status das contas cadastradas no IntelliTasks.
        </p>
      </header>

      {error ? (
        <div className="rounded-lg border border-primary/30 bg-surface-container-high px-4 py-3 text-sm font-semibold text-on-surface">
          {error}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
        <table className="w-full min-w-[820px] text-left">
          <thead className="bg-surface-container-highest text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Papel</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Criado em</th>
              <th className="px-4 py-3 text-right">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/70 text-sm">
            {users.map((user) => (
              <UserRow
                currentUserId={currentUserId}
                isSaving={savingId === user.id}
                key={user.id}
                user={user}
                onUpdate={updateUser}
              />
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function UserRow({
  user,
  currentUserId,
  isSaving,
  onUpdate,
}: {
  user: ManagedUserDTO;
  currentUserId: string;
  isSaving: boolean;
  onUpdate: (user: ManagedUserDTO, input: { role: UserRole; isActive: boolean }) => void;
}) {
  const [role, setRole] = useState<UserRole>(user.role);
  const [isActive, setIsActive] = useState(user.isActive);
  const isChanged = role !== user.role || isActive !== user.isActive;

  return (
    <tr className="transition hover:bg-surface-variant/40">
      <td className="px-4 py-4">
        <p className="font-semibold text-on-surface">
          {user.name} {user.id === currentUserId ? <span className="text-xs text-primary">(voce)</span> : null}
        </p>
        <p className="mt-1 text-xs text-on-surface-variant">{user.email}</p>
      </td>
      <td className="px-4 py-4">
        <select
          className="rounded-md border border-outline-variant bg-background px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
        >
          {roleOptions.map((option) => (
            <option key={option} value={option}>
              {roleLabels[option]}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-4">
        <label className="inline-flex items-center gap-2 text-on-surface-variant">
          <input
            checked={isActive}
            className="h-4 w-4 accent-primary-container"
            type="checkbox"
            onChange={(event) => setIsActive(event.target.checked)}
          />
          {isActive ? "Ativo" : "Inativo"}
        </label>
      </td>
      <td className="px-4 py-4 text-on-surface-variant">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</td>
      <td className="px-4 py-4 text-right">
        <button
          className="rounded-md bg-primary-container px-3 py-2 text-sm font-semibold text-on-primary-container transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!isChanged || isSaving}
          type="button"
          onClick={() => onUpdate(user, { role, isActive })}
        >
          {isSaving ? "Salvando..." : "Salvar"}
        </button>
      </td>
    </tr>
  );
}
