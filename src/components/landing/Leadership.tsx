import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";

export function Leadership() {
  const { leadership } = site;
  return (
    <section className="border-t border-border px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-muted">
            {leadership.kicker}
          </p>
          <h2 className="mt-4 max-w-lg text-balance font-display text-3xl sm:text-4xl">
            {leadership.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {leadership.people.map((person, i) => (
            <Reveal key={`${person.role}-${i}`} delay={i * 0.06}>
              <div className="h-full bg-background p-8">
                <div className="h-12 w-12 rounded-full border border-border-strong" />
                <p className="mt-6 font-display text-lg">{person.name}</p>
                <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
                  {person.role}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
