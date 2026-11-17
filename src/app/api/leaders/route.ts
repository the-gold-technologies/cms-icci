import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import { fraction, paragraphs, slugify, text } from "@/lib/collection-input";

export const dynamic = "force-dynamic";

const PAGES_SHOWING_LEADERS = ["home", "about", "leadership"].map(WebsiteTag.page);

export async function GET() {
  try {
    const leaders = await prisma.leader.findMany({ orderBy: [{ tier: "desc" }, { order: "asc" }] });
    return NextResponse.json({ success: true, data: leaders });
  } catch (error) {
    console.error("Leaders fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch leaders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();
    const name = text(body.name);
    const role = text(body.role);
    const tier = text(body.tier) || "office-bearer";
    const slug = slugify(text(body.slug) || name);
    if (!name || !role || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and role are required" },
        { status: 400 },
      );
    }
    if (await prisma.leader.findUnique({ where: { slug } })) {
      return NextResponse.json(
        { success: false, error: `Another leader already uses the anchor #${slug}` },
        { status: 409 },
      );
    }

    const highest = await prisma.leader.aggregate({ where: { tier }, _max: { order: true } });
    const leader = await prisma.leader.create({
      data: {
        slug,
        name,
        role,
        tier,
        org: text(body.org),
        photo: text(body.photo),
        photoAlt: text(body.photoAlt),
        faceX: fraction(body.faceX, 0.5),
        faceY: fraction(body.faceY, 0.4),
        bio: paragraphs(body.bio),
        order: (highest._max.order ?? -1) + 1,
      },
    });

    revalidateWebsite(WebsiteTag.leaders, ...PAGES_SHOWING_LEADERS);
    return NextResponse.json({ success: true, data: leader });
  } catch (error: any) {
    console.error("Create leader error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create leader" },
      { status: 500 },
    );
  }
}
