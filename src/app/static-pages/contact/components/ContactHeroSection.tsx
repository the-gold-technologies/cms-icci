"use client";

import React from "react";
import { BannerSectionEditor } from "@/components/BannerSectionEditor";

export function ContactHeroSection({ initialData }: { initialData?: any }) {
  return (
    <BannerSectionEditor
      slug="contact"
      section="ContactHeroSection"
      number={1}
      pageName="Contact"
      initialData={initialData}
    />
  );
}
