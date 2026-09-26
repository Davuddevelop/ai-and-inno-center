"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { isAdmin } from "@/lib/supabase/types";

async function requireAdmin() {
  const { profile } = await getCurrentUserAndProfile();
  if (!isAdmin(profile)) {
    throw new Error("Not authorized.");
  }
  return profile!;
}

export async function createMeeting(formData: FormData) {
  const admin = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const meetingDate = String(formData.get("meeting_date") ?? "").trim();
  if (!title || !meetingDate) throw new Error("Title and date are required.");

  const supabase = await createClient();
  const { error } = await supabase.from("meetings").insert({
    title,
    meeting_date: meetingDate,
    created_by: admin.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/meetings");
}
