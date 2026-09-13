"use client";

import { useState, useTransition } from "react";

// A <select> bound to a Server Action that takes (id, newValue) and applies
// optimistically, reverting on failure. Shared by any "pick from an enum,
// save immediately" control -- member rank, project status, etc.
export function InlineSelect<T extends string>({
  id,
  value,
  options,
  labels,
  action,
  disabled,
}: {
  id: string;
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  action: (id: string, value: T) => Promise<void>;
  disabled?: boolean;
}) {
  const [current, setCurrent] = useState(value);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as T;
    const previous = current;
    setCurrent(next);
    setError(null);
    startTransition(async () => {
      try {
        await action(id, next);
      } catch (err) {
        setCurrent(previous);
        setError(err instanceof Error ? err.message : "Failed to update.");
      }
    });
  }

  return (
    <div>
      <select
        value={current}
        onChange={handleChange}
        disabled={disabled || pending}
        className="rounded-lg border border-border bg-transparent px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground outline-none transition-colors focus:border-accent disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-background text-foreground">
            {labels[option]}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
