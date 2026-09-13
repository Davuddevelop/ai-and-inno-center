"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile, isAdmin } from "@/lib/supabase/profile";
import type { MemberRank } from "@/lib/supabase/types";

// Row Level Security in the database is the real security boundary here
// (a non-admin's update would be rejected regardless of this check) — this
// just fails fast with a clear error instead of a silent no-op update.
async function requireAdmin() {
  const { profile } = await getCurrentUserAndProfile();
  if (!isAdmin(profile)) {
    throw new Error("Not authorized.");
  }
  return profile;
}

export async function approveApplication(profileId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status: "active" })
    .eq("id", profileId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function rejectApplication(profileId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status: "rejected" })
    .eq("id", profileId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateMemberRank(profileId: string, rank: MemberRank) {
  const admin = await requireAdmin();
  if (admin!.id === profileId) {
    throw new Error("You can't change your own rank here.");
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ rank })
    .eq("id", profileId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
