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
  created_by: string | null;
  created_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  meeting_date: string;
  created_by: string | null;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  meeting_id: string;
  profile_id: string;
  marked_by: string | null;
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
