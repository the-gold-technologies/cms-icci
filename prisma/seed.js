/**
 * ICCI CMS seed — idempotent upserts from the JSON seed files.
 *
 * - Image paths are resolved through prisma/uploaded-assets.json (website path → CDN URL).
 * - The admin account is only created when it does not exist; an existing password is never reset.
 * - Section content is only written for sections that do not exist yet unless SEED_OVERWRITE=1,
 *   so editor changes in the CMS are not overwritten by a re-run.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL environment variable is required.");
  process.exit(1);
}

const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
const pool = new Pool({ connectionString, ssl: isLocal ? false : { rejectUnauthorized: false } });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const OVERWRITE = process.env.SEED_OVERWRITE === "1";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://icci.co.in").replace(/\/$/, "");

const readJson = (name, fallback) => {
  const file = path.join(__dirname, name);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
};

const assets = readJson("uploaded-assets.json", {});
const unmapped = new Set();
const IMAGE_RE = /^(\/.+\.(webp|png|jpe?g|gif|svg|avif|ico)|https:\/\/images\.unsplash\.com\/.+)$/i;

/** Replaces every website image reference (deeply) with its uploaded CDN URL. */
function resolveImages(value) {
  if (typeof value === "string") {
    if (!IMAGE_RE.test(value)) return value;
    if (assets[value]) return assets[value];
    unmapped.add(value);
    return value;
  }
  if (Array.isArray(value)) return value.map(resolveImages);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveImages(v)]));
  }
  return value;
}

