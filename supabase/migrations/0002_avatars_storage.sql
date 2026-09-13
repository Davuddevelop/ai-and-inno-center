-- Profile photo storage.
-- Run this in the Supabase SQL Editor, same as 0001_init.sql.

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- storage.objects is owned by Supabase's internal supabase_storage_admin
-- role and already has RLS enabled by default -- our postgres role isn't
-- the owner, so we can't (and don't need to) ALTER TABLE it ourselves.
-- We only add policies on top of the RLS that's already there.

-- Photos are shown on profiles other members (and eventually the public
-- site) can see, so read access is public rather than gated by RLS.
create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Each member can only write inside their own folder, named after their
-- user id (e.g. avatars/<uid>/photo.jpg) -- enforced by checking the first
-- path segment against auth.uid(), not just trusted from the client.
create policy "avatars_owner_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
