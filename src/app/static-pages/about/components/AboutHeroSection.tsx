"use client";

import React from "react";
import { BannerSectionEditor } from "@/components/BannerSectionEditor";

export function AboutHeroSection({ initialData }: { initialData?: any }) {
  return (
    <BannerSectionEditor
      slug="about"
      section="AboutHeroSection"
      number={1}
      pageName="About"
      initialData={initialData}
    />
  );
}
