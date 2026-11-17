import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import { text } from "@/lib/collection-input";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: event });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const body = await req.json();
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: body.title !== undefined ? text(body.title) : existing.title,
        date: body.date !== undefined ? text(body.date) : existing.date,
        location: body.location !== undefined ? text(body.location) : existing.location,
        text: body.text !== undefined ? text(body.text) : existing.text,
        isPast: body.isPast !== undefined ? Boolean(body.isPast) : existing.isPast,
        order: typeof body.order === "number" ? body.order : existing.order,
      },
    });
    revalidateWebsite(WebsiteTag.events, WebsiteTag.page("events"));
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Update event error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update event" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    revalidateWebsite(WebsiteTag.events, WebsiteTag.page("events"));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 });
  }
}
