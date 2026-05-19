import type { PrismaClient } from "@/lib/generated/prisma/client";
import type { TaskFilter, TaskFormInput } from "@/lib/domain/types";
import { toCategoryDTO, toTaskDTO } from "@/lib/mappers/task-mapper";
import { PrismaTaskRepository } from "@/lib/repositories/prisma-task-repository";

export class PrismaTaskController {
  private readonly taskRepository: PrismaTaskRepository;

  constructor(private readonly prisma: PrismaClient) {
    this.taskRepository = new PrismaTaskRepository(prisma);
  }

  async listCategories() {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return categories.map(toCategoryDTO);
  }

  async listTasks(filter: TaskFilter) {
    const tasks = await this.taskRepository.findAll(filter);

    return tasks.map(toTaskDTO);
  }

  async createTask(input: TaskFormInput) {
    const task = await this.taskRepository.create(input);

    return toTaskDTO(task);
  }

  async updateTask(taskId: string, input: TaskFormInput) {
    const task = await this.taskRepository.update(taskId, input);

    return toTaskDTO(task);
  }

  async deleteTask(taskId: string) {
    await this.taskRepository.delete(taskId);
  }

  async toggleDone(taskId: string) {
    const task = await this.taskRepository.toggleDone(taskId);

    return toTaskDTO(task);
  }

  async getSummary() {
    return this.taskRepository.summary();
  }
}
