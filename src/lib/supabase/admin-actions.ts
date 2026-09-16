"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { isAdmin } from "@/lib/supabase/types";
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

// Approving someone and changing a rank both change what the member
// directory renders, and an admin very often goes straight from /admin to
// /members to check the result. Rejecting does not need this: a rejected
// applicant was never in the directory to begin with.
function revalidateDirectory() {
  revalidatePath("/members");
  revalidatePath("/members/[id]", "page");
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
  revalidateDirectory();
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
  revalidateDirectory();
}
