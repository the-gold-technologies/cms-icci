"use client";

import React from "react";
import { Users } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function RepresentationSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="home"
      section="RepresentationSection"
      title="5. Industry Representation (heading + intro)"
      description="Heading and intro beside the stakeholders list."
      label="Industry Representation"
      initialData={initialData}
      intro
      managed={[
        {
          icon: Users,
          title: "Stakeholder list is shared with the Initiatives page",
          text: "Edit the list once under Initiatives › Who We Represent.",
          href: "/static-pages/initiatives",
          linkLabel: "Manage Stakeholders",
        },
      ]}
    />
  );
}
