"use client";

import React from "react";
import { BadgeCheck } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function MembershipSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="home"
      section="MembershipSection"
      title="8. Membership Overview & Benefits"
      description="Eyebrow tag, heading, intro text, categories link, and benefits heading. Categories and benefits are synchronized with Pages › Membership."
      label="Membership"
      initialData={initialData}
      intro
      link
      extra={[
        {
          key: "benefitsHeading",
          label: "Benefits Heading",
          placeholder: "e.g. Heading above the tick list",
        },
      ]}
      managed={[
        {
          icon: BadgeCheck,
          title: "Categories and benefits are shared with the Membership page",
          text: "Edit them once under Membership › Categories and Membership › Why Join.",
          href: "/static-pages/membership",
          linkLabel: "Manage Membership Lists",
        },
      ]}
    />
  );
}
