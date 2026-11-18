import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import { deleteCloudinaryAsset } from "@/lib/cloudinaryCleanup";
import { paragraphs, slugify, text } from "@/lib/collection-input";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const item = await prisma.newsItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const body = await req.json();
    const existing = await prisma.newsItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const slug = body.slug !== undefined ? slugify(text(body.slug)) : existing.slug;
    if (!slug) {
      return NextResponse.json({ success: false, error: "URL slug is required" }, { status: 400 });
    }
    if (slug !== existing.slug && (await prisma.newsItem.findUnique({ where: { slug } }))) {
      return NextResponse.json(
        { success: false, error: `Another article already uses the URL /news/${slug}` },
        { status: 409 },
      );
    }

    const img = body.img !== undefined ? text(body.img) : existing.img;
    const updated = await prisma.newsItem.update({
      where: { id },
      data: {
        title: body.title !== undefined ? text(body.title) : existing.title,
        slug,
        category: body.category !== undefined ? text(body.category) : existing.category,
        date: body.date !== undefined ? text(body.date) : existing.date,
        excerpt: body.excerpt !== undefined ? text(body.excerpt) : existing.excerpt,
        img,
        imgAlt: body.imgAlt !== undefined ? text(body.imgAlt) : existing.imgAlt,
        body: body.body !== undefined ? paragraphs(body.body) : (existing.body ?? []),
        metaTitle: body.metaTitle !== undefined ? text(body.metaTitle) || null : existing.metaTitle,
        metaDescription: body.metaDescription !== undefined ? text(body.metaDescription) || null : existing.metaDescription,
        order: typeof body.order === "number" ? body.order : existing.order,
      },
    });

    if (existing.img && existing.img !== img)
      deleteCloudinaryAsset(existing.img).catch(console.error);
    revalidateWebsite(WebsiteTag.news, WebsiteTag.page("home"));
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Update news error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update article" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const existing = await prisma.newsItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }
    await prisma.newsItem.delete({ where: { id } });
    if (existing.img) deleteCloudinaryAsset(existing.img).catch(console.error);

    revalidateWebsite(WebsiteTag.news, WebsiteTag.page("home"));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete news error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete article" },
      { status: 500 },
    );
  }
}
