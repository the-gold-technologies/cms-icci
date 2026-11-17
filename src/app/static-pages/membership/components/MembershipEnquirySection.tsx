"use client";

import React from "react";
import { Mail } from "lucide-react";
import { SectionShell } from "@/components/SectionShell";
import { HeadingFields } from "@/components/HeadingFields";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ManagedElsewhereBanner } from "@/components/ManagedElsewhereBanner";
import { EnquiryFormFields, normalizeFormCopy } from "@/components/EnquiryFormFields";
import { useSectionEditor, str } from "@/lib/useSectionEditor";

// components/Forms.tsx MembershipForm, in website order
const FIELD_NAMES = ["name", "organisation", "email", "phone", "category", "state", "message"];

const normalize = (d: any = {}) => ({
  tagline: str(d.tagline),
  headline: str(d.headline),
  intro: str(d.intro),
  eligibilityTitle: str(d.eligibilityTitle),
  eligibilityText: str(d.eligibilityText),
  ...normalizeFormCopy(d, FIELD_NAMES),
});

export function MembershipEnquirySection({ initialData }: { initialData?: any }) {
  const { isOpen, setIsOpen, content: c, set, loading, saved, handleSave } = useSectionEditor({
    slug: "membership",
    section: "MembershipEnquirySection",
    label: "Membership enquiry",
    initialData,
    normalize,
  });

  return (
    <SectionShell
      title="5. Membership Enquiry (eligibility + form)"
      description="The #join block shown on both the Membership page and the home page: heading, eligibility note and the enquiry form."
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onSave={handleSave}
      loading={loading}
      saved={saved}
    >
      <ManagedElsewhereBanner
        icon={Mail}
        title="Membership Enquiries inbox"
        text="Applications sent through this form are collected under Submissions. Category options come from Membership Categories."
        href="/submissions/membership"
        linkLabel="View Enquiries"
      />
      <HeadingFields value={c} onChange={(k, v) => set(k as "tagline" | "headline", v)} />
      <TextAreaField
        label="Intro Paragraph"
        value={c.intro}
        onChange={(e) => set("intro", e.target.value)}
        rows={2}
        placeholder="e.g. What happens after applying"
      />
      <div className="border-t border-gray-100 pt-5 space-y-4">
        <InputField
          label="Eligibility Box Title"
          value={c.eligibilityTitle}
          onChange={(e) => set("eligibilityTitle", e.target.value)}
          placeholder="e.g. Heading of the grey box"
        />
        <TextAreaField
          label="Eligibility Text"
          value={c.eligibilityText}
          onChange={(e) => set("eligibilityText", e.target.value)}
          rows={3}
          placeholder="e.g. Who can apply"
        />
      </div>
      <div className="border-t border-gray-100 pt-5">
        <EnquiryFormFields
          value={c}
          onChange={(next) =>
            (Object.keys(next) as (keyof typeof next)[]).forEach((k) => set(k, next[k] as never))
          }
        />
      </div>
    </SectionShell>
  );
}
