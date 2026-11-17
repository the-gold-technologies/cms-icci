"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ActivityItem {
  text: string;
  time: string;
}

interface AdminRightSidebarProps {
  stats?: { newSubmissionsCount?: number } | null;
  loading?: boolean;
}

const timeAgo = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  const days = Math.round(mins / 1440);
  return days === 1 ? "Yesterday" : `${days} days ago`;
};

/** Same promo card + Recent Activity layout as lfcs-school-cms; activity = latest real CMS updates. */
export function AdminRightSidebar({ stats, loading }: AdminRightSidebarProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/news")
        .then((r) => r.json())
        .catch(() => null),
      fetch("/api/leaders")
        .then((r) => r.json())
        .catch(() => null),
      fetch("/api/events")
        .then((r) => r.json())
        .catch(() => null),
    ]).then(([news, leaders, events]) => {
      const items = [
        ...(news?.data || []).map((n: any) => ({
          text: `Article updated: ${n.title}`,
          at: n.updatedAt,
        })),
        ...(leaders?.data || []).map((l: any) => ({
          text: `Leader profile updated: ${l.name}`,
          at: l.updatedAt,
        })),
        ...(events?.data || []).map((e: any) => ({
          text: `Event updated: ${e.title}`,
          at: e.updatedAt,
        })),
      ]
        .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
        .slice(0, 4)
        .map((i) => ({ text: i.text, time: timeAgo(i.at) }));
      setActivities(items);
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Dark Promo Card */}
      <div className="bg-[#0B0F29] rounded-[2rem] p-7 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#d4561b]/40 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="flex items-center gap-2 font-bold tracking-tight text-white/90 mb-6">
          <div className="w-6 h-6 rounded-full bg-white text-[#0B0F29] flex items-center justify-center font-serif italic text-sm">
            IC
          </div>
          ICCI CMS Suite
        </div>

        <h2 className="text-[26px] font-black leading-[1.1] mb-3">
          Manage <br />
          Leaders & Members
        </h2>

        <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-[200px] mb-8">
          {loading
            ? "Checking new enquiries..."
            : `${stats?.newSubmissionsCount ?? 0} new membership & contact enquiries to review.`}
        </p>

        <Link
          href="/leaders"
          className="inline-block bg-[#d4561b] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white hover:text-[#d4561b] transition-colors transform hover:scale-105 shadow-[0_0_20px_rgba(212,86,27,0.4)] relative z-10"
        >
          View Leadership
        </Link>

        <div className="absolute -bottom-4 right-0 w-36 h-36 opacity-90 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Builder&backgroundColor=transparent"
            className="w-full h-full object-contain filter drop-shadow-2xl grayscale contrast-125"
            alt="illustration"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="font-bold text-lg text-[#0B0F29]">Recent Activity</h3>
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-gray-50 space-y-4">
          {activities.length === 0 ? (
            <p className="text-xs text-gray-400">No recent updates yet.</p>
          ) : (
            activities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#ee6a2c] mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 leading-snug">{activity.text}</p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">{activity.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
