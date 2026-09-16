import Link from "next/link";
import { InlineSelect } from "@/components/ui/InlineSelect";
import { updateMemberRank } from "@/lib/supabase/admin-actions";
import { RANK_LABELS } from "@/lib/supabase/types";
import type { MemberRank, Profile } from "@/lib/supabase/types";

const RANK_OPTIONS: MemberRank[] = [
  "president",
  "vice_president",
  "executive_member",
  "senior_member",
  "member",
  "trainee",
];

function RankControl({ member, isSelf }: { member: Profile; isSelf: boolean }) {
  // An admin cannot change their own rank -- a self-demotion with no other
  // admin active would lock everyone out of the admin area.
  if (isSelf) {
    return (
      <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted">
        {RANK_LABELS[member.rank]}
      </span>
    );
  }
  return (
    <InlineSelect
      id={member.id}
      value={member.rank}
      options={RANK_OPTIONS}
      labels={RANK_LABELS}
      action={updateMemberRank}
    />
  );
}

// Two layouts on purpose. The table is the right shape for scanning a
// roster on a wide screen, but it was the only layout -- with a 560px
// minimum width and the rank dropdown in the last column, changing
// someone's rank on a phone meant scrolling sideways to reach the one
// control you came for.
export function MembersTable({
  members,
  currentProfileId,
}: {
  members: Profile[];
  currentProfileId: string;
}) {
  if (members.length === 0) {
    return <p className="mt-6 text-muted">No active members yet.</p>;
  }

  return (
    <>
      <div className="mt-6 space-y-3 md:hidden">
        {members.map((member) => {
          const isSelf = member.id === currentProfileId;
          return (
            <div
              key={member.id}
              className="rounded-2xl border border-border p-4"
            >
              <Link
                href={`/members/${member.id}`}
                className="flex min-h-11 items-center font-display text-lg transition-colors hover:text-accent"
              >
                {member.full_name}
                {isSelf ? (
                  <span className="ml-2 text-xs text-muted">(you)</span>
                ) : null}
              </Link>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                {member.grade || "No grade"} · joined{" "}
                {new Date(member.created_at).toLocaleDateString()}
              </p>
              <div className="mt-3">
                <RankControl member={member} isSelf={isSelf} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border md:block">
        <table className="w-full text-left text-sm">
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
              const isSelf = member.id === currentProfileId;
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
                    <RankControl member={member} isSelf={isSelf} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
