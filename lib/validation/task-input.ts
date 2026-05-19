import type { TaskFormInput, TaskStatus } from "@/lib/domain/types";

const statuses: TaskStatus[] = ["pending", "in_progress", "done"];

export function parseTaskInput(input: unknown): TaskFormInput {
  if (!input || typeof input !== "object") {
    throw new Error("Dados invalidos.");
  }

  const data = input as Partial<Record<keyof TaskFormInput, unknown>>;
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description = typeof data.description === "string" ? data.description : "";
  const categoryId = typeof data.categoryId === "string" ? data.categoryId : "";
  const status = statuses.includes(data.status as TaskStatus) ? (data.status as TaskStatus) : "pending";
  const dueDate = typeof data.dueDate === "string" ? data.dueDate : "";

  if (!title) {
    throw new Error("Titulo e obrigatorio.");
  }

  if (!categoryId) {
    throw new Error("Categoria e obrigatoria.");
  }

  return {
    title,
    description,
    categoryId,
    status,
    dueDate,
  };
}
