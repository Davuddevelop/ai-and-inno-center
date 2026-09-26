"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { recordSessionFile, deleteSessionFile } from "@/lib/supabase/session-actions";
import type { SessionFile } from "@/lib/supabase/types";

const BUCKET = "session-files";

export function SessionFiles({
  meetingId,
  files,
}: {
  meetingId: string;
  files: SessionFile[];
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setBusy(true);

    try {
      const supabase = createClient();
      // Timestamp-prefixed so uploading two files with the same name in one
      // session does not silently overwrite the first.
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${meetingId}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type || "application/pdf" });
      if (uploadError) throw new Error(uploadError.message);

      await recordSessionFile(meetingId, file.name, path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  // The bucket is private, so there is no permanent URL to link to. Each
  // click mints a short-lived signed one; a link copied out of here stops
  // working shortly after, which is the point.
  async function open(path: string) {
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: signError } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, 60);
      if (signError) throw new Error(signError.message);
      if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open file.");
    }
  }

  function remove(file: SessionFile) {
    setError(null);
    startTransition(async () => {
      try {
        await deleteSessionFile(file.id, meetingId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not delete.");
      }
    });
  }

  return (
    <section className="mt-12 border-t border-border pt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl">Files</h2>
        <label
          className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border border-border-strong px-6 font-mono text-[13px] uppercase tracking-[0.1em] text-foreground transition-colors hover:border-foreground ${
            busy ? "opacity-50" : ""
          }`}
        >
          {busy ? "Uploading…" : "Upload PDF"}
          <input
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            disabled={busy}
            className="hidden"
          />
        </label>
      </div>

      <p className="mt-2 text-sm text-muted">
        Visible to presidents and vice presidents only.
      </p>

      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

      {files.length === 0 ? (
        <p className="mt-6 text-muted">Nothing attached to this session yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-foreground">{file.title}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                  {new Date(file.uploaded_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => open(file.file_path)}>
                  Open
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => remove(file)}
                  className="hover:text-red-400"
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
