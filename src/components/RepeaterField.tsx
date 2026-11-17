"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { CollapsibleCard } from "@/components/CollapsibleCard";

interface RepeaterFieldProps<T> {
  title: string;
  helperText?: string;
  addLabel: string;
  emptyText: string;
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  itemTitle: (item: T, index: number) => string;
  itemSubtitle?: (item: T, index: number) => string | undefined;
  itemThumbnail?: (item: T) => string | undefined;
  /** Renders the fields of one item; call `setItem` with the full updated item. */
  renderItem: (item: T, setItem: (next: T) => void, index: number) => React.ReactNode;
}

/**
 * Repeater block from .agents/rules/cms-ui-and-structure.md §6: uppercase title with count,
 * helper line, Expand/Collapse All, Add pill, dashed empty state and a CollapsibleCard per item
 * (with move up / move down, since list order is the website's display order).
 */
export function RepeaterField<T>({
  title,
  helperText,
  addLabel,
  emptyText,
  items,
  onChange,
  createItem,
  itemTitle,
  itemSubtitle,
  itemThumbnail,
  renderItem,
}: RepeaterFieldProps<T>) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const handleAdd = () => {
    onChange([...items, createItem()]);
    setOpenIndices((prev) => [...prev, items.length]);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setOpenIndices((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
  };

  const handleMove = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
    setOpenIndices((prev) => prev.map((i) => (i === index ? target : i === target ? index : i)));
  };

  const setItem = (index: number) => (next: T) => {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  };

  const allOpen = items.length > 0 && openIndices.length === items.length;

  return (
    <div className="border-t border-gray-100 pt-5 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
            {title} ({items.length})
          </h4>
          {helperText && <p className="text-[11px] text-gray-400 mt-0.5">{helperText}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => setOpenIndices(allOpen ? [] : items.map((_, i) => i))}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {allOpen ? "Collapse All" : "Expand All"}
            </button>
          )}
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ee6a2c] hover:text-[#0a192f] bg-[#ee6a2c]/10 hover:bg-[#ee6a2c]/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{addLabel}</span>
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div
          onClick={handleAdd}
          className="p-8 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center text-xs text-gray-400 cursor-pointer hover:bg-gray-100/70 hover:border-gray-300 transition-all flex flex-col items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5 text-gray-400" />
          <span>{emptyText}</span>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <CollapsibleCard
              key={idx}
              index={idx}
              title={itemTitle(item, idx)}
              subtitle={itemSubtitle?.(item, idx)}
              thumbnail={itemThumbnail?.(item)}
              isOpen={openIndices.includes(idx)}
              onToggle={() =>
                setOpenIndices((prev) =>
                  prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                )
              }
              onDelete={() => handleRemove(idx)}
              deleteTitle={`Delete ${addLabel.replace(/^Add\s+/i, "")}`}
              onMoveUp={idx > 0 ? () => handleMove(idx, -1) : undefined}
              onMoveDown={idx < items.length - 1 ? () => handleMove(idx, 1) : undefined}
            >
              {renderItem(item, setItem(idx), idx)}
            </CollapsibleCard>
          ))}
        </div>
      )}
    </div>
  );
}
