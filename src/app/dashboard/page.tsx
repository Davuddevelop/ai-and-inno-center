import { redirect } from "next/navigation";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProjectsSection } from "@/components/profile/ProjectsSection";
import { ButtonLink } from "@/components/ui/Button";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { getMemberActivity } from "@/lib/supabase/member-activity";
import {
  getMyFeedback,
  getUpcomingMeetings,
  formatMeetingWhen,
} from "@/lib/supabase/planning";

export default async function DashboardPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!profile || profile.status !== "active") redirect("/pending");

  const [{ projects, attended }, feedback, upcoming] = await Promise.all([
    getMemberActivity(profile.id),
    getMyFeedback(),
    getUpcomingMeetings(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader profile={profile} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
        {/* Directory, Admin and Log out used to be repeated here. They live
            in the header now, on every page rather than only this one.
            Editing your profile is an action on this page, not navigation,
            so it stays. */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ButtonLink href="/profile">Edit profile</ButtonLink>
        </div>

        {upcoming.length > 0 ? (
          <section className="mt-10 rounded-2xl border border-border p-6">
            <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-accent">
              Coming up
            </span>
            <div className="mt-4 space-y-4">
              {upcoming.map((meeting) => (
                <div key={meeting.id}>
                  <p className="font-display text-lg">{meeting.title}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                    {formatMeetingWhen(meeting)}
                  </p>
                  {meeting.agenda ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {meeting.agenda}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-10">
          <ProfileView member={profile} attended={attended} />

          {/* Only the shared half of any feedback reaches this page, and it
              is the view that enforces that, not this component. */}
          {feedback.length > 0 ? (
            <section className="mt-10 border-t border-border pt-10">
              <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
                Feedback for you
              </span>
              <div className="mt-4 space-y-4">
                {feedback.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-xl border border-border p-4"
                  >
                    <p className="leading-relaxed text-foreground">
                      {note.shared_note}
                    </p>
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                      {new Date(note.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <ProjectsSection projects={projects} />
        </div>
      </main>
    </div>
  );
}
