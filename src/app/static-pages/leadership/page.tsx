"use client";

import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { usePageData } from "@/lib/useSectionEditor";
import {
  LeadershipHeroSection,
  RosterSection,
  PresidentSection,
  VicePresidentsSection,
  SecretariesSection,
  ExecutiveCommitteeSection,
} from "./components";

export default function LeadershipPageEditor() {
  const pageData = usePageData("leadership");

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Leadership Page Sections"
        description="Manage the 6 live sections of this page, in website order: banner, at-a-glance roster, President, Vice Presidents, Secretaries & Treasurer and the National Executive Committee (people come from the Leadership module)."
        badge="People"
      />

      <LeadershipHeroSection initialData={pageData?.LeadershipHeroSection} />
      <RosterSection initialData={pageData?.RosterSection} />
      <PresidentSection initialData={pageData?.PresidentSection} />
      <VicePresidentsSection initialData={pageData?.VicePresidentsSection} />
      <SecretariesSection initialData={pageData?.SecretariesSection} />
      <ExecutiveCommitteeSection initialData={pageData?.ExecutiveCommitteeSection} />
    </section>
  );
}
