import type { Project } from "@/domain/entities";

export interface ProjectDropdownProps {
  projects: Project[];
  value: string;
  onChange: (projectId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

export function ProjectDropdown({
  projects,
  value,
  onChange,
  placeholder = "Select project",
  disabled = false,
  "aria-label": ariaLabel = "Project",
}: ProjectDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label={ariaLabel}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
    >
      <option value="">{placeholder}</option>
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
