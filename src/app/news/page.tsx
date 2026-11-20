"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { CategoryManager } from "@/components/CategoryManager";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Edit2,
  ExternalLink,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCollection } from "@/lib/useCollection";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  img: string;
  excerpt: string;
  order: number;
}

const WEBSITE = (process.env.NEXT_PUBLIC_WEBSITE_URL || "").replace(/\/$/, "");

export default function NewsPage() {
  const { items, loading, deleteId, setDeleteId, deleting, confirmDelete, move } =
    useCollection<Article>("/api/news", "article");
  const [category, setCategory] = useState("All");
  const shown = category === "All" ? items : items.filter((n) => n.category === category);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <PageHeader
        title="News & Articles"
        description="Articles shown on /news and /news/[slug]. The first four (by order) appear on the home page; the first is featured."
        badge={`${items.length} articles`}
        actions={
          <Link
            href="/news/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ee6a2c] text-white rounded-xl text-sm font-semibold hover:bg-[#d4561b] transition-all shadow-md shadow-[#ee6a2c]/20 hover:shadow-lg active:scale-[0.99] whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Add Article</span>
          </Link>
        }
      />

      <CategoryManager
        type="news"
        activeCategory={category}
        onSelectCategory={setCategory}
        allowAll
      />

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Loading articles...</div>
      ) : shown.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-gray-500 text-sm">No articles here yet.</p>
          <Link
            href="/news/create"
            className="inline-flex items-center gap-2 px-6 py-3 mt-4 bg-[#ee6a2c] text-white rounded-xl text-sm font-semibold hover:bg-[#d4561b] transition-all shadow-md shadow-[#ee6a2c]/20 hover:shadow-lg active:scale-[0.99] whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} /> Add First Article
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((item, idx) => {
            const homeRank = items.findIndex((n) => n.id === item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full bg-gray-100 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.img} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-gray-800 shadow-xs">
                      {item.category}
                    </div>
                    {homeRank < 4 && (
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#ee6a2c] text-white flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-2.5 h-2.5" />{" "}
                        {homeRank === 0 ? "Home Featured" : "On Home"}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-semibold mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>
                    {WEBSITE && (
                      <a
                        href={`${WEBSITE}/news/${item.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#ee6a2c] font-semibold flex items-center gap-1 mt-4 hover:underline"
                      >
                        /news/{item.slug} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <span className="text-[11px] text-gray-400 font-medium">
                    {homeRank === 0 ? "Home featured" : homeRank < 4 ? "On home page" : "News page"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => move(shown, idx, -1)}
                      className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === shown.length - 1}
                      onClick={() => move(shown, idx, 1)}
                      className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/news/edit/${item.id}`}
                      className="p-2 text-gray-500 hover:text-[#d4561b] hover:bg-white rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Article"
        message="Are you sure you want to delete this article? Its /news link will stop working. This cannot be undone."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
