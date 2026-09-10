"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { createClient } from "@/lib/supabase/client";

// Supabase attaches a session token to this URL (as a query param or hash
// fragment, depending on flow) after a confirmation/magic link is clicked.
// Creating the client and calling getSession() is what actually reads and
// exchanges that token -- nothing else in the app does this, so landing
// anywhere else after confirmation leaves the visitor "verified" on
// Supabase's side but not actually logged in here.
export default function AuthCallbackPage() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        setFailed(true);
        return;
      }
      router.replace("/pending");
    });
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-6 py-16 text-center">
        {failed ? (
          <>
            <h1 className="font-display text-3xl">That link didn&apos;t work.</h1>
            <p className="mt-4 text-muted">
              It may have expired or already been used. Try logging in
              directly instead.
            </p>
            <Link
              href="/login"
              className="mt-8 rounded-full bg-foreground px-6 py-3 font-mono text-[13px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent"
            >
              Go to login
            </Link>
          </>
        ) : (
          <p className="text-muted">Confirming your account…</p>
        )}
      </main>
    </div>
  );
}
