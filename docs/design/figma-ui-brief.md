# Figma UI Generation Brief — AI & Innovation Center

Paste the block below into Figma (First Draft / Make) to generate the initial
UI. Fill in `[Your School Name]` before pasting.

## Context

First student-run AI & Innovation Center at a high school in Azerbaijan. This
covers three surfaces: public landing site, member portal, and admin console.

## Role hierarchy

President (1) → Vice President (2) → four member ranks: **Trainee → Member →
Senior Member → Executive Member**.

Rationale: a single linear ladder maps to one `rank` field with an integer
level, so feature gating (e.g. "Executive Member+ can lead a project") is a
comparison, not special-casing. Rank *titles* should be admin-editable text
in the data model, not hardcoded strings, so renaming a rank later is a
settings change, not a code change.

## Role permissions summary

| Role | Can do |
|---|---|
| President | Everything VPs can, plus manage VP accounts |
| VP (x2) | Approve/reject members, edit ranks below VP, post gazette, mark attendance, view all member data |
| Executive Member | Lead a project, elevated profile visibility |
| Senior Member | Standard access + can be assigned project lead |
| Member | Standard access |
| Trainee | Restricted: profile + view-only dashboard until first meeting attendance is logged |

## The prompt

```
PROJECT: AI & Innovation Center — [Your School Name] chapter
CONTEXT: First student-run AI & Innovation Center at a high school in Azerbaijan.
This is the internal platform: public landing site + member portal + admin console.

=== AESTHETIC DIRECTION (Vercel-inspired) ===
- Pure black (#000000) backgrounds, white (#FFFFFF) foreground text/shapes
- One restrained accent color for links/CTAs/status only (suggest an electric
  blue or lime green — used sparingly, not decoratively)
- Typography: geometric sans (Geist, Inter, or similar), large bold headlines,
  small uppercase monospace "eyebrow" labels above section headings
- Hairline 1px borders at low opacity (rgba(255,255,255,0.1)) to divide
  sections and cards instead of heavy drop shadows
- Generous whitespace, strict grid alignment, sharp rectangular cards with
  occasional soft gradient glow behind hero sections
- The organic cell/blob logomark is the one "soft" visual element against an
  otherwise geometric, high-contrast system — use it in the nav, favicon,
  loading states, empty states
- Desktop-first for dashboards (sidebar layout like a Vercel project
  dashboard), fully responsive landing page

=== INFORMATION ARCHITECTURE ===

PUBLIC (no login):
1. Landing page
   - Nav: logo, About, Programs, Gazette, Join / Login
   - Hero: mission statement, one-line value prop, CTA "Apply to Join"
   - About/Mission section
   - "What we do" — programs/activities grid
   - Latest Gazette preview (3 most recent accomplishment posts)
   - Leadership section (President + 2 VPs, photo + name + title)
   - Footer: contact, socials, school affiliation
2. Public Gazette feed (all published accomplishments, no login required)
3. Login page
4. Sign-up / Application page — multi-step form:
   - Basic info (name, grade/class, contact)
   - Interest questions (why join, skills, prior experience)
   - Submit → account created with status "Pending Approval"

MEMBER PORTAL (authenticated, rank: Trainee and above):
5. Pending Approval screen (shown until President/VP approves them)
6. Member Dashboard (home): welcome banner, current rank badge, upcoming
   meeting, recent org announcements, quick stats (attendance %, projects,
   documents)
7. My Profile: editable bio, photo, rank badge (read-only, admin-set),
   social/portfolio links, public/private toggle
8. My Projects: add/edit project cards — title, description, link, status,
   cover image
9. My Documents: upload/manage PDFs — certificates, awards, competition
   results; list view with type filter
10. My Attendance: history of meetings, attended/missed, running percentage
11. Gazette (member view — same as public but can react/comment if desired)

ADMIN CONSOLE (President + VP only):
12. Admin Dashboard: pending-approval count, total members by rank, recent
    activity feed, quick actions
13. Approval Queue: list of pending applicants → view application answers →
    Approve / Reject
14. Member Directory: searchable/filterable table (name, rank, status,
    attendance %) → click into...
15. Member Detail (admin view): edit rank, view all their documents/projects,
    attendance log, add internal notes, record accomplishments
16. Attendance Tracker: pick a meeting date → checklist to mark who attended
17. Gazette Composer: create/publish a new accomplishment post (title, body,
    cover image, tag a member/team)
18. Roles & Ranks settings: rename the 4 member rank labels, reorder if needed

=== ROLE PERMISSIONS SUMMARY ===
President      — full control: everything VPs can do + manage VP accounts
VP (x2)        — approve/reject members, edit ranks (below VP), post gazette,
                 mark attendance, view all member data
Executive Mbr  — can lead a project, elevated profile visibility
Senior Member  — standard member access + can be assigned project lead
Member         — standard member access
Trainee        — restricted: profile + view-only dashboard until first
                 meeting attendance is logged

=== KEY COMPONENTS TO DESIGN ===
- Rank badge (pill, 6 color-coded variants for the 6 levels)
- Member card (avatar, name, rank badge, small stat row)
- Project card (cover image, title, tags, external link icon)
- Document row (file icon, name, type tag, upload date, download)
- Gazette post card (image, title, excerpt, author/team tag, date)
- Sidebar nav (member vs admin variants — admin gets extra section)
- Data table (member directory — sortable columns, row click-through)
- Multi-step form (application) with progress indicator
- Approve/Reject confirmation modal
- Empty states (no projects yet, no pending approvals, etc.)
- Toast/notification style for actions (approved, saved, uploaded)

=== DELIVERABLE ===
Generate high-fidelity frames for all 18 screens above at desktop width
(1440px), using a shared color/type style library defined first. Prioritize
the Landing Page, Login/Signup, Member Dashboard, and Admin Dashboard as the
most detailed frames — the rest can reuse the established component system.
```

## Next step

Once frames come back from Figma, design the Supabase schema (users, ranks,
applications, attendance, projects, documents, gazette posts) to match
whatever the approval/rank workflow actually needs — do this together rather
than generating it standalone, since the tables depend on decisions made
during the Figma pass (e.g. exact application questions, whether ranks stay
a fixed enum or become a separate editable table).
