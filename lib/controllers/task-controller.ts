import { Category } from "@/lib/domain/category";
import { Task } from "@/lib/domain/task";
import type { CategoryDTO, DashboardSummary, TaskDTO, TaskFilter, TaskFormInput } from "@/lib/domain/types";
import type { TaskRepository } from "@/lib/repositories/task-repository";

export class TaskController {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly categories: Category[],
  ) {}

  listCategories(): CategoryDTO[] {
    return this.categories.map((category) => category.toDTO());
  }

  listTasks(): TaskDTO[] {
    return this.taskRepository.findAll().map((task) => task.toDTO());
  }

  filterTasks(filter: TaskFilter): TaskDTO[] {
    return this.taskRepository.findByFilter(filter).map((task) => task.toDTO());
  }

  createTask(input: TaskFormInput): TaskDTO {
    const task = new Task(
      `task-${crypto.randomUUID()}`,
      input.title.trim(),
      input.description,
      input.categoryId,
      input.status,
      input.dueDate,
    );

    return this.taskRepository.create(task).toDTO();
  }

  updateTask(taskId: string, input: TaskFormInput): TaskDTO | undefined {
    const task = this.taskRepository.findById(taskId);

    if (!task) {
      return undefined;
    }

    task.update(input);
    return this.taskRepository.update(task).toDTO();
  }

  deleteTask(taskId: string) {
    this.taskRepository.delete(taskId);
  }

  toggleDone(taskId: string) {
    const task = this.taskRepository.findById(taskId);

    if (!task) {
      return;
    }

    if (task.status === "done") {
      task.reopen();
    } else {
      task.markAsDone();
    }

    this.taskRepository.update(task);
  }

  getSummary(): DashboardSummary {
    const tasks = this.taskRepository.findAll();

    return {
      total: tasks.length,
      done: tasks.filter((task) => task.status === "done").length,
      pending: tasks.filter((task) => task.status === "pending").length,
      inProgress: tasks.filter((task) => task.status === "in_progress").length,
    };
  }
}
