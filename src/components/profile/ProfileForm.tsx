"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Field, TextInput, TextArea } from "@/components/ui/Field";
import { createClient } from "@/lib/supabase/client";
import type { PortfolioLink, Profile } from "@/lib/supabase/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name);
  const [grade, setGrade] = useState(profile.grade ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [links, setLinks] = useState<PortfolioLink[]>(
    profile.portfolio_links.length ? profile.portfolio_links : [{ label: "", url: "" }],
  );
  const [skills, setSkills] = useState<string[]>(profile.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile.photo_url);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function updateLink(index: number, field: keyof PortfolioLink, value: string) {
    setLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
    );
  }

  function addLink() {
    setLinks((prev) => [...prev, { label: "", url: "" }]);
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  function addSkill() {
    const value = skillInput.trim();
    if (!value) return;
    setSkills((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  function handleSkillKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);

    const supabase = createClient();
    let photoUrl = profile.photo_url;

    if (photoFile) {
      const ext = photoFile.name.split(".").pop();
      const path = `${profile.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, photoFile, { upsert: true });
      if (uploadError) {
        setSaving(false);
        setError(uploadError.message);
        return;
      }
      const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(path);
      // Cache-bust so the new photo shows immediately instead of the
      // previous one at the same URL.
      photoUrl = `${publicUrl.publicUrl}?v=${Date.now()}`;
    }

    const cleanLinks = links.filter((link) => link.label.trim() && link.url.trim());

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        grade,
        bio,
        photo_url: photoUrl,
        portfolio_links: cleanLinks,
        skills,
      })
      .eq("id", profile.id);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8">
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border-strong bg-background">
          {photoPreview ? (
            <Image
              src={photoPreview}
              alt=""
              width={80}
              height={80}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : null}
        </div>
        <label className="cursor-pointer rounded-full border border-border-strong px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-foreground transition-colors hover:border-foreground">
          Change photo
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name">
          <TextInput
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Field>
        <Field label="Grade / class">
          <TextInput value={grade} onChange={(e) => setGrade(e.target.value)} />
        </Field>
      </div>

      <Field label="Bio" hint="a couple sentences, shown on your profile">
        <TextArea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
      </Field>

      <div>
        <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
          Tools &amp; skills
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-2 rounded-full border border-border-strong px-3 py-1.5 text-sm text-foreground"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-muted transition-colors hover:text-red-400"
                aria-label={`Remove ${skill}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-3">
          <input
            placeholder="e.g. Python, Figma, TensorFlow"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
          />
          <button
            type="button"
            onClick={addSkill}
            className="rounded-lg border border-border-strong px-4 font-mono text-[12px] uppercase tracking-[0.1em] text-foreground transition-colors hover:border-foreground"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
          Links
        </span>
        <div className="mt-2 space-y-3">
          {links.map((link, i) => (
            <div key={i} className="flex gap-3">
              <input
                placeholder="Label (e.g. GitHub)"
                value={link.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
                className="w-40 rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
              />
              <input
                placeholder="https://…"
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="px-2 text-muted transition-colors hover:text-red-400"
                aria-label="Remove link"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLink}
          className="mt-3 font-mono text-[12px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
        >
          + Add link
        </button>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          Saved.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-foreground px-6 py-3 font-mono text-[13px] uppercase tracking-[0.1em] text-background transition-colors hover:bg-accent disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Profile"}
      </button>
    </form>
  );
}
