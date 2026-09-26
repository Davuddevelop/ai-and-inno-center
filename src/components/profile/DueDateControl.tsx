"use client";

import { useState, useTransition } from "react";
import { updateProjectDueDate } from "@/lib/supabase/project-actions";

export function isOverdue(dueDate: string | null, status: string) {
  if (!dueDate || status === "completed") return false;
  // Compared as date strings so a deadline is "today" for the whole day in
  // the viewer's own reckoning, rather than expiring at midnight UTC.
  return dueDate < new Date().toISOString().slice(0, 10);
}

export function DueDateControl({
  projectId,
  dueDate: initial,
  status,
}: {
  projectId: string;
  dueDate: string | null;
  status: string;
}) {
  const [dueDate, setDueDate] = useState(initial ?? "");
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    const previous = dueDate;
    setDueDate(next);
    startTransition(async () => {
      try {
        await updateProjectDueDate(projectId, next);
      } catch {
        setDueDate(previous);
      }
    });
  }

  const overdue = isOverdue(dueDate || null, status);

  return (
    <label className="flex items-center gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
        Due
      </span>
      <input
        type="date"
        value={dueDate}
        onChange={handleChange}
        disabled={pending}
        aria-label="Due date"
        className={`h-11 rounded-lg border bg-transparent px-3 text-sm outline-none transition-colors disabled:opacity-50 ${
          overdue
            ? "border-red-400/60 text-red-400"
            : "border-border text-foreground focus:border-accent"
        }`}
      />
      {overdue ? (
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-red-400">
          Overdue
        </span>
      ) : null}
    </label>
  );
}
