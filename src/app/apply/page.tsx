"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Field, TextInput, TextArea } from "@/components/auth/Field";
import { createClient } from "@/lib/supabase/client";

export default function ApplyPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [whyJoin, setWhyJoin] = useState("");
  const [experience, setExperience] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Without this, Supabase falls back to the project's Site URL
        // setting for the confirmation-email redirect -- correct only by
        // coincidence, and wrong the moment that setting is stale or this
        // runs on a different domain (local dev vs. production).
        // window.location.origin is always the domain the signup actually
        // happened on, so this is correct everywhere with no configuration.
        // Points at /auth/callback, not /login directly -- that page is
        // what actually consumes the session token Supabase attaches to
        // this URL; landing anywhere else just strands it unread.
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          grade,
          application_answers: {
            phone: phone || null,
            why_join: whyJoin,
            experience,
            portfolio: portfolio || null,
          },
        },
      },
    });
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (!data.session) {
      // Email confirmation is required before a session exists.
      setCheckEmail(true);
      return;
    }

    router.push("/pending");
  }

  if (checkEmail) {
    return (
      <div className="flex min-h-screen flex-col">
        <AuthHeader />
        <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-6 py-16 text-center">
          <h1 className="font-display text-3xl">Check your email</h1>
          <p className="mt-4 text-muted">
            We sent a confirmation link to <span className="text-foreground">{email}</span>.
            Click it, then{" "}
            <Link href="/login" className="text-accent underline underline-offset-4">
              log in
            </Link>{" "}
            — your application will be waiting for review.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-16 sm:px-10">
        <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
          Apply
        </p>
        <h1 className="mt-3 font-display text-4xl">Tell us who you are.</h1>
        <p className="mt-3 text-muted">
          This creates your account and submits your application in one step.
          A president or VP reviews it before you get full access.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Full name">
              <TextInput
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </Field>
            <Field label="Grade / class">
              <TextInput
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. 10th grade"
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Email">
              <TextInput
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Field>
            <Field label="Phone" hint="optional">
              <TextInput
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Password">
              <TextInput
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
              />
            </Field>
            <Field label="Confirm password">
              <TextInput
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
              />
            </Field>
          </div>

          <Field label="Why do you want to join?">
            <TextArea
              required
              rows={3}
              value={whyJoin}
              onChange={(e) => setWhyJoin(e.target.value)}
            />
          </Field>

          <Field
            label="Your experience with programming or AI"
            hint="it's fine to say none"
          >
            <TextArea
              required
              rows={3}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </Field>

          <Field label="Anything you've built or worked on?" hint="optional, a link is fine">
            <TextInput
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
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
            {submitting ? "Submitting…" : "Submit Application"}
          </button>

          <p className="text-center text-sm text-muted">
            Already applied?{" "}
            <Link href="/login" className="text-foreground underline underline-offset-4">
              Log in
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
