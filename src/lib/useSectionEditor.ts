"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/**
 * State + save logic shared by every static-page section editor.
 *
 * `normalize` is the section's single key list: it maps raw `initialData` to the editor state
 * (every key with a `?? ""` / `?? []` fallback, array items field-by-field) and is run again on
 * save, so every key that is loaded is also saved and nothing is silently dropped
 * (.agents/rules/cms-content-parity.md §4).
 */
export function useSectionEditor<T extends Record<string, unknown>>({
  slug,
  section,
  label,
  initialData,
  normalize,
}: {
  slug: string;
  section: string;
  label: string;
  initialData?: unknown;
  normalize: (data?: any) => T;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [content, setContent] = useState<T>(() => normalize({}));

  useEffect(() => {
    if (initialData) setContent(normalize(initialData));
    // normalize is a module-level function in every editor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const set = <K extends keyof T>(key: K, value: T[K]) =>
    setContent((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, content: normalize(content) }),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success(`${label} section saved successfully!`);
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save section");
      }
    } catch (err: any) {
      toast.error(err?.message || "Network error while saving");
    } finally {
      setLoading(false);
    }
  };

  return { isOpen, setIsOpen, content, set, loading, saved, handleSave };
}

/** Fetches `/api/pages/<slug>` once for a page editor. */
export function usePageData(slug: string) {
  const [pageData, setPageData] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/pages/${slug}`);
        const json = await res.json();
        if (json.success && json.data) setPageData(json.data);
        else toast.error(json.error || `Failed to load ${slug} page`);
      } catch (err) {
        console.error(`Failed to load ${slug} page data:`, err);
        toast.error(`Could not load the ${slug} page`);
      }
    })();
  }, [slug]);
  return pageData;
}

/** Normalisers reused by section editors. */
export const str = (v: unknown): string => (typeof v === "string" ? v : "");
export const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => (typeof x === "string" ? x : "")) : [];
export const objList = <T>(v: unknown, map: (item: any) => T): T[] =>
  Array.isArray(v) ? v.map((item) => map(item ?? {})) : [];

/** Paragraph arrays are edited as one textarea, paragraphs separated by a blank line. */
export const paragraphsToText = (paras: string[]) => paras.join("\n\n");
export const textToParagraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
