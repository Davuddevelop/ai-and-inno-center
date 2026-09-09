import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";

export function Manifesto() {
  const { manifesto } = site;
  return (
    <section id="manifesto" className="border-t border-border px-6 py-24 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[220px_1fr]">
        <Reveal>
          <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-muted">
            {manifesto.kicker}
          </p>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-balance font-display text-3xl italic leading-tight sm:text-4xl lg:text-[44px]">
              &ldquo;{manifesto.statement}&rdquo;
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
              {manifesto.body}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
