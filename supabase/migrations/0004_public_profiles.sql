-- Makes member profiles shareable outside the center, without putting
-- school students' contact details or internal records on the open web.
--
-- What becomes public: name, rank, photo, bio, skills, portfolio links, and
-- the projects they are on.
--
-- What deliberately stays internal, and is simply not selected by these
-- views: email, phone and the rest of application_answers, grade (a school
-- year narrows down a minor's identity), attendance records (whether
-- someone missed meetings is nobody's business outside the center), and
-- status (nobody outside needs to know who was rejected).

-- Every active member is public by default, which is the stated intent.
-- The column exists so that a member who is not comfortable being listed
-- publicly can switch themselves off without leaving the center.
alter table profiles
  add column is_public boolean not null default true;

-- Same pattern as member_directory in 0003: a plain (non-security_invoker)
-- view runs with its owner's privileges, so it can expose a chosen slice of
-- a table whose own RLS stays locked to "your own row or an admin". The
-- difference here is that there is no viewer check -- this one is readable
-- by anon on purpose -- so the column list IS the security boundary. Do not
-- add a column to this view without deciding it is safe for the open web.
create view public_profiles
  with (security_invoker = false)
  as
  select
    id,
    full_name,
    rank,
    bio,
    photo_url,
    portfolio_links,
    skills,
    created_at
  from profiles
  where status = 'active'
    and is_public = true;

grant select on public_profiles to anon, authenticated;

-- Projects belonging to publicly visible members. Joins through
-- project_members so a project shows on every member's public profile who
-- is actually on its team, not only its creator.
create view public_projects
  with (security_invoker = false)
  as
  select
    pr.id,
    pr.title,
    pr.description,
    pr.link,
    pr.status,
    pr.created_at,
    pm.profile_id
  from projects pr
  join project_members pm on pm.project_id = pr.id
  join profiles owner on owner.id = pm.profile_id
  where owner.status = 'active'
    and owner.is_public = true;

grant select on public_projects to anon, authenticated;
