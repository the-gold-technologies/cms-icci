"use client";

import React from "react";
import { Newspaper } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function NewsSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="home"
      section="NewsSection"
      title="9. Latest News & Updates"
      description="Eyebrow tag, heading, and 'View all news' link. Featured stories and recent posts are managed under News & Articles."
      label="News"
      initialData={initialData}
      link
      extra={[
        {
          key: "readMoreLabel",
          label: "Featured Story Link Label",
          placeholder: "e.g. Text on the featured card",
        },
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
