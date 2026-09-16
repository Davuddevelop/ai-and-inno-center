import { HeaderNav, type HeaderLink } from "./HeaderNav";
import { isAdmin, type Profile } from "@/lib/supabase/types";

// Takes the profile as a prop rather than fetching it. Every page that
// renders this header has already loaded the signed-in profile, and this
// app pays a full network round trip per Supabase call -- fetching it
// again here would add one to every single page load.
//
// Pages with no signed-in user (login, apply, auth callback) render this
// with no profile and get just the wordmark linking back to the public
// site, which is all they need.
export function AuthHeader({ profile }: { profile?: Profile | null }) {
  const active = !!profile && profile.status === "active";

  const links: HeaderLink[] = active
    ? [
        { label: "My profile", href: "/dashboard" },
        { label: "Directory", href: "/members" },
        ...(isAdmin(profile) ? [{ label: "Admin", href: "/admin" }] : []),
      ]
    : [];

  return (
    <HeaderNav
      // An active member's home is their own hub, not the marketing page.
      // The old header sent them to "/" from every member page, where the
      // landing nav greets them as a stranger and invites them to apply.
      homeHref={active ? "/dashboard" : "/"}
      links={links}
      showLogout={!!profile}
      // A pending member has no profile page to represent yet, so showing
      // them an avatar in the header promises something that is not there.
      showAvatar={active}
      photoUrl={active ? (profile?.photo_url ?? null) : null}
      name={profile?.full_name ?? null}
    />
  );
}
