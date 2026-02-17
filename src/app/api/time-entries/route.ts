import { NextRequest, NextResponse } from "next/server";
import {
  projectRepository,
  timeEntryRepository,
} from "@/infrastructure/container";
import {
  GetTimeEntriesUseCase,
  GroupTimeEntriesByProjectUseCase,
  StartTimeEntryUseCase,
} from "@/application/use-cases";

const getTimeEntries = new GetTimeEntriesUseCase(timeEntryRepository);
const startTimeEntry = new StartTimeEntryUseCase(timeEntryRepository);
const groupByProject = new GroupTimeEntriesByProjectUseCase(
  timeEntryRepository,
  projectRepository
);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const activeOnly = searchParams.get("activeOnly") === "true";
  const groupBy = searchParams.get("groupBy");
  const projectId = searchParams.get("projectId");

  if (activeOnly) {
    const active = await timeEntryRepository.findActive();
    if (!active) {
      return NextResponse.json(
        { error: "No active time entry" },
        { status: 404 }
      );
    }
    return NextResponse.json(active);
  }

  if (groupBy === "project") {
    const groups = await groupByProject.execute();
    return NextResponse.json(groups);
  }

  const entries = await getTimeEntries.execute(projectId ?? undefined);
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { projectId, taskNameId, description } = body;
  if (!projectId || !taskNameId) {
    return NextResponse.json(
      { error: "projectId and taskNameId are required" },
      { status: 400 }
    );
  }
  const entry = await startTimeEntry.execute({
    projectId: String(projectId),
    taskNameId: String(taskNameId),
    description: typeof description === "string" ? description : undefined,
  });
  return NextResponse.json(entry, { status: 201 });
}
