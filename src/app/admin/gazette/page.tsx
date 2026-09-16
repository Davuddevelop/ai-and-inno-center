import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { buttonClasses } from "@/components/ui/Button";
import { getCurrentUserAndProfile } from "@/lib/supabase/profile";
import { isAdmin } from "@/lib/supabase/types";
import { createGazettePost, deleteGazettePost } from "@/lib/supabase/gazette-actions";
import { getGazettePosts, formatPostDate, excerpt } from "@/lib/supabase/gazette";

export default async function AdminGazettePage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/login");
  if (!isAdmin(profile)) redirect("/dashboard");

  const posts = await getGazettePosts();

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader profile={profile} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-10">
        <Breadcrumbs
          trail={[{ label: "Admin", href: "/admin" }, { label: "Gazette" }]}
        />
        <h1 className="mt-2 font-display text-4xl">Gazette</h1>
        <p className="mt-3 text-muted">
          Posts here are public — they show on the landing page and at
          /gazette, to anyone, signed in or not.
        </p>

        <form
          action={createGazettePost}
          className="mt-10 space-y-4 rounded-2xl border border-border p-6"
        >
          <div>
            <label
              htmlFor="gazette-title"
              className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted"
            >
              Title
            </label>
            <input
              id="gazette-title"
              name="title"
              required
              className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label
              htmlFor="gazette-tag"
              className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted"
            >
              Tag <span className="normal-case">(optional — e.g. Competition)</span>
            </label>
            <input
              id="gazette-tag"
              name="tag"
              className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label
              htmlFor="gazette-body"
              className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted"
            >
              Body
            </label>
            <textarea
              id="gazette-body"
              name="body"
              rows={8}
              required
              placeholder="Leave a blank line between paragraphs."
              className="mt-2 w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
            />
          </div>
          <SubmitButton pendingText="Publishing…" className={buttonClasses()}>
            Publish
          </SubmitButton>
        </form>

        <div className="mt-12 space-y-3">
          <h2 className="font-display text-2xl">Published ({posts.length})</h2>
          {posts.length === 0 ? (
            <p className="text-muted">
              Nothing published yet. The Gazette section is hidden on the
              landing page until the first post goes up.
            </p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border p-4"
              >
                <div className="min-w-0">
                  <Link
                    href={`/gazette/${post.id}`}
                    className="font-display text-lg transition-colors hover:text-accent"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                    {post.tag ? `${post.tag} · ` : ""}
                    {formatPostDate(post.published_at)}
                  </p>
                  <p className="mt-2 text-sm text-muted">{excerpt(post.body, 110)}</p>
                </div>
                <form action={deleteGazettePost.bind(null, post.id)}>
                  <SubmitButton
                    pendingText="Deleting…"
                    className={buttonClasses("ghost", "hover:text-red-400")}
                  >
                    Delete
                  </SubmitButton>
                </form>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
