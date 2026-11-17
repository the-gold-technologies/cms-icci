"use client";

import React from "react";
import { ListSectionEditor } from "@/components/ListSectionEditor";

export function ObjectivesSection({ initialData }: { initialData?: any }) {
  return (
    <ListSectionEditor
      slug="initiatives"
      section="ObjectivesSection"
      title="3. Objectives"
      description="Master list of numbered objectives — also shown on the home page."
      label="Objectives"
      initialData={initialData}
      listKey="items"
      listTitle="Objectives"
      listHelper="Numbered 01, 02… automatically in list order. Shared with the home page."
      addLabel="Add Objective"
      itemFields={[
        { key: "title", label: "Title", placeholder: "e.g. Card heading" },
        { key: "text", label: "Text", placeholder: "e.g. One or two sentences", multiline: true },
      ]}
    />
  );
}
