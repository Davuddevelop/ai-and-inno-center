import { notFound, redirect } from "next/navigation";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProjectsReadOnly } from "@/components/profile/ProjectsReadOnly";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { getMemberActivity } from "@/lib/supabase/member-activity";
import type { MemberDirectoryEntry } from "@/lib/supabase/types";

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!profile || profile.status !== "active") redirect("/pending");

  if (id === profile.id) redirect("/dashboard");

  const supabase = await createClient();
  const { data: memberData } = await supabase
    .from("member_directory")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const member = memberData as MemberDirectoryEntry | null;
  if (!member) notFound();

  const { projects, attended } = await getMemberActivity(id);

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader profile={profile} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
        {/* The old "← Directory" link always went to the directory even
            when you arrived from the admin members table. The header has a
            Directory link that is correct from everywhere. */}
        <div>
          <ProfileView member={member} attended={attended} />
          <ProjectsReadOnly projects={projects} />
        </div>
      </main>
    </div>
  );
}
