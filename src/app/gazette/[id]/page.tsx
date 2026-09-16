import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { ButtonLink } from "@/components/ui/Button";
import { getGazettePost, formatPostDate, excerpt } from "@/lib/supabase/gazette";

// Public content, read with the cookie-free client, so this page stays
// cacheable instead of rendering per request. Publishing from /admin/gazette
// calls revalidatePath, so a new post appears immediately rather than after
// this window.
export const revalidate = 300;


export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getGazettePost(id);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} — The Gazette`,
    description: excerpt(post.body, 155),
  };
}

export default async function GazettePostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getGazettePost(id);
  if (!post) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-20 sm:px-10">
        <div className="flex flex-wrap items-center gap-3">
          {post.tag ? (
            <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-accent">
              {post.tag}
            </span>
          ) : null}
          <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
            {formatPostDate(post.published_at)}
          </span>
        </div>

        <h1 className="mt-4 text-balance font-display text-4xl leading-tight">
          {post.title}
        </h1>

        {/* Posts are plain text, so paragraphs are blank-line separated
            rather than markup. Rendering them as text nodes keeps anything
            an author pastes in from becoming HTML. */}
        <div className="mt-8 space-y-4">
          {post.body
            .split(/\n{2,}/)
            .map((para) => para.trim())
            .filter(Boolean)
            .map((para, i) => (
              <p key={i} className="leading-relaxed text-foreground">
                {para}
              </p>
            ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <ButtonLink href="/gazette" variant="secondary">
            ← All posts
          </ButtonLink>
        </div>
      </main>
      <Footer />
    </div>
  );
}
