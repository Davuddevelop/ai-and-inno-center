import type { ComponentProps } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
        {label}
      </span>
      {hint ? <span className="ml-2 text-[12px] text-muted/60">{hint}</span> : null}
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent";

export function TextInput(props: ComponentProps<"input">) {
  return <input {...props} className={inputClass} />;
}

export function TextArea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={`${inputClass} resize-none`} />;
}
