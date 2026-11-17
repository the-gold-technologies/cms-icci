"use client";

import React from "react";
import { ListSectionEditor } from "@/components/ListSectionEditor";

export function HowToJoinSection({ initialData }: { initialData?: any }) {
  return (
    <ListSectionEditor
      slug="membership"
      section="HowToJoinSection"
      title="4. How to Join (steps)"
      description="Numbered steps (1, 2, 3…) in list order."
      label="How to Join"
      initialData={initialData}
      listKey="steps"
      listTitle="Steps"
      addLabel="Add Step"
      itemFields={[
        { key: "title", label: "Title", placeholder: "e.g. Card heading" },
        { key: "text", label: "Text", placeholder: "e.g. One or two sentences", multiline: true },
      ]}
    />
  );
}
