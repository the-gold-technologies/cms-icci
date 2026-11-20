"use client";

import React from "react";
import { Newspaper } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function NewsBrowserSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="news-and-articles"
      section="NewsBrowserSection"
      title="2. News Browser & Community Sidebar"
      description="Labels for category filters, featured story badges, topic navigation, and the 'Have news to share?' callout card."
      label="News Browser"
      initialData={initialData}
      heading={false}
      extra={[
        { key: "allLabel", label: "'All' Filter Label", placeholder: "e.g. First filter chip" },
        {
          key: "latestBadge",
          label: "Lead Story Badge",
          placeholder: "e.g. Badge on the lead photo",
        },
        {
          key: "readFullStoryLabel",
          label: "Lead Story Link Label",
          placeholder: "e.g. Link under the lead story",
        },
        {
          key: "browseTitle",
          label: "Sidebar Topics Title",
          placeholder: "e.g. Title of the category list",
        },
        { key: "shareTitle", label: "Share Card Title", placeholder: "e.g. Dark card heading" },
        {
          key: "shareCtaLabel",
          label: "Share Card Link Label",
          placeholder: "e.g. Contact link text",
        },
        {
          key: "shareText",
          label: "Share Card Text",
          placeholder: "e.g. Invite members to send news",
          multiline: true,
        },
        { key: "shareCtaLink", label: "Share Card Link URL", placeholder: "e.g. /contact" },
      ]}
      managed={[
        {
          icon: Newspaper,
          title: "Articles and categories come from News & Articles",
          text: "Filter chips are built from the categories used by articles.",
          href: "/news",
          linkLabel: "Manage Articles",
        },
      ]}
    />
  );
}
