"use client";

import React from "react";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";

export interface FormFieldCopy {
  name: string; // fixed: maps to the submission column
  label: string;
  placeholder: string;
}

export interface EnquiryFormCopy {
  formTitle: string;
  fields: FormFieldCopy[];
  submitLabel: string;
  successTitle: string;
  successText: string;
  resetLabel: string;
}

const s = (v: unknown) => (typeof v === "string" ? v : "");

/** Loads the form copy, keeping the website's fixed field list (`names`) and order. */
export function normalizeFormCopy(d: any, names: string[]): EnquiryFormCopy {
  const saved: any[] = Array.isArray(d?.fields) ? d.fields : [];
  return {
    formTitle: s(d?.formTitle),
    fields: names.map((name) => {
      const f = saved.find((x) => x?.name === name) ?? {};
      return { name, label: s(f.label), placeholder: s(f.placeholder) };
    }),
    submitLabel: s(d?.submitLabel),
    successTitle: s(d?.successTitle),
    successText: s(d?.successText),
    resetLabel: s(d?.resetLabel),
  };
}

/** Form title, per-field label/placeholder, submit button and thank-you message. */
export function EnquiryFormFields({
  value,
  onChange,
}: {
  value: EnquiryFormCopy;
  onChange: (next: EnquiryFormCopy) => void;
}) {
  const set = <K extends keyof EnquiryFormCopy>(k: K, v: EnquiryFormCopy[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Form Card Title"
          value={value.formTitle}
          onChange={(e) => set("formTitle", e.target.value)}
          placeholder="e.g. Heading above the form"
        />
        <InputField
          label="Submit Button Label"
          value={value.submitLabel}
          onChange={(e) => set("submitLabel", e.target.value)}
          placeholder="e.g. Send button text"
        />
      </div>

      <div className="border-t border-gray-100 pt-5 space-y-3">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Form Fields ({value.fields.length})
          </h4>
          <p className="text-[11px] text-gray-400 mt-0.5">
            The fields themselves are fixed (they map to the Submissions inbox); edit their label
            and placeholder.
          </p>
        </div>
        {value.fields.map((f, i) => (
          <div
            key={f.name}
            className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-4 items-end rounded-2xl border border-gray-200 p-4"
          >
            <span className="text-xs font-mono font-semibold text-gray-500 pb-4">{f.name}</span>
            <InputField
              label="Label"
              value={f.label}
              onChange={(e) => {
                const fields = [...value.fields];
                fields[i] = { ...f, label: e.target.value };
                set("fields", fields);
              }}
              placeholder="e.g. Field label"
            />
            <InputField
              label="Placeholder"
              value={f.placeholder}
              onChange={(e) => {
                const fields = [...value.fields];
                fields[i] = { ...f, placeholder: e.target.value };
                set("fields", fields);
              }}
              placeholder="e.g. Hint inside the field"
            />
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Thank-you Message
        </h4>
        <InputField
          label="Success Title"
          value={value.successTitle}
          onChange={(e) => set("successTitle", e.target.value)}
          placeholder="e.g. Shown after a successful submit"
        />
        <TextAreaField
          label="Success Text"
          value={value.successText}
          onChange={(e) => set("successText", e.target.value)}
          rows={2}
          placeholder="e.g. What happens next"
        />
        <InputField
          label="'Submit Another' Link Label"
          value={value.resetLabel}
          onChange={(e) => set("resetLabel", e.target.value)}
          placeholder="e.g. Resets the form"
        />
      </div>
    </div>
  );
}
