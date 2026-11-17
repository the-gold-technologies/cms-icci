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
        description="Manage the 4 live sections of this page, in website order: banner, key initiatives, objectives and who we represent (these lists also feed the home page)."
        badge="Programmes"
      />

      <InitiativesHeroSection initialData={pageData?.InitiativesHeroSection} />
      <KeyInitiativesSection initialData={pageData?.KeyInitiativesSection} />
      <ObjectivesSection initialData={pageData?.ObjectivesSection} />
      <WhoWeRepresentSection initialData={pageData?.WhoWeRepresentSection} />
    </section>
  );
}
