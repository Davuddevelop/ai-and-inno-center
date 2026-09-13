import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { PROJECT_STATUS_LABELS, RANK_LABELS } from "@/lib/supabase/types";
import type {
  MemberDirectoryEntry,
  Meeting,
  Project,
} from "@/lib/supabase/types";

interface ProjectMemberRow {
  projects: Project | null;
}

interface AttendanceRow {
  meetings: Meeting | null;
}

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!profile || profile.status !== "active") redirect("/pending");

  const supabase = await createClient();
  const { data: memberData } = await supabase
    .from("member_directory")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const member = memberData as MemberDirectoryEntry | null;
  if (!member) notFound();

  const [{ data: projectRows }, { data: attendanceRows }] = await Promise.all([
    supabase.from("project_members").select("projects(*)").eq("profile_id", id),
    supabase.from("attendance").select("meetings(*)").eq("profile_id", id),
  ]);

  const projects = ((projectRows ?? []) as unknown as ProjectMemberRow[])
    .map((row) => row.projects)
    .filter((p): p is Project => p !== null)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const attended = ((attendanceRows ?? []) as unknown as AttendanceRow[])
    .map((row) => row.meetings)
    .filter((m): m is Meeting => m !== null)
    .sort((a, b) => b.meeting_date.localeCompare(a.meeting_date));

  const isSelf = member.id === profile.id;

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-16 sm:px-10">
        <Link
          href="/members"
          className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
        >
          ← Directory
        </Link>

        <div className="mt-6 flex items-center gap-5">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border-strong bg-background">
            {member.photo_url ? (
              <Image
                src={member.photo_url}
                alt=""
                width={80}
                height={80}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : null}
          </div>
          <div>
            <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
              {RANK_LABELS[member.rank]}
            </p>
            <h1 className="mt-1 font-display text-3xl">{member.full_name}</h1>
            {member.grade ? <p className="mt-1 text-muted">{member.grade}</p> : null}
          </div>
        </div>

        {isSelf ? (
          <Link
            href="/profile"
            className="mt-6 inline-block font-mono text-[12px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
          >
            Edit your profile →
          </Link>
        ) : null}

        {member.bio ? <p className="mt-6 text-foreground">{member.bio}</p> : null}

        {member.skills.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {member.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border-strong px-3 py-1.5 text-sm text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : null}

        {member.portfolio_links.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-4">
            {member.portfolio_links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-accent underline underline-offset-4"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}

        <div className="mt-10 border-t border-border pt-10">
          <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
            Projects
          </span>
          {projects.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nothing added yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg">{project.title}</h3>
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-accent underline underline-offset-4"
                        >
                          {project.link}
                        </a>
                      ) : null}
                      {project.description ? (
                        <p className="mt-2 text-sm text-muted">{project.description}</p>
                      ) : null}
                    </div>
                    <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted">
                      {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-border pt-10">
          <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
            Attendance ({attended.length})
          </span>
          {attended.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No meetings attended yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {attended.map((meeting) => (
                <li
                  key={meeting.id}
                  className="flex items-center justify-between border-b border-border pb-2 text-sm"
                >
                  <span className="text-foreground">{meeting.title}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                    {new Date(meeting.meeting_date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
