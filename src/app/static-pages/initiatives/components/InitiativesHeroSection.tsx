"use client";

import React from "react";
import { BannerSectionEditor } from "@/components/BannerSectionEditor";

export function InitiativesHeroSection({ initialData }: { initialData?: any }) {
  return (
    <BannerSectionEditor
      slug="initiatives"
      section="InitiativesHeroSection"
      number={1}
      pageName="Initiatives"
      initialData={initialData}
    />
  );
}
