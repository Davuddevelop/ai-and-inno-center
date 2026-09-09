import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";

export function JoinBand() {
  const { join } = site;
  return (
    <section className="border-t border-border px-6 py-24 sm:px-10">
      <Reveal>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <p className="max-w-xl text-balance font-display text-3xl leading-tight sm:text-4xl">
            {join.title}
          </p>
          <Link
            href={join.cta.href}
            className="shrink-0 rounded-full bg-foreground px-7 py-3.5 font-mono text-[13px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent"
          >
            {join.cta.label}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
