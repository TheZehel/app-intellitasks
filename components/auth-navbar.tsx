"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/lib/domain/types";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

type AuthMode = "login" | "register";

type AuthResponse = {
  user?: AuthUser | null;
  message?: string;
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const navItems = [
  { href: "/", label: "Painel" },
  { href: "/tarefas", label: "Tarefas" },
  { href: "/kanban", label: "Kanban" },
  { href: "/calendario", label: "Calendario" },
];

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Gestor",
  member: "Membro",
};

export default function AuthNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });
        const data = (await response.json()) as AuthResponse;

        setUser(data.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    }

    void loadUser();
    window.addEventListener("auth-user-updated", loadUser);

    return () => window.removeEventListener("auth-user-updated", loadUser);
  }, []);

  function openModal(nextMode: AuthMode) {
    setMode(nextMode);
    setForm(emptyForm);
    setError("");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setError("");
    setForm(emptyForm);
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as AuthResponse;

      if (!response.ok) {
        throw new Error(data.message ?? "Nao foi possivel autenticar.");
      }

      setUser(data.user ?? null);
      closeModal();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Nao foi possivel autenticar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    }).catch(() => undefined);
    setUser(null);
  }

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-outline-variant bg-surface-dark/95 text-on-surface backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/">
              <p className="text-base font-bold text-primary">IntelliTasks</p>
              <p className="text-xs font-medium text-on-surface-variant">Gestao de tarefas</p>
            </Link>
          </div>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-surface-variant text-primary" : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {user ? (
            <div className="group relative flex items-center">
              <button
                className="flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-left transition hover:border-outline-variant hover:bg-surface-variant focus:border-outline-variant focus:bg-surface-variant focus:outline-none"
                type="button"
              >
                <span className="hidden text-right sm:block">
                  <span className="block text-sm font-semibold text-on-surface">{user.name}</span>
                  <span className="block text-xs text-on-surface-variant">
                    {roleLabels[user.role]} - {user.email}
                  </span>
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-container text-xs font-bold text-on-primary-container">
                  {user.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-xs text-on-surface-variant transition group-hover:rotate-180">v</span>
              </button>

              <div
                className="invisible absolute right-0 top-full z-50 w-56 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                role="menu"
              >
                <div className="rounded-lg border border-outline-variant bg-surface-container p-2 shadow-app-modal">
                  <Link
                    className="block rounded-md px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
                    href="/perfil"
                    role="menuitem"
                  >
                    Perfil
                  </Link>
                  {user.role === "admin" ? (
                    <Link
                      className="block rounded-md px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
                      href="/usuarios"
                      role="menuitem"
                    >
                      Usuarios
                    </Link>
                  ) : null}
                  <button
                    className="mt-1 block w-full rounded-md border-t border-outline-variant px-3 py-2 text-left text-sm font-semibold text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
                    type="button"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="rounded-md border border-outline-variant px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
                disabled={isLoadingUser}
                type="button"
                onClick={() => openModal("login")}
              >
                Login
              </button>
              <button
                className="rounded-md bg-primary-container px-3 py-2 text-sm font-semibold text-on-primary-container transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                disabled={isLoadingUser}
                type="button"
                onClick={() => openModal("register")}
              >
                Registre-se
              </button>
            </div>
          )}
        </div>
      </nav>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-4 py-6">
          <div
            aria-modal="true"
            className="w-full max-w-md rounded-lg border border-outline-variant bg-surface-container p-5 text-on-surface shadow-app-modal"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-on-surface">{mode === "login" ? "Entrar" : "Criar conta"}</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {mode === "login"
                    ? "Acesse sua conta do IntelliTasks."
                    : "Cadastre-se para acessar o IntelliTasks."}
                </p>
              </div>
              <button
                aria-label="Fechar modal"
                className="rounded-md border border-outline-variant px-2.5 py-1.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
                type="button"
                onClick={closeModal}
              >
                X
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 rounded-md border border-outline-variant bg-background p-1">
              <button
                className={`rounded px-3 py-2 text-sm font-semibold transition ${
                  mode === "login" ? "bg-surface-variant text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                }`}
                type="button"
                onClick={() => switchMode("login")}
              >
                Login
              </button>
              <button
                className={`rounded px-3 py-2 text-sm font-semibold transition ${
                  mode === "register" ? "bg-surface-variant text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                }`}
                type="button"
                onClick={() => switchMode("register")}
              >
                Registro
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              {mode === "register" ? (
                <label className="block">
                  <span className="text-sm font-medium text-on-surface-variant">Nome</span>
                  <input
                    className="mt-1 w-full rounded-md border border-outline-variant bg-background px-3 py-2 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Seu nome"
                    required
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="text-sm font-medium text-on-surface-variant">Email</span>
                <input
                  className="mt-1 w-full rounded-md border border-outline-variant bg-background px-3 py-2 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="voce@email.com"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-on-surface-variant">Senha</span>
                <input
                  className="mt-1 w-full rounded-md border border-outline-variant bg-background px-3 py-2 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Minimo de 6 caracteres"
                  required
                />
              </label>

              {mode === "register" ? (
                <label className="block">
                  <span className="text-sm font-medium text-on-surface-variant">Confirmar senha</span>
                  <input
                    className="mt-1 w-full rounded-md border border-outline-variant bg-background px-3 py-2 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                    placeholder="Repita sua senha"
                    required
                  />
                </label>
              ) : null}

              {error ? (
                <div className="rounded-md border border-primary/30 bg-surface-container-high px-4 py-3 text-sm font-medium text-on-surface">
                  {error}
                </div>
              ) : null}

              <button
                className="w-full rounded-md bg-primary-container px-4 py-2.5 text-sm font-semibold text-on-primary-container transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Processando..." : mode === "login" ? "Entrar" : "Criar conta"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
