"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, Edit2, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { useCollection } from "@/lib/useCollection";
import { LEADER_TIERS } from "@/lib/site-pages";

interface Leader {
  id: string;
  slug: string;
  name: string;
  role: string;
  org: string | null;
  photo: string | null;
  faceX: number;
  faceY: number;
  bio: string[];
  tier: string;
  order: number;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

export default function LeadersPage() {
  const { items, loading, deleteId, setDeleteId, deleting, confirmDelete, move } =
    useCollection<Leader>("/api/leaders", "leader");

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <PageHeader
        title="Leadership"
        description="Office bearers appear on the home, About and Leadership pages; the National Executive Committee on the Leadership page. Order here = order on the website."
        badge={`${items.length} people`}
        actions={
          <Link
            href="/leaders/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d4561b] text-white rounded-xl text-xs font-bold hover:bg-[#a8410f] transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Leader</span>
          </Link>
        }
      />

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Loading leaders...</div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-gray-500 text-sm">No leaders added yet.</p>
          <Link
            href="/leaders/create"
            className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-[#d4561b] text-white rounded-xl text-xs font-bold"
          >
            <Plus className="w-4 h-4" /> Add First Leader
          </Link>
        </div>
      ) : (
        (() => {
          const knownTierKeys = LEADER_TIERS.map((t) => t.key) as string[];
          const allTiers: { key: string; label: string }[] = [
            ...LEADER_TIERS,
            ...Array.from(new Set(items.map((l) => l.tier)))
              .filter((k): k is string => Boolean(k) && !knownTierKeys.includes(k))
              .map((k) => ({
                key: k,
                label: k
                  .split(/[-_\s]+/)
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" "),
              })),
          ];

          return allTiers.map((tier) => {
            const group = items.filter((l) => l.tier === tier.key).sort((a, b) => a.order - b.order);
            if (group.length === 0) return null;
            return (
              <section key={tier.key} className="flex flex-col gap-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  {tier.label} ({group.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.map((l, idx) => (
                    <div
                      key={l.id}
                      className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-44 w-full bg-gray-100 relative overflow-hidden">
                          {l.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={l.photo}
                              alt={l.name}
                              className="w-full h-full object-cover"
                              style={{ objectPosition: `${l.faceX * 100}% ${l.faceY * 100}%` }}
                            />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-4xl font-bold text-gray-300">
                              {initials(l.name)}
                            </div>
                          )}
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-gray-800 shadow-xs">
                            {l.role.replace(/^National /, "")}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-base font-bold text-gray-900 leading-snug">{l.name}</h3>
                          {l.org && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{l.org}</p>
                          )}
                          <p className="text-[11px] text-[#d4561b] font-semibold mt-3">#{l.slug}</p>
                        </div>
                      </div>
                      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <span className="text-[11px] text-gray-400 font-medium">
                          {l.bio?.length ? `${l.bio.length} bio paragraph(s)` : "No bio"}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => move(group, idx, -1)}
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                            title="Move up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === group.length - 1}
                            onClick={() => move(group, idx, 1)}
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                            title="Move down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/leaders/edit/${l.id}`}
                            className="p-2 text-gray-500 hover:text-[#d4561b] hover:bg-white rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteId(l.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          });
        })()
      )}

      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Leader"
        message="Are you sure you want to remove this person from the website? This cannot be undone."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
