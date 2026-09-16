import { redirect } from "next/navigation";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { signOut } from "@/lib/supabase/actions";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";

export default async function PendingPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");

  if (profile?.status === "active") redirect("/dashboard");
  const rejected = profile?.status === "rejected";

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader profile={profile} />
      <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-6 py-16 text-center">
        <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
          {rejected ? "Application" : "Pending Review"}
        </p>
        <h1 className="mt-3 font-display text-3xl">
          {rejected
            ? "Your application wasn't approved."
            : `Hang tight, ${profile?.full_name?.split(" ")[0] ?? "there"}.`}
        </h1>
        <p className="mt-4 text-muted">
          {rejected
            ? "If you think this is a mistake, reach out to a president or VP directly."
            : "A president or VP reviews new applications — you'll get access as soon as yours is approved."}
        </p>
        <form action={signOut} className="mt-8">
          <SubmitButton
            pendingText="Logging out…"
            className="rounded-full border border-border-strong px-6 py-3 font-mono text-[13px] uppercase tracking-[0.1em] text-foreground transition-colors hover:border-foreground disabled:opacity-50"
          >
            Log out
          </SubmitButton>
        </form>
      </main>
    </div>
  );
}
