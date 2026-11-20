"use client";

import React from "react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function ArticlePageSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="news-and-articles"
      section="ArticlePageSection"
      title="3. Article Reading Page Template"
      description="Labels for the single article reader view (/news/[slug]), including back link and related news header."
      label="Article Page"
      initialData={initialData}
      heading={false}
      extra={[
        { key: "backLabel", label: "Back Link Label", placeholder: "e.g. Link back to all news" },
        { key: "backLink", label: "Back Link URL", placeholder: "e.g. /news" },
        {
          key: "moreTitle",
          label: "'More News' Heading",
          placeholder: "e.g. Heading above three more stories",
        },
      ]}
    />
  );
}
