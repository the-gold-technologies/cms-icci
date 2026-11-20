"use client";

import React from "react";
import { ListSectionEditor } from "@/components/ListSectionEditor";

export function HowToJoinSection({ initialData }: { initialData?: any }) {
  return (
    <ListSectionEditor
      slug="membership"
      section="HowToJoinSection"
      title="4. How to Join (Application Steps)"
      description="Section heading and sequential steps (1 to 4) detailing the application and onboarding process."
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
