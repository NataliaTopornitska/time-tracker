import { NextRequest, NextResponse } from "next/server";
import { taskNameRepository } from "@/infrastructure/container";
import {
  CreateTaskNameUseCase,
  GetTaskNameSuggestionsUseCase,
} from "@/application/use-cases";

const createTaskName = new CreateTaskNameUseCase(taskNameRepository);
const getTaskNameSuggestions = new GetTaskNameSuggestionsUseCase(
  taskNameRepository
);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const projectId = searchParams.get("projectId");
  const q = searchParams.get("q");

  if (q != null) {
    const suggestions = await getTaskNameSuggestions.execute({
      projectId: projectId ?? null,
      query: q,
      limit: 20,
    });
    return NextResponse.json(suggestions);
  }

  const taskNames = projectId
    ? await taskNameRepository.findByProjectId(projectId)
    : await taskNameRepository.findAll();
  return NextResponse.json(taskNames);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, projectId } = body;
  if (!name || !projectId) {
    return NextResponse.json(
      { error: "name and projectId are required" },
      { status: 400 }
    );
  }
  const taskName = await createTaskName.execute({
    name: String(name),
    projectId: String(projectId),
  });
  return NextResponse.json(taskName, { status: 201 });
}
