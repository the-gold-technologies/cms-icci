/**
 * Full content audit: website (../icci) → CMS database.
 *
 *  A. Every leaf value of every export in lib/content.ts (text, numbers, URLs, image paths)
 *     must exist in the CMS database.
 *  B. Every JSX text and every content attribute (alt, placeholder, title, aria-label, href, src)
 *     in app/** and components/** must exist in the CMS database, unless it is listed as UI chrome.
 *  C. Image references are listed separately (Cloudinary upload comes later).
 *
 * Usage: node scripts/audit-content.js [path-to-website]
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const WEBSITE = path.resolve(process.argv[2] || path.join(__dirname, "../../icci"));
const IMAGE = /\.(webp|png|jpe?g|svg|ico|gif|avif)(\?|$)|images\.unsplash\.com/i;

// Not content: interface labels, accessibility labels and code that the CMS does not need to store.
const CHROME = new Map([
  ["Read more", "ReadMore toggle (fixed UI label)"],
  ["Read less", "ReadMore toggle (fixed UI label)"],
  ["Toggle menu", "aria-label"],
  ["Close", "aria-label"],
  ["Next field", "aria-label"],
  ["Construction across India", "carousel aria-label"],
  ["Who we represent", "aria-label (visible label 'We represent' is in the CMS)"],
  ["Filter news by category", "aria-label"],
  ["Social media", "aria-label"],
  ["carousel", "aria-roledescription"],
]);
const NOT_RENDERED = ["Name", "Organisation", "Company / body", "Contact Details", "Email or phone number", "Suggestion / Feedback", "Share your idea, concern or feedback…", "Submit Suggestion", "Thank you for your suggestion"];

function loadContent() {
  const src = fs.readFileSync(path.join(WEBSITE, "lib/content.ts"), "utf8");
  const { outputText } = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const mod = { exports: {} };
  new Function("module", "exports", "require", outputText)(mod, mod.exports, require);
  return mod.exports;
}

function leaves(value, p, out) {
  if (typeof value === "string" || typeof value === "number") out.push([p, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => leaves(v, `${p}[${i}]`, out));
  else if (value && typeof value === "object") Object.entries(value).forEach(([k, v]) => leaves(v, `${p}.${k}`, out));
  return out;
}

const SKIP_ATTR = new Set(["className", "style", "d", "viewBox", "fill", "stroke", "strokeWidth", "strokeLinecap", "strokeLinejoin", "fillRule", "key", "type", "name", "id", "rel", "target", "role", "loading", "popover", "popoverTarget", "popoverTargetAction", "aria-hidden", "rows", "data-reveal", "x", "y", "width", "height", "rx", "cx", "cy", "r", "lang", "defaultValue", "fetchPriority", "suppressHydrationWarning", "dangerouslySetInnerHTML", "aria-selected", "aria-expanded", "required"]);

function jsxStrings(file) {
  const src = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out = [];
  const visit = (node) => {
    if (ts.isImportDeclaration(node)) return;
    if (ts.isJsxText(node)) {
      const t = node.getText().replace(/&apos;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
      if (t) out.push(["text", t]);
    }
    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText();
      if (SKIP_ATTR.has(name)) return;
      const init = node.initializer;
      if (init && ts.isStringLiteral(init)) out.push([name, init.text]);
      if (init && ts.isJsxExpression(init) && init.expression && (ts.isStringLiteral(init.expression) || ts.isNoSubstitutionTemplateLiteral(init.expression)))
        out.push([name, init.expression.text]);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : /\.tsx$/.test(e.name) ? [path.join(dir, e.name)] : [],
  );
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  const [pages, leaders, news, events, cats, cfg, nav] = await Promise.all([
    prisma.page.findMany({ include: { sections: true } }),
    prisma.leader.findMany(),
    prisma.newsItem.findMany(),
    prisma.event.findMany(),
    prisma.dynamicCategory.findMany(),
    prisma.globalConfig.findUnique({ where: { id: "global" } }),
    prisma.navLink.findMany(),
  ]);
  const values = [];
  leaves(JSON.parse(JSON.stringify({ pages, leaders, news, events, cats, cfg, nav })), "", values);
  const db = new Set();
  const dbText = values.map(([, v]) => String(v)).join("\u0000");
  for (const [, v] of values) db.add(String(v));
  const assetsFile = path.join(__dirname, "../prisma/uploaded-assets.json");
  const assets = fs.existsSync(assetsFile) ? JSON.parse(fs.readFileSync(assetsFile, "utf8")) : {};
  // Website image paths count as present when their Cloudinary URL is in the database
  const has = (v) => {
    const s = String(v);
    return db.has(s) || dbText.includes(s) || (assets[s] !== undefined && dbText.includes(assets[s]));
  };

  let gaps = 0;
  const images = new Set();

  // ── A. lib/content.ts ──
  console.log("A. lib/content.ts — every value");
  const content = loadContent();
  let total = 0;
  for (const [name, value] of Object.entries(content)) {
    if (typeof value === "function") continue;
    const list = leaves(value, name, []);
    const missing = list.filter(([, v]) => !has(v));
    total += list.length;
    list.filter(([, v]) => typeof v === "string" && IMAGE.test(v)).forEach(([, v]) => images.add(v));
    console.log(`  ${missing.length ? "✗" : "✓"} ${name.padEnd(20)} ${list.length - missing.length}/${list.length}`);
    for (const [p, v] of missing) {
      gaps++;
      console.log(`      missing ${p} = ${JSON.stringify(v).slice(0, 120)}`);
    }
  }
  console.log(`  (${total} values checked)`);

  // ── B. JSX text + attributes ──
  console.log("\nB. Pages & components — text, links, alt, placeholders");
  const files = [...walk(path.join(WEBSITE, "app")), ...walk(path.join(WEBSITE, "components"))];
  const chrome = [];
  const unrendered = [];
  let checked = 0;
  for (const file of files) {
    const rel = path.relative(WEBSITE, file);
    const missing = [];
    for (const [kind, raw] of jsxStrings(file)) {
      const v = raw.trim();
      if (!v || !/[A-Za-z0-9]/.test(v) || v === "/#top") continue;
      if (IMAGE.test(v)) images.add(v);
      checked++;
      if (has(v)) continue;
      if (CHROME.has(v)) chrome.push(`${rel}: "${v}" — ${CHROME.get(v)}`);
      else if (rel.endsWith("Forms.tsx") && NOT_RENDERED.includes(v)) unrendered.push(`${rel}: "${v}"`);
      else missing.push(`${kind}: ${JSON.stringify(v)}`);
    }
    console.log(`  ${missing.length ? "✗" : "✓"} ${rel}`);
    missing.forEach((m) => {
      gaps++;
      console.log(`      missing ${m}`);
    });
  }
  console.log(`  (${checked} strings checked)`);

  console.log(`\nUI chrome, not stored (${chrome.length}):`);
  [...new Set(chrome)].forEach((c) => console.log(`  · ${c}`));
  console.log(`\nSuggestionForm (exported but never rendered), not stored (${new Set(unrendered).size}):`);
  [...new Set(unrendered)].forEach((c) => console.log(`  · ${c}`));

  // ── C. Images ──
  const inDb = [...images].filter((i) => has(i));
  console.log(`\nC. Images referenced by the website: ${images.size} (${inDb.length} present in the CMS, ${[...images].filter((i) => assets[i]).length} on Cloudinary)`);
  [...images].filter((i) => !has(i)).forEach((i) => {
    gaps++;
    console.log(`  ✗ not in CMS: ${i}`);
  });

  console.log(gaps ? `\n✗ ${gaps} gap(s)` : "\n✓ No content gaps — every website value is in the CMS");
  await prisma.$disconnect();
  await pool.end();
  process.exitCode = gaps ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
