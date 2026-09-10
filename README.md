# AI & Innovation Center

Platform for a student-run AI & Innovation Center inside a high school in
Baku, Azerbaijan — public landing site, member portal, and admin console.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Supabase (auth, Postgres,
storage). See `docs/design/figma-ui-brief.md` for the full product and
design brief, and `supabase/migrations/0001_init.sql` for the database
schema.

## Content

Landing page copy lives in `src/content/site.ts` — edit that file with real
details (school name, programs, leadership) rather than the components.

## Getting started

```bash
pnpm install
cp .env.local.example .env.local  # fill in your Supabase project URL + publishable key
pnpm dev
```

## Deploying (Vercel)

If the deployed site 404s on every route despite a successful, READY build:
check **Settings → General → Build & Development Settings → Framework
Preset** on the Vercel project. If it shows "Other" instead of "Next.js",
Vercel builds the app fine but doesn't package it as a Next.js app when
deploying — every route 404s at the edge even though the build logs look
completely clean. Set it to "Next.js" and push again.

Required environment variables (Project Settings → Environment Variables):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
