"use client";

import React from "react";
import { ListSectionEditor } from "@/components/ListSectionEditor";

export function ChaptersSection({ initialData }: { initialData?: any }) {
  return (
    <ListSectionEditor
      slug="about"
      section="ChaptersSection"
      title="6. Regional & State Chapters"
      description="Heading, intro text, and state chapter cards (state, head, and contact info)."
      label="State Chapters"
      initialData={initialData}
      fields={[
        {
          key: "intro",
          label: "Intro Paragraph",
          placeholder: "e.g. Sentence under the heading",
          multiline: true,
        },
      ]}
      listKey="chapters"
      listTitle="Chapters"
      addLabel="Add Chapter"
      itemFields={[
        { key: "state", label: "State", placeholder: "e.g. Uttar Pradesh" },
        { key: "head", label: "Chapter Head", placeholder: "e.g. Name of the chapter head" },
        { key: "contact", label: "Contact", placeholder: "e.g. Email or phone" },
      ]}
    />
  );
}
