"use client";

import { useRef, useEffect, useState } from "react";
import type { TaskName } from "@/domain/entities";

export interface TaskNameInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Selected task (id) when user picks a suggestion; component is uncontrolled for display name. */
  onSelectTask?: (task: TaskName) => void;
  suggestions: TaskName[];
  placeholder?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

export function TaskNameInput({
  value,
  onChange,
  onSelectTask,
  suggestions,
  placeholder = "Task name",
  disabled = false,
  "aria-label": ariaLabel = "Task name",
}: TaskNameInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered =
    value.trim() === ""
      ? suggestions
      : suggestions.filter((t) =>
          t.name.toLowerCase().includes(value.toLowerCase())
        );

  useEffect(() => {
    setHighlightIndex(-1);
  }, [value, suggestions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (task: TaskName) => {
    onChange(task.name);
    onSelectTask?.(task);
    setIsOpen(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filtered.length === 0) {
      if (e.key === "Escape") setIsOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i < filtered.length - 1 ? i + 1 : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : filtered.length - 1));
      return;
    }
    if (e.key === "Enter" && highlightIndex >= 0 && filtered[highlightIndex]) {
      e.preventDefault();
      handleSelect(filtered[highlightIndex]);
      return;
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-expanded={isOpen && filtered.length > 0}
        aria-controls="task-name-listbox"
        aria-activedescendant={
          highlightIndex >= 0 && filtered[highlightIndex]
            ? `task-option-${filtered[highlightIndex].id}`
            : undefined
        }
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
      />
      {isOpen && filtered.length > 0 && (
        <ul
          id="task-name-listbox"
          role="listbox"
          className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {filtered.map((task, i) => (
            <li
              key={task.id}
              id={`task-option-${task.id}`}
              role="option"
              aria-selected={highlightIndex === i}
              onMouseEnter={() => setHighlightIndex(i)}
              onClick={() => handleSelect(task)}
              className={`cursor-pointer px-3 py-2 text-sm ${
                highlightIndex === i
                  ? "bg-emerald-50 text-emerald-900"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {task.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
