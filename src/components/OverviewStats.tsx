"use client";

import Link from "next/link";
import { BookOpen, MessageSquare, Users, Newspaper, type LucideIcon } from "lucide-react";
import { FORM_TYPES, SITE_PAGES } from "@/lib/site-pages";

interface OverviewStatsProps {
  stats?: {
    leadersCount?: number;
    newsCount?: number;
    eventsCount?: number;
    submissionsCount?: number;
    newSubmissionsCount?: number;
  } | null;
  loading?: boolean;
}

interface Card {
  title: string;
  sub: string;
  icon: LucideIcon;
  tone: string;
  meta: { label: string; value: string; green?: boolean }[];
}

/** Same 2×2 card layout as lfcs-school-cms, filled with ICCI figures. */
export function OverviewStats({ stats, loading = false }: OverviewStatsProps) {
  const n = (v?: number) => (loading ? "..." : String(v ?? 0));
  const cards: Card[] = [
    {
      title: "Active Pages",
      sub: `${SITE_PAGES.length} Published Pages`,
      icon: BookOpen,
      tone: "bg-[#f0f9ff] text-[#0ea5e9]",
      meta: [
        { label: "Status", value: "Online" },
        { label: "CMS Access", value: "Editable" },
      ],
    },
    {
      title: "Total Enquiries",
      sub: loading ? "..." : `${n(stats?.submissionsCount)} Enquiries Recorded`,
      icon: MessageSquare,
      tone: "bg-[#d1fadf] text-[#12b76a]",
      meta: [
        { label: "Forms", value: `${FORM_TYPES.length} Enquiry Types` },
        { label: "New", value: `${n(stats?.newSubmissionsCount)} Awaiting Reply`, green: true },
      ],
    },
    {
      title: "Leadership",
      sub: loading ? "..." : `${n(stats?.leadersCount)} Leaders Listed`,
      icon: Users,
      tone: "bg-[#fef3f2] text-[#f04438]",
      meta: [
        { label: "Tiers", value: "Office Bearers, NEC" },
        { label: "Media", value: "Cloudinary CDN" },
      ],
    },
    {
      title: "News & Events",
      sub: loading ? "..." : `${n(stats?.newsCount)} Articles`,
      icon: Newspaper,
      tone: "bg-[#fdf2fa] text-[#c11574]",
      meta: [
        { label: "Events", value: `${n(stats?.eventsCount)} Listed` },
        { label: "Revalidation", value: "Instant ISR", green: true },
      ],
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#0B0F29]">Overview Stats</h2>
        <Link
          href="/submissions/membership"
          className="text-sm font-semibold text-gray-500 hover:text-[#0B0F29] underline decoration-gray-300 underline-offset-4 transition-colors"
        >
          View All Enquiries
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map((c) => (
          <div
            key={c.title}
            className="bg-white rounded-3xl p-5 shadow-sm ring-1 ring-gray-50 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${c.tone}`}>
                <c.icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-bold text-[#0B0F29] text-[15px]">{c.title}</h3>
                <p className="text-[13px] font-medium text-gray-400 mt-0.5">{c.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50">
              {c.meta.map((m) => (
                <div key={m.label}>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {m.label}
                  </p>
                  <p className={`text-[13px] font-bold ${m.green ? "text-[#12b76a]" : "text-[#0B0F29]"}`}>
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
