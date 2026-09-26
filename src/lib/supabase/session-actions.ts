"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { isAdmin } from "@/lib/supabase/types";
import type { ArrivalStatus } from "@/lib/supabase/types";

async function requireAdmin() {
  const { profile } = await getCurrentUserAndProfile();
  if (!isAdmin(profile)) throw new Error("Not authorized.");
  return profile!;
}

function revalidateSession(meetingId: string) {
  revalidatePath(`/admin/meetings/${meetingId}`);
  revalidatePath("/admin/meetings");
}

// ---------------------------------------------------------------- schedule
// Time, place and agenda live on meetings, which every active member can
// read. That is intentional: this is the half of a session people should
// be able to plan around.
export async function updateSessionSchedule(meetingId: string, formData: FormData) {
  await requireAdmin();
  const startsAt = String(formData.get("starts_at") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const agenda = String(formData.get("agenda") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase
    .from("meetings")
    .update({
      starts_at: startsAt || null,
      location: location || null,
      agenda: agenda || null,
    })
    .eq("id", meetingId);
  if (error) throw new Error(error.message);
  revalidateSession(meetingId);
  revalidatePath("/dashboard");
}

// ----------------------------------------------------------------- record
// What actually happened. Admin-only table, deliberately not a column on
// meetings.
export async function saveSessionNotes(meetingId: string, formData: FormData) {
  const admin = await requireAdmin();
  const notes = String(formData.get("notes") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.from("session_records").upsert(
    {
      meeting_id: meetingId,
      notes,
      updated_by: admin.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "meeting_id" },
  );
  if (error) throw new Error(error.message);
  revalidateSession(meetingId);
}

// ------------------------------------------------------------------ files
// The upload itself happens in the browser, straight to Supabase Storage,
// the same way profile photos already do -- a Server Action would push the
// whole PDF through the function's request body and hit its size limit.
// This only records the row once the object is in place.
export async function recordSessionFile(
  meetingId: string,
  title: string,
  filePath: string,
) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("session_files").insert({
    meeting_id: meetingId,
    title,
    file_path: filePath,
    uploaded_by: admin.id,
  });
  if (error) throw new Error(error.message);
  revalidateSession(meetingId);
}

export async function deleteSessionFile(fileId: string, meetingId: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error: readError } = await supabase
    .from("session_files")
    .select("file_path")
    .eq("id", fileId)
    .maybeSingle();
  if (readError) throw new Error(readError.message);

  // Remove the object first: if the row goes but the object stays, the file
  // is orphaned in the bucket with nothing left pointing at it to clean up.
  if (data?.file_path) {
    const { error: storageError } = await supabase.storage
      .from("session-files")
      .remove([data.file_path]);
    if (storageError) throw new Error(storageError.message);
  }

  const { error } = await supabase.from("session_files").delete().eq("id", fileId);
  if (error) throw new Error(error.message);
  revalidateSession(meetingId);
}

// --------------------------------------------------------------- feedback
export async function addFeedback(
  profileId: string,
  meetingId: string | null,
  formData: FormData,
) {
  const admin = await requireAdmin();
  const shared = String(formData.get("shared_note") ?? "").trim();
  const priv = String(formData.get("private_note") ?? "").trim();
  if (!shared && !priv) throw new Error("Write something in one of the notes.");

  const supabase = await createClient();
  const { error } = await supabase.from("member_feedback").insert({
    profile_id: profileId,
    meeting_id: meetingId,
    author_id: admin.id,
    shared_note: shared || null,
    private_note: priv || null,
  });
  if (error) throw new Error(error.message);

  if (meetingId) revalidateSession(meetingId);
  revalidatePath(`/members/${profileId}`);
  // The member reads their shared notes on their own dashboard.
  revalidatePath("/dashboard");
}

export async function deleteFeedback(feedbackId: string, profileId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("member_feedback")
    .delete()
    .eq("id", feedbackId);
  if (error) throw new Error(error.message);
  revalidatePath(`/members/${profileId}`);
  revalidatePath("/dashboard");
}

// ------------------------------------------------------------ punctuality
export async function setAttendanceStatus(
  meetingId: string,
  profileId: string,
  status: ArrivalStatus | "absent",
  minutesLate?: number | null,
) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  // "Absent" is still the absence of a row, as it always has been -- the
  // three stored statuses all mean the person was accounted for.
  if (status === "absent") {
    const { error } = await supabase
      .from("attendance")
      .delete()
      .eq("meeting_id", meetingId)
      .eq("profile_id", profileId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("attendance").upsert(
      {
        meeting_id: meetingId,
        profile_id: profileId,
        marked_by: admin.id,
        arrival_status: status,
        minutes_late: status === "late" ? (minutesLate ?? null) : null,
      },
      { onConflict: "meeting_id,profile_id" },
    );
    if (error) throw new Error(error.message);
  }
  revalidateSession(meetingId);
  revalidatePath(`/members/${profileId}`);
}
