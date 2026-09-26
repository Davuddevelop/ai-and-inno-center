"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { addFeedback } from "@/lib/supabase/session-actions";
import type { Profile } from "@/lib/supabase/types";

// Writes one feedback entry holding both notes. The two fields are labelled
// with who reads them because that is the single thing an author must get
// right, and there is no undo once a member has read the shared half.
export function FeedbackComposer({
  members,
  profileId,
  meetingId,
}: {
  // Pass members to pick from (session page), or a fixed profileId (a
  // member's own page).
  members?: Profile[];
  profileId?: string;
  meetingId: string | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [target, setTarget] = useState(profileId ?? members?.[0]?.id ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function submit(formData: FormData) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await addFeedback(target, meetingId, formData);
        formRef.current?.reset();
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save.");
      }
    });
  }

  if (members && members.length === 0) {
    return (
      <p className="mt-6 text-muted">
        No active members to leave feedback for yet.
      </p>
    );
  }

  return (
    <form
      ref={formRef}
      action={submit}
      className="mt-6 space-y-4 rounded-2xl border border-border p-6"
    >
      {members ? (
        <div>
          <label
            htmlFor="feedback-member"
            className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted"
          >
            Member
          </label>
          <select
            id="feedback-member"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-border bg-transparent px-3 text-foreground outline-none transition-colors focus:border-accent"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id} className="bg-background">
                {m.full_name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <label
          htmlFor="feedback-shared"
          className="font-mono text-[12px] uppercase tracking-[0.1em] text-foreground"
        >
          Shared with the member
        </label>
        <p className="mt-1 text-sm text-muted">
          They will read this on their own profile. Write it to them.
        </p>
        <textarea
          id="feedback-shared"
          name="shared_note"
          rows={3}
          className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
        />
      </div>

      <div>
        <label
          htmlFor="feedback-private"
          className="font-mono text-[12px] uppercase tracking-[0.1em] text-foreground"
        >
          Private — leadership only
        </label>
        <p className="mt-1 text-sm text-muted">
          Never shown to the member. Still write it as if they will read it one
          day.
        </p>
        <textarea
          id="feedback-private"
          name="private_note"
          rows={3}
          className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
        />
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {saved ? <p className="text-sm text-accent">Saved.</p> : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save feedback"}
      </Button>
    </form>
  );
}
