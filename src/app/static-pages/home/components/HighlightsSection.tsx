"use client";

import React from "react";
import { ListSectionEditor } from "@/components/ListSectionEditor";

export function HighlightsSection({ initialData }: { initialData?: any }) {
  return (
    <ListSectionEditor
      slug="home"
      section="HighlightsSection"
      title="2. Key Highlights Strip (Key Statistics)"
      description="Four key impact figures displayed on the highlight strip directly beneath the hero carousel."
      label="Highlights"
      initialData={initialData}
      heading={false}
      listKey="stats"
      listTitle="Stats"
      listHelper="Shown left to right; keep 4 so each gets its icon."
      addLabel="Add Stat"
      itemFields={[
        { key: "value", label: "Value", placeholder: "e.g. 30+" },
        { key: "label", label: "Label", placeholder: "e.g. What the number counts" },
      ]}
    />
  );
}
