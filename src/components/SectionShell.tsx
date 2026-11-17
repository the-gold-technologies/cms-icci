import React from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { SaveButton } from "@/components/SaveButton";

/**
 * Outer card of a section editor: SectionHeader + collapsible body + sticky full-width SaveButton
 * (.agents/rules/cms-ui-and-structure.md §6 / §8).
 */
export function SectionShell({
  title,
  description,
  isOpen,
  onToggle,
  onSave,
  loading,
  saved,
  children,
}: {
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
  onSave: () => void;
  loading: boolean;
  saved: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6">
      <SectionHeader
        title={title}
        description={description}
        badge="Live Section"
        isOpen={isOpen}
        onToggle={onToggle}
      />
      {isOpen && (
        <div className="space-y-6 pt-2">
          {children}
          <div className="sticky bottom-4 z-20 pt-3 pb-1 bg-white/95 backdrop-blur-md border-t border-gray-100 w-full rounded-b-2xl">
            <SaveButton onClick={onSave} loading={loading} saved={saved} />
          </div>
        </div>
      )}
    </div>
  );
}
