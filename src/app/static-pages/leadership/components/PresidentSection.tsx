"use client";

import React from "react";
import { Users } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function PresidentSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="leadership"
      section="PresidentSection"
      title="3. National President Tier"
      description="Tier badge, title, and profile button label for the National President section."
      label="National President"
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
      extra={[
        {
          key: "readProfileLabel",
          label: "'Read Profile' Button Label",
          placeholder: "e.g. Opens the full bio (used on every card)",
        },
      ]}
    />
  );
}
