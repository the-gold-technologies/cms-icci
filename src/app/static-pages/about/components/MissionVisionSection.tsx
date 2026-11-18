"use client";

import React from "react";
import { SectionShell } from "@/components/SectionShell";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { useSectionEditor, str } from "@/lib/useSectionEditor";

const normalize = (d: any = {}) => ({
  missionTagline: str(d.missionTagline),
  missionLead: str(d.missionLead),
  missionMore: Array.isArray(d.missionMore) ? d.missionMore.join("\n\n") : str(d.missionMore),
  visionTagline: str(d.visionTagline),
  visionLead: str(d.visionLead),
  visionMore: Array.isArray(d.visionMore) ? d.visionMore.join("\n\n") : str(d.visionMore),
});

type Content = ReturnType<typeof normalize>;

export function MissionVisionSection({ initialData }: { initialData?: any }) {
  const {
    isOpen,
    setIsOpen,
    content: c,
    set,
    loading,
    saved,
    handleSave,
  } = useSectionEditor({
    slug: "about",
    section: "MissionVisionSection",
    label: "Mission & Vision",
    initialData,
    normalize,
  });

  const block = (prefix: "mission" | "vision", heading: string) => {
    const k = (s: string) => `${prefix}${s}` as keyof Content;
    return (
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">{heading}</h4>
        <InputField
          label="Eyebrow Tag"
          value={c[k("Tagline")]}
          onChange={(e) => set(k("Tagline"), e.target.value)}
          placeholder="e.g. Card label"
        />
        <TextAreaField
          label="Lead Statement"
          value={c[k("Lead")]}
          onChange={(e) => set(k("Lead"), e.target.value)}
          rows={3}
          placeholder="e.g. One-sentence statement shown large"
        />
        <TextAreaField
          label="'Read More' Paragraphs"
          value={c[k("More")]}
          onChange={(e) => set(k("More"), e.target.value)}
          rows={10}
          helperText="Separate paragraphs with a blank line."
          placeholder="e.g. Further paragraphs…"
        />
      </div>
    );
  };

  return (
    <SectionShell
      title="4. Mission & Vision (two cards)"
      description="White mission card and saffron vision card, each with a lead statement and 'Read more' paragraphs."
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onSave={handleSave}
      loading={loading}
      saved={saved}
    >
      {block("mission", "Mission Card")}
      <div className="border-t border-gray-100 pt-5">
        {block("vision", "Vision Card (saffron)")}
      </div>
    </SectionShell>
  );
}
