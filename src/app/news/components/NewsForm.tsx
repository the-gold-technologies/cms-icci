"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { SelectOrCustomField } from "@/components/SelectOrCustomField";
import { slugify } from "@/lib/collection-input";

interface NewsFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function NewsForm({ initialData, isEdit = false }: NewsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const [title, setTitle] = useState<string>(initialData?.title ?? "");
  const [slug, setSlug] = useState<string>(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState<boolean>(isEdit);
  const [category, setCategory] = useState<string>(initialData?.category ?? "");
  const [date, setDate] = useState<string>(initialData?.date ?? "");
  const [excerpt, setExcerpt] = useState<string>(initialData?.excerpt ?? "");
  const [body, setBody] = useState<string>(
    Array.isArray(initialData?.body) ? initialData.body.join("\n\n") : "",
  );
  const [img, setImg] = useState<string>(initialData?.img ?? "");
  const [imgAlt, setImgAlt] = useState<string>(initialData?.imgAlt ?? "");

  useEffect(() => {
    fetch("/api/categories/news")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCategories((json.data || []).map((c: any) => c.name));
      })
      .catch(() => toast.error("Could not load news categories"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !date || !excerpt || !img) {
      toast.error("Please fill in Title, Category, Date, Excerpt and Photo.");
      return;
    }

    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch(isEdit ? `/api/news/${initialData.id}` : "/api/news", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || slugify(title),
          category,
          date,
          excerpt,
          body,
          img,
          imgAlt,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success(isEdit ? "Article updated successfully!" : "Article published successfully!");
        setTimeout(() => router.push("/news"), 800);
      } else {
        toast.error(json.error || "Failed to save article");
      }
    } catch (err: any) {
      toast.error(err?.message || "Network error while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6"
    >
      <InputField
        label="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (!slugTouched) setSlug(slugify(e.target.value));
        }}
        placeholder="e.g. Headline of the article"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="URL Slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          helperText="The article lives at /news/<slug>. Changing it breaks old links."
          placeholder="e.g. icci-annual-meet-2026"
        />
        <SelectOrCustomField
          label="Category"
          value={category}
          onChange={setCategory}
          options={categories}
          placeholder="Select category..."
          customPlaceholder="e.g. Press Release, Event Brief..."
          helperText="Choose a category or enter a custom one."
          required
        />
        <InputField
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          helperText="Shown as written, e.g. 'October 2026' (the list shows the first 3 letters of the month)."
          placeholder="e.g. November 2026"
        />
      </div>
      <TextAreaField
        label="Excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        rows={2}
        helperText="Shown on cards and as the first, larger paragraph of the article."
        placeholder="e.g. One-sentence summary"
      />
      <TextAreaField
        label="Article Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={12}
        helperText="Separate paragraphs with a blank line."
        placeholder="e.g. Full text of the article…"
      />
      <ImagePickerField label="Cover Photo" value={img} onChange={setImg} folder="icci/news" />
      <InputField
        label="Photo Alt Text"
        value={imgAlt}
        onChange={(e) => setImgAlt(e.target.value)}
        placeholder="e.g. Leave empty when the photo is decorative"
      />
      <div className="pt-4 border-t border-gray-100 w-full">
        <SaveButton
          type="submit"
          loading={loading}
          saved={saved}
          label={isEdit ? "Update Article" : "Publish Article"}
        />
      </div>
    </form>
  );
}
