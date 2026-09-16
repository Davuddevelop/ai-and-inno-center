import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { RANK_LABELS, RANK_ORDER } from "@/lib/supabase/types";
import type { MemberDirectoryEntry } from "@/lib/supabase/types";

export default async function MembersPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!profile || profile.status !== "active") redirect("/pending");

  const supabase = await createClient();
  const { data } = await supabase.from("member_directory").select("*");
  const members = ((data ?? []) as MemberDirectoryEntry[]).sort(
    (a, b) => RANK_ORDER[a.rank] - RANK_ORDER[b.rank] || a.full_name.localeCompare(b.full_name),
  );

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader profile={profile} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:px-10">
        <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
          Directory
        </p>
        <h1 className="mt-3 font-display text-4xl">Members ({members.length})</h1>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/members/${member.id}`}
              className="flex items-center gap-4 rounded-2xl border border-border p-4 transition-colors hover:border-foreground"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border-strong bg-background">
                {member.photo_url ? (
                  <Image
                    src={member.photo_url}
                    alt=""
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : null}
              </div>
              <div>
                <h2 className="font-display text-lg">{member.full_name}</h2>
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                  {RANK_LABELS[member.rank]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
