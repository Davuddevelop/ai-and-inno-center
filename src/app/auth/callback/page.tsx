"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { createClient } from "@/lib/supabase/client";

// Kept for confirmation emails already sent in the old format. New ones go
// to /auth/confirm, which works from any device; this path only succeeds in
// the same browser the signup was submitted from, because of PKCE.
export default function AuthCallbackPage() {
  // useSearchParams needs a Suspense boundary on a prerendered route.
  return (
    <Suspense fallback={null}>
      <AuthCallback />
    </Suspense>
  );
}

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // /auth/confirm redirects here with ?failed=1 when a token_hash link
  // could not be verified. Read during render rather than set from an
  // effect, which would be a second render pass for something already
  // known on the first.
  const linkFailed = searchParams.has("failed");
  const [sessionFailed, setSessionFailed] = useState(false);
  const failed = linkFailed || sessionFailed;
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (linkFailed) return;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError || !data.session) {
        setSessionFailed(true);
        return;
      }
      router.replace("/pending");
    });
  }, [router, linkFailed]);

  async function resend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      // Deliberately the old path: until the Supabase email template is
      // switched to {{ .TokenHash }}, the link it builds still comes back
      // with ?code=, which only /auth/callback understands. Pointing this
      // at /auth/confirm now would break the same-device confirmations
      // that do currently work.
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setSending(false);
    if (resendError) {
      setError(resendError.message);
      return;
    }
    setSent(true);
  }

  if (!failed) {
    return (
      <div className="flex min-h-screen flex-col">
        <AuthHeader />
        <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-6 py-16 text-center">
          <p className="text-muted">Confirming your account…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <h1 className="font-display text-3xl">That link didn&apos;t work here.</h1>
        <p className="mt-4 text-muted">
          Confirmation links from older emails only open in the same browser
          you applied from. If you applied on a laptop and opened the email on
          your phone, that is what happened — nothing is wrong with your
          account.
        </p>

        {sent ? (
          <p className="mt-8 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground">
            Sent. Open the new email on any device — that one will work.
          </p>
        ) : (
          <form onSubmit={resend} className="mt-8 space-y-4">
            <Field label="Send me a new link">
              <TextInput
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="the email you applied with"
              />
            </Field>
            {error ? (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={sending} className="w-full">
              {sending ? "Sending…" : "Email me a new link"}
            </Button>
          </form>
        )}

        <div className="mt-8">
          <ButtonLink href="/login" variant="secondary">
            Or log in directly
          </ButtonLink>
        </div>
      </main>
    </div>
  );
}
