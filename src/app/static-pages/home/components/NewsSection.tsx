"use client";

import React from "react";
import { Newspaper } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function NewsSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="home"
      section="NewsSection"
      title="9. Latest News (heading + links)"
      description="Featured story plus three compact stories (first four articles by order)."
      label="News"
      initialData={initialData}
      link
      extra={[
        { key: "readMoreLabel", label: "Featured Story Link Label", placeholder: "e.g. Text on the featured card" },
      ]}
      managed={[
        {
          icon: Newspaper,
          title: "Stories come from News & Articles",
          text: "The first four articles (by order) appear here; the first one is featured.",
          href: "/news",
          linkLabel: "Manage Articles",
        },
      ]}
    />
  );
}