// Kept in sync with src/lib/site-pages.ts (SITE_PAGES)
const PAGES = [
  {
    slug: "home",
    title: "Home",
    route: "/",
    metaTitle: "ICCI – Indian Chamber of Construction Industry",
    metaDescription:
      "The Indian Chamber of Construction Industry (ICCI) unites contractors, builders, consultants, suppliers and allied professionals to collaborate, innovate and build a better India.",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": "https://icci.co.in/#website",
            url: "https://icci.co.in/",
            name: "Indian Chamber of Construction Industry",
            alternateName: "ICCI",
            description:
              "The Indian Chamber of Construction Industry (ICCI) unites contractors, builders, consultants, suppliers and allied professionals to collaborate, innovate and build a better India.",
            publisher: { "@id": "https://icci.co.in/#organization" },
            inLanguage: "en-IN",
          },
          {
            "@type": "Organization",
            "@id": "https://icci.co.in/#organization",
            name: "Indian Chamber of Construction Industry",
            alternateName: "ICCI",
            url: "https://icci.co.in/",
            logo: "https://res.cloudinary.com/dpa93copz/image/upload/v1794909790/icci/brand/icci-logo_1794909790717.webp",
            description:
              "The Indian Chamber of Construction Industry (ICCI) unites contractors, builders, consultants, suppliers and allied professionals to collaborate, innovate and build a better India.",
            address: {
              "@type": "PostalAddress",
              streetAddress:
                "ICCI Secretariat, 3rd Floor, PHD House, 4/2 August Kranti Marg, Siri Institutional Area, Hauz Khas",
              addressLocality: "New Delhi",
              postalCode: "110016",
              addressCountry: "IN",
            },
            telephone: "+91 93157 00465",
            email: "contact@icci.co.in",
            sameAs: [
              "https://www.facebook.com/profile.php?id=61595681472168",
              "https://www.instagram.com/icci.official.2026/",
              "https://www.linkedin.com/company/indian-chamber-of-construction-industry/",
              "https://x.com/icci_official",
            ],
          },
          {
            "@type": "WebPage",
            "@id": "https://icci.co.in/#webpage",
            url: "https://icci.co.in/",
            name: "ICCI – Indian Chamber of Construction Industry",
            isPartOf: { "@id": "https://icci.co.in/#website" },
            about: { "@id": "https://icci.co.in/#organization" },
            description:
              "The Indian Chamber of Construction Industry (ICCI) unites contractors, builders, consultants, suppliers and allied professionals to collaborate, innovate and build a better India.",
          },
        ],
      },
      null,
      2,
    ),
  },
  {
    slug: "about",
    title: "About",
    route: "/about",
    metaTitle: "About – ICCI",
    metaDescription:
      "The Indian Chamber of Construction Industry is a not-for-profit organisation representing, promoting and protecting the interests of India’s construction and allied industries.",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": "https://icci.co.in/about#webpage",
        url: "https://icci.co.in/about",
        name: "About Us – Indian Chamber of Construction Industry",
        description:
          "The Indian Chamber of Construction Industry is a not-for-profit organisation representing, promoting and protecting the interests of India’s construction and allied industries.",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://icci.co.in/#website",
          name: "Indian Chamber of Construction Industry",
          url: "https://icci.co.in/",
        },
        mainEntity: {
          "@type": "Organization",
          "@id": "https://icci.co.in/#organization",
          name: "Indian Chamber of Construction Industry",
          alternateName: "ICCI",
          url: "https://icci.co.in/",
          logo: "https://res.cloudinary.com/dpa93copz/image/upload/v1794909790/icci/brand/icci-logo_1794909790717.webp",
          description:
            "The Indian Chamber of Construction Industry is a not-for-profit organisation representing, promoting and protecting the interests of India's construction and allied industries.",
          foundingLocation: {
            "@type": "Place",
            name: "New Delhi, India",
          },
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "ICCI Secretariat, 3rd Floor, PHD House, 4/2 August Kranti Marg, Siri Institutional Area, Hauz Khas",
            addressLocality: "New Delhi",
            postalCode: "110016",
            addressCountry: "IN",
          },
        },
      },
      null,
      2,
    ),
  },
  {
    slug: "leadership",
    title: "Leadership",
    route: "/leadership",
    metaTitle: "Leadership – ICCI",
    metaDescription:
      "The national office bearers and National Executive Committee of the Indian Chamber of Construction Industry.",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": "https://icci.co.in/leadership#webpage",
        url: "https://icci.co.in/leadership",
        name: "Leadership – Indian Chamber of Construction Industry",
        description:
          "The national office bearers and National Executive Committee of the Indian Chamber of Construction Industry.",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://icci.co.in/#website",
          name: "Indian Chamber of Construction Industry",
          url: "https://icci.co.in/",
        },
        mainEntity: {
          "@type": "Organization",
          "@id": "https://icci.co.in/#organization",
          name: "Indian Chamber of Construction Industry",
          url: "https://icci.co.in/",
          member: [
            {
              "@type": "Person",
              name: "Ved Khurana",
              jobTitle: "National President",
              worksFor: {
                "@type": "Organization",
                name: "Globe Civil Projects Limited",
              },
            },
          ],
        },
      },
      null,
      2,
    ),
  },
  {
    slug: "initiatives",
    title: "Initiatives",
    route: "/initiatives",
    metaTitle: "Initiatives – ICCI",
    metaDescription: "ICCI's key initiatives, objectives and the stakeholders it represents.",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://icci.co.in/initiatives#webpage",
        url: "https://icci.co.in/initiatives",
        name: "Initiatives – Indian Chamber of Construction Industry",
        description:
          "ICCI's key initiatives, objectives and the stakeholders it represents across India's construction and infrastructure sector.",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://icci.co.in/#website",
          name: "Indian Chamber of Construction Industry",
          url: "https://icci.co.in/",
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://icci.co.in/#organization",
          name: "Indian Chamber of Construction Industry",
          url: "https://icci.co.in/",
        },
      },
      null,
      2,
    ),
  },
  {
    slug: "events",
    title: "Events",
    route: "/events",
    metaTitle: "Events – ICCI",
    metaDescription: "Upcoming and past ICCI conferences, meetings and workshops.",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": "https://icci.co.in/events#webpage",
        url: "https://icci.co.in/events",
        name: "Events – Indian Chamber of Construction Industry",
        description:
          "Upcoming and past ICCI conferences, meetings, workshops and industry exhibitions.",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://icci.co.in/#website",
          name: "Indian Chamber of Construction Industry",
          url: "https://icci.co.in/",
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://icci.co.in/#organization",
          name: "Indian Chamber of Construction Industry",
          url: "https://icci.co.in/",
        },
      },
      null,
      2,
    ),
  },
  {
    slug: "news-and-articles",
    title: "News & Articles",
    route: "/news",
    metaTitle: "News & Articles – ICCI",
    metaDescription:
      "Updates from the Indian Chamber of Construction Industry and the wider construction sector.",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": "https://icci.co.in/news#webpage",
        url: "https://icci.co.in/news",
        name: "News & Articles – Indian Chamber of Construction Industry",
        description:
          "Updates from the Indian Chamber of Construction Industry and the wider construction and infrastructure sector.",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://icci.co.in/#website",
          name: "Indian Chamber of Construction Industry",
          url: "https://icci.co.in/",
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://icci.co.in/#organization",
          name: "Indian Chamber of Construction Industry",
          url: "https://icci.co.in/",
        },
      },
      null,
      2,
    ),
  },
  {
    slug: "contact",
    title: "Contact",
    route: "/contact",
    metaTitle: "Contact – ICCI",
    metaDescription: "Get in touch with the Indian Chamber of Construction Industry.",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": "https://icci.co.in/contact#webpage",
        url: "https://icci.co.in/contact",
        name: "Contact Us – Indian Chamber of Construction Industry",
        description: "Get in touch with the Indian Chamber of Construction Industry.",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://icci.co.in/#website",
          name: "Indian Chamber of Construction Industry",
          url: "https://icci.co.in/",
        },
        mainEntity: {
          "@type": "Organization",
          "@id": "https://icci.co.in/#organization",
          name: "Indian Chamber of Construction Industry",
          alternateName: "ICCI",
          url: "https://icci.co.in/",
          telephone: "+91 93157 00465",
          email: "contact@icci.co.in",
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "ICCI Secretariat, 3rd Floor, PHD House, 4/2 August Kranti Marg, Siri Institutional Area, Hauz Khas",
            addressLocality: "New Delhi",
            postalCode: "110016",
            addressCountry: "IN",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+91 93157 00465",
            email: "contact@icci.co.in",
            contactType: "Secretariat",
            areaServed: "IN",
            availableLanguage: ["English", "Hindi"],
          },
        },
      },
      null,
      2,
    ),
  },
  {
    slug: "membership",
    title: "Membership",
    route: "/membership",
    metaTitle: "Membership – ICCI",
    metaDescription: "Why join ICCI, membership categories, eligibility and how to apply.",
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://icci.co.in/membership#webpage",
        url: "https://icci.co.in/membership",
        name: "Membership – Indian Chamber of Construction Industry",
        description:
          "Why join ICCI, membership categories, eligibility and how to apply for membership in India's leading construction industry chamber.",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://icci.co.in/#website",
          name: "Indian Chamber of Construction Industry",
          url: "https://icci.co.in/",
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://icci.co.in/#organization",
          name: "Indian Chamber of Construction Industry",
          url: "https://icci.co.in/",
        },
      },
      null,
      2,
    ),
  },
];

