"use client";

import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { usePageData } from "@/lib/useSectionEditor";
import {
  InitiativesHeroSection,
  KeyInitiativesSection,
  ObjectivesSection,
  WhoWeRepresentSection,
} from "./components";

export default function InitiativesPageEditor() {
  const pageData = usePageData("initiatives");

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Initiatives Page Sections"
        description="Manage the 4 content sections of the /initiatives page: hero banner, key initiatives pillars, Chamber objectives, and industry representation (also synchronized with Home)."
        badge="Programmes"
      />

      <InitiativesHeroSection initialData={pageData?.InitiativesHeroSection} />
      <KeyInitiativesSection initialData={pageData?.KeyInitiativesSection} />
      <ObjectivesSection initialData={pageData?.ObjectivesSection} />
      <WhoWeRepresentSection initialData={pageData?.WhoWeRepresentSection} />
    </section>
  );
}
