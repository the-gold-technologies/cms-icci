"use client";

import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { usePageData } from "@/lib/useSectionEditor";
import { ContactHeroSection, ContactDetailsSection, ContactFormSection } from "./components";

export default function ContactPageEditor() {
  const pageData = usePageData("contact");

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Contact Page Sections"
        description="Manage the 3 content sections of the /contact page: hero banner, secretariat contact details & map, and the general contact enquiry form."
        badge="Enquiry"
      />

      <ContactHeroSection initialData={pageData?.ContactHeroSection} />
      <ContactDetailsSection initialData={pageData?.ContactDetailsSection} />
      <ContactFormSection initialData={pageData?.ContactFormSection} />
    </section>
  );
}
