import { NextRequest, NextResponse } from "next/server";
import { PrismaTaskController } from "@/lib/controllers/prisma-task-controller";
import { prisma } from "@/lib/prisma";
import { handleTaskError } from "../../route";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const controller = new PrismaTaskController(prisma);
    const task = await controller.toggleDone(id);
    const summary = await controller.getSummary();

    return NextResponse.json({ task, summary });
  } catch (error) {
    return handleTaskError(error);
  }
}
