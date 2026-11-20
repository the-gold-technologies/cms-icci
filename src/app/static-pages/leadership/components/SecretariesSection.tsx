"use client";

import React from "react";
import { Users } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function SecretariesSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="leadership"
      section="SecretariesSection"
      title="5. Secretariat & Treasurer Tier"
      description="Tier badge and title for the General Secretary, Joint Secretary, and Treasurer section."
      label="Secretaries & Treasurer"
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
