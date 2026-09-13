"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile, isAdmin } from "@/lib/supabase/profile";

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

export async function setAttendance(
  meetingId: string,
  profileId: string,
  attended: boolean,
) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  if (attended) {
    const { error } = await supabase
      .from("attendance")
      .upsert(
        { meeting_id: meetingId, profile_id: profileId, marked_by: admin.id },
        { onConflict: "meeting_id,profile_id" },
      );
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("attendance")
      .delete()
      .eq("meeting_id", meetingId)
      .eq("profile_id", profileId);
    if (error) throw new Error(error.message);
  }
  revalidatePath(`/admin/meetings/${meetingId}`);
}
