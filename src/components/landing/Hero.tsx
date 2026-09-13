"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:px-10 sm:pt-28">
      {/* Ambient glow + the logomark, blurred large, standing in for a stock
          illustration or gradient blob. */}
      <div className="pointer-events-none absolute -right-4 top-0 h-16 w-16 sm:-right-20 sm:top-0 sm:h-[560px] sm:w-[560px]">
        <div className="absolute -inset-4 bg-[radial-gradient(closest-side,rgba(185,255,75,0.4),rgba(185,255,75,0)_72%)] sm:-inset-32" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src="/logo-mark.png"
            alt=""
            fill
            className="object-contain opacity-90"
            priority
          />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[13px] uppercase tracking-[0.18em] text-accent"
        >
          {site.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-3xl text-balance font-display text-[42px] leading-[1.05] tracking-tight sm:text-[58px] lg:text-[68px]"
        >
          {site.hero.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted"
        >
          {site.hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href={site.hero.primaryCta.href}
            className="rounded-full bg-foreground px-6 py-3 font-mono text-[13px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent"
          >
            {site.hero.primaryCta.label}
          </Link>
          <a
            href={site.hero.secondaryCta.href}
            className="rounded-full border border-border-strong px-6 py-3 font-mono text-[13px] uppercase tracking-[0.1em] text-foreground transition-colors hover:border-foreground"
          >
            {site.hero.secondaryCta.label}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
