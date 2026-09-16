import Image from "next/image";
import { RANK_LABELS } from "@/lib/supabase/types";
import type { Meeting, PublicProfile } from "@/lib/supabase/types";

// Read-only rendering of a profile's identity (bio/skills/links) and
// attendance -- used both for viewing your own profile (dashboard) and
// someone else's (member directory). Projects are handled separately
// (ProjectsSection for your own, ProjectsReadOnly for someone else's),
// since one is editable and the other isn't.
export function ProfileView({
  member,
  attended,
}: {
  member: PublicProfile & { grade?: string | null };
  // Omitted entirely for the public view of a profile. Passing an empty
  // array instead would render "Attendance (0) / No meetings attended yet",
  // which tells a stranger something untrue about that member.
  attended?: Meeting[];
}) {
  return (
    <>
      <div className="flex items-center gap-5">
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

      {attended === undefined ? null : (
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
      )}
    </>
  );
}
