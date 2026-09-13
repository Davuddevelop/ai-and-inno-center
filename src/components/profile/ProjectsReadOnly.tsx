import { PROJECT_STATUS_LABELS } from "@/lib/supabase/types";
import type { Project } from "@/lib/supabase/types";

// Like ProjectsSection, but for viewing someone else's projects -- no add
// form, no status editing, no delete (you don't own these).
export function ProjectsReadOnly({ projects }: { projects: Project[] }) {
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
                <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted">
                  {PROJECT_STATUS_LABELS[project.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
