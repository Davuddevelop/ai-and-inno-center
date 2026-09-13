import { createClient } from "@/lib/supabase/server";
import type { Meeting, Project } from "@/lib/supabase/types";

interface ProjectMemberRow {
  projects: Project | null;
}

interface AttendanceRow {
  meetings: Meeting | null;
}

// Shared by /dashboard (your own activity) and /members/[id] (someone
// else's) -- same two queries either way, just a different profile id.
export async function getMemberActivity(profileId: string) {
  const supabase = await createClient();
  const [{ data: projectRows }, { data: attendanceRows }] = await Promise.all([
    supabase.from("project_members").select("projects(*)").eq("profile_id", profileId),
    supabase.from("attendance").select("meetings(*)").eq("profile_id", profileId),
  ]);

  const projects = ((projectRows ?? []) as unknown as ProjectMemberRow[])
    .map((row) => row.projects)
    .filter((p): p is Project => p !== null)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const attended = ((attendanceRows ?? []) as unknown as AttendanceRow[])
    .map((row) => row.meetings)
    .filter((m): m is Meeting => m !== null)
    .sort((a, b) => b.meeting_date.localeCompare(a.meeting_date));

  return { projects, attended };
}
