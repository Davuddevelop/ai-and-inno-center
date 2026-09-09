import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export function Nav() {
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

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden font-mono text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground sm:inline"
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
      </div>
    </header>
  );
}
