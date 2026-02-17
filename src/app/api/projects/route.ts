import { NextResponse } from "next/server";
import { projectRepository } from "@/infrastructure/container";
import { GetProjectsUseCase, CreateProjectUseCase } from "@/application/use-cases";

const getProjects = new GetProjectsUseCase(projectRepository);
const createProject = new CreateProjectUseCase(projectRepository);

export async function GET() {
  const projects = await getProjects.execute();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description, color } = body;
  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "name is required and must be a string" },
      { status: 400 }
    );
  }
  const project = await createProject.execute({
    name,
    description: typeof description === "string" ? description : undefined,
    color: typeof color === "string" ? color : undefined,
  });
  return NextResponse.json(project, { status: 201 });
}
