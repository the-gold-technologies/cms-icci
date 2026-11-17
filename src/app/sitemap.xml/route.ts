import { prisma } from "@/lib/prisma";
import { SITE_PAGES, SITE_URL } from "@/lib/site-pages";

export const dynamic = "force-dynamic";

const xmlEscape = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Every published ICCI page plus every news article (/news/<slug>), lastmod from updatedAt. */
export async function GET() {
  const config = await prisma.globalConfig.findFirst({ where: { id: "global" } });
  if (config && config.sitemapEnabled === false) {
    return new Response("", { status: 404 });
  }
  // An uploaded custom sitemap (SEO › Sitemap & Robots) replaces the generated one
  if (config?.sitemapCustomContent?.trim()) {
    return new Response(config.sitemapCustomContent, {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }

  const [pages, articles] = await Promise.all([
    prisma.page.findMany({ where: { visibility: "published" } }),
    prisma.newsItem.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { order: "asc" },
    }),
  ]);
  const bySlug = new Map(pages.map((p) => [p.slug, p]));

  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];
  for (const sp of SITE_PAGES) {
    const page = bySlug.get(sp.slug);
    if (page?.noIndex) continue;
    urls.push({
      loc: page?.canonicalUrl || `${SITE_URL}${sp.route === "/" ? "/" : sp.route}`,
      lastmod: (page?.updatedAt ?? new Date()).toISOString(),
      changefreq:
        sp.slug === "home" || sp.slug === "news-and-articles" || sp.slug === "events"
          ? "weekly"
          : "monthly",
      priority: sp.slug === "home" ? "1.0" : sp.slug === "membership" ? "0.9" : "0.8",
    });
  }
  for (const a of articles) {
    urls.push({
      loc: `${SITE_URL}/news/${a.slug}`,
      lastmod: a.updatedAt.toISOString(),
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const u of urls) {
    xml += `  <url>\n    <loc>${xmlEscape(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>\n`;
  }
  xml += `</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
