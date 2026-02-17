import { NextResponse } from "next/server";
import { taskNameRepository } from "@/infrastructure/container";
import {
  DeleteTaskNameUseCase,
  UpdateTaskNameUseCase,
} from "@/application/use-cases";

const updateTaskName = new UpdateTaskNameUseCase(taskNameRepository);
const deleteTaskName = new DeleteTaskNameUseCase(taskNameRepository);

/**
 * PUT /api/task-names/:id — edit task name.
 * Body: { name? }
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const input: Record<string, unknown> = {};
  if (body.name != null) input.name = String(body.name);

  const taskName = await updateTaskName.execute(id, input);
  if (!taskName) {
    return NextResponse.json(
      { error: "Task name not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(taskName);
}

/**
 * DELETE /api/task-names/:id — delete task name.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deleteTaskName.execute(id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Task name not found" },
      { status: 404 }
    );
  }
  return new NextResponse(null, { status: 204 });
}
