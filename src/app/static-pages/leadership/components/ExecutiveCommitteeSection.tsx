"use client";

import React from "react";
import { Users } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function ExecutiveCommitteeSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="leadership"
      section="ExecutiveCommitteeSection"
      title="6. National Executive Committee Tier"
      description="Tier badge and title for the National Executive Committee member cards."
      label="Executive Committee"
      initialData={initialData}
      managed={[
        {
          icon: Users,
          title: "Cards come from the Leadership module",
          text: "Leaders appear here by role and tier, in their saved order.",
          href: "/leaders",
          linkLabel: "Manage Leaders",
        },
      ]}
    />
  );
}
