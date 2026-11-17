import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import { deleteCloudinaryAsset } from "@/lib/cloudinaryCleanup";
import { fraction, paragraphs, slugify, text } from "@/lib/collection-input";

type Params = { params: Promise<{ id: string }> };
const PAGES_SHOWING_LEADERS = ["home", "about", "leadership"].map(WebsiteTag.page);

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const leader = await prisma.leader.findUnique({ where: { id } });
    if (!leader)
      return NextResponse.json({ success: false, error: "Leader not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: leader });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch leader" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const body = await req.json();
    const existing = await prisma.leader.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ success: false, error: "Leader not found" }, { status: 404 });

    const slug = body.slug !== undefined ? slugify(text(body.slug)) : existing.slug;
    if (!slug)
      return NextResponse.json(
        { success: false, error: "Anchor slug is required" },
        { status: 400 },
      );
    if (slug !== existing.slug && (await prisma.leader.findUnique({ where: { slug } }))) {
      return NextResponse.json(
        { success: false, error: `Another leader already uses the anchor #${slug}` },
        { status: 409 },
      );
    }

    const photo = body.photo !== undefined ? text(body.photo) : existing.photo;
    const updated = await prisma.leader.update({
      where: { id },
      data: {
        slug,
        name: body.name !== undefined ? text(body.name) : existing.name,
        role: body.role !== undefined ? text(body.role) : existing.role,
        tier:
          body.tier !== undefined
            ? body.tier === "executive"
              ? "executive"
              : "office-bearer"
            : existing.tier,
        org: body.org !== undefined ? text(body.org) : existing.org,
        photo,
        photoAlt: body.photoAlt !== undefined ? text(body.photoAlt) : existing.photoAlt,
        faceX: body.faceX !== undefined ? fraction(body.faceX, existing.faceX) : existing.faceX,
        faceY: body.faceY !== undefined ? fraction(body.faceY, existing.faceY) : existing.faceY,
        bio: body.bio !== undefined ? paragraphs(body.bio) : (existing.bio ?? []),
        order: typeof body.order === "number" ? body.order : existing.order,
      },
    });

    if (existing.photo && existing.photo !== photo)
      deleteCloudinaryAsset(existing.photo).catch(console.error);
    revalidateWebsite(WebsiteTag.leaders, ...PAGES_SHOWING_LEADERS);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Update leader error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update leader" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const existing = await prisma.leader.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ success: false, error: "Leader not found" }, { status: 404 });
    await prisma.leader.delete({ where: { id } });
    if (existing.photo) deleteCloudinaryAsset(existing.photo).catch(console.error);

    revalidateWebsite(WebsiteTag.leaders, ...PAGES_SHOWING_LEADERS);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete leader error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete leader" }, { status: 500 });
  }
}
