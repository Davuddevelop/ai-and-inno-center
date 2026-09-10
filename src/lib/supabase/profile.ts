import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

export async function getCurrentUserAndProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile: data as Profile | null };
}

export function isAdmin(profile: Profile | null): boolean {
  return (
    !!profile &&
    profile.status === "active" &&
    (profile.rank === "vice_president" || profile.rank === "president")
  );
}
