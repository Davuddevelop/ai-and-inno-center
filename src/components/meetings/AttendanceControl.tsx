"use client";

import { useState, useTransition } from "react";
import { setAttendanceStatus } from "@/lib/supabase/session-actions";
import { ARRIVAL_LABELS } from "@/lib/supabase/types";
import type { ArrivalStatus } from "@/lib/supabase/types";

type Choice = ArrivalStatus | "absent";

const CHOICES: Choice[] = ["present", "late", "excused", "absent"];
const LABELS: Record<Choice, string> = { ...ARRIVAL_LABELS, absent: "Absent" };

// Replaces the old present/absent checkbox. Applies optimistically and
// reverts on failure, the same way the rank dropdown does -- every action
// here is a round trip to Tokyo, and marking a roster of twenty people is
// unusable if each click waits for it.
export function AttendanceControl({
  meetingId,
  profileId,
  status: initialStatus,
  minutesLate: initialMinutes,
}: {
  meetingId: string;
  profileId: string;
  status: Choice;
  minutesLate: number | null;
}) {
  const [status, setStatus] = useState<Choice>(initialStatus);
  const [minutes, setMinutes] = useState<string>(
    initialMinutes == null ? "" : String(initialMinutes),
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save(next: Choice, nextMinutes: string) {
    const previous = status;
    setStatus(next);
    setError(null);
    startTransition(async () => {
      try {
        const parsed = nextMinutes.trim() === "" ? null : Number(nextMinutes);
        await setAttendanceStatus(
          meetingId,
          profileId,
          next,
          Number.isFinite(parsed) ? parsed : null,
        );
      } catch (err) {
        setStatus(previous);
        setError(err instanceof Error ? err.message : "Failed to save.");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1.5">
        {CHOICES.map((choice) => {
          const on = status === choice;
          return (
            <button
              key={choice}
              type="button"
              disabled={pending}
              onClick={() => save(choice, choice === "late" ? minutes : "")}
              aria-pressed={on}
              className={`min-h-11 rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors disabled:opacity-50 ${
                on
                  ? "bg-foreground text-background"
                  : "border border-border-strong text-muted hover:text-foreground"
              }`}
            >
              {LABELS[choice]}
            </button>
          );
        })}
      </div>

      {status === "late" ? (
        <label className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            onBlur={() => save("late", minutes)}
            placeholder="min"
            aria-label="Minutes late"
            className="h-11 w-20 rounded-lg border border-border bg-transparent px-3 text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
            min late
          </span>
        </label>
      ) : null}

      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </div>
  );
}
