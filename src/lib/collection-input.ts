/** Input cleaning shared by collection API routes (news, leaders, events). */

export const text = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/** Paragraph arrays (bio, article body): accepts string[] or one text block split on blank lines. */
export function paragraphs(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(text).filter(Boolean);
  if (typeof v === "string") {
    return v
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
}

export const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export function fraction(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : fallback;
}
