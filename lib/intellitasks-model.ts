import type { CategoryDTO, TaskDTO, TaskStatus } from "@/lib/domain/types";

export type IntelliTasksData = {
  categories: CategoryDTO[];
  tasks: TaskDTO[];
  summary: {
    total: number;
    pending: number;
    inProgress: number;
    done: number;
  };
};

export const statusLabels: Record<TaskStatus, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  done: "Concluida",
};

export function getCategory(categories: CategoryDTO[], categoryId: string) {
  return categories.find((category) => category.id === categoryId) ?? {
    id: "",
    name: "Sem categoria",
    color: "#918fa1",
  };
}

export function getTasksByStatus(tasks: TaskDTO[], status: TaskStatus) {
  return tasks.filter((task) => task.status === status);
}

export function formatDate(value: string) {
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return "Sem data";
  }

  return `${day}/${month}/${year}`;
}
