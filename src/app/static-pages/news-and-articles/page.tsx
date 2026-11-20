"use client";

import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { usePageData } from "@/lib/useSectionEditor";
import { NewsHeroSection, NewsBrowserSection, ArticlePageSection } from "./components";

export default function NewsPageEditor() {
  const pageData = usePageData("news-and-articles");

  return (
    <section className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        title="News & Articles Page Sections"
        description="Manage the 3 content sections of the /news page: hero banner, news browser & sidebar, and the article reader template."
        badge="Media"
      />

      <NewsHeroSection initialData={pageData?.NewsHeroSection} />
      <NewsBrowserSection initialData={pageData?.NewsBrowserSection} />
      <ArticlePageSection initialData={pageData?.ArticlePageSection} />
    </section>
  );
}
