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

// A post is on the public landing page, the public Gazette index, and its
// own public page, so every write invalidates all three.
function revalidateGazette() {
  revalidatePath("/");
  revalidatePath("/gazette");
  revalidatePath("/gazette/[id]", "page");
  revalidatePath("/admin/gazette");
}

export async function createGazettePost(formData: FormData) {
  const admin = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const tag = String(formData.get("tag") ?? "").trim();
  if (!title || !body) throw new Error("A post needs a title and a body.");

  const supabase = await createClient();
  const { error } = await supabase.from("gazette_posts").insert({
    title,
    body,
    tag: tag || null,
    author_id: admin.id,
  });
  if (error) throw new Error(error.message);
  revalidateGazette();
}

export async function deleteGazettePost(postId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("gazette_posts")
    .delete()
    .eq("id", postId);
  if (error) throw new Error(error.message);
  revalidateGazette();
}
