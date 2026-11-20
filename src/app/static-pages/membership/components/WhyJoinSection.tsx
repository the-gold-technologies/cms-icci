"use client";

import React from "react";
import { ListSectionEditor } from "@/components/ListSectionEditor";

export function WhyJoinSection({ initialData }: { initialData?: any }) {
  return (
    <ListSectionEditor
      slug="membership"
      section="WhyJoinSection"
      title="2. Why Join (Member Benefits)"
      description="Section heading, intro narrative, and the full checklist of member benefits (also shown on Home)."
      label="Why Join"
      initialData={initialData}
      fields={[
        {
          key: "intro",
          label: "Intro Paragraph",
          placeholder: "e.g. Who membership is open to",
          multiline: true,
        },
      ]}
      listKey="benefits"
      listTitle="Benefits"
      listHelper="Tick list; shared with the home page Membership section."
      addLabel="Add Benefit"
      itemPlaceholder="e.g. One membership benefit"
    />
  );
}
