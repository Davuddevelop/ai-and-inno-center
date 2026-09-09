import { Reveal } from "@/components/Reveal";
import { site } from "@/content/site";

export function Programs() {
  const { programs } = site;
  return (
    <section id="programs" className="border-t border-border px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-muted">
            {programs.kicker}
          </p>
          <h2 className="mt-4 max-w-lg text-balance font-display text-3xl sm:text-4xl">
            {programs.title}
          </h2>
        </Reveal>

        <div className="mt-14 border-t border-border">
          {programs.items.map((item, i) => (
            <Reveal key={item.number} delay={i * 0.06}>
              <div className="group grid grid-cols-[64px_1fr] gap-x-6 gap-y-3 border-b border-border py-8 transition-colors sm:grid-cols-[80px_220px_1fr] sm:gap-x-10 sm:gap-y-0">
                <span className="font-mono text-sm text-muted transition-colors group-hover:text-accent">
                  {item.number}
                </span>
                <h3 className="font-display text-xl sm:text-2xl">{item.title}</h3>
                <p className="col-span-2 max-w-xl text-muted sm:col-span-1 sm:col-start-3">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
