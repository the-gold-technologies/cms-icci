"use client";

import React from "react";
import { Layers } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function InitiativesSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="home"
      section="InitiativesSection"
      title="6. Key Initiatives (heading, intro + link)"
      description="Cream band introducing the four initiative pillars."
      label="Key Initiatives"
      initialData={initialData}
      intro
      link
      managed={[
        {
          icon: Layers,
          title: "Initiative cards are shared with the Initiatives page",
          text: "Edit the four pillars once under Initiatives › Key Initiatives.",
          href: "/static-pages/initiatives",
          linkLabel: "Manage Initiatives",
        },
      ]}
    />
  );
}
