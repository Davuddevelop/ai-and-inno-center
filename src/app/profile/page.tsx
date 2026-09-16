import { redirect } from "next/navigation";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!profile || profile.status !== "active") redirect("/pending");

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader profile={profile} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
        <h1 className="font-display text-4xl">Edit your profile.</h1>
        <ProfileForm profile={profile} />
      </main>
    </div>
  );
}
