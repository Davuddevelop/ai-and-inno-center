import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { signOut } from "@/lib/supabase/actions";
import { getCurrentUserAndProfile, isAdmin } from "@/lib/supabase/profile";
import { RANK_LABELS } from "@/lib/supabase/types";

// Placeholder — proves the signup -> approval -> access pipeline works.
// The real member dashboard (projects, documents, attendance) is next.
export default async function DashboardPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!profile || profile.status !== "active") redirect("/pending");

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
          Dashboard
        </p>
        <h1 className="mt-3 font-display text-4xl">
          Welcome, {profile.full_name.split(" ")[0]}.
        </h1>
        <p className="mt-3 text-muted">
          Rank: {RANK_LABELS[profile.rank]}. Projects, documents, and
          attendance land here next.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          {isAdmin(profile) ? (
            <Link
              href="/admin"
              className="rounded-full bg-foreground px-6 py-3 font-mono text-[13px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent"
            >
              Admin Console
            </Link>
          ) : null}
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full border border-border-strong px-6 py-3 font-mono text-[13px] uppercase tracking-[0.1em] text-foreground transition-colors hover:border-foreground"
            >
              Log out
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
