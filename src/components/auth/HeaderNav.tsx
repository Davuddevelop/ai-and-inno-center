"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { buttonClasses } from "@/components/ui/Button";
import { signOut } from "@/lib/supabase/actions";
import { site } from "@/content/site";

export type HeaderLink = { label: string; href: string };

export function HeaderNav({
  homeHref,
  links,
  showLogout,
  showAvatar,
  photoUrl,
  name,
}: {
  homeHref: string;
  links: HeaderLink[];
  showLogout: boolean;
  showAvatar: boolean;
  photoUrl: string | null;
  name: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Falls back to initials rather than an empty ring, which is what someone
  // who has not uploaded a photo yet would otherwise see in the header.
  const initials = (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const hasMenu = links.length > 0;

  return (
    <header className="border-b border-border">
      <div className="flex items-center justify-between px-6 py-4 sm:px-10">
        <Link href={homeHref} className="flex w-fit items-center gap-3">
          <Image src="/logo-mark.png" alt="" width={26} height={26} priority />
          <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-foreground">
            {site.orgName}
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={buttonClasses(
                  "ghost",
                  active ? "text-foreground" : "",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {showAvatar ? (
            <span
              aria-hidden="true"
              className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-strong bg-background font-mono text-[11px] uppercase text-muted"
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                initials
              )}
            </span>
          ) : null}
          {showLogout ? (
            <form action={signOut}>
              <SubmitButton
                pendingText="Logging out…"
                className={buttonClasses("ghost")}
              >
                Log out
              </SubmitButton>
            </form>
          ) : null}
        </div>

        {/* A pending member has no links, only a log out -- that fits on a
            phone as-is, so it does not need to hide behind a menu. */}
        {!hasMenu && showLogout ? (
          <form action={signOut} className="md:hidden">
            <SubmitButton
              pendingText="Logging out…"
              className={buttonClasses("ghost")}
            >
              Log out
            </SubmitButton>
          </form>
        ) : null}

        {hasMenu ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="member-menu"
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
        ) : null}
      </div>

      {hasMenu ? (
        <div
          id="member-menu"
          hidden={!open}
          className="border-t border-border px-6 pb-4 pt-2 md:hidden"
        >
          <nav className="flex flex-col">
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  // Closed here rather than in an effect on pathname: the
                  // header is not unmounted between App Router navigations,
                  // so without this the panel stays open over the new page.
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center font-mono text-[13px] uppercase tracking-[0.1em] transition-colors hover:text-foreground ${
                    active ? "text-foreground" : "text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {showLogout ? (
              <form action={signOut} className="mt-2 border-t border-border pt-2">
                <SubmitButton
                  pendingText="Logging out…"
                  className="flex min-h-11 items-center font-mono text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground disabled:opacity-50"
                >
                  Log out
                </SubmitButton>
              </form>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
