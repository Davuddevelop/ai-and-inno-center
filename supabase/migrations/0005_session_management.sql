-- Management and planning tools for presidents and vice presidents:
-- session records, PDF attachments, member feedback, punctuality, and
-- deadlines.
--
-- Independent of 0004 (public profiles) -- these can be run in either
-- order, and neither depends on the other's columns.
--
-- The central decision here is what the WHOLE MEMBERSHIP can read.
-- meetings already carries meetings_select_active_members, so every active
-- member can select from it. That makes it the right home for the plan (a
-- schedule people should see) and the wrong home for the record of what
-- actually happened, which is candid by nature. Those go in separate,
-- admin-only tables rather than as extra columns on meetings.

-- ==========================================================================
-- 1. Meetings become schedulable: time, place, and the plan
--    All member-visible, by the existing meetings policy. Intentional.
-- ==========================================================================

alter table meetings
  add column starts_at time,
  add column location text,
  add column agenda text;

-- ==========================================================================
-- 2. The session record -- what actually happened. Admin-only.
-- ==========================================================================

create table session_records (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null unique references meetings (id) on delete cascade,
  notes text not null default '',
  updated_by uuid references profiles (id),
  updated_at timestamptz not null default now()
);

alter table session_records enable row level security;

create policy "session_records_admin_only"
  on session_records for all
  using (is_admin())
  with check (is_admin());

-- ==========================================================================
-- 3. PDF attachments on a session. Admin-only, in a PRIVATE bucket.
-- ==========================================================================

create table session_files (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references meetings (id) on delete cascade,
  title text not null,
  file_path text not null,
  uploaded_by uuid references profiles (id),
  uploaded_at timestamptz not null default now()
);

alter table session_files enable row level security;

create policy "session_files_admin_only"
  on session_files for all
  using (is_admin())
  with check (is_admin());

-- Unlike the avatars bucket from 0002, this one is NOT public: these are
-- session records and evaluations, and a public bucket means anyone holding
-- the URL can read the file regardless of any policy here. Downloads go
-- through short-lived signed URLs instead.
insert into storage.buckets (id, name, public)
values ('session-files', 'session-files', false)
on conflict (id) do nothing;

create policy "session_files_read_admin"
  on storage.objects for select
  using (bucket_id = 'session-files' and public.is_admin());

create policy "session_files_insert_admin"
  on storage.objects for insert
  with check (bucket_id = 'session-files' and public.is_admin());

create policy "session_files_delete_admin"
  on storage.objects for delete
  using (bucket_id = 'session-files' and public.is_admin());

-- ==========================================================================
-- 4. Member feedback -- one row holds both notes
--
--    RLS hides rows, not columns, so a member cannot be handed this row
--    with private_note withheld. The table stays admin-only and the view
--    below exposes just the shared half to the person it is about -- the
--    same approach member_directory used in 0003.
-- ==========================================================================

create table member_feedback (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  -- Nullable: feedback usually comes out of a session, but not always.
  meeting_id uuid references meetings (id) on delete set null,
  author_id uuid references profiles (id),
  shared_note text,
  private_note text,
  created_at timestamptz not null default now()
);

create index member_feedback_profile_idx on member_feedback (profile_id);

alter table member_feedback enable row level security;

create policy "member_feedback_admin_only"
  on member_feedback for all
  using (is_admin())
  with check (is_admin());

-- What the member themselves sees: their own shared notes, never the
-- private ones, and never anyone else's. Rows with no shared note are not
-- exposed at all, so an admin writing a private-only note does not surface
-- an empty entry on that member's profile.
create view my_feedback
  with (security_invoker = false)
  as
  select
    id,
    meeting_id,
    shared_note,
    created_at
  from member_feedback
  where profile_id = auth.uid()
    and shared_note is not null
    and shared_note <> '';

grant select on my_feedback to authenticated;

-- ==========================================================================
-- 5. Punctuality
--    An attendance row has always meant "was here". Defaulting to 'present'
--    keeps every existing row meaning exactly what it did before.
-- ==========================================================================

alter table attendance
  add column arrival_status text not null default 'present'
    check (arrival_status in ('present', 'late', 'excused')),
  add column minutes_late integer
    check (minutes_late is null or minutes_late >= 0);

-- ==========================================================================
-- 6. Deadlines on projects
-- ==========================================================================

alter table projects add column due_date date;
