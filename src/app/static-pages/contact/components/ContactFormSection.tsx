"use client";

import React from "react";
import { Mail } from "lucide-react";
import { SectionShell } from "@/components/SectionShell";
import { ManagedElsewhereBanner } from "@/components/ManagedElsewhereBanner";
import { EnquiryFormFields, normalizeFormCopy } from "@/components/EnquiryFormFields";
import { useSectionEditor } from "@/lib/useSectionEditor";

// components/Forms.tsx ContactForm, in website order
const FIELD_NAMES = ["name", "email", "subject", "message"];

const normalize = (d: any = {}) => ({ ...normalizeFormCopy(d, FIELD_NAMES) });

export function ContactFormSection({ initialData }: { initialData?: any }) {
  const { isOpen, setIsOpen, content: c, set, loading, saved, handleSave } = useSectionEditor({
    slug: "contact",
    section: "ContactFormSection",
    label: "Contact form",
    initialData,
    normalize,
  });

  return (
    <SectionShell
      title="3. Enquiry Form (labels & thank-you message)"
      description="The 'Send us an enquiry' card: field labels, button and the message shown after sending."
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onSave={handleSave}
      loading={loading}
      saved={saved}
    >
      <ManagedElsewhereBanner
        icon={Mail}
        title="Contact Enquiries inbox"
        text="Messages sent through this form are collected under Submissions."
        href="/submissions/contact"
        linkLabel="View Enquiries"
      />
      <EnquiryFormFields
        value={c}
        onChange={(next) => (Object.keys(next) as (keyof typeof next)[]).forEach((k) => set(k, next[k]))}
      />
    </SectionShell>
  );
}
