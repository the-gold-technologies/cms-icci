"use client";

import React from "react";
import { ListSectionEditor } from "@/components/ListSectionEditor";

export function FocusAreasSection({ initialData }: { initialData?: any }) {
  return (
    <ListSectionEditor
      slug="about"
      section="FocusAreasSection"
      title="3. Focus Areas (What We Work Towards)"
      description="Four icon cards on the grey band. Icons are fixed by position."
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
