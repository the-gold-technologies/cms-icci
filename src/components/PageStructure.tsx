"use client";

import Link from "next/link";
import { ArrowRight, Eye, Layout, BadgeCheck } from "lucide-react";

import { SITE_PAGES } from "@/lib/site-pages";

export function PageStructure() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg text-[#0B0F29]">ICCI Website Pages</h3>
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            Overview of static pages, layout editors, and section configurations.
          </p>
        </div>
        <Link
          href="/seo/pages"
          className="text-xs font-bold text-[#ee6a2c] hover:text-black flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-xl transition-all"
        >
          Manage SEO <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-gray-100 pb-2">
              <th className="pb-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                Page Name
              </th>
              <th className="pb-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                Route Path
              </th>
              <th className="pb-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                Status
              </th>
              <th className="pb-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                Sections Count
              </th>
              <th className="pb-3 font-bold text-gray-400 uppercase tracking-widest text-[10px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {SITE_PAGES.map((page) => (
              <tr key={page.slug} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3.5">
                  <Link href={page.editorUrl} className="flex items-center gap-3 group">
                    <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-[#ee6a2c]/10 group-hover:text-[#ee6a2c] transition-colors">
                      <Layout className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 group-hover:text-[#ee6a2c] transition-colors">
                        {page.title}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                        {page.type}
                      </span>
                    </div>
                  </Link>
                </td>
                <td className="py-3.5 font-mono text-xs text-gray-600 font-semibold">
                  {page.route}
                </td>
                <td className="py-3.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-600">
                    <BadgeCheck className="w-3 h-3" />
                    Public
                  </span>
                </td>
                <td className="py-3.5 font-bold text-gray-800">
                  {page.sections.length} content blocks
                </td>
                <td className="py-3.5 text-right">
                  <Link
                    href={page.editorUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-black font-semibold text-[11px] transition-all"
                  >
                    <Eye className="w-3 h-3" />
                    Edit Layout
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
