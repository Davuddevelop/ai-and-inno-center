import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export function AuthHeader() {
  return (
    <header className="border-b border-border px-6 py-4 sm:px-10">
      <Link href="/" className="flex w-fit items-center gap-3">
        <Image src="/logo-mark.png" alt="" width={26} height={26} priority />
        <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-foreground">
          {site.orgName}
        </span>
      </Link>
    </header>
  );
}
