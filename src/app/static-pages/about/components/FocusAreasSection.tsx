"use client";

import React from "react";
import { ListSectionEditor } from "@/components/ListSectionEditor";

export function FocusAreasSection({ initialData }: { initialData?: any }) {
  return (
    <ListSectionEditor
      slug="about"
      section="FocusAreasSection"
      title="3. Focus Areas (Strategic Pillars)"
      description="The four core focus cards on the About page detailing the Chamber's key areas of effort."
      label="Focus Areas"
      initialData={initialData}
      listKey="items"
      listTitle="Focus Cards"
      addLabel="Add Focus Card"
      itemFields={[
        { key: "title", label: "Title", placeholder: "e.g. Card heading" },
        { key: "text", label: "Text", placeholder: "e.g. One or two sentences", multiline: true },
      ]}
    />
  );
}
