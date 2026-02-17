import { NextResponse } from "next/server";
import { timeEntryRepository } from "@/infrastructure/container";
import {
  DeleteTimeEntryUseCase,
  UpdateTimeEntryUseCase,
} from "@/application/use-cases";

const updateTimeEntry = new UpdateTimeEntryUseCase(timeEntryRepository);
const deleteTimeEntry = new DeleteTimeEntryUseCase(timeEntryRepository);

/**
 * PUT /api/time-entries/:id — edit entry.
 * Body: { projectId?, taskNameId?, startedAt?, endedAt?, description? }
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const input: Record<string, unknown> = {};
  if (body.projectId != null) input.projectId = String(body.projectId);
  if (body.taskNameId != null) input.taskNameId = String(body.taskNameId);
  if (body.startedAt != null) input.startedAt = new Date(body.startedAt);
  if (body.endedAt != null) input.endedAt = new Date(body.endedAt);
  if (body.description != null) input.description = String(body.description);

  const entry = await updateTimeEntry.execute(id, input);
  if (!entry) {
    return NextResponse.json(
      { error: "Time entry not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(entry);
}

/**
 * DELETE /api/time-entries/:id — delete the time entry.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deleteTimeEntry.execute(id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Time entry not found" },
      { status: 404 }
    );
  }
  return new NextResponse(null, { status: 204 });
}
