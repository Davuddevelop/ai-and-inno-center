import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { ButtonLink } from "@/components/ui/Button";
import { getGazettePosts, excerpt, formatPostDate } from "@/lib/supabase/gazette";

// Public content, read with the cookie-free client, so this page stays
// cacheable instead of rendering per request. Publishing from /admin/gazette
// calls revalidatePath, so a new post appears immediately rather than after
// this window.
export const revalidate = 300;


export const metadata: Metadata = {
  title: "The Gazette — AI & Innovation Center",
  description: "What the center has been building, winning, and shipping.",
};

export default async function GazettePage() {
  const posts = await getGazettePosts();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-20 sm:px-10">
        <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
          The Gazette
        </p>
        <h1 className="mt-4 max-w-2xl text-balance font-display text-4xl sm:text-5xl">
          What the center has been building.
        </h1>

        {posts.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-border p-8">
            <p className="font-display text-xl">Nothing published yet.</p>
            <p className="mt-3 text-muted">
              The first entries go up as the center ships its first projects.
            </p>
            <div className="mt-6">
              <ButtonLink href="/" variant="secondary">
                Back to the center
              </ButtonLink>
            </div>
          </div>
        ) : (
          <div className="mt-16 space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/gazette/${post.id}`}
                className="block rounded-2xl border border-border p-6 transition-colors hover:border-border-strong"
              >
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
                <h2 className="mt-3 font-display text-2xl leading-snug">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {excerpt(post.body)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
