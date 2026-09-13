"use client";

import { useFormStatus } from "react-dom";

// Every <form action={someServerAction}> button needs this -- without it,
// a click gives zero feedback until the round trip to the server finishes
// (which can be a couple seconds), so people click again thinking it
// didn't register. useFormStatus only works in a child of the <form>,
// which is why this has to be its own component rather than inline logic
// in the page that renders the form.
export function SubmitButton({
  children,
  pendingText,
  className,
  ...rest
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled" | "className">) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className} {...rest}>
      {pending ? (pendingText ?? "…") : children}
    </button>
  );
}
