"use client";

import React from "react";
import { SectionShell } from "@/components/SectionShell";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { useSectionEditor, str } from "@/lib/useSectionEditor";

const normalize = (d: any = {}) => ({
  tagline: str(d.tagline),
  image: str(d.image),
  imageAlt: str(d.imageAlt),
  badgeLabel: str(d.badgeLabel),
  badgeTitle: str(d.badgeTitle),
  lead: str(d.lead),
  more: Array.isArray(d.more) ? d.more.join("\n\n") : str(d.more),
});

export function AboutUsSection({ initialData }: { initialData?: any }) {
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
    section: "AboutUsSection",
    label: "About Us",
    initialData,
    normalize,
  });

  return (
    <SectionShell
      title="2. About Us Story (Photo, Badge & Narrative)"
      description="Introductory story on the About page: side photo, establishment badge, lead paragraph, and expandable narrative."
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onSave={handleSave}
      loading={loading}
      saved={saved}
    >
      <InputField
        label="Eyebrow Tag"
        value={c.tagline}
        onChange={(e) => set("tagline", e.target.value)}
        placeholder="e.g. Short eyebrow above the section"
      />
      <TextAreaField
        label="Lead Paragraph"
        value={c.lead}
        onChange={(e) => set("lead", e.target.value)}
        rows={5}
        placeholder="e.g. Opening paragraph shown in large text"
      />
      <TextAreaField
        label="'Read More' Paragraphs"
        value={c.more}
        onChange={(e) => set("more", e.target.value)}
        rows={10}
        helperText="Hidden until the visitor clicks Read more. Separate paragraphs with a blank line."
        placeholder="e.g. Further paragraphs…"
      />
      <ImagePickerField
        label="Photo"
        value={c.image}
        onChange={(url) => set("image", url)}
        folder="icci/about"
      />
      <InputField
        label="Photo Alt Text"
        value={c.imageAlt}
        onChange={(e) => set("imageAlt", e.target.value)}
        placeholder="e.g. Describe the photo"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Badge Small Label"
          value={c.badgeLabel}
          onChange={(e) => set("badgeLabel", e.target.value)}
          placeholder="e.g. Small caps line on the badge"
        />
        <InputField
          label="Badge Title"
          value={c.badgeTitle}
          onChange={(e) => set("badgeTitle", e.target.value)}
          placeholder="e.g. Bold line on the badge"
        />
      </div>
    </SectionShell>
  );
}
