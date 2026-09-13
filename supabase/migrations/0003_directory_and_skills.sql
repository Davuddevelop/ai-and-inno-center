-- Adds a "skills/tools" field to profiles, opens attendance visibility to
-- every active member (previously own-record-or-admin only), and adds a
-- member_directory view so active members can browse each other's profiles
-- without exposing email or application_answers to peers.

alter table profiles add column skills text[] not null default '{}';

-- Attendance: was own-record-or-admin; now any active member can see the
-- full log for everyone. Marking attendance is still admin-only
-- (attendance_write_admin, unchanged).
drop policy if exists "attendance_select_own_or_admin" on attendance;

create policy "attendance_select_active_members"
  on attendance for select
  using (
    exists (select 1 from profiles where id = auth.uid() and status = 'active')
  );

-- member_directory: a narrow, safe slice of profiles for peer browsing.
-- This is a plain view (not security_invoker), so it runs with its owner's
-- privileges rather than the querying user's -- deliberately, so it can
-- expose *some* columns from a table whose RLS is otherwise locked to
-- "your own row or admin", without loosening that RLS itself. email and
-- application_answers (phone, why_join, etc.) are simply not selected here,
-- so there is no path through this view to read them for anyone but the
-- row's own owner or an admin querying the profiles table directly.
create view member_directory
  with (security_invoker = false)
  as
  select
    id,
    full_name,
    grade,
    rank,
    bio,
    photo_url,
    portfolio_links,
    skills,
    created_at
  from profiles
  where status = 'active'
    and exists (
      select 1 from profiles viewer
      where viewer.id = auth.uid() and viewer.status = 'active'
    );

grant select on member_directory to authenticated;
