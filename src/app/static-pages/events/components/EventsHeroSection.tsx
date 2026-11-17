"use client";

import React from "react";
import { BannerSectionEditor } from "@/components/BannerSectionEditor";

export function EventsHeroSection({ initialData }: { initialData?: any }) {
  return (
    <BannerSectionEditor
      slug="events"
      section="EventsHeroSection"
      number={1}
      pageName="Events"
      initialData={initialData}
    />
  );
}
