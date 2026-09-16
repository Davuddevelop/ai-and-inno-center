import { createPublicClient } from "@/lib/supabase/public-client";
import type { GazettePost } from "@/lib/supabase/types";

// The Gazette is content, not infrastructure. The landing page is
// prerendered at build time, and env vars are scoped to Production only --
// so without this, a preview build has no Supabase URL and the entire
// public site fails to build over three post titles. Same reasoning as the
// fail-open in the session proxy: missing Supabase config should cost you
// the Gazette section, not the whole page.
async function safely<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return fallback;
  }
  try {
    return await run();
  } catch (err) {
    console.error("Gazette read failed:", err);
    return fallback;
  }
}

// Readable by anon under the gazette_select_public policy from 0001, so
// this works on the signed-out landing page as well as inside the app.
export async function getGazettePosts(limit?: number) {
  return safely<GazettePost[]>(async () => {
    const supabase = createPublicClient();
    let query = supabase
      .from("gazette_posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return (data ?? []) as GazettePost[];
  }, []);
}

export async function getGazettePost(id: string) {
  return safely<GazettePost | null>(async () => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("gazette_posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return data as GazettePost | null;
  }, null);
}

export function excerpt(body: string, max = 160) {
  const flat = body.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  // Cut at a word boundary so the preview does not end mid-word.
  return `${flat.slice(0, flat.lastIndexOf(" ", max))}…`;
}

export function formatPostDate(published_at: string) {
  return new Date(published_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
