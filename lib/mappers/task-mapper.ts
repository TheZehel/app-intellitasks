import type { Category, Task } from "@/lib/generated/prisma/client";
import type { CategoryDTO, TaskDTO } from "@/lib/domain/types";

type TaskWithCategory = Task & {
  category?: Category;
};

export function toCategoryDTO(category: Category): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    color: category.color,
  };
}

export function toTaskDTO(task: TaskWithCategory): TaskDTO {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    categoryId: task.categoryId,
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : "",
  };
}
