import { TaskController } from "@/lib/controllers/task-controller";
import { Category } from "@/lib/domain/category";
import { Task } from "@/lib/domain/task";
import { InMemoryTaskRepository } from "@/lib/repositories/task-repository";

export function createTaskController() {
  const categories = [
    new Category("study", "Estudos", "#2563eb"),
    new Category("work", "Trabalho", "#059669"),
    new Category("personal", "Pessoal", "#d97706"),
    new Category("urgent", "Urgente", "#dc2626"),
  ];

  const tasks = [
    new Task(
      "task-1",
      "Preparar apresentacao MVC",
      "Organizar exemplos de Model, View e Controller para demonstracao.",
      "study",
      "in_progress",
      "2026-05-22",
    ),
    new Task(
      "task-2",
      "Revisar backlog da semana",
      "Priorizar tarefas abertas e remover itens duplicados.",
      "work",
      "pending",
      "2026-05-24",
    ),
    new Task(
      "task-3",
      "Confirmar horario da entrega",
      "Validar data final e separar roteiro da apresentacao.",
      "urgent",
      "done",
      "2026-05-19",
    ),
  ];

  return new TaskController(new InMemoryTaskRepository(tasks), categories);
}
