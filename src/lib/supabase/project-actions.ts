"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import type { ProjectStatus } from "@/lib/supabase/types";

async function requireActiveUser() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user || !profile || profile.status !== "active") {
    throw new Error("Not authorized.");
  }
  return { user, profile };
}

// Projects render in exactly two places: your own copy on /dashboard (with
// edit controls) and everyone else's read-only copy on /members/[id]. These
// used to revalidate /profile, which has shown only the edit form since the
// dashboard restructure -- so the list people actually look at was never
// invalidated after a change.
function revalidateProjectViews() {
  revalidatePath("/dashboard");
  revalidatePath("/members/[id]", "page");
}

export async function createProject(formData: FormData) {
  const { profile } = await requireActiveUser();
  const title = String(formData.get("title") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!title) throw new Error("A project needs a title.");

  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      title,
      link: link || null,
      description: description || null,
      created_by: profile.id,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  // The creator is automatically on the project's team, so "my projects"
  // is always just "projects I'm a member of" -- one query shape, no
  // special-casing the creator elsewhere.
  const { error: memberError } = await supabase
    .from("project_members")
    .insert({ project_id: project.id, profile_id: profile.id });
  if (memberError) throw new Error(memberError.message);

  revalidateProjectViews();
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus) {
  await requireActiveUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", projectId);
  if (error) throw new Error(error.message);
  revalidateProjectViews();
}

export async function deleteProject(projectId: string) {
  await requireActiveUser();
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) throw new Error(error.message);
  revalidateProjectViews();
}
