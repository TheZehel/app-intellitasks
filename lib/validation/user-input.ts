import type { UserRole } from "@/lib/domain/types";

const allowedRoles: UserRole[] = ["admin", "manager", "member"];

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseProfileInput(value: unknown) {
  if (!value || typeof value !== "object") {
    throw new Error("Dados do perfil invalidos.");
  }

  const data = value as Record<string, unknown>;
  const name = getString(data.name);

  if (!name) {
    throw new Error("Informe seu nome.");
  }

  return { name };
}

export function parsePasswordInput(value: unknown) {
  if (!value || typeof value !== "object") {
    throw new Error("Dados de senha invalidos.");
  }

  const data = value as Record<string, unknown>;
  const currentPassword = getString(data.currentPassword);
  const newPassword = getString(data.newPassword);
  const confirmPassword = getString(data.confirmPassword);

  if (currentPassword.length < 6) {
    throw new Error("Informe sua senha atual.");
  }

  if (newPassword.length < 6) {
    throw new Error("A nova senha deve ter pelo menos 6 caracteres.");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("A confirmacao da nova senha nao confere.");
  }

  return { currentPassword, newPassword };
}

export function parseUserManagementInput(value: unknown) {
  if (!value || typeof value !== "object") {
    throw new Error("Dados do usuario invalidos.");
  }

  const data = value as Record<string, unknown>;
  const role = getString(data.role) as UserRole;
  const isActive = data.isActive;

  if (!allowedRoles.includes(role)) {
    throw new Error("Papel de usuario invalido.");
  }

  if (typeof isActive !== "boolean") {
    throw new Error("Status de usuario invalido.");
  }

  return { role, isActive };
}
