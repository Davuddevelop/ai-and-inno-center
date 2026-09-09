-- AI & Innovation Center — initial schema
-- Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).

create extension if not exists pgcrypto;

-- ==========================================================================
-- ENUMS
-- ==========================================================================

create type member_rank as enum (
  'trainee',
  'member',
  'senior_member',
  'executive_member',
  'vice_president',
  'president'
);

create type member_status as enum ('pending', 'active', 'rejected');

create type project_status as enum ('planned', 'in_progress', 'completed');

-- ==========================================================================
-- TABLES
-- ==========================================================================

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  grade text,
  rank member_rank not null default 'trainee',
  status member_status not null default 'pending',
  bio text,
  photo_url text,
  portfolio_links jsonb not null default '[]',
  application_answers jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  meeting_date date not null,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references meetings (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  marked_by uuid references profiles (id),
  created_at timestamptz not null default now(),
  unique (meeting_id, profile_id)
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  link text,
  cover_image_url text,
  status project_status not null default 'in_progress',
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table project_members (
  project_id uuid not null references projects (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  primary key (project_id, profile_id)
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  doc_type text not null default 'other',
  file_path text not null,
  uploaded_at timestamptz not null default now()
);

create table gazette_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  tag text,
  cover_image_url text,
  author_id uuid references profiles (id),
  related_profile_id uuid references profiles (id),
  published_at timestamptz not null default now()
);

-- ==========================================================================
-- AUTO-CREATE A PROFILE ROW WHEN SOMEONE SIGNS UP
-- ==========================================================================
-- The apply form calls supabase.auth.signUp({ ..., options: { data: {...} } }).
-- Whatever is passed as `data` lands in auth.users.raw_user_meta_data, and
-- this trigger copies it into a new profiles row in the same transaction —
-- so there's no window where a signed-up user has no profile.

create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, grade, application_answers)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'grade',
    coalesce(new.raw_user_meta_data -> 'application_answers', '{}'::jsonb)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ==========================================================================
-- PREVENT MEMBERS FROM PROMOTING THEMSELVES
-- ==========================================================================
-- RLS below lets a member update their own profile (bio, photo, links). This
-- trigger stops that same update from also changing rank/status unless the
-- person making the change is an admin — otherwise "update my bio" could
-- also silently smuggle in "and make me president".

create function is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and status = 'active'
      and rank in ('vice_president', 'president')
  );
$$;

create function protect_rank_and_status()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if not is_admin() then
    new.rank := old.rank;
    new.status := old.status;
  end if;
  return new;
end;
$$;

create trigger protect_rank_and_status_trigger
  before update on profiles
  for each row execute function protect_rank_and_status();

-- ==========================================================================
-- ROW LEVEL SECURITY
-- ==========================================================================

alter table profiles enable row level security;
alter table meetings enable row level security;
alter table attendance enable row level security;
alter table projects enable row level security;
alter table project_members enable row level security;
alter table documents enable row level security;
alter table gazette_posts enable row level security;

-- profiles: you can see your own row; admins can see and edit everyone's.
create policy "profiles_select_own_or_admin"
  on profiles for select
  using (id = auth.uid() or is_admin());

create policy "profiles_update_own_or_admin"
  on profiles for update
  using (id = auth.uid() or is_admin());

-- meetings: any signed-in active member can see the schedule; only admins
-- create/edit/delete meetings.
create policy "meetings_select_active_members"
  on meetings for select
  using (
    exists (select 1 from profiles where id = auth.uid() and status = 'active')
  );

create policy "meetings_write_admin"
  on meetings for all
  using (is_admin())
  with check (is_admin());

-- attendance: you can see your own attendance; only admins can see everyone's
-- and only admins can mark it.
create policy "attendance_select_own_or_admin"
  on attendance for select
  using (profile_id = auth.uid() or is_admin());

create policy "attendance_write_admin"
  on attendance for all
  using (is_admin())
  with check (is_admin());

-- projects: any signed-in active member can see and create projects; only
-- the creator, a team member, or an admin can edit/delete one.
create policy "projects_select_active_members"
  on projects for select
  using (
    exists (select 1 from profiles where id = auth.uid() and status = 'active')
  );

create policy "projects_insert_active_members"
  on projects for insert
  with check (
    created_by = auth.uid()
    and exists (select 1 from profiles where id = auth.uid() and status = 'active')
  );

create policy "projects_update_owner_member_or_admin"
  on projects for update
  using (
    created_by = auth.uid()
    or is_admin()
    or exists (
      select 1 from project_members
      where project_id = projects.id and profile_id = auth.uid()
    )
  );

create policy "projects_delete_owner_or_admin"
  on projects for delete
  using (created_by = auth.uid() or is_admin());

-- project_members: visible to any active member; only the project's creator
-- or an admin manages who's on the team.
create policy "project_members_select_active_members"
  on project_members for select
  using (
    exists (select 1 from profiles where id = auth.uid() and status = 'active')
  );

create policy "project_members_write_owner_or_admin"
  on project_members for all
  using (
    is_admin()
    or exists (
      select 1 from projects
      where id = project_members.project_id and created_by = auth.uid()
    )
  )
  with check (
    is_admin()
    or exists (
      select 1 from projects
      where id = project_members.project_id and created_by = auth.uid()
    )
  );

-- documents: private to the owner and admins.
create policy "documents_select_own_or_admin"
  on documents for select
  using (profile_id = auth.uid() or is_admin());

create policy "documents_insert_own"
  on documents for insert
  with check (profile_id = auth.uid());

create policy "documents_update_delete_own_or_admin"
  on documents for update
  using (profile_id = auth.uid() or is_admin());

create policy "documents_delete_own_or_admin"
  on documents for delete
  using (profile_id = auth.uid() or is_admin());

-- gazette_posts: public read (including signed-out visitors on the landing
-- page), admin-only write.
create policy "gazette_select_public"
  on gazette_posts for select
  to anon, authenticated
  using (true);

create policy "gazette_write_admin"
  on gazette_posts for all
  using (is_admin())
  with check (is_admin());
