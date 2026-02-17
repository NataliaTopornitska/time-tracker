import { NextResponse } from "next/server";
import { timeEntryRepository } from "@/infrastructure/container";
import { StopTimeEntryUseCase } from "@/application/use-cases";

const stopTimeEntry = new StopTimeEntryUseCase(timeEntryRepository);

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const entry = await stopTimeEntry.execute(id);
  if (!entry) {
    return NextResponse.json(
      { error: "Entry not found or already stopped" },
      { status: 404 }
    );
  }
  return NextResponse.json(entry);
}
