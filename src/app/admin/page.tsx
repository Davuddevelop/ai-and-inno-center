import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ApplicantsList } from "@/components/admin/ApplicantsList";
import { InlineSelect } from "@/components/ui/InlineSelect";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { isAdmin } from "@/lib/supabase/types";
import { updateMemberRank } from "@/lib/supabase/admin-actions";
import { RANK_LABELS, RANK_ORDER } from "@/lib/supabase/types";
import type { MemberRank, Profile } from "@/lib/supabase/types";

const RANK_OPTIONS: MemberRank[] = [
  "president",
  "vice_president",
  "executive_member",
  "senior_member",
  "member",
  "trainee",
];

export default async function AdminPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!isAdmin(profile)) redirect("/dashboard");

  const supabase = await createClient();
  const [{ data: pendingData }, { data: memberData }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
    supabase
      .from("profiles")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: true }),
  ]);
  const applicants = (pendingData ?? []) as Profile[];
  const members = ((memberData ?? []) as Profile[]).sort(
    (a, b) => RANK_ORDER[a.rank] - RANK_ORDER[b.rank] || a.full_name.localeCompare(b.full_name),
  );

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader profile={profile} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
              Admin
            </p>
            <h1 className="mt-3 font-display text-4xl">
              Pending applications ({applicants.length})
            </h1>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/meetings"
              className="font-mono text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
            >
              Meetings →
            </Link>
            <Link
              href="/dashboard"
              className="font-mono text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        <ApplicantsList applicants={applicants} />

        <div className="mt-16">
          <h2 className="font-display text-2xl">Members ({members.length})</h2>

          {members.length === 0 ? (
            <p className="mt-6 text-muted">No active members yet.</p>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                    <th className="px-5 py-3 font-normal">Name</th>
                    <th className="px-5 py-3 font-normal">Grade</th>
                    <th className="px-5 py-3 font-normal">Joined</th>
                    <th className="px-5 py-3 font-normal">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => {
                    const isSelf = member.id === profile!.id;
                    return (
                      <tr key={member.id} className="border-b border-border last:border-0">
                        <td className="px-5 py-4">
                          <Link
                            href={`/members/${member.id}`}
                            className="transition-colors hover:text-accent"
                          >
                            {member.full_name}
                          </Link>
                          {isSelf ? (
                            <span className="ml-2 text-xs text-muted">(you)</span>
                          ) : null}
                        </td>
                        <td className="px-5 py-4 text-muted">{member.grade || "—"}</td>
                        <td className="px-5 py-4 text-muted">
                          {new Date(member.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4">
                          {isSelf ? (
                            <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted">
                              {RANK_LABELS[member.rank]}
                            </span>
                          ) : (
                            <InlineSelect
                              id={member.id}
                              value={member.rank}
                              options={RANK_OPTIONS}
                              labels={RANK_LABELS}
                              action={updateMemberRank}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