async function seedAdmin() {
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@icci.co.in").trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✓ Admin user ${email} already exists (password unchanged)`);
    return;
  }
  const password = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(9).toString("base64url");
  await prisma.user.create({
    data: {
      email,
      name: "ICCI Administrator",
      password: await bcrypt.hash(password, 10),
      role: "admin",
    },
  });
  console.log(`✓ Admin user created: ${email}`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`  Generated password: ${password}  (change it under Settings › Profile)`);
  }
}

async function seedGlobal(global) {
  const config = resolveImages(global.config);
  if (typeof config.schema === "string") {
    config.schema = Object.entries(assets).reduce(
      (txt, [from, to]) => txt.split(`"${from}"`).join(`"${to}"`),
      config.schema,
    );
  }
  await prisma.globalConfig.upsert({
    where: { id: "global" },
    create: { id: "global", ...config },
    update: OVERWRITE ? config : {},
  });
  console.log(`✓ Global config ${OVERWRITE ? "upserted" : "ensured"}`);

  if (OVERWRITE || (await prisma.navLink.count()) === 0) {
    await prisma.navLink.deleteMany();
    for (const link of global.navLinks) await prisma.navLink.create({ data: link });
    console.log(`✓ ${global.navLinks.length} navigation links seeded`);
  } else {
    console.log("✓ Navigation links already present (skipped)");
  }

  for (const [order, name] of global.newsCategories.entries()) {
    await prisma.dynamicCategory.upsert({
      where: { type_name: { type: "news", name } },
      update: {},
      create: { type: "news", name, order },
    });
  }
  console.log(`✓ ${global.newsCategories.length} news categories ensured`);
}

