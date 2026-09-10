import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile, isAdmin } from "@/lib/supabase/profile";
import { approveApplication, rejectApplication } from "@/lib/supabase/admin-actions";
import type { Profile } from "@/lib/supabase/types";

export default async function AdminPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!isAdmin(profile)) redirect("/dashboard");

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  const applicants = (data ?? []) as Profile[];

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
              Admin
            </p>
            <h1 className="mt-3 font-display text-4xl">
              Pending applications ({applicants.length})
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="font-mono text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
          >
            ← Dashboard
          </Link>
        </div>

        {applicants.length === 0 ? (
          <p className="mt-12 text-muted">Nothing waiting on you right now.</p>
        ) : (
          <div className="mt-10 space-y-6">
            {applicants.map((applicant) => (
              <article
                key={applicant.id}
                className="rounded-2xl border border-border p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl">{applicant.full_name}</h2>
                    <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
                      {applicant.grade || "Grade not given"} · {applicant.email}
                      {applicant.application_answers.phone
                        ? ` · ${applicant.application_answers.phone}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <form action={approveApplication.bind(null, applicant.id)}>
                      <button
                        type="submit"
                        className="rounded-full bg-foreground px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={rejectApplication.bind(null, applicant.id)}>
                      <button
                        type="submit"
                        className="rounded-full border border-border-strong px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-foreground transition-colors hover:border-red-400 hover:text-red-400"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                </div>

                <dl className="mt-5 space-y-4 border-t border-border pt-5">
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                      Why do you want to join?
                    </dt>
                    <dd className="mt-1 text-sm text-foreground">
                      {applicant.application_answers.why_join || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                      Experience with programming or AI
                    </dt>
                    <dd className="mt-1 text-sm text-foreground">
                      {applicant.application_answers.experience || "—"}
                    </dd>
                  </div>
                  {applicant.application_answers.portfolio ? (
                    <div>
                      <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                        Portfolio
                      </dt>
                      <dd className="mt-1 text-sm text-foreground">
                        {applicant.application_answers.portfolio}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
