import { NextRequest, NextResponse } from "next/server";
import { PrismaTaskController } from "@/lib/controllers/prisma-task-controller";
import { prisma } from "@/lib/prisma";
import { parseTaskInput } from "@/lib/validation/task-input";
import { handleTaskError } from "../route";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const controller = new PrismaTaskController(prisma);
    const input = parseTaskInput(await request.json());
    const task = await controller.updateTask(id, input);
    const summary = await controller.getSummary();

    return NextResponse.json({ task, summary });
  } catch (error) {
    return handleTaskError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const controller = new PrismaTaskController(prisma);
    await controller.deleteTask(id);
    const summary = await controller.getSummary();

    return NextResponse.json({ summary });
  } catch (error) {
    return handleTaskError(error);
  }
}
