"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-6 py-16">
      <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
        Error
      </p>
      <h1 className="mt-3 font-display text-4xl">Something broke.</h1>
      <p className="mt-4 text-muted">
        This one is on us, not you. Try again — if it keeps happening, tell an
        admin what you were doing.
      </p>
      {/* The digest is the only handle on the server-side stack trace in
          production logs, so it has to be visible to whoever reports it. */}
      {error.digest ? (
        <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
          Reference: {error.digest}
        </p>
      ) : null}
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex min-h-11 items-center rounded-full bg-foreground px-6 font-mono text-[13px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent"
        >
          Try again
        </button>
        <Link
          href="/"
          className="flex min-h-11 items-center rounded-full border border-border-strong px-6 font-mono text-[13px] uppercase tracking-[0.1em] text-foreground transition-colors hover:border-foreground"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
