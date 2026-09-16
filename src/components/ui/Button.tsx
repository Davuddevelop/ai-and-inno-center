import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "ghost";

// min-h-11 is 44px. WCAG 2.5.8 sets the floor at 24x24; 44 is the size
// Apple and Google both publish for touch, and it costs nothing here.
// The old bare 12px text links across the member area were below the floor.
const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-mono text-[13px] uppercase tracking-[0.1em] transition-colors disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-foreground px-6 text-background hover:bg-accent",
  secondary:
    "border border-border-strong px-6 text-foreground hover:border-foreground",
  ghost: "px-3 text-muted hover:text-foreground",
};

export function buttonClasses(variant: ButtonVariant = "primary", extra = "") {
  return `${BASE} ${VARIANTS[variant]}${extra ? ` ${extra}` : ""}`;
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={buttonClasses(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">) {
  return (
    <button className={buttonClasses(variant, className)} {...rest}>
      {children}
    </button>
  );
}
