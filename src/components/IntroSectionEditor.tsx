"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { SectionShell } from "@/components/SectionShell";
import { HeadingFields } from "@/components/HeadingFields";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ManagedElsewhereBanner } from "@/components/ManagedElsewhereBanner";
import { useSectionEditor, str } from "@/lib/useSectionEditor";

export interface ExtraField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

/**
 * Section whose own copy is only a heading (+ optional intro, "more" link and extra labels) and
 * whose cards come from another module, shown as a ManagedElsewhereBanner.
 * Every configured key is loaded and saved; unconfigured keys are never written.
 */
export function IntroSectionEditor({
  slug,
  section,
  title,
  description,
  label,
  initialData,
  intro = false,
  link = false,
  heading = true,
  extra = [],
  managed,
}: {
  slug: string;
  section: string;
  title: string;
  description: string;
  label: string;
  initialData?: any;
  intro?: boolean;
  link?: boolean;
  heading?: boolean;
  extra?: ExtraField[];
  managed?: { icon: LucideIcon; title: string; text: string; href: string; linkLabel: string }[];
}) {
  const normalize = (d: any = {}) => {
    const out: Record<string, string> = {};
    if (heading) {
      out.tagline = str(d.tagline);
      out.headline = str(d.headline);
    }
    if (intro) out.intro = str(d.intro);
    if (link) {
      out.linkLabel = str(d.linkLabel);
      out.linkHref = str(d.linkHref);
    }
    for (const f of extra) out[f.key] = str(d[f.key]);
    return out;
  };

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
    label,
    initialData,
    normalize,
  });

  return (
    <SectionShell
      title={title}
      description={description}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onSave={handleSave}
      loading={loading}
      saved={saved}
    >
      {managed?.map((m) => (
        <ManagedElsewhereBanner key={m.href + m.title} {...m} />
      ))}

      {heading && (
        <HeadingFields
          value={{ tagline: c.tagline, headline: c.headline }}
          onChange={(k, v) => set(k, v)}
        />
      )}

      {intro && (
        <TextAreaField
          label="Intro Paragraph"
          value={c.intro}
          onChange={(e) => set("intro", e.target.value)}
          rows={3}
          placeholder="e.g. One or two sentences under the heading"
        />
      )}

      {link && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Link Label"
            value={c.linkLabel}
            onChange={(e) => set("linkLabel", e.target.value)}
            placeholder="e.g. Text of the arrow link beside the heading"
          />
          <InputField
            label="Link URL"
            value={c.linkHref}
            onChange={(e) => set("linkHref", e.target.value)}
            placeholder="e.g. /initiatives"
          />
        </div>
      )}

      {extra.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {extra.map((f) =>
            f.multiline ? (
              <TextAreaField
                key={f.key}
                label={f.label}
                containerClassName="md:col-span-2"
                value={c[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                rows={3}
                placeholder={f.placeholder}
              />
            ) : (
              <InputField
                key={f.key}
                label={f.label}
                value={c[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
              />
            ),
          )}
        </div>
      )}
    </SectionShell>
  );
}
