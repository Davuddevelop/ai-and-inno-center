import { redirect } from "next/navigation";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";
import { RANK_LABELS, type Profile } from "@/lib/supabase/types";

// Placeholder — proves the signup -> approval -> access pipeline works.
// The real member dashboard (projects, documents, attendance) is next.
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  const profile = data as Profile | null;
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
        <form action={signOut} className="mt-8">
          <button
            type="submit"
            className="rounded-full border border-border-strong px-6 py-3 font-mono text-[13px] uppercase tracking-[0.1em] text-foreground transition-colors hover:border-foreground"
          >
            Log out
          </button>
        </form>
      </main>
    </div>
  );
}
