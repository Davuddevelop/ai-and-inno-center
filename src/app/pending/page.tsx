import { redirect } from "next/navigation";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";
import type { Profile } from "@/lib/supabase/types";

export default async function PendingPage() {
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

  if (profile?.status === "active") redirect("/dashboard");
  const rejected = profile?.status === "rejected";

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
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
