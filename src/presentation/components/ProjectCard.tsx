import type { Project } from "@/domain/entities";

export interface ProjectCardProps {
  project: Project;
  onSelect?: (project: Project) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(project)}
      className="block w-full rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-gray-300 hover:shadow"
    >
      <div className="flex items-center gap-2">
        {project.color && (
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: project.color }}
            aria-hidden
          />
        )}
        <span className="font-medium text-gray-900">{project.name}</span>
      </div>
      {project.description && (
        <p className="mt-1 text-sm text-gray-500">{project.description}</p>
      )}
    </button>
  );
}
