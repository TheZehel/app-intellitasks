import { NextResponse } from "next/server";
import { PrismaTaskController } from "@/lib/controllers/prisma-task-controller";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const controller = new PrismaTaskController(prisma);
  const categories = await controller.listCategories();

  return NextResponse.json({ categories });
}
