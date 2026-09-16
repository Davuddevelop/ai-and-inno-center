import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";

export function Gazette() {
  const { gazette } = site;
  return (
    <section id="gazette" className="border-t border-border px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div>
            <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-muted">
              {gazette.kicker}
            </p>
            <h2 className="mt-4 max-w-lg text-balance font-display text-3xl sm:text-4xl">
              {gazette.title}
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {gazette.posts.map((post, i) => (
            <Reveal key={post.title} delay={i * 0.08}>
              <article className="flex h-full flex-col justify-between rounded-2xl border border-border p-6 transition-colors hover:border-border-strong">
                <div>
                  <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-accent">
                    {post.tag}
                  </span>
                  <h3 className="mt-4 font-display text-xl leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                </div>
                <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
                  {post.date}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
