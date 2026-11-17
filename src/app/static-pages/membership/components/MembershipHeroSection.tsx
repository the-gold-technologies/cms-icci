"use client";

import React from "react";
import { BannerSectionEditor } from "@/components/BannerSectionEditor";

export function MembershipHeroSection({ initialData }: { initialData?: any }) {
  return (
    <BannerSectionEditor
      slug="membership"
      section="MembershipHeroSection"
      number={1}
      pageName="Membership"
      initialData={initialData}
    />
  );
}
