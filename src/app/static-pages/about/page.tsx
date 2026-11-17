"use client";

import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { usePageData } from "@/lib/useSectionEditor";
import {
  AboutHeroSection,
  AboutUsSection,
  FocusAreasSection,
  MissionVisionSection,
  LeadershipSection,
  ChaptersSection,
} from "./components";

export default function AboutPageEditor() {
  const pageData = usePageData("about");

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="About Page Sections"
        description="Manage the 6 live sections of this page, in website order: banner, about us, focus areas, mission & vision, national office bearers and state chapters."
        badge="Institutional"
      />

      <AboutHeroSection initialData={pageData?.AboutHeroSection} />
      <AboutUsSection initialData={pageData?.AboutUsSection} />
      <FocusAreasSection initialData={pageData?.FocusAreasSection} />
      <MissionVisionSection initialData={pageData?.MissionVisionSection} />
      <LeadershipSection initialData={pageData?.LeadershipSection} />
      <ChaptersSection initialData={pageData?.ChaptersSection} />
    </section>
  );
}
