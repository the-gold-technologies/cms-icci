import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SITE_PAGES, canonicalFor } from "@/lib/site-pages";

export const dynamic = "force-dynamic";

const CORE_PAGES = SITE_PAGES.filter((p) => p.slug !== "home").map((p) => ({
  slug: p.slug,
  title: p.title,
  type: p.type,
  metaTitle: p.metaTitle,
  metaDescription: p.metaDescription,
  targetKeywords: "",
  canonicalUrl: canonicalFor(p.route),
  schema: p.schema || null,
}));

export async function GET() {
  try {
    // Upsert the core pages with complete metadata if missing
    for (const core of CORE_PAGES) {
      const existing = await prisma.page.findUnique({
        where: { slug: core.slug },
      });

      if (!existing) {
        await prisma.page.create({
          data: {
            slug: core.slug,
            title: core.title,
            type: core.type,
            metaTitle: core.metaTitle,
            metaDescription: core.metaDescription,
            targetKeywords: core.targetKeywords,
            canonicalUrl: core.canonicalUrl,
            schema: core.schema,
            visibility: "published",
          },
        });
      } else {
        await prisma.page.update({
          where: { slug: core.slug },
          data: {
            title: existing.title || core.title,
            type: existing.type || core.type,
            metaTitle: existing.metaTitle || core.metaTitle,
            metaDescription: existing.metaDescription || core.metaDescription,
            targetKeywords: existing.targetKeywords || core.targetKeywords,
            canonicalUrl: existing.canonicalUrl || core.canonicalUrl,
            schema: existing.schema || core.schema,
          },
        });
      }
    }

    const pages = await prisma.page.findMany({
      where: {
        slug: {
          not: "home",
        },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        metaTitle: true,
        metaDescription: true,
        targetKeywords: true,
        canonicalUrl: true,
        type: true,
        visibility: true,
        noIndex: true,
      },
    });

    const orderMap: Record<string, number> = {};
    CORE_PAGES.forEach((item, index) => {
      orderMap[item.slug] = index + 1;
    });

    const orderedPages = pages
      .map((p) => ({
        ...p,
        order: orderMap[p.slug] || 99,
        parent: "-",
      }))
      .sort((a, b) => a.order - b.order);

    return NextResponse.json({ success: true, data: orderedPages });
  } catch (error: any) {
    console.error("Error fetching SEO pages:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
