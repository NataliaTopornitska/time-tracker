import type { Project } from "@/domain/entities";
import { ColorPicker } from "./ColorPicker";
import { EditProjectForm } from "./EditProjectForm";

export interface ProjectsListProps {
  projects: Project[];
  onColorChange: (projectId: string, color: string) => void;
  onEdit: (projectId: string, payload: { name: string; description?: string; color?: string }) => void;
  onDelete: (projectId: string) => void;
  editingId: string | null;
  onStartEdit: (projectId: string) => void;
  onCancelEdit: () => void;
}

export function ProjectsList({
  projects,
  onColorChange,
  onEdit,
  onDelete,
  editingId,
  onStartEdit,
  onCancelEdit,
}: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <p className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
        No projects yet. Add one above.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {projects.map((project) => (
        <li
          key={project.id}
          className="rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          {editingId === project.id ? (
            <div className="p-4">
              <EditProjectForm
                key={project.id}
                initialValues={{
                  name: project.name,
                  description: project.description ?? "",
                  color: project.color ?? "",
                }}
                onSubmit={(payload) => onEdit(project.id, payload)}
                onCancel={onCancelEdit}
              />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 p-4">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {project.color && (
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border border-gray-200"
                    style={{ backgroundColor: project.color }}
                    aria-hidden
                  />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{project.name}</p>
                  {project.description && (
                    <p className="truncate text-sm text-gray-500">{project.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">Color</span>
                  <ColorPicker
                    value={project.color ?? ""}
                    onChange={(color) => onColorChange(project.id, color)}
                    aria-label={`Color for ${project.name}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onStartEdit(project.id)}
                  className="rounded border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(project.id)}
                  aria-label={`Delete ${project.name}`}
                  className="rounded border border-red-200 bg-white px-2 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
