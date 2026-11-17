import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import { revalidateWebsite, WebsiteTag } from "@/lib/revalidateWebsite";
import { text } from "@/lib/collection-input";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: [{ isPast: "asc" }, { order: "asc" }] });
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error("Events fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const body = await req.json();
    const title = text(body.title);
    const date = text(body.date);
    const location = text(body.location);
    if (!title || !date || !location) {
      return NextResponse.json(
        { success: false, error: "Title, date and location are required" },
        { status: 400 },
      );
    }
    const highest = await prisma.event.aggregate({ _max: { order: true } });
    const event = await prisma.event.create({
      data: {
        title,
        date,
        location,
        text: text(body.text),
        isPast: Boolean(body.isPast),
        order: (highest._max.order ?? -1) + 1,
      },
    });
    revalidateWebsite(WebsiteTag.events, WebsiteTag.page("events"));
    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create event" },
      { status: 500 },
    );
  }
}
