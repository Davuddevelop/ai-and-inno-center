import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!profile || profile.status !== "active") redirect("/pending");

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
        <Link
          href="/dashboard"
          className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
        >
          ← Back to profile
        </Link>
        <h1 className="mt-6 font-display text-4xl">Edit your profile.</h1>
        <ProfileForm profile={profile} />
      </main>
    </div>
  );
}
