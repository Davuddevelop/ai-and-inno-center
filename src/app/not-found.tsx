import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-6 py-16">
      <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl">This page doesn&apos;t exist.</h1>
      <p className="mt-4 text-muted">
        The link may be out of date, or the page may have moved.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="flex min-h-11 items-center rounded-full bg-foreground px-6 font-mono text-[13px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent"
        >
          Home
        </Link>
        <Link
          href="/dashboard"
          className="flex min-h-11 items-center rounded-full border border-border-strong px-6 font-mono text-[13px] uppercase tracking-[0.1em] text-foreground transition-colors hover:border-foreground"
        >
          My profile
        </Link>
      </div>
    </main>
  );
}
