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
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. If these
are scoped to Production only (Vercel's env var UI lets you check
Production/Preview/Development independently), preview deployments will
build fine but every server-rendered page that touches Supabase (`/admin`,
`/dashboard`, `/pending`) will 500 with "Your project's URL and Key are
required to create a Supabase client" — that's expected there, not a bug,
unless you also want preview deployments to work against Supabase, in which
case check Preview (and Development) too.

Also: environment variables only apply to builds created *after* they're
saved. Adding or changing one doesn't retroactively fix an existing
deployment — you need a new build (a new commit push, since redeploying an
old deployment reuses its original build).
