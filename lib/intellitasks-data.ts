import { PrismaTaskController } from "@/lib/controllers/prisma-task-controller";
import { prisma } from "@/lib/prisma";
import type { IntelliTasksData } from "@/lib/intellitasks-model";

export async function getIntelliTasksData(): Promise<IntelliTasksData> {
  const controller = new PrismaTaskController(prisma);
  const [categories, tasks, summary] = await Promise.all([
    controller.listCategories(),
    controller.listTasks({ categoryId: "all", status: "all" }),
    controller.getSummary(),
  ]);

  return { categories, tasks, summary };
}
