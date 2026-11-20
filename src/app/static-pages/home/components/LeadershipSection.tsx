"use client";

import React from "react";
import { Users } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function LeadershipSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="home"
      section="LeadershipSection"
      title="7. Leadership Preview (National Office Bearers)"
      description="Eyebrow tag, heading, intro text, and 'Meet the full leadership' link. Leader cards are managed under Leadership."
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
