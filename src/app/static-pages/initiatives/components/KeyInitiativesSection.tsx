"use client";

import React from "react";
import { ListSectionEditor } from "@/components/ListSectionEditor";

export function KeyInitiativesSection({ initialData }: { initialData?: any }) {
  return (
    <ListSectionEditor
      slug="initiatives"
      section="KeyInitiativesSection"
      title="2. Key Initiatives (four pillars)"
      description="Master list of initiative cards — also shown on the home page."
      label="Key Initiatives"
      initialData={initialData}
      fields={[
        { key: "intro", label: "Intro Paragraph", placeholder: "e.g. Sentence under the heading", multiline: true },
      ]}
      listKey="items"
      listTitle="Initiative Cards"
      listHelper="Shared with the home page Key Initiatives section."
      addLabel="Add Initiative"
      itemFields={[
        { key: "title", label: "Title", placeholder: "e.g. Initiative name" },
        { key: "tag", label: "Number Tag", placeholder: "e.g. 05" },
        { key: "text", label: "Text", placeholder: "e.g. What the initiative does", multiline: true },
      ]}
    />
  );
}
