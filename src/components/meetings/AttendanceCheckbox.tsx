"use client";

import { useState, useTransition } from "react";

export function AttendanceCheckbox({
  meetingId,
  profileId,
  attended: initialAttended,
  action,
}: {
  meetingId: string;
  profileId: string;
  attended: boolean;
  action: (meetingId: string, profileId: string, attended: boolean) => Promise<void>;
}) {
  const [attended, setAttended] = useState(initialAttended);
  const [pending, startTransition] = useTransition();

  function handleChange() {
    const next = !attended;
    setAttended(next);
    startTransition(async () => {
      try {
        await action(meetingId, profileId, next);
      } catch {
        setAttended(!next);
      }
    });
  }

  return (
    <input
      type="checkbox"
      checked={attended}
      onChange={handleChange}
      disabled={pending}
      className="h-5 w-5 rounded border-border-strong accent-accent"
    />
  );
}
