"use client";

import { useState, useTransition } from "react";
import { RANK_LABELS } from "@/lib/supabase/types";
import type { MemberRank } from "@/lib/supabase/types";

const RANK_OPTIONS: MemberRank[] = [
  "president",
  "vice_president",
  "executive_member",
  "senior_member",
  "member",
  "trainee",
];

export function MemberRankSelect({
  profileId,
  rank,
  onChange,
}: {
  profileId: string;
  rank: MemberRank;
  onChange: (profileId: string, rank: MemberRank) => Promise<void>;
}) {
  const [value, setValue] = useState(rank);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as MemberRank;
    const previous = value;
    setValue(next);
    setError(null);
    startTransition(async () => {
      try {
        await onChange(profileId, next);
      } catch (err) {
        setValue(previous);
        setError(err instanceof Error ? err.message : "Failed to update.");
      }
    });
  }

  return (
    <div>
      <select
        value={value}
        onChange={handleChange}
        disabled={pending}
        className="rounded-lg border border-border bg-transparent px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-foreground outline-none transition-colors focus:border-accent disabled:opacity-50"
      >
        {RANK_OPTIONS.map((option) => (
          <option key={option} value={option} className="bg-background text-foreground">
            {RANK_LABELS[option]}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
