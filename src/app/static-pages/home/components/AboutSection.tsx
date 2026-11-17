"use client";

import React from "react";
import { SectionShell } from "@/components/SectionShell";
import { HeadingFields } from "@/components/HeadingFields";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { RepeaterField } from "@/components/RepeaterField";
import { useSectionEditor, str, objList } from "@/lib/useSectionEditor";

interface Card {
  title: string;
  text: string;
}

const normalize = (d: any = {}) => ({
  tagline: str(d.tagline),
  headline: str(d.headline),
  description: str(d.description),
  highlight: str(d.highlight),
  cards: objList<Card>(d.cards, (x) => ({ title: str(x.title), text: str(x.text) })),
});

export function AboutSection({ initialData }: { initialData?: any }) {
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
    section: "AboutSection",
    label: "About the Chamber",
    initialData,
    normalize,
  });

  return (
    <SectionShell
      title="3. About the Chamber (narrative + 4 cards)"
      description="Two paragraphs with a bold highlight, beside four small cards."
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onSave={handleSave}
      loading={loading}
      saved={saved}
    >
      <HeadingFields value={c} onChange={(k, v) => set(k as "tagline" | "headline", v)} />
      <TextAreaField
        label="Narrative"
        value={c.description}
        onChange={(e) => set("description", e.target.value)}
        rows={7}
        helperText="Separate paragraphs with a blank line."
        placeholder="e.g. How and why the Chamber was formed…"
      />
      <InputField
        label="Bold Highlight"
        value={c.highlight}
        onChange={(e) => set("highlight", e.target.value)}
        helperText="This exact phrase is shown in bold inside the narrative."
        placeholder="e.g. Phrase from the narrative to emphasise"
      />
      <RepeaterField<Card>
        title="Cards"
        addLabel="Add Card"
        emptyText="No cards yet."
        items={c.cards}
        onChange={(v) => set("cards", v)}
        createItem={() => ({ title: "", text: "" })}
        itemTitle={(x, i) => x.title || `Card ${i + 1}`}
        renderItem={(x, setX) => (
          <>
            <InputField
              label="Title"
              value={x.title}
              onChange={(e) => setX({ ...x, title: e.target.value })}
              placeholder="e.g. Card heading"
            />
            <TextAreaField
              label="Text"
              value={x.text}
              onChange={(e) => setX({ ...x, text: e.target.value })}
              rows={2}
              placeholder="e.g. One sentence"
            />
          </>
        )}
      />
    </SectionShell>
  );
}
