"use client";

import React from "react";
import { CalendarDays } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function UpcomingEventsSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="events"
      section="UpcomingEventsSection"
      title="2. Upcoming Events"
      description="Heading and empty-state message for upcoming events."
      label="Upcoming Events"
      initialData={initialData}
      extra={[
        {
          key: "emptyText",
          label: "Empty State Message",
          placeholder: "e.g. Shown while there are no events",
          multiline: true,
        },
        {
          key: "emptyCtaLabel",
          label: "Empty State Link Label",
          placeholder: "e.g. Contact link text",
        },
        { key: "emptyCtaLink", label: "Empty State Link URL", placeholder: "e.g. /contact" },
      ]}
      managed={[
        {
          icon: CalendarDays,
          title: "Events come from the Events module",
          text: "Mark an event as past to move it to the Past events list.",
          href: "/events",
          linkLabel: "Manage Events",
        },
      ]}
    />
  );
}
