/**
 * Mandatory checks from .agents/rules/cms-content-parity.md §7.
 *
 *  7.2 Editor key coverage — every key in prisma/static-pages-seed.json must be loaded/saved by
 *      the section's editor (static-pages/<slug>/components/<Section>.tsx).
 *  7.3 Database vs seed    — DB section content equals the seed by value (images resolved).
 *  7.1 Website ↔ CMS diff  — every JSX text / content-like string in the website's rendered
 *      components and lib/content.ts exists somewhere in the CMS database.
 *
 * Usage: node scripts/verify-parity.js [path-to-website]   (default: ../icci)
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const ROOT = path.join(__dirname, "..");
const WEBSITE_DIR = path.resolve(process.argv[2] || path.join(ROOT, "../icci"));
const seed = JSON.parse(fs.readFileSync(path.join(ROOT, "prisma/static-pages-seed.json"), "utf8"));
const assets = fs.existsSync(path.join(ROOT, "prisma/uploaded-assets.json"))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, "prisma/uploaded-assets.json"), "utf8"))
  : {};

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`  ✗ ${msg}`);
};

// ───────────── 7.2 Editor key coverage ─────────────
function editorKeys(file) {
  const src = fs.readFileSync(file, "utf8");
  const keys = new Set();
  if (src.includes("BannerSectionEditor"))
    ["tagline", "headline", "scriptAccent", "headlineSuffix", "image", "imageAlt"].forEach((k) => keys.add(k));
  if (src.includes("IntroSectionEditor") || src.includes("ListSectionEditor")) {
    if (!/heading=\{false\}/.test(src)) ["tagline", "headline"].forEach((k) => keys.add(k));
    if (/^\s+intro$/m.test(src)) keys.add("intro");
    if (/^\s+link$/m.test(src)) ["linkLabel", "linkHref"].forEach((k) => keys.add(k));
    const list = src.match(/listKey="(\w+)"/);
    if (list) keys.add(list[1]);
    // extra / fields / fieldsAfterList keys (item field keys are checked below)
    const itemBlock = src.match(/itemFields=\{\[([\s\S]*?)\]\}/);
    const outside = itemBlock ? src.replace(itemBlock[0], "") : src;
    for (const m of outside.matchAll(/key: "(\w+)"/g)) keys.add(m[1]);
  }
  for (const m of src.matchAll(/\bd\.(\w+)/g)) keys.add(m[1]);
  if (src.includes("normalizeFormCopy"))
    ["formTitle", "fields", "submitLabel", "successTitle", "successText", "resetLabel"].forEach((k) => keys.add(k));
  if (/\.\.\.\(?TITLE_TEXT|key: "title".*\n.*key: "text"/.test(src)) {}
  return { keys, src };
}

function itemKeys(src) {
  const block = src.match(/itemFields=\{\[([\s\S]*?)\]\}/);
  return block ? new Set([...block[1].matchAll(/key: "(\w+)"/g)].map((m) => m[1])) : null;
}

console.log("\n§7.2 Editor key coverage");
for (const [slug, sections] of Object.entries(seed)) {
  for (const [section, content] of Object.entries(sections)) {
    const file = path.join(ROOT, "src/app/static-pages", slug, "components", `${section}.tsx`);
    if (!fs.existsSync(file)) {
      fail(`${slug} › ${section}: editor file missing`);
      continue;
    }
    const { keys, src } = editorKeys(file);
    for (const k of Object.keys(content)) if (!keys.has(k)) fail(`${slug} › ${section}.${k} is not saved by the editor`);
    // array item fields
    for (const [k, v] of Object.entries(content)) {
      if (!Array.isArray(v) || !v.length || typeof v[0] !== "object") continue;
      if (k === "fields" && src.includes("normalizeFormCopy")) continue;
      const declared = itemKeys(src) || new Set([...src.matchAll(/\b\w\.(\w+)\)/g)].map((m) => m[1]));
      for (const ik of Object.keys(v[0])) {
        if (!declared.has(ik) && !new RegExp(`\\b${ik}: str\\(`).test(src))
          fail(`${slug} › ${section}.${k}[].${ik} is not saved by the editor`);
      }
    }
  }
}
if (!failures) console.log("  ✓ every seed key is loaded and saved");

// ───────────── DB checks ─────────────
const resolve = (v) =>
  typeof v === "string" ? assets[v] || v : Array.isArray(v) ? v.map(resolve) : v && typeof v === "object"
    ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolve(x)]))
    : v;
const canon = (v) =>
  Array.isArray(v) ? v.map(canon) : v && typeof v === "object"
    ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])]))
    : v;

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  try {
    console.log("\n§7.3 Database vs seed");
    const before = failures;
    const pages = await prisma.page.findMany({ include: { sections: true } });
    for (const [slug, sections] of Object.entries(seed)) {
      const page = pages.find((p) => p.slug === slug);
      if (!page) {
        fail(`page ${slug} missing in DB`);
        continue;
      }
      for (const [type, content] of Object.entries(sections)) {
        const row = page.sections.find((s) => s.type === type);
        if (!row) fail(`${slug} › ${type} missing in DB`);
        else if (JSON.stringify(canon(row.content)) !== JSON.stringify(canon(resolve(content))))
          fail(`${slug} › ${type} differs from seed (edited in the CMS?)`);
      }
    }
    if (failures === before) console.log("  ✓ database content matches the seed");

    // ───────────── 7.1 Website ↔ CMS ─────────────
    console.log("\n§7.1 Website strings missing from the CMS");
    const [leaders, news, events, cfg, nav] = await Promise.all([
      prisma.leader.findMany(),
      prisma.newsItem.findMany(),
      prisma.event.findMany(),
      prisma.globalConfig.findUnique({ where: { id: "global" } }),
      prisma.navLink.findMany(),
    ]);
    const haystack = JSON.stringify([pages.map((p) => [p.sections.map((s) => s.content), p.metaTitle, p.metaDescription]), leaders, news, events, cfg, nav])
      .replace(/\\n/g, " ")
      .replace(/\\"/g, '"')
      .replace(/\s+/g, " ");
    const norm = (s) => s.replace(/\s+/g, " ").trim();

    // UI chrome intentionally not in the CMS (reported, not failed)
    const CHROME = new Set([
      "Toggle menu", "Close", "Next field", "Read more", "Read less", "Construction across India",
      "Who we represent", "Filter news by category", "Social media", "carousel", "·", "©",
      "ICCI office location",
    ]);
    const files = [
      ...fs.readdirSync(path.join(WEBSITE_DIR, "components")).map((f) => path.join("components", f)),
      ...walk(path.join(WEBSITE_DIR, "app")).map((f) => path.relative(WEBSITE_DIR, f)),
      "lib/content.ts",
    ].filter((f) => /\.tsx?$/.test(f));

    // Strings of components that exist but are not rendered anywhere (SuggestionForm)
    const NOT_RENDERED = new Set(["Contact Details", "Suggestion / Feedback", "Submit Suggestion", "Thank you for your suggestion"]);
    const unrendered = [];
    const missing = [];
    const chrome = [];
    for (const rel of files) {
      for (const str of extractStrings(path.join(WEBSITE_DIR, rel))) {
        const s = norm(str);
        if (s.length < 3 || !/[A-Za-z]{2}/.test(s)) continue;
        if (haystack.includes(s)) continue;
        // headings split around the saffron word: check the parts
        if (/\b(bg|from|via|to|text|h|w)-\[|^M[\d.]+ |sessionStorage/.test(s)) continue; // classes, SVG paths, scripts
        if (NOT_RENDERED.has(s)) {
          unrendered.push(`${rel}: ${s}`);
          continue;
        }
        if (CHROME.has(s) || /^(Show slide|bio-|#|\/|https?:)/.test(s)) {
          chrome.push(`${rel}: ${s}`);
          continue;
        }
        missing.push(`${rel}: ${s}`);
      }
    }
    if (missing.length) missing.forEach((m) => fail(m));
    else console.log("  ✓ no content gaps");
    if (unrendered.length) {
      console.log(`  ℹ ${unrendered.length} string(s) from components that are not rendered (SuggestionForm) — not modelled:`);
      [...new Set(unrendered)].forEach((c) => console.log(`     ${c}`));
    }
    if (chrome.length) {
      console.log(`  ℹ ${chrome.length} UI-chrome string(s) intentionally not stored:`);
      [...new Set(chrome)].forEach((c) => console.log(`     ${c}`));
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }

  console.log(failures ? `\n✗ ${failures} problem(s) found` : "\n✓ All parity checks passed");
  process.exitCode = failures ? 1 : 0;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
  );
}

const SKIP_ATTRS = new Set([
  "className", "style", "d", "viewBox", "fill", "stroke", "strokeWidth", "strokeLinecap",
  "strokeLinejoin", "fillRule", "key", "href", "src", "type", "name", "id", "rel", "target",
  "role", "loading", "popover", "popoverTarget", "popoverTargetAction", "aria-hidden", "rows",
  "data-reveal", "x", "y", "width", "height", "rx", "cx", "cy", "r", "lang", "defaultValue",
  "aria-roledescription", "aria-label", "title", "alt", "placeholder", "fetchPriority",
]);

/** JSX text + string literals that look like copy (skips imports, classNames, SVG, keys). */
function extractStrings(file) {
  const src = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out = [];
  const visit = (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isJsxAttribute(node) && SKIP_ATTRS.has(node.name.getText())) return;
    if (ts.isPropertyAssignment(node) && ["d", "className", "key", "src", "slug", "href"].includes(node.name.getText())) return;
    if (ts.isCallExpression(node) && /^(photo|leaderPhoto|delay|afterSplash|byRole|filter|replace|split|includes|startsWith|getItem|setItem|add|getEntriesByType|Poppins)$/.test(node.expression.getText().split(".").pop())) return;
    if (ts.isJsxText(node)) {
      const t = node.getText().replace(/&apos;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
      if (t.trim()) out.push(t);
    } else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const t = node.text;
      if (/\s/.test(t) && !/^[a-z0-9:\-\[\]\/._%() #]+$/.test(t)) out.push(t);
      else if (/^[A-Z][a-z]+( [A-Z&][a-z]*)*$/.test(t)) out.push(t);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
