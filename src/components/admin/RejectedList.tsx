"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { restoreApplication } from "@/lib/supabase/admin-actions";
import type { Profile } from "@/lib/supabase/types";

// Collapsed by default: this is a recovery path, not part of the daily
// review flow. Before it existed, /admin only ever queried pending
// profiles, so a rejected applicant simply vanished from the app.
export function RejectedList({ rejected }: { rejected: Profile[] }) {
  const [open, setOpen] = useState(false);
  const [optimisticRejected, removeRejected] = useOptimistic(
    rejected,
    (state, id: string) => state.filter((r) => r.id !== id),
  );
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (rejected.length === 0) return null;

  function restore(id: string) {
    setError(null);
    startTransition(async () => {
      removeRejected(id);
      try {
        await restoreApplication(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to restore.");
      }
    });
  }

  return (
    <div className="mt-16">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-11 items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
      >
        {open ? "▾" : "▸"} Rejected ({optimisticRejected.length})
      </button>

      {open ? (
        <div className="mt-4 space-y-3">
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {optimisticRejected.map((person) => (
            <div
              key={person.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
            >
              <div>
                <p className="font-display text-lg">{person.full_name}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                  {person.grade || "No grade"} · {person.email}
                </p>
              </div>
              <Button variant="secondary" onClick={() => restore(person.id)}>
                Move back to pending
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
