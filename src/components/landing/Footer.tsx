import Image from "next/image";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo-mark.png" alt="" width={24} height={24} className="rounded-sm" />
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-foreground">
              {site.orgName}
            </p>
            <p className="text-xs text-muted">{site.footer.tagline}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
          <span>{site.location}</span>
          <a href={`mailto:${site.footer.email}`} className="transition-colors hover:text-foreground">
            {site.footer.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
