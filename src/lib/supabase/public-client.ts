import { createClient } from "@supabase/supabase-js";

// For reading content that is public anyway (the Gazette).
//
// The normal server client binds to the request's cookies, which forces
// Next to render the page dynamically -- on every single visit, from
// Tokyo. The landing page is the site's public face and is otherwise
// static, so it should keep being served from the CDN edge near the
// visitor rather than round-tripping to Japan for three post titles.
//
// This client carries no session, so it reads strictly as `anon` and sees
// only what the anon RLS policies allow. Never use it for anything that
// depends on who is asking.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
