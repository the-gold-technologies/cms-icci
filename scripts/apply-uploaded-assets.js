/**
 * Swaps website image paths/URLs for their Cloudinary URLs (prisma/uploaded-assets.json) in the
 * database — image fields only. Text and other edits made in the CMS are left untouched.
 *
 * Usage: node scripts/apply-uploaded-assets.js
 */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const map = JSON.parse(fs.readFileSync(path.join(__dirname, "../prisma/uploaded-assets.json"), "utf8"));
const swap = (v) =>
  typeof v === "string" ? map[v] ?? v : Array.isArray(v) ? v.map(swap) : v && typeof v === "object"
    ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, swap(x)]))
    : v;
const changed = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  const counts = { sections: 0, leaders: 0, news: 0, global: 0 };

  for (const s of await prisma.section.findMany()) {
    const next = swap(s.content);
    if (changed(next, s.content)) {
      await prisma.section.update({ where: { id: s.id }, data: { content: next } });
      counts.sections++;
    }
  }
  for (const l of await prisma.leader.findMany()) {
    if (l.photo && map[l.photo]) {
      await prisma.leader.update({ where: { id: l.id }, data: { photo: map[l.photo] } });
      counts.leaders++;
    }
  }
  for (const n of await prisma.newsItem.findMany()) {
    if (map[n.img]) {
      await prisma.newsItem.update({ where: { id: n.id }, data: { img: map[n.img] } });
      counts.news++;
    }
  }
  const cfg = await prisma.globalConfig.findUnique({ where: { id: "global" } });
  if (cfg) {
    const data = {};
    for (const k of ["logo", "logoMark", "logoMarkWhite", "favicon", "ogImage"]) {
      if (cfg[k] && map[cfg[k]]) data[k] = map[cfg[k]];
    }
    // The Organization JSON-LD logo is a website path too
    if (cfg.schema) {
      const schema = Object.entries(map).reduce((s, [from, to]) => s.split(`"${from}"`).join(`"${to}"`), cfg.schema);
      if (schema !== cfg.schema) data.schema = schema;
    }
    if (Object.keys(data).length) {
      await prisma.globalConfig.update({ where: { id: "global" }, data });
      counts.global = Object.keys(data).length;
    }
  }

  console.log(
    `✓ Switched to Cloudinary: ${counts.sections} sections, ${counts.leaders} leader photos, ${counts.news} news photos, ${counts.global} global fields`,
  );
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
