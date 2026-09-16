import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";
import { getGazettePosts, excerpt, formatPostDate } from "@/lib/supabase/gazette";

export async function Gazette() {
  const { gazette } = site;
  const posts = await getGazettePosts(3);

  // Hidden entirely until something real is published. This section used to
  // render three hardcoded placeholders -- "First placement at a national
  // robotics & AI challenge", dated TBD -- which read to any visitor as
  // things the center had actually done. An empty section is weaker than a
  // full one; claiming wins that have not happened is worse than both.
  if (posts.length === 0) return null;

  return (
    <section id="gazette" className="border-t border-border px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-muted">
                {gazette.kicker}
              </p>
              <h2 className="mt-4 max-w-lg text-balance font-display text-3xl sm:text-4xl">
                {gazette.title}
              </h2>
            </div>
            <Link
              href="/gazette"
              className="font-mono text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
            >
              View all →
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.08}>
              <Link
                href={`/gazette/${post.id}`}
                className="flex h-full flex-col justify-between rounded-2xl border border-border p-6 transition-colors hover:border-border-strong"
              >
                <div>
                  {post.tag ? (
                    <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-accent">
                      {post.tag}
                    </span>
                  ) : null}
                  <h3 className="mt-4 font-display text-xl leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {excerpt(post.body, 120)}
                  </p>
                </div>
                <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
                  {formatPostDate(post.published_at)}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
