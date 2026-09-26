import { FeedbackComposer } from "@/components/meetings/FeedbackComposer";
import { createClient } from "@/lib/supabase/server";
import type { MemberFeedback } from "@/lib/supabase/types";

// Admin-only view of everything written about one member, both halves.
// Rendered only where the caller has already established the viewer is an
// admin; member_feedback's RLS is admin-only regardless, so a non-admin
// reaching here would simply get an empty list rather than a leak.
export async function MemberFeedbackPanel({ profileId }: { profileId: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("member_feedback")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });
  const entries = (data ?? []) as MemberFeedback[];

  return (
    <section className="mt-10 border-t border-border pt-10">
      <h2 className="font-display text-2xl">Feedback</h2>
      <p className="mt-2 text-sm text-muted">
        Leadership view — shows both what this member can read and what they
        cannot.
      </p>

      {entries.length === 0 ? (
        <p className="mt-6 text-muted">Nothing written yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-border p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                {new Date(entry.created_at).toLocaleDateString()}
              </p>

              {entry.shared_note ? (
                <div className="mt-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
                    Shared with them
                  </span>
                  <p className="mt-1 leading-relaxed text-foreground">
                    {entry.shared_note}
                  </p>
                </div>
              ) : null}

              {entry.private_note ? (
                <div className="mt-4 border-t border-border pt-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                    Private
                  </span>
                  <p className="mt-1 leading-relaxed text-muted">
                    {entry.private_note}
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <FeedbackComposer profileId={profileId} meetingId={null} />
    </section>
  );
}
