"use client";

import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { usePageData } from "@/lib/useSectionEditor";
import { EventsHeroSection, UpcomingEventsSection, PastEventsSection } from "./components";

export default function EventsPageEditor() {
  const pageData = usePageData("events");

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="Events Page Sections"
        description="Manage the 3 live sections of this page, in website order: banner, upcoming events and past events (events come from the Events module)."
        badge="Calendar"
      />

      <EventsHeroSection initialData={pageData?.EventsHeroSection} />
      <UpcomingEventsSection initialData={pageData?.UpcomingEventsSection} />
      <PastEventsSection initialData={pageData?.PastEventsSection} />
    </section>
  );
}
