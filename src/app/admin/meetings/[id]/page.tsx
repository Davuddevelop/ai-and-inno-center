import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { buttonClasses } from "@/components/ui/Button";
import { AttendanceControl } from "@/components/meetings/AttendanceControl";
import { SessionFiles } from "@/components/meetings/SessionFiles";
import { FeedbackComposer } from "@/components/meetings/FeedbackComposer";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { updateSessionSchedule, saveSessionNotes } from "@/lib/supabase/session-actions";
import { isAdmin, RANK_ORDER } from "@/lib/supabase/types";
import type {
  ArrivalStatus,
  Meeting,
  Profile,
  SessionFile,
  SessionRecord,
} from "@/lib/supabase/types";

type AttendanceRow = {
  profile_id: string;
  arrival_status: ArrivalStatus;
  minutes_late: number | null;
};

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!isAdmin(profile)) redirect("/dashboard");

  const supabase = await createClient();
  const [
    { data: meetingData },
    { data: memberData },
    { data: attendanceData },
    { data: recordData },
    { data: fileData },
  ] = await Promise.all([
    supabase.from("meetings").select("*").eq("id", id).maybeSingle(),
    supabase.from("profiles").select("*").eq("status", "active"),
    supabase
      .from("attendance")
      .select("profile_id, arrival_status, minutes_late")
      .eq("meeting_id", id),
    supabase.from("session_records").select("*").eq("meeting_id", id).maybeSingle(),
    supabase
      .from("session_files")
      .select("*")
      .eq("meeting_id", id)
      .order("uploaded_at", { ascending: false }),
  ]);

  const meeting = meetingData as Meeting | null;
  if (!meeting) notFound();

  const members = ((memberData ?? []) as Profile[]).sort(
    (a, b) =>
      RANK_ORDER[a.rank] - RANK_ORDER[b.rank] ||
      a.full_name.localeCompare(b.full_name),
  );
  const attendance = new Map(
    ((attendanceData ?? []) as AttendanceRow[]).map((r) => [r.profile_id, r]),
  );
  const record = recordData as SessionRecord | null;
  const files = (fileData ?? []) as SessionFile[];

  const marked = attendance.size;

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader profile={profile} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
        <Breadcrumbs
          trail={[
            { label: "Admin", href: "/admin" },
            { label: "Meetings", href: "/admin/meetings" },
            { label: meeting.title },
          ]}
        />
        <h1 className="mt-2 font-display text-4xl">{meeting.title}</h1>
        <p className="mt-2 text-muted">
          {new Date(meeting.meeting_date).toLocaleDateString()}
          {meeting.starts_at ? ` · ${meeting.starts_at.slice(0, 5)}` : ""}
          {meeting.location ? ` · ${meeting.location}` : ""}
        </p>

        {/* ---------------- plan: members can see this ---------------- */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="font-display text-2xl">The plan</h2>
          <p className="mt-2 text-sm text-muted">
            Time, place and agenda are visible to every member.
          </p>
          <form
            action={updateSessionSchedule.bind(null, meeting.id)}
            className="mt-6 space-y-4 rounded-2xl border border-border p-6"
          >
            <div className="flex flex-wrap gap-4">
              <div>
                <label
                  htmlFor="starts_at"
                  className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted"
                >
                  Start time
                </label>
                <input
                  id="starts_at"
                  type="time"
                  name="starts_at"
                  defaultValue={meeting.starts_at?.slice(0, 5) ?? ""}
                  className="mt-2 block h-11 rounded-lg border border-border bg-transparent px-3 text-foreground outline-none transition-colors focus:border-accent"
                />
              </div>
              <div className="min-w-[200px] flex-1">
                <label
                  htmlFor="location"
                  className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted"
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  defaultValue={meeting.location ?? ""}
                  placeholder="e.g. ICT lab"
                  className="mt-2 block h-11 w-full rounded-lg border border-border bg-transparent px-3 text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="agenda"
                className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted"
              >
                Agenda
              </label>
              <textarea
                id="agenda"
                name="agenda"
                rows={4}
                defaultValue={meeting.agenda ?? ""}
                placeholder="What this session is meant to cover."
                className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
              />
            </div>
            <SubmitButton pendingText="Saving…" className={buttonClasses()}>
              Save plan
            </SubmitButton>
          </form>
        </section>

        {/* ---------------- record: leadership only ---------------- */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="font-display text-2xl">What happened</h2>
          <p className="mt-2 text-sm text-muted">
            Leadership only. Members never see this, whatever you write here.
          </p>
          <form
            action={saveSessionNotes.bind(null, meeting.id)}
            className="mt-6 space-y-4"
          >
            <textarea
              name="notes"
              rows={12}
              defaultValue={record?.notes ?? ""}
              placeholder="Everything worth remembering about this session — what was covered, what worked, what did not, who needs following up."
              className="w-full rounded-2xl border border-border bg-transparent px-5 py-4 leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
            />
            <div className="flex flex-wrap items-center gap-4">
              <SubmitButton pendingText="Saving…" className={buttonClasses()}>
                Save record
              </SubmitButton>
              {record ? (
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                  Last saved {new Date(record.updated_at).toLocaleString()}
                </span>
              ) : null}
            </div>
          </form>
        </section>

        {/* ---------------- files ---------------- */}
        <SessionFiles meetingId={meeting.id} files={files} />

        {/* ---------------- attendance ---------------- */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="font-display text-2xl">
            Attendance ({marked}/{members.length})
          </h2>
          <div className="mt-6 space-y-3">
            {members.map((member) => {
              const row = attendance.get(member.id);
              return (
                <div
                  key={member.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
                >
                  <Link
                    href={`/members/${member.id}`}
                    className="flex min-h-11 items-center text-foreground transition-colors hover:text-accent"
                  >
                    {member.full_name}
                  </Link>
                  <AttendanceControl
                    meetingId={meeting.id}
                    profileId={member.id}
                    status={row?.arrival_status ?? "absent"}
                    minutesLate={row?.minutes_late ?? null}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------------- feedback ---------------- */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="font-display text-2xl">Feedback</h2>
          <p className="mt-2 text-sm text-muted">
            Tied to this session. Appears on the member&apos;s profile.
          </p>
          <FeedbackComposer members={members} meetingId={meeting.id} />
        </section>
      </main>
    </div>
  );
}
