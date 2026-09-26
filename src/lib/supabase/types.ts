// Hand-written to match supabase/migrations/0001_init.sql. If the schema
// changes, update this alongside it. (Once the project is linked to the
// Supabase CLI, `supabase gen types typescript` can generate this instead.)

export type MemberRank =
  | "trainee"
  | "member"
  | "senior_member"
  | "executive_member"
  | "vice_president"
  | "president";

export type MemberStatus = "pending" | "active" | "rejected";

export interface ApplicationAnswers {
  phone?: string | null;
  why_join?: string;
  experience?: string;
  portfolio?: string | null;
}

export interface PortfolioLink {
  label: string;
  url: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  grade: string | null;
  rank: MemberRank;
  status: MemberStatus;
  bio: string | null;
  photo_url: string | null;
  portfolio_links: PortfolioLink[];
  skills: string[];
  application_answers: ApplicationAnswers;
  created_at: string;
}

// Safe, peer-visible slice of Profile (the member_directory view) --
// deliberately excludes email and application_answers.
export interface MemberDirectoryEntry {
  id: string;
  full_name: string;
  grade: string | null;
  rank: MemberRank;
  bio: string | null;
  photo_url: string | null;
  portfolio_links: PortfolioLink[];
  skills: string[];
  created_at: string;
}

export type ProjectStatus = "planned" | "in_progress" | "completed";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
};

export interface Project {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  cover_image_url: string | null;
  status: ProjectStatus;
  due_date: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  meeting_date: string;
  // Schedule fields: every active member can read the meetings table, so
  // these are deliberately the member-visible half of a session -- the
  // plan, not the record of what happened.
  starts_at: string | null;
  location: string | null;
  agenda: string | null;
  created_by: string | null;
  created_at: string;
}

export type ArrivalStatus = "present" | "late" | "excused";

export const ARRIVAL_LABELS: Record<ArrivalStatus, string> = {
  present: "On time",
  late: "Late",
  excused: "Excused",
};

export interface AttendanceRecord {
  id: string;
  meeting_id: string;
  profile_id: string;
  marked_by: string | null;
  arrival_status: ArrivalStatus;
  minutes_late: number | null;
  created_at: string;
}

// What actually happened in a session. A separate admin-only table rather
// than a column on meetings, which the whole membership can read.
export interface SessionRecord {
  id: string;
  meeting_id: string;
  notes: string;
  updated_by: string | null;
  updated_at: string;
}

export interface SessionFile {
  id: string;
  meeting_id: string;
  title: string;
  file_path: string;
  uploaded_by: string | null;
  uploaded_at: string;
}

// Admin-only. Holds both halves; the member never receives this row.
export interface MemberFeedback {
  id: string;
  profile_id: string;
  meeting_id: string | null;
  author_id: string | null;
  shared_note: string | null;
  private_note: string | null;
  created_at: string;
}

// The my_feedback view -- what the member themselves can read. private_note
// is absent by construction, not by a filter in application code.
export interface MyFeedback {
  id: string;
  meeting_id: string | null;
  shared_note: string;
  created_at: string;
}

export const RANK_LABELS: Record<MemberRank, string> = {
  trainee: "Trainee",
  member: "Member",
  senior_member: "Senior Member",
  executive_member: "Executive Member",
  vice_president: "Vice President",
  president: "President",
};

// Leadership-first ordering, for displaying member lists.
export const RANK_ORDER: Record<MemberRank, number> = {
  president: 0,
  vice_president: 1,
  executive_member: 2,
  senior_member: 3,
  member: 4,
  trainee: 5,
};

// Pure rank logic, deliberately kept out of profile.ts: that module builds a
// server-only Supabase client, so importing it from any component that can
// render on the client (the header, which appears on the client-rendered
// login and apply pages) drags the server client into the browser bundle.
export function isAdmin(profile: Pick<Profile, "status" | "rank"> | null | undefined): boolean {
  return (
    !!profile &&
    profile.status === "active" &&
    (profile.rank === "vice_president" || profile.rank === "president")
  );
}

// gazette_posts has existed since 0001 (public read, admin write) but
// nothing in the app ever read or wrote it -- the landing page rendered
// three hardcoded placeholders instead.
export interface GazettePost {
  id: string;
  title: string;
  body: string;
  tag: string | null;
  cover_image_url: string | null;
  author_id: string | null;
  related_profile_id: string | null;
  published_at: string;
}
