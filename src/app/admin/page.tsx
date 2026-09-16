import { redirect } from "next/navigation";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ApplicantsList } from "@/components/admin/ApplicantsList";
import { MembersTable } from "@/components/admin/MembersTable";
import { RejectedList } from "@/components/admin/RejectedList";
import { ButtonLink } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { isAdmin, RANK_ORDER } from "@/lib/supabase/types";
import type { Profile } from "@/lib/supabase/types";

export default async function AdminPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!isAdmin(profile)) redirect("/dashboard");

  const supabase = await createClient();
  const [{ data: pendingData }, { data: memberData }, { data: rejectedData }] =
    await Promise.all([
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
      // Fetched so a rejection stays recoverable. Runs in the same
      // Promise.all, so it costs no extra round trip.
      supabase
        .from("profiles")
        .select("*")
        .eq("status", "rejected")
        .order("created_at", { ascending: false }),
    ]);
  const applicants = (pendingData ?? []) as Profile[];
  const rejected = (rejectedData ?? []) as Profile[];
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
          {/* "← Dashboard" lived here; the header's My profile does that
              from every page now. Meetings stays: it is a child section of
              Admin, and nothing else links to it. */}
          <ButtonLink href="/admin/meetings" variant="secondary">
            Meetings →
          </ButtonLink>
        </div>

        <ApplicantsList applicants={applicants} />

        <div className="mt-16">
          <h2 className="font-display text-2xl">Members ({members.length})</h2>

          <MembersTable members={members} currentProfileId={profile!.id} />
        </div>

        <RejectedList rejected={rejected} />
      </main>
    </div>
  );
}
