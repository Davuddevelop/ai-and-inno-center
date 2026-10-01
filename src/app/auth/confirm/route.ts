import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Confirms a signup from an emailed link, on ANY device.
//
// The old path (/auth/callback) could not do that. createBrowserClient
// hardcodes flowType: "pkce", so signUp() stashes a code_verifier in the
// storage of the browser that submitted the form, and the emailed link can
// only be redeemed by a browser holding that verifier. People open mail in
// Gmail's in-app browser, or on their phone having applied on a laptop --
// different storage, no verifier, exchange impossible. Two members hit this
// and it looked exactly like an expired link.
//
// verifyOtp with a token_hash carries no verifier: the token in the URL is
// the whole credential, so it works wherever the link is opened. This runs
// as a Route Handler rather than a page because only Route Handlers and
// middleware can set the session cookie.
//
// Requires the Supabase "Confirm signup" email template to point here:
//   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (tokenHash && type) {
    // Anything that throws here -- misconfigured env, Supabase unreachable --
    // must still land on the recovery screen. This route is what someone
    // already locked out of their account is clicking; a crash page is the
    // one response that leaves them with nowhere to go.
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash,
      });
      if (!error) {
        // Confirmed and signed in. /pending routes them onward by status --
        // straight to the dashboard if an admin already approved them.
        return NextResponse.redirect(new URL("/pending", request.url));
      }
    } catch (err) {
      console.error("verifyOtp failed:", err);
    }
  }

  return NextResponse.redirect(new URL("/auth/callback?failed=1", request.url));
}
