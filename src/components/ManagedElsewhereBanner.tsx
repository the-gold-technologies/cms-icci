import React from "react";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

/**
 * Info banner for data a section shows but that is edited in another module
 * (.agents/rules/cms-ui-and-structure.md §6 — "Data managed elsewhere").
 */
export function ManagedElsewhereBanner({
  icon: Icon,
  title,
  text,
  href,
  linkLabel,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[#ee6a2c] text-white shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-800">{title}</p>
          <p className="text-[11px] text-gray-500">{text}</p>
        </div>
      </div>
      <Link
        href={href}
        className="px-4 py-2 bg-white text-[#ee6a2c] text-xs font-bold rounded-xl border border-orange-200 hover:bg-orange-50 transition-all flex items-center gap-1.5 shrink-0 w-fit"
      >
        {linkLabel} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
