"use client";

import React from "react";
import { SectionShell } from "@/components/SectionShell";
import { HeadingFields } from "@/components/HeadingFields";
import { InputField } from "@/components/InputField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { useSectionEditor, str } from "@/lib/useSectionEditor";

const normalize = (d: any = {}) => ({
  tagline: str(d.tagline),
  headline: str(d.headline),
  scriptAccent: str(d.scriptAccent),
  headlineSuffix: str(d.headlineSuffix),
  image: str(d.image),
  imageAlt: str(d.imageAlt),
});

/**
 * Inner-page photo banner (website `PageBanner` in components/ui.tsx and the inline banners on
 * About / Contact): eyebrow, h1 split around the saffron word, background photo.
 */
export function BannerSectionEditor({
  slug,
  section,
  number,
  pageName,
  initialData,
}: {
  slug: string;
  section: string;
  number: number;
  pageName: string;
  initialData?: any;
}) {
  const {
    isOpen,
    setIsOpen,
    content: c,
    set,
    loading,
    saved,
    handleSave,
  } = useSectionEditor({
    slug,
    section,
    label: `${pageName} banner`,
    initialData,
    normalize,
  });

  return (
    <SectionShell
      title={`${number}. Hero Banner`}
      description={`Top header banner of the ${pageName} page: eyebrow tagline, primary headline, and background photo.`}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onSave={handleSave}
      loading={loading}
      saved={saved}
    >
      <HeadingFields
        value={c}
        onChange={(k, v) => set(k, v)}
        accent
        headlineLabel="Primary Heading (H1)"
      />
      <ImagePickerField
        label="Banner Background Photo"
        value={c.image}
        onChange={(url) => set("image", url)}
        folder={`icci/${slug}`}
        helperText="Wide landscape photo; a dark gradient is drawn over it on the website."
      />
      <InputField
        label="Photo Alt Text"
        value={c.imageAlt}
        onChange={(e) => set("imageAlt", e.target.value)}
        placeholder="e.g. Leave empty when the photo is decorative"
      />
    </SectionShell>
  );
}
