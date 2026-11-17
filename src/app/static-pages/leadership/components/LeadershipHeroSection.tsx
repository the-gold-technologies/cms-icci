"use client";

import React from "react";
import { BannerSectionEditor } from "@/components/BannerSectionEditor";

export function LeadershipHeroSection({ initialData }: { initialData?: any }) {
  return (
    <BannerSectionEditor
      slug="leadership"
      section="LeadershipHeroSection"
      number={1}
      pageName="Leadership"
      initialData={initialData}
    />
  );
}
