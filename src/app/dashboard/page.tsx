import { redirect } from "next/navigation";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProjectsSection } from "@/components/profile/ProjectsSection";
import { ButtonLink } from "@/components/ui/Button";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { getMemberActivity } from "@/lib/supabase/member-activity";

export default async function DashboardPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!profile || profile.status !== "active") redirect("/pending");

  const { projects, attended } = await getMemberActivity(profile.id);

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader profile={profile} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
        {/* Directory, Admin and Log out used to be repeated here. They live
            in the header now, on every page rather than only this one.
            Editing your profile is an action on this page, not navigation,
            so it stays. */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ButtonLink href="/profile">Edit profile</ButtonLink>
        </div>

        <div className="mt-10">
          <ProfileView member={profile} attended={attended} />
          <ProjectsSection projects={projects} />
        </div>
      </main>
    </div>
  );
}
