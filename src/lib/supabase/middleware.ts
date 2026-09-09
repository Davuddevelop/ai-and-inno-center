import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase auth session cookie on every request. Without this,
// server components see a stale/expired session because Next.js can't set
// cookies from a Server Component — only middleware and Route Handlers can.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    // Fail open: no Supabase config means no session to refresh, not a
    // reason to 500 the entire site (this runs in front of every route,
    // including the public landing page).
    console.error(
      "Supabase env vars are missing — skipping session refresh. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  try {
    // Touching auth.getUser() is what actually triggers the refresh.
    await supabase.auth.getUser();
  } catch (err) {
    console.error("Supabase session refresh failed:", err);
  }

  return supabaseResponse;
}
