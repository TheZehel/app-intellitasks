import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = [
    { id: "study", name: "Estudos", color: "#028090" },
    { id: "work", name: "Trabalho", color: "#02C39A" },
    { id: "personal", name: "Pessoal", color: "#5AB8B6" },
    { id: "urgent", name: "Urgente", color: "#0B5F6F" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category,
    });
  }

  const existingTasks = await prisma.task.count();

  if (existingTasks === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: "Preparar apresentacao MVC",
          description: "Organizar exemplos de Model, View e Controller para demonstracao.",
          categoryId: "study",
          status: "in_progress",
          dueDate: new Date("2026-05-22T00:00:00.000Z"),
        },
        {
          title: "Revisar backlog da semana",
          description: "Priorizar tarefas abertas e remover itens duplicados.",
          categoryId: "work",
          status: "pending",
          dueDate: new Date("2026-05-24T00:00:00.000Z"),
        },
        {
          title: "Confirmar horario da entrega",
          description: "Validar data final e separar roteiro da apresentacao.",
          categoryId: "urgent",
          status: "done",
          dueDate: new Date("2026-05-19T00:00:00.000Z"),
        },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
