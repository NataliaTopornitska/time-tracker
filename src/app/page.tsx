"use client";

import { useEffect, useState, useCallback } from "react";
import type { Project, TaskName, TimeEntry } from "@/domain/entities";
import type { ReportData, ReportPeriod } from "@/application/use-cases";
import type { TimeEntriesGroup } from "@/presentation/components";
import {
  AddProjectForm,
  ProjectDropdown,
  ProjectsList,
  ReportsView,
  TaskNameInput,
  TimeEntriesGroupedList,
  TimerControls,
  TimerDisplay,
} from "@/presentation/components";

function elapsedSeconds(entry: TimeEntry | null): number {
  if (!entry) return 0;
  const start = new Date(entry.startedAt).getTime();
  const end = entry.endedAt
    ? new Date(entry.endedAt).getTime()
    : Date.now();
  return Math.floor((end - start) / 1000);
}

function entryDurationMinutes(entry: TimeEntry): number {
  const start = new Date(entry.startedAt).getTime();
  const end = entry.endedAt
    ? new Date(entry.endedAt).getTime()
    : Date.now();
  return Math.floor((end - start) / 60_000);
}

function formatDurationHhMm(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

function parseDurationHhMm(hhMm: string): number {
  const parts = hhMm.trim().split(":");
  const h = Math.max(0, parseInt(parts[0], 10) || 0);
  const m = Math.max(0, parseInt(parts[1], 10) || 0);
  return h * 60 + m;
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [taskSuggestions, setTaskSuggestions] = useState<TaskName[]>([]);
  const [allTaskNames, setAllTaskNames] = useState<TaskName[]>([]);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [groups, setGroups] = useState<TimeEntriesGroup[]>([]);
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>("week");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [tick, setTick] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [taskInputValue, setTaskInputValue] = useState("");
  const [selectedTaskNameId, setSelectedTaskNameId] = useState<string>("");
  const [runningLabel, setRunningLabel] = useState<{
    projectName: string;
    taskName: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/projects");
    if (res.ok) setProjects(await res.json());
  }, []);

  const fetchReport = useCallback(async (period: ReportPeriod) => {
    setReportLoading(true);
    const res = await fetch(`/api/reports?period=${period}`);
    if (res.ok) setReportData(await res.json());
    else setReportData(null);
    setReportLoading(false);
  }, []);

  const handleReportExport = useCallback(() => {
    window.open(`/api/reports/export?period=${reportPeriod}`, "_blank");
  }, [reportPeriod]);

  const handleAddProject = useCallback(
    async (payload: { name: string; description?: string; color?: string }) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) await fetchProjects();
    },
    [fetchProjects]
  );

  const handleEditProject = useCallback(
    async (
      projectId: string,
      payload: { name: string; description?: string; color?: string }
    ) => {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingProjectId(null);
        await fetchProjects();
      }
    },
    [fetchProjects]
  );

  const handleDeleteProject = useCallback(
    async (projectId: string) => {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEditingProjectId(null);
        await fetchProjects();
      }
    },
    [fetchProjects]
  );
  
  const handleCreateTask = useCallback(async () => {
    if (!selectedProjectId || !taskInputValue.trim()) return;
  
    const res = await fetch("/api/task-names", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: taskInputValue.trim(),
        projectId: selectedProjectId,
      }),
    });
  
    if (res.ok) {
      const created: TaskName = await res.json();
  
      // додаємо в локальний state (без повторного fetch)
      setAllTaskNames((prev) => [...prev, created]);
      setTaskSuggestions((prev) => [...prev, created]);
  
      // вибираємо новий task
      setTaskInputValue(created.name);
      setSelectedTaskNameId(created.id);
    }
  }, [selectedProjectId, taskInputValue]);  

  const handleProjectColorChange = useCallback(
    async (projectId: string, color: string) => {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color }),
      });
      if (res.ok) await fetchProjects();
    },
    [fetchProjects]
  );

  const fetchTaskSuggestions = useCallback(
    async (query: string, projectId: string | null) => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (projectId) params.set("projectId", projectId);
      const res = await fetch(`/api/task-names?${params.toString()}`);
      if (res.ok) setTaskSuggestions(await res.json());
      else setTaskSuggestions([]);
    },
    []
  );

  const fetchEntries = useCallback(async () => {
    const res = await fetch("/api/time-entries");
    if (res.ok) {
      const data = await res.json();
      setEntries(data);
      const active = data.find((e: TimeEntry) => !e.endedAt) ?? null;
      setActiveEntry(active);
      if (!active) setRunningLabel(null);
    }
  }, []);

  const fetchGroups = useCallback(async () => {
    const res = await fetch("/api/time-entries?groupBy=project");
    if (res.ok) setGroups(await res.json());
  }, []);

  const fetchAllTaskNames = useCallback(async () => {
    const res = await fetch("/api/task-names");
    if (res.ok) setAllTaskNames(await res.json());
  }, []);

  useEffect(() => {
    Promise.all([
      fetchProjects(),
      fetchEntries(),
      fetchGroups(),
      fetchAllTaskNames(),
    ]).finally(() => setLoading(false));
  }, [fetchProjects, fetchEntries, fetchGroups, fetchAllTaskNames]);

  useEffect(() => {
    fetchReport(reportPeriod);
  }, [reportPeriod, fetchReport]);

  useEffect(() => {
    if (!activeEntry) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [activeEntry]);

  useEffect(() => {
    fetchTaskSuggestions(taskInputValue, selectedProjectId || null);
  }, [taskInputValue, selectedProjectId, fetchTaskSuggestions]);

  const handleStop = useCallback(
    async (entry?: TimeEntry) => {
      const toStop = entry ?? activeEntry;
      if (!toStop) return;
      const res = await fetch(`/api/time-entries/${toStop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endedAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setRunningLabel(null);
        await Promise.all([fetchEntries(), fetchGroups()]);
      }
    },
    [activeEntry, fetchEntries]
  );

  const handleStart = useCallback(async () => {
    if (!selectedProjectId || !selectedTaskNameId) return;
    const project = projects.find((p) => p.id === selectedProjectId);
    const task =
    taskSuggestions.find((t) => t.id === selectedTaskNameId) ||
    allTaskNames.find((t) => t.id === selectedTaskNameId);
    const res = await fetch("/api/time-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: selectedProjectId,
        taskNameId: selectedTaskNameId,
      }),
    });
    if (res.ok) {
      setRunningLabel({
        projectName: project?.name ?? "Project",
        taskName: task?.name ?? "Task",
      });
      await Promise.all([fetchEntries(), fetchGroups()]);
      setTaskInputValue("");
      setSelectedTaskNameId("");
    }
  }, [
    selectedProjectId,
    selectedTaskNameId,
    projects,
    taskSuggestions,
    allTaskNames,
    fetchEntries,
  ]);

  const handleSelectTask = useCallback((task: TaskName) => {
    setSelectedTaskNameId(task.id);
  }, []);

  const allEntries = groups.flatMap((g) => g.entries);

  const getDurationString = useCallback((entry: TimeEntry) => {
    return formatDurationHhMm(entryDurationMinutes(entry));
  }, []);

  const handleProjectChange = useCallback(
    async (entryId: string, projectId: string) => {
      const res = await fetch(`/api/time-entries/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      if (res.ok) await Promise.all([fetchEntries(), fetchGroups()]);
    },
    [fetchEntries, fetchGroups]
  );

  const handleTaskChange = useCallback(
    async (entryId: string, taskNameId: string) => {
      const res = await fetch(`/api/time-entries/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskNameId }),
      });
      if (res.ok) await Promise.all([fetchEntries(), fetchGroups()]);
    },
    [fetchEntries, fetchGroups]
  );

  const handleDurationChange = useCallback(
    async (entryId: string, durationHhMm: string) => {
      const entry = allEntries.find((e) => e.id === entryId);
      if (!entry) return;
      const minutes = parseDurationHhMm(durationHhMm);
      const startMs = new Date(entry.startedAt).getTime();
      const endedAt = new Date(startMs + minutes * 60_000);
      const res = await fetch(`/api/time-entries/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startedAt: entry.startedAt,
          endedAt: endedAt.toISOString(),
        }),
      });
      if (res.ok) await Promise.all([fetchEntries(), fetchGroups()]);
    },
    [allEntries, fetchEntries, fetchGroups]
  );

  const handleDeleteEntry = useCallback(
    async (entryId: string) => {
      const res = await fetch(`/api/time-entries/${entryId}`, {
        method: "DELETE",
      });
      if (res.ok) await Promise.all([fetchEntries(), fetchGroups()]);
    },
    [fetchEntries, fetchGroups]
  );

  const canStart =
    !activeEntry && selectedProjectId && selectedTaskNameId;

  const timerLabel =
    activeEntry && runningLabel
      ? `${runningLabel.projectName} · ${runningLabel.taskName}`
      : activeEntry
        ? "Running"
        : undefined;

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-gray-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Time Tracker</h1>

      {/* Main Timer — always visible at top */}
      <section className="mb-8">
        <TimerDisplay
          elapsedSeconds={elapsedSeconds(activeEntry)}
          label={timerLabel}
          isRunning={!!activeEntry}
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <ProjectDropdown
            projects={projects}
            value={selectedProjectId}
            onChange={(id) => {
              setSelectedProjectId(id);
              setSelectedTaskNameId("");
            }}
            placeholder="Project / client"
            disabled={!!activeEntry}
          />
          <div className="min-w-[200px] flex-1 flex gap-2">
            <TaskNameInput
              value={taskInputValue}
              onChange={setTaskInputValue}
              onSelectTask={handleSelectTask}
              suggestions={taskSuggestions}
              placeholder="Task name"
              disabled={!!activeEntry}
            />

            <button
              type="button"
              onClick={handleCreateTask}
              disabled={!selectedProjectId || !taskInputValue.trim() || !!activeEntry}
              className="px-3 py-2 text-sm bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              + Task
            </button>
          </div>
          <TimerControls
            isRunning={!!activeEntry}
            onStart={handleStart}
            onStop={() => handleStop()}
            disabled={!canStart}
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Projects</h2>
        <div className="space-y-4">
          <AddProjectForm onSubmit={handleAddProject} />
          <ProjectsList
            projects={projects}
            onColorChange={handleProjectColorChange}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            editingId={editingProjectId}
            onStartEdit={setEditingProjectId}
            onCancelEdit={() => setEditingProjectId(null)}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Time entries
        </h2>
        <TimeEntriesGroupedList
          groups={groups}
          projects={projects}
          taskNames={allTaskNames}
          getDurationString={getDurationString}
          onProjectChange={handleProjectChange}
          onTaskChange={handleTaskChange}
          onDurationChange={handleDurationChange}
          onDelete={handleDeleteEntry}
          onStop={handleStop}
        />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Reports</h2>
        <ReportsView
          report={reportData}
          period={reportPeriod}
          onPeriodChange={setReportPeriod}
          onExportClick={handleReportExport}
          isLoading={reportLoading}
        />
      </section>
    </main>
  );
}
