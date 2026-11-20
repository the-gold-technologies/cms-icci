"use client";

import React from "react";
import { InputField } from "@/components/InputField";

export interface HeadingValue {
  tagline: string;
  headline: string;
  scriptAccent?: string;
  headlineSuffix?: string;
}

/**
 * Heading row from .agents/rules/cms-ui-and-structure.md §6 + content-parity §3.
 * ICCI headings render as: headline + <span class="text-saffron">scriptAccent</span> + headlineSuffix.
 * Pass `accent` for headings that have a highlighted word; without it only Tagline + Headline show.
 */
export function HeadingFields({
  value,
  onChange,
  accent = false,
  taglineLabel = "Eyebrow Tag",
  headlineLabel = "Primary Heading",
  placeholders = {},
}: {
  value: HeadingValue;
  onChange: (key: keyof HeadingValue, value: string) => void;
  accent?: boolean;
  taglineLabel?: string;
  headlineLabel?: string;
  placeholders?: Partial<Record<keyof HeadingValue, string>>;
}) {
  if (!accent) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label={taglineLabel}
          value={value.tagline}
          onChange={(e) => onChange("tagline", e.target.value)}
          placeholder={placeholders.tagline || "e.g. Short eyebrow above the heading"}
        />
        <InputField
          label={headlineLabel}
          containerClassName="sm:col-span-2"
          value={value.headline}
          onChange={(e) => onChange("headline", e.target.value)}
          placeholder={placeholders.headline || "e.g. Main section heading"}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <InputField
        label={taglineLabel}
        value={value.tagline}
        onChange={(e) => onChange("tagline", e.target.value)}
        placeholder={placeholders.tagline || "e.g. Short eyebrow above the heading"}
      />
      <InputField
        label={headlineLabel}
        value={value.headline}
        onChange={(e) => onChange("headline", e.target.value)}
        placeholder={placeholders.headline || "e.g. Words before the highlighted word"}
        helperText="Text shown before the saffron highlighted word."
      />
      <InputField
        label="Script Accent"
        value={value.scriptAccent ?? ""}
        onChange={(e) => onChange("scriptAccent", e.target.value)}
        placeholder={
          placeholders.scriptAccent || "e.g. Word shown in saffron, incl. dot (e.g. ICCI.)"
        }
        helperText="Rendered in the saffron brand colour. Include any closing punctuation."
      />
    </div>
  );
}
