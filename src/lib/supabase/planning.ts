import { createClient } from "@/lib/supabase/server";
import type { Meeting, MyFeedback } from "@/lib/supabase/types";

// Reads the my_feedback view, which is scoped to auth.uid() in SQL. There
// is no profile id parameter on purpose: the caller cannot ask for someone
// else's feedback even by mistake.
export async function getMyFeedback() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("my_feedback")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as MyFeedback[];
}

// Meetings from today onward. Every active member can read the meetings
// table, so this is safe for the member dashboard -- it shows the plan
// (time, place, agenda), never the session record.
export async function getUpcomingMeetings(limit = 3) {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("meetings")
    .select("*")
    .gte("meeting_date", today)
    .order("meeting_date", { ascending: true })
    .limit(limit);
  return (data ?? []) as Meeting[];
}

export function formatMeetingWhen(meeting: Meeting) {
  const date = new Date(meeting.meeting_date).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = meeting.starts_at ? ` · ${meeting.starts_at.slice(0, 5)}` : "";
  const place = meeting.location ? ` · ${meeting.location}` : "";
  return `${date}${time}${place}`;
}
