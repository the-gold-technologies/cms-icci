import { checkAdminSession } from "@/lib/auth-check";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import { DEFAULT_NAV_LINKS } from "@/lib/nav-defaults";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const links = await prisma.navLink.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: links });
  } catch (error: any) {
    console.error("Error fetching nav links:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch nav links" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const body = await request.json();
    const { label, url, type, parent, description, image, order } = body;

    if (!label || !url) {
      return NextResponse.json(
        { success: false, error: "Label and URL are required" },
        { status: 400 },
      );
    }

    const created = await prisma.navLink.create({
      data: {
        label,
        url,
        type: type || (parent && parent !== "-" ? "Dropdown Item" : "Main Link"),
        parent: parent || "-",
        description: description || null,
        image: image || null,
        order: typeof order === "number" ? order : 0,
      },
    });

    revalidateWebsite(WebsiteTag.site);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("Error creating nav link:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create link" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const body = await request.json();

    // Check if sync default action requested
    if (body.action === "sync_default") {
      await prisma.navLink.deleteMany();
      for (const item of DEFAULT_NAV_LINKS) {
        await prisma.navLink.create({
          data: {
            id: item.id,
            label: item.label,
            url: item.url,
            type: item.type,
            parent: item.parent,
            description: item.description ?? null,
            image: item.image ?? null,
            order: item.order,
          },
        });
      }
      const links = await prisma.navLink.findMany({ orderBy: { order: "asc" } });
      revalidateWebsite(WebsiteTag.site);
      return NextResponse.json({ success: true, data: links });
    }

    // Single link update
    if (body.id) {
      const { id, label, url, type, parent, description, image, order } = body;
      const updated = await prisma.navLink.update({
        where: { id },
        data: {
          label: label !== undefined ? label : undefined,
          url: url !== undefined ? url : undefined,
          type: type !== undefined ? type : undefined,
          parent: parent !== undefined ? parent : undefined,
          description: description !== undefined ? description : undefined,
          image: image !== undefined ? image : undefined,
          order: order !== undefined ? order : undefined,
        },
      });
      revalidateWebsite(WebsiteTag.site);
      return NextResponse.json({ success: true, data: updated });
    }

    // Bulk links array update
    if (Array.isArray(body.links)) {
      for (const item of body.links) {
        if (!item.id) continue;
        await prisma.navLink.update({
          where: { id: item.id },
          data: {
            label: item.label,
            url: item.url,
            type: item.type,
            parent: item.parent,
            description: item.description,
            image: item.image,
            order: item.order,
          },
        });
      }
      const all = await prisma.navLink.findMany({ orderBy: { order: "asc" } });
      revalidateWebsite(WebsiteTag.site);
      return NextResponse.json({ success: true, data: all });
    }

    return NextResponse.json({ success: false, error: "Invalid update payload" }, { status: 400 });
  } catch (error: any) {
    console.error("Error updating nav links:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update link" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) {
      return authCheck.response;
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id parameter is required" },
        { status: 400 },
      );
    }

    // Delete child links if any
    await prisma.navLink.deleteMany({ where: { parent: id } });
    await prisma.navLink.delete({ where: { id } });

    revalidateWebsite(WebsiteTag.site);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting nav link:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete link" },
      { status: 500 },
    );
  }
}
