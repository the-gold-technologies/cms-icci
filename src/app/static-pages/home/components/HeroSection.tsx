"use client";

import React from "react";
import { SectionShell } from "@/components/SectionShell";
import { HeadingFields } from "@/components/HeadingFields";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { RepeaterField } from "@/components/RepeaterField";
import { useSectionEditor, str, strList, objList } from "@/lib/useSectionEditor";

interface Slide {
  tag: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
}
interface Field {
  label: string;
  image: string;
  imageAlt: string;
}

const normalize = (d: any = {}) => ({
  tagline: str(d.tagline),
  headline: str(d.headline),
  scriptAccent: str(d.scriptAccent),
  headlineSuffix: str(d.headlineSuffix),
  primaryCtaLabel: str(d.primaryCtaLabel),
  primaryCtaLink: str(d.primaryCtaLink),
  secondaryCtaLabel: str(d.secondaryCtaLabel),
  secondaryCtaLink: str(d.secondaryCtaLink),
  slides: objList<Slide>(d.slides, (s) => ({
    tag: str(s.tag),
    title: str(s.title),
    text: str(s.text),
    image: str(s.image),
    imageAlt: str(s.imageAlt),
  })),
  trustPoints: strList(d.trustPoints),
  membersValue: str(d.membersValue),
  membersLabel: str(d.membersLabel),
  membersCtaLabel: str(d.membersCtaLabel),
  membersCtaLink: str(d.membersCtaLink),
  fieldsLabel: str(d.fieldsLabel),
  fields: objList<Field>(d.fields, (f) => ({
    label: str(f.label),
    image: str(f.image),
    imageAlt: str(f.imageAlt),
  })),
});

export function HeroSection({ initialData }: { initialData?: any }) {
  const {
    isOpen,
    setIsOpen,
    content: c,
    set,
    loading,
    saved,
    handleSave,
  } = useSectionEditor({
    slug: "home",
    section: "HeroSection",
    label: "Hero",
    initialData,
    normalize,
  });

  return (
    <SectionShell
      title="1. Hero Carousel & Overview Panel"
      description="Main landing hero: primary headline, CTA buttons, background carousel slides, trust badges, and the 'We Represent' quick panel."
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onSave={handleSave}
      loading={loading}
      saved={saved}
    >
      <HeadingFields
        value={c}
        onChange={(k, v) => set(k, v)}
        accent
        headlineLabel="Primary Heading (H1)"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Primary Button Label"
          value={c.primaryCtaLabel}
          onChange={(e) => set("primaryCtaLabel", e.target.value)}
          placeholder="e.g. Saffron button text"
        />
        <InputField
          label="Primary Button Link"
          value={c.primaryCtaLink}
          onChange={(e) => set("primaryCtaLink", e.target.value)}
          placeholder="e.g. #join (membership form on this page)"
        />
        <InputField
          label="Secondary Button Label"
          value={c.secondaryCtaLabel}
          onChange={(e) => set("secondaryCtaLabel", e.target.value)}
          placeholder="e.g. Outline button text"
        />
        <InputField
          label="Secondary Button Link"
          value={c.secondaryCtaLink}
          onChange={(e) => set("secondaryCtaLink", e.target.value)}
          placeholder="e.g. #about"
        />
      </div>

      <RepeaterField<Slide>
        title="Background Slides"
        helperText="Photos rotate every 6 seconds. Tag / title / text are used as the photo's alt text and slide label."
        addLabel="Add Slide"
        emptyText="No slides yet. Click to add the first background photo."
        items={c.slides}
        onChange={(v) => set("slides", v)}
        createItem={() => ({ tag: "", title: "", text: "", image: "", imageAlt: "" })}
        itemTitle={(s, i) => s.title || `Slide ${i + 1}`}
        itemSubtitle={(s) => s.tag}
        itemThumbnail={(s) => s.image}
        renderItem={(s, setS) => (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="Tag"
                value={s.tag}
                onChange={(e) => setS({ ...s, tag: e.target.value })}
                placeholder="e.g. Theme of the photo"
              />
              <InputField
                label="Title"
                containerClassName="sm:col-span-2"
                value={s.title}
                onChange={(e) => setS({ ...s, title: e.target.value })}
                placeholder="e.g. Short caption for the photo"
              />
            </div>
            <TextAreaField
              label="Text"
              value={s.text}
              onChange={(e) => setS({ ...s, text: e.target.value })}
              rows={2}
              placeholder="e.g. One-line description of the photo"
            />
            <ImagePickerField
              label="Slide Photo"
              value={s.image}
              onChange={(url) => setS({ ...s, image: url })}
              folder="icci/home"
            />
            <InputField
              label="Photo Alt Text"
              value={s.imageAlt}
              onChange={(e) => setS({ ...s, imageAlt: e.target.value })}
              placeholder="e.g. Describe the photo for screen readers"
            />
          </>
        )}
      />

      <RepeaterField<string>
        title="Trust Points"
        helperText="Tick-marked lines above the members card (desktop)."
        addLabel="Add Trust Point"
        emptyText="No trust points yet."
        items={c.trustPoints}
        onChange={(v) => set("trustPoints", v)}
        createItem={() => ""}
        itemTitle={(t, i) => t || `Trust point ${i + 1}`}
        renderItem={(t, setT) => (
          <InputField
            label="Text"
            value={t}
            onChange={(e) => setT(e.target.value)}
            placeholder="e.g. Short proof point"
          />
        )}
      />

      <div className="border-t border-gray-100 pt-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Members Card</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Big Number"
            value={c.membersValue}
            onChange={(e) => set("membersValue", e.target.value)}
            placeholder="e.g. Member count"
          />
          <InputField
            label="Caption"
            value={c.membersLabel}
            onChange={(e) => set("membersLabel", e.target.value)}
            placeholder="e.g. Line under the number"
          />
          <InputField
            label="Link Label"
            value={c.membersCtaLabel}
            onChange={(e) => set("membersCtaLabel", e.target.value)}
            placeholder="e.g. Call to join"
          />
          <InputField
            label="Link URL"
            value={c.membersCtaLink}
            onChange={(e) => set("membersCtaLink", e.target.value)}
            placeholder="e.g. #join"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <InputField
          label="'We Represent' Card Label"
          value={c.fieldsLabel}
          onChange={(e) => set("fieldsLabel", e.target.value)}
          placeholder="e.g. Small caps label above the field name"
        />
      </div>

      <RepeaterField<Field>
        title="'We Represent' Fields"
        helperText="Cycles every 3 seconds in the small photo card."
        addLabel="Add Field"
        emptyText="No fields yet."
        items={c.fields}
        onChange={(v) => set("fields", v)}
        createItem={() => ({ label: "", image: "", imageAlt: "" })}
        itemTitle={(f, i) => f.label || `Field ${i + 1}`}
        itemThumbnail={(f) => f.image}
        renderItem={(f, setF) => (
          <>
            <InputField
              label="Label"
              value={f.label}
              onChange={(e) => setF({ ...f, label: e.target.value })}
              placeholder="e.g. Group the Chamber represents"
            />
            <ImagePickerField
              label="Photo"
              value={f.image}
              onChange={(url) => setF({ ...f, image: url })}
              folder="icci/home"
            />
            <InputField
              label="Photo Alt Text"
              value={f.imageAlt}
              onChange={(e) => setF({ ...f, imageAlt: e.target.value })}
              placeholder="e.g. Describe the photo"
            />
          </>
        )}
      />
    </SectionShell>
  );
}
