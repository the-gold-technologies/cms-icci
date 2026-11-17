"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { SectionShell } from "@/components/SectionShell";
import { HeadingFields } from "@/components/HeadingFields";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { RepeaterField } from "@/components/RepeaterField";
import { ManagedElsewhereBanner } from "@/components/ManagedElsewhereBanner";
import { useSectionEditor, str, strList, objList } from "@/lib/useSectionEditor";

export interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  helperText?: string;
}

/**
 * Section = heading (tagline + headline) + optional extra fields + one repeater.
 * `itemFields` → array of objects; omit it for a plain string list.
 * The key list is fully defined by the config, so load and save always cover the same keys.
 */
export function ListSectionEditor({
  slug,
  section,
  title,
  description,
  label,
  initialData,
  heading = true,
  fields = [],
  fieldsAfterList = [],
  listKey,
  listTitle,
  listHelper,
  addLabel,
  itemFields,
  itemPlaceholder = "e.g. List item text",
  managed,
}: {
  slug: string;
  section: string;
  title: string;
  description: string;
  label: string;
  initialData?: any;
  heading?: boolean;
  fields?: FieldDef[];
  fieldsAfterList?: FieldDef[];
  listKey: string;
  listTitle: string;
  listHelper?: string;
  addLabel: string;
  itemFields?: FieldDef[];
  itemPlaceholder?: string;
  managed?: { icon: LucideIcon; title: string; text: string; href: string; linkLabel: string };
}) {
  const normalize = (d: any = {}) => {
    const out: Record<string, unknown> = {};
    if (heading) {
      out.tagline = str(d.tagline);
      out.headline = str(d.headline);
    }
    for (const f of [...fields, ...fieldsAfterList]) out[f.key] = str(d[f.key]);
    out[listKey] = itemFields
      ? objList(d[listKey], (item) =>
          Object.fromEntries(itemFields.map((f) => [f.key, str(item[f.key])])),
        )
      : strList(d[listKey]);
    return out;
  };

  const {
    isOpen,
    setIsOpen,
    content: c,
    set,
    loading,
    saved,
    handleSave,
  } = useSectionEditor({
    slug,
    section,
    label,
    initialData,
    normalize,
  });

  const renderField = (f: FieldDef, value: string, onChange: (v: string) => void, span = false) =>
    f.multiline ? (
      <TextAreaField
        key={f.key}
        label={f.label}
        containerClassName={span ? "md:col-span-2" : ""}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={f.placeholder}
        helperText={f.helperText}
      />
    ) : (
      <InputField
        key={f.key}
        label={f.label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={f.placeholder}
        helperText={f.helperText}
      />
    );

  const fieldGrid = (defs: FieldDef[]) =>
    defs.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defs.map((f) => renderField(f, (c[f.key] as string) ?? "", (v) => set(f.key, v), true))}
      </div>
    );

  type Item = Record<string, string>;

  return (
    <SectionShell
      title={title}
      description={description}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onSave={handleSave}
      loading={loading}
      saved={saved}
    >
      {managed && <ManagedElsewhereBanner {...managed} />}

      {heading && (
        <HeadingFields
          value={{ tagline: c.tagline as string, headline: c.headline as string }}
          onChange={(k, v) => set(k, v)}
        />
      )}

      {fieldGrid(fields)}

      {itemFields ? (
        <RepeaterField<Item>
          title={listTitle}
          helperText={listHelper}
          addLabel={addLabel}
          emptyText={`Nothing added yet. Click to ${addLabel.toLowerCase()}.`}
          items={c[listKey] as Item[]}
          onChange={(v) => set(listKey, v)}
          createItem={() => Object.fromEntries(itemFields.map((f) => [f.key, ""]))}
          itemTitle={(item, i) => item[itemFields[0].key] || `Item ${i + 1}`}
          itemSubtitle={(item) => (itemFields[1] ? item[itemFields[1].key] : undefined)}
          renderItem={(item, setItem) => (
            <>
              {itemFields.map((f) =>
                renderField(f, item[f.key] ?? "", (v) => setItem({ ...item, [f.key]: v })),
              )}
            </>
          )}
        />
      ) : (
        <RepeaterField<string>
          title={listTitle}
          helperText={listHelper}
          addLabel={addLabel}
          emptyText={`Nothing added yet. Click to ${addLabel.toLowerCase()}.`}
          items={c[listKey] as string[]}
          onChange={(v) => set(listKey, v)}
          createItem={() => ""}
          itemTitle={(t, i) => t || `Item ${i + 1}`}
          renderItem={(t, setT) => (
            <InputField
              label="Text"
              value={t}
              onChange={(e) => setT(e.target.value)}
              placeholder={itemPlaceholder}
            />
          )}
        />
      )}

      {fieldsAfterList.length > 0 && (
        <div className="border-t border-gray-100 pt-5">{fieldGrid(fieldsAfterList)}</div>
      )}
    </SectionShell>
  );
}
