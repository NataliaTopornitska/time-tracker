import { NextResponse } from "next/server";
import { projectRepository } from "@/infrastructure/container";
import {
  DeleteProjectUseCase,
  UpdateProjectUseCase,
} from "@/application/use-cases";

const updateProject = new UpdateProjectUseCase(projectRepository);
const deleteProject = new DeleteProjectUseCase(projectRepository);

/**
 * PUT /api/projects/:id — edit project.
 * Body: { name?, description?, color? }
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const input: Record<string, unknown> = {};
  if (body.name != null) input.name = String(body.name);
  if (body.description != null) input.description = String(body.description);
  if (body.color != null) input.color = String(body.color);

  const project = await updateProject.execute(id, input);
  if (!project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(project);
}

/**
 * DELETE /api/projects/:id — delete project.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deleteProject.execute(id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }
  return new NextResponse(null, { status: 204 });
}
