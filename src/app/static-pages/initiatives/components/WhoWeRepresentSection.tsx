"use client";

import React from "react";
import { ListSectionEditor } from "@/components/ListSectionEditor";

export function WhoWeRepresentSection({ initialData }: { initialData?: any }) {
  return (
    <ListSectionEditor
      slug="initiatives"
      section="WhoWeRepresentSection"
      title="4. Industry Representation (Who We Represent)"
      description="Stakeholder groups represented by the Chamber, intro narrative, and membership call-to-action button (also shown on Home)."
      label="Who We Represent"
      initialData={initialData}
      fields={[
        {
          key: "intro",
          label: "Intro Paragraph",
          placeholder: "e.g. Sentence under the heading",
          multiline: true,
        },
        { key: "ctaLabel", label: "Button Label", placeholder: "e.g. Membership call to action" },
        { key: "ctaLink", label: "Button Link", placeholder: "e.g. /membership" },
      ]}
      listKey="stakeholders"
      listTitle="Stakeholders"
      listHelper="Shared with the home page Industry Representation section."
      addLabel="Add Stakeholder"
      itemPlaceholder="e.g. Type of business or professional"
    />
  );
}
