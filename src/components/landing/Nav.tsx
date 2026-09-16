"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

// Below md there is no room for the section links, Log in and Apply all at
// once. They used to simply be hidden -- which meant a phone visitor saw a
// logo and nothing else, with no way to log in from the homepage at all.
// Everything that gets hidden now lives in this menu instead.
export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-mark.png"
            alt=""
            width={28}
            height={28}
            className="rounded-sm"
            priority
          />
          <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-foreground">
            {site.orgName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="font-mono text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            href={site.hero.primaryCta.href}
            className="rounded-full bg-foreground px-4 py-2 font-mono text-[13px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent"
          >
            Apply
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-border/40 md:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="17" y2="6" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </>
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-border bg-background px-6 pb-6 pt-2 md:hidden"
      >
        <nav className="flex flex-col">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center font-mono text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="flex min-h-11 items-center font-mono text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            href={site.hero.primaryCta.href}
            onClick={() => setOpen(false)}
            className="mt-3 flex min-h-11 items-center justify-center rounded-full bg-foreground px-4 font-mono text-[13px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent"
          >
            Apply
          </Link>
        </nav>
      </div>
    </header>
  );
}
