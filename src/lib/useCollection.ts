"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

/** List state for a collection module: load, delete (with confirm modal) and move up/down. */
export function useCollection<T extends { id: string; order: number }>(
  endpoint: string,
  noun: string,
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(endpoint);
      const json = await res.json();
      if (json.success) setItems(json.data || []);
      else toast.error(json.error || `Failed to load ${noun}s`);
    } catch {
      toast.error(`Failed to load ${noun}s`);
    } finally {
      setLoading(false);
    }
  }, [endpoint, noun]);

  useEffect(() => {
    load();
  }, [load]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${endpoint}/${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success(`${noun[0].toUpperCase()}${noun.slice(1)} deleted`);
        setItems((prev) => prev.filter((i) => i.id !== deleteId));
        setDeleteId(null);
      } else toast.error(json.error || `Failed to delete ${noun}`);
    } catch {
      toast.error("Delete operation failed");
    } finally {
      setDeleting(false);
    }
  };

  /** Swaps an item with its neighbour inside `group` (the list as displayed) and saves both orders. */
  const move = async (group: T[], index: number, dir: -1 | 1) => {
    const a = group[index];
    const b = group[index + dir];
    if (!a || !b) return;
    const [orderA, orderB] = a.order === b.order ? [b.order + dir, a.order] : [b.order, a.order];
    try {
      const results = await Promise.all(
        [
          [a.id, orderA],
          [b.id, orderB],
        ].map(([id, order]) =>
          fetch(`${endpoint}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order }),
          }).then((r) => r.json()),
        ),
      );
      if (results.every((r) => r.success)) {
        setItems((prev) =>
          prev
            .map((i) =>
              i.id === a.id ? { ...i, order: orderA } : i.id === b.id ? { ...i, order: orderB } : i,
            )
            .sort((x, y) => x.order - y.order),
        );
        toast.success("Order updated");
      } else toast.error("Failed to update order");
    } catch {
      toast.error("Failed to update order");
    }
  };

  return { items, loading, deleteId, setDeleteId, deleting, confirmDelete, move, reload: load };
}
