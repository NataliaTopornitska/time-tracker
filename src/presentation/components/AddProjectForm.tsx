import { useState } from "react";
import { ColorPicker } from "./ColorPicker";

export interface AddProjectFormProps {
  onSubmit: (payload: { name: string; description?: string; color?: string }) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export function AddProjectForm({
  onSubmit,
  onCancel,
  disabled = false,
}: AddProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit({
      name: trimmed,
      description: description.trim() || undefined,
      color: color.trim() || undefined,
    });
    setName("");
    setDescription("");
    setColor("");
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-800">New project</h3>
      <div className="space-y-3">
        <div>
          <label htmlFor="add-project-name" className="mb-1 block text-xs font-medium text-gray-600">
            Name
          </label>
          <input
            id="add-project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            disabled={disabled}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="add-project-desc" className="mb-1 block text-xs font-medium text-gray-600">
            Description (optional)
          </label>
          <input
            id="add-project-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            disabled={disabled}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
          />
        </div>
        <div>
          <span className="mb-1 block text-xs font-medium text-gray-600">Color</span>
          <ColorPicker value={color} onChange={setColor} disabled={disabled} />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={disabled || !name.trim()}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          Add project
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
