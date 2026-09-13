import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile, isAdmin } from "@/lib/supabase/profile";
import { createMeeting } from "@/lib/supabase/meeting-actions";
import type { Meeting } from "@/lib/supabase/types";

export default async function AdminMeetingsPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!isAdmin(profile)) redirect("/dashboard");

  const supabase = await createClient();
  const { data } = await supabase
    .from("meetings")
    .select("*")
    .order("meeting_date", { ascending: false });
  const meetings = (data ?? []) as Meeting[];

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
              Admin
            </p>
            <h1 className="mt-3 font-display text-4xl">Meetings</h1>
          </div>
          <Link
            href="/admin"
            className="font-mono text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
          >
            ← Admin
          </Link>
        </div>

        <form
          action={createMeeting}
          className="mt-10 flex flex-wrap items-end gap-4 rounded-2xl border border-border p-6"
        >
          <div className="min-w-[180px] flex-1">
            <label className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
              Title
            </label>
            <input
              name="title"
              required
              className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
              Date
            </label>
            <input
              type="date"
              name="meeting_date"
              required
              className="mt-2 rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
            />
          </div>
          <SubmitButton
            pendingText="Creating…"
            className="rounded-full bg-foreground px-6 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent disabled:opacity-50"
          >
            Create
          </SubmitButton>
        </form>

        <div className="mt-10 space-y-3">
          {meetings.length === 0 ? (
            <p className="text-muted">No meetings yet.</p>
          ) : (
            meetings.map((meeting) => (
              <Link
                key={meeting.id}
                href={`/admin/meetings/${meeting.id}`}
                className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:border-foreground"
              >
                <span className="font-display text-lg">{meeting.title}</span>
                <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted">
                  {new Date(meeting.meeting_date).toLocaleDateString()}
                </span>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
