"use client";

import React from "react";
import { Users } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function VicePresidentsSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="leadership"
      section="VicePresidentsSection"
      title="4. National Vice Presidents Tier"
      description="Tier badge and title for the National Vice Presidents section."
      label="Vice Presidents"
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
