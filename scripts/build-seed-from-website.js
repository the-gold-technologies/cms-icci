/**
 * Builds prisma/*-seed.json from the ICCI website source so seed copy is verbatim
 * (.agents/rules/cms-content-parity.md §2).
 *
 *  - Arrays and objects come straight from `<website>/lib/content.ts` (transpiled + evaluated).
 *  - Copy that the website writes inline in `app/**\/page.tsx` / `components/*.tsx` is transcribed
 *    below with JSX entities decoded (&apos; → '). Each block names its source file.
 *
 * Usage: node scripts/build-seed-from-website.js [path-to-website]   (default: ../icci)
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const WEBSITE_DIR = path.resolve(process.argv[2] || path.join(__dirname, "../../icci"));
const OUT_DIR = path.join(__dirname, "../prisma");

function loadContent() {
  const file = path.join(WEBSITE_DIR, "lib/content.ts");
  const source = fs.readFileSync(file, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const mod = { exports: {} };
  new Function("module", "exports", "require", outputText)(mod, mod.exports, require);
  return mod.exports;
}

const c = loadContent();
const para = (arr) => arr.join("\n\n");

// ───────────────────────── Static pages ─────────────────────────
const leadershipIntro = {
  // app/page.tsx + app/about/page.tsx (identical copy on both pages)
  tagline: "National Office Bearers",
  headline: "The people leading the Chamber",
  intro:
    "Experienced industry leaders who came together to found ICCI and now steer it nationally.",
  linkLabel: "Meet the full leadership",
  linkHref: "/leadership",
};

const staticPages = {
  home: {
    // app/page.tsx (hero copy) + components/HeroCarousel.tsx (slides, side panel)
    HeroSection: {
      tagline: "Collaborate • Innovate • Transform",
      headline: "The unified voice of India's",
      scriptAccent: "construction",
      headlineSuffix: " industry.",
      primaryCtaLabel: "Join the Chamber",
      primaryCtaLink: "#join",
      secondaryCtaLabel: "Discover ICCI",
      secondaryCtaLink: "#about",
      slides: c.heroSlides.map((s) => ({
        tag: s.tag,
        title: s.title,
        text: s.text,
        image: s.photo,
        imageAlt: s.title,
      })),
      trustPoints: ["30+ members from 7 states", "One unified industry voice"],
      membersValue: "30+",
      membersLabel: "Members from 7 states",
      membersCtaLabel: "Join them",
      membersCtaLink: "#join",
      fieldsLabel: "We represent",
      fields: c.fields.map((f) => ({ label: f.label, image: f.photo, imageAlt: f.label })),
    },
    // app/page.tsx highlights strip (icons are fixed by position: people, map, voice, globe)
    HighlightsSection: {
      stats: c.stats.map((s) => ({ value: s.value, label: s.label })),
    },
    // app/page.tsx "About"
    AboutSection: {
      tagline: "About the Chamber",
      headline: "A recognised platform for everyone who builds India.",
      description: para([
        "ICCI was formed by industry leaders who felt the need for one credible, organised body to represent the construction and allied industries. Today the Chamber brings together 30+ members from 7 states, with a vision to establish chapters in every state.",
        "The Chamber works as a bridge between the industry and Government departments — raising members' concerns, contributing to policy, and helping businesses of every size grow with fairness, quality and transparency.",
      ]),
      highlight: "30+ members from 7 states",
      cards: [
        {
          title: "Background & Formation",
          text: "Founded by experienced contractors and industry stakeholders to give the sector a unified voice.",
        },
        {
          title: "Role in the Industry",
          text: "Networking, knowledge, skill development and quality standards for the built environment.",
        },
        {
          title: "Representation",
          text: "Structured engagement with Central & State departments, PWD, CPWD and public bodies.",
        },
        {
          title: "Pan-India Expansion",
          text: "A growing network of state chapters, each led by local industry leadership.",
        },
      ],
    },
    // app/page.tsx "Objectives" (cards: initiatives › ObjectivesSection)
    ObjectivesSection: {
      tagline: "Objectives",
      headline: "What the Chamber sets out to achieve",
      linkLabel: "See how we work",
      linkHref: "/initiatives",
    },
    // app/page.tsx "Industry representation" (list: initiatives › WhoWeRepresentSection)
    RepresentationSection: {
      tagline: "Industry Representation",
      headline: "One chamber. Every stakeholder in construction.",
      intro:
        "ICCI represents the full value chain of the construction and allied industries — and engages with Government departments, public bodies and policy makers on their behalf.",
    },
    // app/page.tsx "Key initiatives" (cards: initiatives › KeyInitiativesSection)
    InitiativesSection: {
      tagline: "Key Initiatives",
      headline: "Four pillars that make ICCI work for its members",
      intro:
        "A practical framework designed to position ICCI as the central platform for contractors, subcontractors, workers and departmental stakeholders.",
      linkLabel: "Explore initiatives",
      linkHref: "/initiatives",
    },
    // app/page.tsx "Leadership" (cards: Leaders collection, office bearers)
    LeadershipSection: { ...leadershipIntro },
    // app/page.tsx "Membership" (categories + benefits: membership page)
    MembershipSection: {
      tagline: "Membership",
      headline: "Join the chamber that represents your business",
      intro:
        "ICCI membership is open to businesses, professionals and organisations across the construction and allied industries.",
      linkLabel: "Membership details",
      linkHref: "/membership",
      benefitsHeading: "Benefits of membership",
    },
    // app/page.tsx "News" (stories: News collection, first four by order)
    NewsSection: {
      tagline: "News & Articles",
      headline: "Latest from the Chamber",
      linkLabel: "View all",
      linkHref: "/news",
      readMoreLabel: "Read more",
    },
  },

  about: {
    // app/about/page.tsx banner
    AboutHeroSection: {
      tagline: "About ICCI",
      headline: "Building a stronger",
      scriptAccent: "construction",
      headlineSuffix: " industry, together.",
      image: c.photos.about,
      imageAlt: "",
    },
    AboutUsSection: {
      tagline: "About Us",
      image: c.photos.aboutSite,
      imageAlt: "Construction site",
      badgeLabel: "Not-for-profit",
      badgeTitle: "Nationwide mandate",
      lead: c.about.intro.lead,
      more: para(c.about.intro.more),
    },
    FocusAreasSection: {
      tagline: "What We Work Towards",
      headline: "Where ICCI focuses its efforts",
      items: c.about.focus.map((f) => ({ title: f.title, text: f.text })),
    },
    MissionVisionSection: {
      missionTagline: "Our Mission",
      missionLead: c.about.mission.lead,
      missionMore: para(c.about.mission.more),
      visionTagline: "Our Vision",
      visionLead: c.about.vision.lead,
      visionMore: para(c.about.vision.more),
    },
    LeadershipSection: { ...leadershipIntro },
    ChaptersSection: {
      tagline: "State Chapters",
      headline: "ICCI across India",
      intro:
        "Each state chapter is led by local industry leadership, with a vision to establish a chapter in every state.",
      chapters: c.chapters.map((ch) => ({ state: ch.state, head: ch.head, contact: ch.contact })),
    },
  },

  leadership: {
    // app/leadership/page.tsx (banner photo = heroSlides[3])
    LeadershipHeroSection: {
      tagline: "Leadership",
      headline: "The people building the",
      scriptAccent: "Chamber",
      headlineSuffix: ".",
      image: c.heroSlides[3].photo,
      imageAlt: "",
    },
    RosterSection: {
      groups: [
        { label: "National President", role: "National President" },
        { label: "National Vice Presidents", role: "National Vice President" },
        { label: "National General Secretary", role: "National General Secretary" },
        { label: "National Joint Secretary", role: "National Joint Secretary" },
        { label: "National Treasurer", role: "National Treasurer" },
      ],
      executiveLabel: "National Executive Committee",
    },
    PresidentSection: {
      tagline: "National President",
      headline: "Leading the Chamber",
      readProfileLabel: "Read profile",
    },
    VicePresidentsSection: {
      tagline: "National Vice Presidents",
      headline: "Steering the national agenda",
    },
    SecretariesSection: {
      tagline: "Secretaries & Treasurer",
      headline: "Running the Chamber day to day",
    },
    ExecutiveCommitteeSection: {
      tagline: "National Executive Committee",
      headline: "Industry leaders from across the sector",
    },
  },

  initiatives: {
    // app/initiatives/page.tsx (banner photo = heroSlides[0])
    InitiativesHeroSection: {
      tagline: "Initiatives",
      headline: "How ICCI works for the",
      scriptAccent: "construction",
      headlineSuffix: " industry.",
      image: c.heroSlides[0].photo,
      imageAlt: "",
    },
    // Canonical store for the initiatives cards (also shown on home)
    KeyInitiativesSection: {
      tagline: "Key Initiatives",
      headline: "Four pillars that make ICCI work for its members",
      intro:
        "A practical framework designed to position ICCI as the central platform for contractors, subcontractors, workers and departmental stakeholders.",
      items: c.initiatives.map((i) => ({ tag: i.tag, title: i.title, text: i.text })),
    },
    // Canonical store for the objectives cards (also shown on home)
    ObjectivesSection: {
      tagline: "Objectives",
      headline: "What the Chamber sets out to achieve",
      items: c.objectives.map((o) => ({ title: o.title, text: o.text })),
    },
    // Canonical store for the stakeholders list (also shown on home)
    WhoWeRepresentSection: {
      tagline: "Who We Represent",
      headline: "One chamber. Every stakeholder in construction.",
      intro:
        "ICCI engages with Government departments, public bodies and policy makers on behalf of the full value chain of the construction and allied industries.",
      ctaLabel: "Become a Member",
      ctaLink: "/membership",
      stakeholders: [...c.stakeholders],
    },
  },

  events: {
    // app/events/page.tsx (banner photo = heroSlides[4])
    EventsHeroSection: {
      tagline: "Events",
      headline: "Conferences, meetings and",
      scriptAccent: "workshops",
      headlineSuffix: ".",
      image: c.heroSlides[4].photo,
      imageAlt: "",
    },
    UpcomingEventsSection: {
      tagline: "Upcoming",
      headline: "Upcoming events",
      emptyText: "New events will be announced here soon.",
      emptyCtaLabel: "Contact the secretariat",
      emptyCtaLink: "/contact",
    },
    PastEventsSection: {
      tagline: "Past",
      headline: "Past events",
      emptyText: "Reports and photos from past events will appear here.",
      emptyCtaLabel: "Contact the secretariat",
      emptyCtaLink: "/contact",
    },
  },

  "news-and-articles": {
    // app/news/page.tsx (banner photo = photos.about)
    NewsHeroSection: {
      tagline: "News & Articles",
      headline: "Updates from the",
      scriptAccent: "Chamber",
      headlineSuffix: " and the industry.",
      image: c.photos.about,
      imageAlt: "",
    },
    // components/NewsBrowser.tsx
    NewsBrowserSection: {
      allLabel: "All",
      latestBadge: "Latest",
      readFullStoryLabel: "Read the full story",
      browseTitle: "Browse by topic",
      shareTitle: "Have news to share?",
      shareText:
        "Members can send project milestones, event reports and industry updates for the Chamber to publish.",
      shareCtaLabel: "Contact the secretariat",
      shareCtaLink: "/contact",
    },
    // app/news/[slug]/page.tsx
    ArticlePageSection: {
      backLabel: "All news",
      backLink: "/news",
      moreTitle: "More from the Chamber",
    },
  },

  contact: {
    // app/contact/page.tsx (banner photo = photos.aboutSite)
    ContactHeroSection: {
      tagline: "Contact Us",
      headline: "Get in touch with",
      scriptAccent: "ICCI",
      headlineSuffix: ".",
      image: c.photos.aboutSite,
      imageAlt: "",
    },
    // Address / phone / email values live in Global Config (also used by the footer)
    ContactDetailsSection: {
      addressLabel: "Office Address",
      phoneLabel: "Phone",
      emailLabel: "Email",
      mapTitle: "ICCI office location",
      mapEmbedUrl:
        "https://maps.google.com/maps?q=PHD%20House%2C%204%2F2%20August%20Kranti%20Marg%2C%20Siri%20Institutional%20Area%2C%20Hauz%20Khas%2C%20New%20Delhi%20110016&z=16&output=embed",
    },
    // app/contact/page.tsx + components/Forms.tsx ContactForm
    ContactFormSection: {
      formTitle: "Send us an enquiry",
      fields: [
        { name: "name", label: "Name", placeholder: "Your name" },
        { name: "email", label: "Email", placeholder: "you@company.com" },
        { name: "subject", label: "Subject", placeholder: "How can we help?" },
        { name: "message", label: "Message", placeholder: "Write your message…" },
      ],
      submitLabel: "Send Enquiry",
      successTitle: "Your message has been sent",
      successText: "Our team will get in touch with you shortly.",
      resetLabel: "Submit another response",
    },
  },

  membership: {
    // app/membership/page.tsx (banner photo = heroSlides[1])
    MembershipHeroSection: {
      tagline: "Membership",
      headline: "Join the chamber that represents",
      scriptAccent: "your business",
      headlineSuffix: ".",
      image: c.heroSlides[1].photo,
      imageAlt: "",
    },
    // Canonical store for benefits (also shown on home)
    WhyJoinSection: {
      tagline: "Why Join",
      headline: "What ICCI membership gives you",
      intro:
        "ICCI membership is open to businesses, professionals and organisations across the construction and allied industries.",
      benefits: [...c.benefits],
    },
    // Canonical store for categories (also shown on home + the membership form's select)
    CategoriesSection: {
      tagline: "Membership Categories",
      headline: "Find the category that fits you",
      categories: c.membershipCategories.map((m) => ({ title: m.title, text: m.text })),
      fallbackTitle: "Not sure where you fit?",
      fallbackCtaLabel: "Send an enquiry",
      fallbackCtaLink: "#join",
    },
    HowToJoinSection: {
      tagline: "How to Join",
      headline: "Four steps to membership",
      steps: c.joinSteps.map((s) => ({ title: s.title, text: s.text })),
    },
    // components/sections.tsx MembershipEnquiry + components/Forms.tsx MembershipForm
    // (rendered on home and membership; stored once here)
    MembershipEnquirySection: {
      tagline: "Become a Member",
      headline: "Apply for ICCI membership",
      intro: "Fill in your details and our team will reach out with next steps.",
      eligibilityTitle: "Eligibility",
      eligibilityText:
        "Any registered business, firm, professional or organisation engaged in construction or allied activities in India is eligible to apply. Applications are reviewed by the Chamber's membership committee.",
      formTitle: "Membership Enquiry",
      fields: [
        { name: "name", label: "Full Name", placeholder: "Your name" },
        { name: "organisation", label: "Organisation / Company", placeholder: "Company name" },
        { name: "email", label: "Email", placeholder: "you@company.com" },
        { name: "phone", label: "Phone", placeholder: "+91" },
        { name: "category", label: "Membership Category", placeholder: "Select a category" },
        { name: "state", label: "State", placeholder: "e.g. Uttar Pradesh" },
        {
          name: "message",
          label: "Tell us about your business",
          placeholder: "Nature of work, experience, areas of operation…",
        },
      ],
      submitLabel: "Submit Membership Enquiry",
      successTitle: "Thank you for your interest in ICCI",
      successText: "Our team will get in touch with you shortly.",
      resetLabel: "Submit another response",
    },
  },
};

// ───────────────────────── Collections ─────────────────────────
const toLeader = (tier) => (p, i) => ({
  slug: p.slug,
  name: p.name,
  role: p.role,
  org: p.org ?? "",
  photo: p.photo?.src ?? "",
  photoAlt: p.photo ? p.name : "",
  faceX: p.photo?.face.x ?? 0.5,
  faceY: p.photo?.face.y ?? 0.4,
  bio: p.bio ?? [],
  tier,
  order: i,
});
const leaders = [
  ...c.officeBearers.map(toLeader("office-bearer")),
  ...c.nationalExecutive.map(toLeader("executive")),
];

const news = c.news.map((n, i) => ({
  slug: n.slug,
  title: n.title,
  category: n.category,
  date: n.date,
  img: n.photo,
  imgAlt: "",
  excerpt: n.excerpt,
  body: [...n.body],
  order: i,
}));

const events = c.events.map((e, i) => ({
  title: e.title,
  date: e.date,
  location: e.location,
  text: e.text,
  isPast: Boolean(e.past),
  order: i,
}));

// ───────────────────────── Global chrome ─────────────────────────
const SITE_URL = "https://icci.co.in";
const socialUrl = (key) => c.social.find((s) => s.key === key)?.href ?? "";

const global = {
  config: {
    // app/layout.tsx metadata
    siteTitle: "ICCI – Indian Chamber of Construction Industry",
    siteDescription:
      "The Indian Chamber of Construction Industry (ICCI) unites contractors, builders, consultants, suppliers and allied professionals to collaborate, innovate and build a better India.",
    // components/Logo.tsx + app/apple-icon.png
    logo: "/logo/icci-logo.webp",
    logoMark: "/logo/icci-mark.webp",
    logoMarkWhite: "/logo/icci-mark-white.webp",
    favicon: "/apple-icon.png",
    ogImage: "",
    // lib/content.ts contact
    address: c.contact.address,
    phone: c.contact.phone,
    email: c.contact.email,
    facebookUrl: socialUrl("facebook"),
    instagramUrl: socialUrl("instagram"),
    linkedinUrl: socialUrl("linkedin"),
    xUrl: socialUrl("x"),
    youtubeUrl: socialUrl("youtube"),
    socialLinks: c.social.map((s) => ({ key: s.key, label: s.label, href: s.href })),
    // components/Header.tsx, components/Footer.tsx, components/Logo.tsx
    footerContent: {
      headerBrandLine1: "Indian Chamber of",
      headerBrandLine2: "Construction Industry",
      logoAlt: "Indian Chamber of Construction Industry – Collaborate • Innovate • Transform",
      logoMarkAlt: "ICCI emblem",
      followUsLabel: "Follow Us",
      quickLinksTitle: "Quick Links",
      reachUsTitle: "Reach Us",
      copyrightText: "Indian Chamber of Construction Industry. All rights reserved.",
    },
    robotsTxt: `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml`,
    sitemapEnabled: true,
    schema: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Indian Chamber of Construction Industry",
        alternateName: "ICCI",
        url: `${SITE_URL}/`,
        logo: "/logo/icci-logo.webp",
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
        telephone: c.contact.phone,
        email: c.contact.email,
        sameAs: c.social.map((s) => s.href),
      },
      null,
      2,
    ),
  },
  // lib/content.ts nav + components/Header.tsx "Become a Member" button.
  // The footer "Quick Links" column reuses the same nav list on the website.
  navLinks: [
    ...c.nav.map((n, i) => ({
      id: `nav-${n.href.replace(/^\//, "")}`,
      label: n.label,
      url: n.href,
      type: "Main Link",
      parent: "-",
      order: i + 1,
    })),
    {
      id: "nav-become-member",
      label: "Become a Member",
      url: "/membership#join",
      type: "Action Button",
      parent: "-",
      order: c.nav.length + 1,
    },
  ],
  newsCategories: Array.from(new Set(c.news.map((n) => n.category))),
};

// Website image paths → Cloudinary URLs (written by scripts/upload-website-assets.js)
const ASSETS_FILE = path.join(OUT_DIR, "uploaded-assets.json");
const assets = fs.existsSync(ASSETS_FILE) ? JSON.parse(fs.readFileSync(ASSETS_FILE, "utf8")) : {};
const unmapped = new Set();
const IMAGE_RE = /^(\/.+\.(webp|png|jpe?g|gif|svg|avif|ico)|https:\/\/images\.unsplash\.com\/.+)$/i;
function toCdn(value) {
  if (typeof value === "string") {
    if (assets[value]) return assets[value];
    if (IMAGE_RE.test(value)) unmapped.add(value);
    // JSON-LD text holds image paths inside a string
    return Object.entries(assets).reduce((t, [from, to]) => t.split(`"${from}"`).join(`"${to}"`), value);
  }
  if (Array.isArray(value)) return value.map(toCdn);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toCdn(v)]));
  }
  return value;
}

const write = (name, data) => {
  fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(toCdn(data), null, 2) + "\n");
  console.log(`✓ prisma/${name}`);
};

write("static-pages-seed.json", staticPages);
write("leaders-seed.json", leaders);
write("news-seed.json", news);
write("events-seed.json", events);
write("global-seed.json", global);

if (unmapped.size) {
  console.warn(`⚠ ${unmapped.size} image(s) have no Cloudinary URL yet — run \`npm run assets:upload\`, then this script again:`);
  for (const u of unmapped) console.warn(`   ${u}`);
} else {
  console.log("✓ All seed images use Cloudinary URLs");
}
