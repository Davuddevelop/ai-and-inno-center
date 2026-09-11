import { redirect } from "next/navigation";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { RANK_LABELS } from "@/lib/supabase/types";

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!profile || profile.status !== "active") redirect("/pending");

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-16 sm:px-10">
        <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
          {RANK_LABELS[profile.rank]}
        </p>
        <h1 className="mt-3 font-display text-4xl">Your profile.</h1>
        <ProfileForm profile={profile} />
      </main>
    </div>
  );
}
