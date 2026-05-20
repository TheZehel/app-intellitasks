const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseRegisterInput(value: unknown): RegisterInput {
  if (!value || typeof value !== "object") {
    throw new Error("Dados de cadastro invalidos.");
  }

  const data = value as Record<string, unknown>;
  const input = {
    name: getString(data.name),
    email: getString(data.email).toLowerCase(),
    password: getString(data.password),
    confirmPassword: getString(data.confirmPassword),
  };

  if (!input.name) {
    throw new Error("Informe seu nome.");
  }

  validateEmailAndPassword(input.email, input.password);

  if (input.password !== input.confirmPassword) {
    throw new Error("A confirmacao de senha nao confere.");
  }

  return input;
}

export function parseLoginInput(value: unknown): LoginInput {
  if (!value || typeof value !== "object") {
    throw new Error("Dados de login invalidos.");
  }

  const data = value as Record<string, unknown>;
  const input = {
    email: getString(data.email).toLowerCase(),
    password: getString(data.password),
  };

  validateEmailAndPassword(input.email, input.password);

  return input;
}

function validateEmailAndPassword(email: string, password: string) {
  if (!emailPattern.test(email)) {
    throw new Error("Informe um email valido.");
  }

  if (password.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }
}
