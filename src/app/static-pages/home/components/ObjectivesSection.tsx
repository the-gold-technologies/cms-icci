"use client";

import React from "react";
import { Target } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function ObjectivesSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="home"
      section="ObjectivesSection"
      title="4. Chamber Objectives Overview"
      description="Eyebrow tag, heading, and 'Explore all objectives' link. Objective cards are synchronized with Pages › Initiatives."
      label="Objectives"
      initialData={initialData}
      link
      managed={[
        {
          icon: Target,
          title: "Objective cards are shared with the Initiatives page",
          text: "Edit the six objectives once under Initiatives › Objectives.",
          href: "/static-pages/initiatives",
          linkLabel: "Manage Objectives",
        },
      ]}
    />
  );
}
