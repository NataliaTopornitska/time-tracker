import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const defaultProject = await prisma.project.upsert({
    where: { id: "default-project-1" },
    update: {},
    create: {
      id: "default-project-1",
      name: "Default Project",
      description: "Initial project for time tracking",
      color: "#3b82f6",
    },
  });

  await prisma.taskName.upsert({
    where: { id: "default-task-1" },
    update: {},
    create: {
      id: "default-task-1",
      name: "Development",
      projectId: defaultProject.id,
    },
  });

  await prisma.taskName.upsert({
    where: { id: "default-task-2" },
    update: {},
    create: {
      id: "default-task-2",
      name: "Meeting",
      projectId: defaultProject.id,
    },
  });

  console.log("Seed completed: default project and tasks created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
