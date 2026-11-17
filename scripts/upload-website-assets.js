/**
 * Uploads every image referenced by the seed JSON through the same sharp pipeline as
 * /api/upload (rotate, strip metadata, ≤ 2000 px, WebP q82) to Cloudinary, and records
 * "website path or URL" → "CDN URL" in prisma/uploaded-assets.json
 * (.agents/rules/cms-content-parity.md §5 "Seeding images from the website").
 *
 * Local paths ("/leaders/x.webp") are read from <website>/public, falling back to <website>/app
 * (for app/apple-icon.png). Remote URLs (Unsplash placeholders) are downloaded first.
 * Already-mapped images are skipped, so the script can be re-run safely.
 *
 * Usage: node scripts/upload-website-assets.js [path-to-website]   (default: ../icci)
 * Needs CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET in .env.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { v2: cloudinary } = require("cloudinary");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const WEBSITE_DIR = path.resolve(process.argv[2] || path.join(__dirname, "../../icci"));
const PRISMA_DIR = path.join(__dirname, "../prisma");
const MAP_FILE = path.join(PRISMA_DIR, "uploaded-assets.json");
const ROOT_FOLDER = process.env.CLOUDINARY_FOLDER || "icci";
const IMAGE_RE = /^(\/.+\.(webp|png|jpe?g|gif|svg|avif|ico)|https:\/\/images\.unsplash\.com\/.+)$/i;

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error("❌ Cloudinary credentials are missing in .env");
  process.exit(1);
}
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

/** Collects image refs with the page/collection they belong to (used as the Cloudinary sub-folder). */
function collect(value, folder, out) {
  if (typeof value === "string") {
    if (IMAGE_RE.test(value) && !out.has(value)) out.set(value, folder);
  } else if (Array.isArray(value)) {
    value.forEach((v) => collect(v, folder, out));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => collect(v, folder, out));
  }
}

const readJson = (name) => JSON.parse(fs.readFileSync(path.join(PRISMA_DIR, name), "utf8"));

function slugify(ref) {
  const base = ref.startsWith("http")
    ? `photo-${(ref.match(/photo-([\w-]+)/) || [])[1] || "image"}`
    : path.basename(ref).replace(/\.[^.]+$/, "");
  return base
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .slice(0, 60);
}

async function loadBuffer(ref) {
  if (ref.startsWith("http")) {
    const res = await fetch(ref);
    if (!res.ok) throw new Error(`download failed (${res.status})`);
    return Buffer.from(await res.arrayBuffer());
  }
  for (const dir of ["public", "app"]) {
    const file = path.join(WEBSITE_DIR, dir, ref);
    if (fs.existsSync(file)) return fs.readFileSync(file);
  }
  throw new Error("file not found in website public/ or app/");
}

async function main() {
  const refs = new Map();
  const pages = readJson("static-pages-seed.json");
  for (const [slug, sections] of Object.entries(pages)) collect(sections, slug, refs);
  collect(readJson("leaders-seed.json"), "leaders", refs);
  collect(readJson("news-seed.json"), "news", refs);
  collect(readJson("global-seed.json").config, "brand", refs);

  const map = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, "utf8")) : {};
  let uploaded = 0;
  let failed = 0;

  for (const [ref, folder] of refs) {
    if (map[ref]) continue;
    try {
      const original = await loadBuffer(ref);
      const isSvg = /\.svg$/i.test(ref);
      const output = isSvg
        ? original
        : await sharp(original, { animated: /\.gif$/i.test(ref) })
            .rotate()
            .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
            .webp({ quality: 82, effort: 4 })
            .toBuffer();

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `${ROOT_FOLDER}/${folder}`,
              public_id: `${slugify(ref)}_${Date.now()}`,
              resource_type: "image",
              format: isSvg ? undefined : "webp",
            },
            (err, res) => (err ? reject(err) : resolve(res)),
          )
          .end(output);
      });

      map[ref] = result.secure_url;
      uploaded++;
      const saving = Math.round((1 - output.length / original.length) * 100);
      console.log(
        `✓ ${ref} → ${result.secure_url} (${Math.round(original.length / 1024)} KB → ${Math.round(output.length / 1024)} KB, ${saving}% saved)`,
      );
      fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2) + "\n");
    } catch (err) {
      failed++;
      console.error(`✗ ${ref}: ${err.message}`);
    }
  }

  const missing = [...refs.keys()].filter((r) => !map[r]);
  console.log(
    `\nUploaded ${uploaded}, failed ${failed}, total mapped ${Object.keys(map).length}/${refs.size}.`,
  );
  if (missing.length) {
    console.log("Still unmapped:\n" + missing.map((m) => `  ${m}`).join("\n"));
    process.exitCode = 1;
  }
}

main();
