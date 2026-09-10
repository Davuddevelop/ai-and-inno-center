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

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  grade: string | null;
  rank: MemberRank;
  status: MemberStatus;
  bio: string | null;
  photo_url: string | null;
  portfolio_links: unknown[];
  application_answers: ApplicationAnswers;
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
