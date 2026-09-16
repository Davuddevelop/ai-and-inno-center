import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProjectsReadOnly } from "@/components/profile/ProjectsReadOnly";
import { ButtonLink } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { getMemberActivity } from "@/lib/supabase/member-activity";
import type {
  MemberDirectoryEntry,
  PublicProfile,
  PublicProject,
} from "@/lib/supabase/types";

// These pages are shareable on purpose -- a member can send the link as a
// portfolio -- but they are not put in front of search engines. The members
// are school students, and there is a real difference between "you can show
// someone this link" and "this child's name, face and school activity are
// indexed and aggregated". Remove this if the center decides otherwise.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile } = await getCurrentUserAndProfile();
  const isMember = !!profile && profile.status === "active";

  if (isMember && id === profile.id) redirect("/dashboard");

  const supabase = await createClient();

  // A signed-in active member sees the internal view: grade, attendance,
  // and every member whether or not they are publicly listed.
  if (isMember) {
    const { data } = await supabase
      .from("member_directory")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    const member = data as MemberDirectoryEntry | null;
    if (!member) notFound();

    const { projects, attended } = await getMemberActivity(id);

    return (
      <div className="flex min-h-screen flex-col">
        <AuthHeader profile={profile} />
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
          <ProfileView member={member} attended={attended} />
          <ProjectsReadOnly projects={projects} />
        </main>
      </div>
    );
  }

  // Everyone else -- logged out, or signed in but not yet approved -- gets
  // the public slice. These two views are the security boundary: they
  // simply do not carry email, grade, attendance or application answers,
  // so there is no branch here that could leak them by mistake.
  const [{ data: publicData }, { data: projectData }] = await Promise.all([
    supabase.from("public_profiles").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("public_projects")
      .select("*")
      .eq("profile_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const member = publicData as PublicProfile | null;
  // Also the "this member switched off public visibility" case: the view
  // returns nothing, and a stranger gets a 404 rather than a page telling
  // them a hidden member exists.
  if (!member) notFound();

  const projects = (projectData ?? []) as PublicProject[];

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader profile={profile} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
        <ProfileView member={member} />
        <ProjectsReadOnly projects={projects} />
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-sm text-muted">
            {member.full_name.split(" ")[0]} is a member of the AI &amp;
            Innovation Center.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href="/">About the center</ButtonLink>
            <ButtonLink href="/apply" variant="secondary">
              Apply to join
            </ButtonLink>
          </div>
        </div>
      </main>
    </div>
  );
}
