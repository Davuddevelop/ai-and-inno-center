import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProjectsSection } from "@/components/profile/ProjectsSection";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { signOut } from "@/lib/supabase/actions";
import { getCurrentUserAndProfile, isAdmin } from "@/lib/supabase/profile";
import { getMemberActivity } from "@/lib/supabase/member-activity";

export default async function DashboardPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!profile || profile.status !== "active") redirect("/pending");

  const { projects, attended } = await getMemberActivity(profile.id);

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/profile"
            className="rounded-full bg-foreground px-6 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent"
          >
            Edit Profile
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/members"
              className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
            >
              Directory
            </Link>
            {isAdmin(profile) ? (
              <Link
                href="/admin"
                className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
              >
                Admin
              </Link>
            ) : null}
            <form action={signOut}>
              <SubmitButton
                pendingText="Logging out…"
                className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground disabled:opacity-50"
              >
                Log out
              </SubmitButton>
            </form>
          </div>
        </div>

        <div className="mt-10">
          <ProfileView member={profile} attended={attended} />
          <ProjectsSection projects={projects} />
        </div>
      </main>
    </div>
  );
}
