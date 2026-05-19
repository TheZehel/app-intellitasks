import type { PrismaClient, TaskStatus } from "@/lib/generated/prisma/client";
import type { TaskFilter, TaskFormInput } from "@/lib/domain/types";

export class PrismaTaskRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(filter: TaskFilter) {
    return this.prisma.task.findMany({
      where: {
        categoryId: filter.categoryId === "all" ? undefined : filter.categoryId,
        status: filter.status === "all" ? undefined : (filter.status as TaskStatus),
      },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
    });
  }

  async create(input: TaskFormInput) {
    return this.prisma.task.create({
      data: {
        title: input.title.trim(),
        description: input.description,
        categoryId: input.categoryId,
        status: input.status,
        dueDate: parseDueDate(input.dueDate),
      },
    });
  }

  async update(taskId: string, input: TaskFormInput) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: input.title.trim(),
        description: input.description,
        categoryId: input.categoryId,
        status: input.status,
        dueDate: parseDueDate(input.dueDate),
      },
    });
  }

  async delete(taskId: string) {
    await this.prisma.task.delete({
      where: { id: taskId },
    });
  }

  async toggleDone(taskId: string) {
    const task = await this.prisma.task.findUniqueOrThrow({
      where: { id: taskId },
    });

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: task.status === "done" ? "pending" : "done",
      },
    });
  }

  async summary() {
    const [total, pending, inProgress, done] = await Promise.all([
      this.prisma.task.count(),
      this.prisma.task.count({ where: { status: "pending" } }),
      this.prisma.task.count({ where: { status: "in_progress" } }),
      this.prisma.task.count({ where: { status: "done" } }),
    ]);

    return {
      total,
      pending,
      inProgress,
      done,
    };
  }
}

function parseDueDate(value: string) {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00.000Z`);
}
