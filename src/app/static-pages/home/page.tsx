"use client";

import React from "react";
import { UserPlus } from "lucide-react";
import { ManagedElsewhereBanner } from "@/components/ManagedElsewhereBanner";
import { PageHeader } from "@/components/PageHeader";
import { usePageData } from "@/lib/useSectionEditor";
import {
  HeroSection,
  HighlightsSection,
  AboutSection,
  ObjectivesSection,
  RepresentationSection,
  InitiativesSection,
  LeadershipSection,
  MembershipSection,
  NewsSection,
} from "./components";

export default function HomePageEditor() {
  const pageData = usePageData("home");

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Home Page Sections"
        description="Manage the 10 live sections of this page, in website order: hero carousel, highlights strip, about the Chamber, objectives, industry representation, key initiatives, national office bearers, membership, latest news, plus the shared membership enquiry block."
        badge="Main Landing Page"
      />

      <HeroSection initialData={pageData?.HeroSection} />
      <HighlightsSection initialData={pageData?.HighlightsSection} />
      <AboutSection initialData={pageData?.AboutSection} />
      <ObjectivesSection initialData={pageData?.ObjectivesSection} />
      <RepresentationSection initialData={pageData?.RepresentationSection} />
      <InitiativesSection initialData={pageData?.InitiativesSection} />
      <LeadershipSection initialData={pageData?.LeadershipSection} />
      <MembershipSection initialData={pageData?.MembershipSection} />
      <NewsSection initialData={pageData?.NewsSection} />
      <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100">
        <ManagedElsewhereBanner
          icon={UserPlus}
          title="10. Membership Enquiry (#join) is shared with the Membership page"
          text="The eligibility note and enquiry form at the bottom of the home page are edited once under Membership."
          href="/static-pages/membership"
          linkLabel="Edit Membership Enquiry"
        />
      </div>
    </section>
  );
}
