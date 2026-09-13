"use client";

import { useState } from "react";
import { InlineSelect } from "@/components/ui/InlineSelect";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  createProject,
  deleteProject,
  updateProjectStatus,
} from "@/lib/supabase/project-actions";
import { PROJECT_STATUS_LABELS } from "@/lib/supabase/types";
import type { Project, ProjectStatus } from "@/lib/supabase/types";

const STATUS_OPTIONS: ProjectStatus[] = ["planned", "in_progress", "completed"];

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <div className="mt-10 border-t border-border pt-10">
      <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
        Projects
      </span>

      {projects.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Nothing added yet.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg">{project.title}</h3>
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-accent underline underline-offset-4"
                    >
                      {project.link}
                    </a>
                  ) : null}
                  {project.description ? (
                    <p className="mt-2 text-sm text-muted">{project.description}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <InlineSelect
                    id={project.id}
                    value={project.status}
                    options={STATUS_OPTIONS}
                    labels={PROJECT_STATUS_LABELS}
                    action={updateProjectStatus}
                  />
                  <form action={deleteProject.bind(null, project.id)}>
                    <SubmitButton
                      pendingText="…"
                      aria-label="Delete project"
                      className="text-muted transition-colors hover:text-red-400 disabled:opacity-50"
                    >
                      ✕
                    </SubmitButton>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <NewProjectForm />
    </div>
  );
}

function NewProjectForm() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 font-mono text-[12px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
      >
        + Add project
      </button>
    );
  }

  return (
    <form
      action={async (formData: FormData) => {
        await createProject(formData);
        setOpen(false);
      }}
      className="mt-4 space-y-3 rounded-xl border border-border p-4"
    >
      <input
        name="title"
        required
        placeholder="Project title"
        className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
      />
      <input
        name="link"
        placeholder="https://…"
        className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
      />
      <textarea
        name="description"
        rows={3}
        placeholder="What is it?"
        className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
      />
      <div className="flex gap-3">
        <SubmitButton
          pendingText="Adding…"
          className="rounded-full bg-foreground px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent disabled:opacity-50"
        >
          Add
        </SubmitButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-border-strong px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-foreground transition-colors hover:border-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