async function seedPages(staticPages) {
  let created = 0;
  let updated = 0;
  for (const meta of PAGES) {
    const canonicalUrl = `${SITE_URL}${meta.route === "/" ? "/" : meta.route}`;
    const page = await prisma.page.upsert({
      where: { slug: meta.slug },
      create: {
        slug: meta.slug,
        title: meta.title,
        type: "static",
        visibility: "published",
        isStatic: true,
        metaTitle: meta.metaTitle,
        metaDescription: meta.metaDescription,
        targetKeywords: "",
        canonicalUrl,
        headingOptions: "h1",
        schema: meta.schema || null,
      },
      update: OVERWRITE
        ? {
            title: meta.title,
            metaTitle: meta.metaTitle,
            metaDescription: meta.metaDescription,
            canonicalUrl,
            schema: meta.schema || null,
          }
        : {},
    });

    const sections = staticPages[meta.slug] || {};
    for (const [order, [type, raw]] of Object.entries(sections).entries()) {
      const content = resolveImages(raw);
      const existing = await prisma.section.findUnique({
        where: { pageId_type: { pageId: page.id, type } },
      });
      if (!existing) {
        await prisma.section.create({ data: { pageId: page.id, type, content, order } });
        created++;
      } else if (OVERWRITE) {
        await prisma.section.update({ where: { id: existing.id }, data: { content, order } });
        updated++;
      }
    }
  }
  console.log(`✓ Pages: ${PAGES.length} · sections created ${created}, overwritten ${updated}`);
}

async function seedCollections() {
  const leaders = resolveImages(readJson("leaders-seed.json", []));
  for (const l of leaders) {
    await prisma.leader.upsert({ where: { slug: l.slug }, create: l, update: OVERWRITE ? l : {} });
  }
  console.log(`✓ ${leaders.length} leaders ensured`);

  const news = resolveImages(readJson("news-seed.json", []));
  for (const n of news) {
    await prisma.newsItem.upsert({
      where: { slug: n.slug },
      create: n,
      update: OVERWRITE ? n : {},
    });
  }
  console.log(`✓ ${news.length} news articles ensured`);

  const events = readJson("events-seed.json", []);
  if (events.length && (OVERWRITE || (await prisma.event.count()) === 0)) {
    await prisma.event.deleteMany();
    await prisma.event.createMany({ data: events });
  }
  console.log(`✓ ${events.length} events in seed (website currently lists none)`);
}

async function main() {
  console.log(
    `🌱 Seeding ICCI CMS${OVERWRITE ? " (SEED_OVERWRITE=1: content will be replaced)" : ""}...`,
  );
  const staticPages = readJson("static-pages-seed.json", null);
  const global = readJson("global-seed.json", null);
  if (!staticPages || !global) {
    throw new Error("Seed JSON missing. Run `npm run seed:build` first.");
  }

  await seedAdmin();
  await seedGlobal(global);
  await seedPages(staticPages);
  await seedCollections();

  if (unmapped.size) {
    console.warn(
      `\n⚠ ${unmapped.size} image(s) not in prisma/uploaded-assets.json — seeded with the website path/URL:`,
    );
    for (const u of unmapped) console.warn(`   ${u}`);
    console.warn(
      "  Run `npm run assets:upload`, then `SEED_OVERWRITE=1 npm run seed` to switch them to the CDN.",
    );
  }
  console.log("🎉 Seed finished.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
