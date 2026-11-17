"use client";

import React from "react";
import { BannerSectionEditor } from "@/components/BannerSectionEditor";

export function NewsHeroSection({ initialData }: { initialData?: any }) {
  return (
    <BannerSectionEditor
      slug="news-and-articles"
      section="NewsHeroSection"
      number={1}
      pageName="News & Articles"
      initialData={initialData}
    />
  );
}
