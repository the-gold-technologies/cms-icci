import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import { paragraphs, slugify, text } from "@/lib/collection-input";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const news = await prisma.newsItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();
    const title = text(body.title);
    const slug = slugify(text(body.slug) || title);
    const category = text(body.category);
    const date = text(body.date);
    const excerpt = text(body.excerpt);
    const img = text(body.img);

    if (!title || !slug || !category || !date || !excerpt || !img) {
      return NextResponse.json(
        { success: false, error: "Title, category, date, excerpt and photo are required" },
        { status: 400 },
      );
    }
    if (await prisma.newsItem.findUnique({ where: { slug } })) {
      return NextResponse.json(
        { success: false, error: `Another article already uses the URL /news/${slug}` },
        { status: 409 },
      );
    }

    const highest = await prisma.newsItem.aggregate({ _max: { order: true } });
    const item = await prisma.newsItem.create({
      data: {
        title,
        slug,
        category,
        date,
        excerpt,
        img,
        imgAlt: text(body.imgAlt),
        body: paragraphs(body.body),
        metaTitle: body.metaTitle !== undefined ? text(body.metaTitle) || null : null,
        metaDescription:
          body.metaDescription !== undefined ? text(body.metaDescription) || null : null,
        order: (highest._max.order ?? -1) + 1,
      },
    });

    revalidateWebsite(WebsiteTag.news, WebsiteTag.page("home"));
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error("Create news error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create article" },
      { status: 500 },
    );
  }
}
