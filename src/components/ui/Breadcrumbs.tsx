import Link from "next/link";

// Used only where the admin section nests (Admin > Meetings > a meeting).
// Everywhere else the header already says where you are, and a lone
// "← somewhere" link was actively wrong: /members/[id] always pointed back
// to the directory even when you had arrived from the admin table.
export function Breadcrumbs({
  trail,
}: {
  trail: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em]">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className="inline-flex min-h-11 items-center text-foreground"
                >
                  {crumb.label}
                </span>
              )}
              {last ? null : <span className="text-muted/50">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
