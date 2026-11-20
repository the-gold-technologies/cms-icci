"use client";

import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { usePageData } from "@/lib/useSectionEditor";
import {
  MembershipHeroSection,
  WhyJoinSection,
  CategoriesSection,
  HowToJoinSection,
  MembershipEnquirySection,
} from "./components";

export default function MembershipPageEditor() {
  const pageData = usePageData("membership");

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Membership Page Sections"
        description="Manage the 5 content sections of the /membership page: hero banner, member benefits, categories, application steps, and the application form (also synchronized with Home)."
        badge="Join"
      />

      <MembershipHeroSection initialData={pageData?.MembershipHeroSection} />
      <WhyJoinSection initialData={pageData?.WhyJoinSection} />
      <CategoriesSection initialData={pageData?.CategoriesSection} />
      <HowToJoinSection initialData={pageData?.HowToJoinSection} />
      <MembershipEnquirySection initialData={pageData?.MembershipEnquirySection} />
    </section>
  );
}
