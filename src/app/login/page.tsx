"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Field, TextInput } from "@/components/ui/Field";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setSubmitting(false);
      setError(signInError.message);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", data.user.id)
      .single();

    setSubmitting(false);
    const status = (profile as Pick<Profile, "status"> | null)?.status;
    router.push(status === "active" ? "/dashboard" : "/pending");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="mx-auto w-full max-w-sm flex-1 px-6 py-16">
        <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
          Log in
        </p>
        <h1 className="mt-3 font-display text-4xl">Welcome back.</h1>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <Field label="Email">
            <TextInput
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </Field>
          <Field label="Password">
            <TextInput
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Field>

          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-foreground px-6 py-3 font-mono text-[13px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent disabled:opacity-50"
          >
            {submitting ? "Logging in…" : "Log In"}
          </button>

          <p className="text-center text-sm text-muted">
            Not a member yet?{" "}
            <Link href="/apply" className="text-foreground underline underline-offset-4">
              Apply to join
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
