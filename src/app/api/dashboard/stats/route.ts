import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const [
      leadersCount,
      newsCount,
      eventsCount,
      submissionsCount,
      newSubmissionsCount,
      recentSubmissions,
    ] = await Promise.all([
      prisma.leader.count().catch(() => 0),
      prisma.newsItem.count().catch(() => 0),
      prisma.event.count().catch(() => 0),
      prisma.submission.count().catch(() => 0),
      prisma.submission.count({ where: { status: "New" } }).catch(() => 0),
      prisma.submission.findMany({ take: 6, orderBy: { createdAt: "desc" } }).catch(() => []),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        leadersCount,
        newsCount,
        eventsCount,
        submissionsCount,
        newSubmissionsCount,
        recentSubmissions,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
