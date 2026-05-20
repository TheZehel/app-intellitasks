import { TaskController } from "@/lib/controllers/task-controller";
import { Category } from "@/lib/domain/category";
import { Task } from "@/lib/domain/task";
import { InMemoryTaskRepository } from "@/lib/repositories/task-repository";

export function createTaskController() {
  const categories = [
    new Category("study", "Estudos", "#028090"),
    new Category("work", "Trabalho", "#02C39A"),
    new Category("personal", "Pessoal", "#5AB8B6"),
    new Category("urgent", "Urgente", "#0B5F6F"),
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
