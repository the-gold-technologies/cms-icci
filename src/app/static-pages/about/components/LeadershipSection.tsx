"use client";

import React from "react";
import { Users } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function LeadershipSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="about"
      section="LeadershipSection"
      title="5. National Office Bearers (heading, intro + link)"
      description="Heading above the office bearer cards on the About page."
      label="Leadership"
      initialData={initialData}
      intro
      link
      managed={[
        {
          icon: Users,
          title: "Leader cards come from the Leadership module",
          text: "Office bearers are listed in their saved order. Photos, names and roles are edited there.",
          href: "/leaders",
          linkLabel: "Manage Leaders",
        },
      ]}
    />
  );
}
