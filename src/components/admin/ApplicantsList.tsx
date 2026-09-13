"use client";

import { useOptimistic, useState, useTransition } from "react";
import { approveApplication, rejectApplication } from "@/lib/supabase/admin-actions";
import type { Profile } from "@/lib/supabase/types";

// Approve/reject used to be plain <form action> buttons: click, then wait for
// the full server round trip (auth check + update + full page re-fetch)
// before the card disappeared. useOptimistic removes the card from the list
// the instant you click, before the server has responded at all -- the
// server call still happens and reconciles in the background, and reverts
// the card if it actually fails.
export function ApplicantsList({ applicants }: { applicants: Profile[] }) {
  const [optimisticApplicants, removeApplicant] = useOptimistic(
    applicants,
    (state, id: string) => state.filter((a) => a.id !== id),
  );
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handle(id: string, action: (id: string) => Promise<void>) {
    setError(null);
    startTransition(async () => {
      removeApplicant(id);
      try {
        await action(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update.");
      }
    });
  }

  if (optimisticApplicants.length === 0) {
    return <p className="mt-12 text-muted">Nothing waiting on you right now.</p>;
  }

  return (
    <div className="mt-10 space-y-6">
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {optimisticApplicants.map((applicant) => (
        <article key={applicant.id} className="rounded-2xl border border-border p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl">{applicant.full_name}</h2>
              <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
                {applicant.grade || "Grade not given"} · {applicant.email}
                {applicant.application_answers.phone
                  ? ` · ${applicant.application_answers.phone}`
                  : ""}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handle(applicant.id, approveApplication)}
                className="rounded-full bg-foreground px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => handle(applicant.id, rejectApplication)}
                className="rounded-full border border-border-strong px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-foreground transition-colors hover:border-red-400 hover:text-red-400"
              >
                Reject
              </button>
            </div>
          </div>

          <dl className="mt-5 space-y-4 border-t border-border pt-5">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                Why do you want to join?
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {applicant.application_answers.why_join || "—"}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                Experience with programming or AI
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {applicant.application_answers.experience || "—"}
              </dd>
            </div>
            {applicant.application_answers.portfolio ? (
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                  Portfolio
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {applicant.application_answers.portfolio}
                </dd>
              </div>
            ) : null}
          </dl>
        </article>
      ))}
    </div>
  );
}
