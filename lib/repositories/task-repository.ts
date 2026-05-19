import { Task } from "@/lib/domain/task";
import type { TaskFilter } from "@/lib/domain/types";

export interface TaskRepository {
  create(task: Task): Task;
  update(task: Task): Task;
  delete(taskId: string): void;
  findById(taskId: string): Task | undefined;
  findAll(): Task[];
  findByFilter(filter: TaskFilter): Task[];
}

export class InMemoryTaskRepository implements TaskRepository {
  constructor(private tasks: Task[]) {}

  create(task: Task) {
    this.tasks = [task, ...this.tasks];
    return task;
  }

  update(task: Task) {
    this.tasks = this.tasks.map((currentTask) => (currentTask.id === task.id ? task : currentTask));
    return task;
  }

  delete(taskId: string) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  findById(taskId: string) {
    return this.tasks.find((task) => task.id === taskId);
  }

  findAll() {
    return [...this.tasks];
  }

  findByFilter(filter: TaskFilter) {
    return this.tasks.filter((task) => task.matchesFilter(filter));
  }
}
