"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, CalendarDays, Edit2, MapPin, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { useCollection } from "@/lib/useCollection";

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  text: string;
  isPast: boolean;
  order: number;
}

export default function EventsPage() {
  const { items, loading, deleteId, setDeleteId, deleting, confirmDelete, move } =
    useCollection<EventItem>("/api/events", "event");

  const groups = [
    { label: "Upcoming events", list: items.filter((e) => !e.isPast) },
    { label: "Past events", list: items.filter((e) => e.isPast) },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <PageHeader
        title="Events"
        description="Conferences, meetings and workshops listed on /events. While a list is empty the website shows its empty-state message (edited under Pages › Events)."
        badge={`${items.length} events`}
        actions={
          <Link
            href="/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d4561b] text-white rounded-xl text-xs font-bold hover:bg-[#a8410f] transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </Link>
        }
      />

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Loading events...</div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-gray-500 text-sm">
            No events yet — the website currently shows its &quot;announced soon&quot; message.
          </p>
          <Link
            href="/events/create"
            className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-[#d4561b] text-white rounded-xl text-xs font-bold"
          >
            <Plus className="w-4 h-4" /> Add First Event
          </Link>
        </div>
      ) : (
        groups.map(({ label, list }) => (
          <section key={label} className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              {label} ({list.length})
            </h2>
            {list.length === 0 ? (
              <p className="text-xs text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 p-5">
                None — the website shows the empty-state message here.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((e, idx) => (
                  <div
                    key={e.id}
                    className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-semibold mb-2">
                        <CalendarDays className="w-3 h-3" />
                        <span>{e.date}</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 leading-snug">{e.title}</h3>
                      <p className="text-xs text-gray-500 mt-2 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span>{e.location}</span>
                      </p>
                      {e.text && <p className="text-xs text-gray-500 mt-3 line-clamp-3 leading-relaxed">{e.text}</p>}
                    </div>
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <span className="text-[11px] text-gray-400 font-medium">{e.isPast ? "Past" : "Upcoming"}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => move(list, idx, -1)}
                          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === list.length - 1}
                          onClick={() => move(list, idx, 1)}
                          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/events/edit/${e.id}`}
                          className="p-2 text-gray-500 hover:text-[#d4561b] hover:bg-white rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(e.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))
      )}

      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Event"
        message="Are you sure you want to delete this event? This cannot be undone."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
