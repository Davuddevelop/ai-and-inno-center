import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AttendanceCheckbox } from "@/components/meetings/AttendanceCheckbox";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { isAdmin } from "@/lib/supabase/types";
import { setAttendance } from "@/lib/supabase/meeting-actions";
import { RANK_ORDER } from "@/lib/supabase/types";
import type { Meeting, Profile } from "@/lib/supabase/types";

export default async function MeetingAttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!isAdmin(profile)) redirect("/dashboard");

  const supabase = await createClient();
  const [{ data: meetingData }, { data: memberData }, { data: attendanceData }] =
    await Promise.all([
      supabase.from("meetings").select("*").eq("id", id).maybeSingle(),
      supabase.from("profiles").select("*").eq("status", "active"),
      supabase.from("attendance").select("profile_id").eq("meeting_id", id),
    ]);

  const meeting = meetingData as Meeting | null;
  if (!meeting) notFound();

  const members = ((memberData ?? []) as Profile[]).sort(
    (a, b) => RANK_ORDER[a.rank] - RANK_ORDER[b.rank] || a.full_name.localeCompare(b.full_name),
  );
  const attendedIds = new Set(
    ((attendanceData ?? []) as { profile_id: string }[]).map((r) => r.profile_id),
  );

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader profile={profile} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
        <Link
          href="/admin/meetings"
          className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
        >
          ← Meetings
        </Link>
        <h1 className="mt-3 font-display text-4xl">{meeting.title}</h1>
        <p className="mt-2 text-muted">
          {new Date(meeting.meeting_date).toLocaleDateString()}
        </p>

        <div className="mt-10 space-y-3">
          {members.map((member) => (
            <label
              key={member.id}
              className="flex items-center justify-between rounded-xl border border-border p-4"
            >
              <span>{member.full_name}</span>
              <AttendanceCheckbox
                meetingId={meeting.id}
                profileId={member.id}
                attended={attendedIds.has(member.id)}
                action={setAttendance}
              />
            </label>
          ))}
        </div>
      </main>
    </div>
  );
}
