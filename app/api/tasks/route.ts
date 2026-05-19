import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma/client";
import { PrismaTaskController } from "@/lib/controllers/prisma-task-controller";
import type { TaskFilter, TaskStatus } from "@/lib/domain/types";
import { prisma } from "@/lib/prisma";
import { parseTaskInput } from "@/lib/validation/task-input";

const validStatuses: TaskStatus[] = ["pending", "in_progress", "done"];

export async function GET(request: NextRequest) {
  const controller = new PrismaTaskController(prisma);
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");
  const filter: TaskFilter = {
    categoryId: categoryId && categoryId !== "all" ? categoryId : "all",
    status: status && validStatuses.includes(status as TaskStatus) ? (status as TaskStatus) : "all",
  };

  const [tasks, summary] = await Promise.all([controller.listTasks(filter), controller.getSummary()]);

  return NextResponse.json({ tasks, summary });
}

export async function POST(request: NextRequest) {
  try {
    const controller = new PrismaTaskController(prisma);
    const input = parseTaskInput(await request.json());
    const task = await controller.createTask(input);
    const summary = await controller.getSummary();

    return NextResponse.json({ task, summary }, { status: 201 });
  } catch (error) {
    return handleTaskError(error);
  }
}

export function handleTaskError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return NextResponse.json({ message: "Registro nao encontrado." }, { status: 404 });
  }

  const message = error instanceof Error ? error.message : "Nao foi possivel processar a tarefa.";

  return NextResponse.json({ message }, { status: 400 });
}
