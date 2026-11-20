"use client";

import React from "react";
import { ListSectionEditor } from "@/components/ListSectionEditor";

export function CategoriesSection({ initialData }: { initialData?: any }) {
  return (
    <ListSectionEditor
      slug="membership"
      section="CategoriesSection"
      title="3. Membership Categories"
      description="Membership tier cards, benefits, and fallback prompt card (also shown on Home)."
      label="Membership Categories"
      initialData={initialData}
      listKey="categories"
      listTitle="Categories"
      listHelper="The first card is outlined in saffron. Titles feed the enquiry form's category select."
      addLabel="Add Category"
      itemFields={[
        { key: "title", label: "Title", placeholder: "e.g. Card heading" },
        { key: "text", label: "Text", placeholder: "e.g. One or two sentences", multiline: true },
      ]}
      fieldsAfterList={[
        {
          key: "fallbackTitle",
          label: "Last Card Title",
          placeholder: "e.g. Prompt for unsure visitors",
        },
        {
          key: "fallbackCtaLabel",
          label: "Last Card Link Label",
          placeholder: "e.g. Enquiry link text",
        },
        { key: "fallbackCtaLink", label: "Last Card Link URL", placeholder: "e.g. #join" },
      ]}
    />
  );
}
