/**
 * Single source of truth for the ICCI website's pages, used by the Sidebar, dashboard
 * PageStructure, SEO page list, sitemap and seed. Order = website order (header nav, then
 * Membership, which is reached from "Become a Member").
 *
 * SEO values are copied verbatim from each website page's `metadata` export (icci/app/**).
 * The website has no keywords, so `targetKeywords` stays empty.
 */

/** Public domain of the website, used for canonical URLs, sitemap and robots. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://icci.co.in").replace(
  /\/$/,
  "",
);

export interface SitePage {
  slug: string; // CMS page slug (Page.slug, /api/<slug>, /static-pages/<slug>)
  title: string;
  route: string; // website route
  editorUrl: string;
  type: string;
  sections: string[]; // Section.type values in website render order
  metaTitle: string;
  metaDescription: string;
}

export const SITE_PAGES: SitePage[] = [
  {
    slug: "home",
    title: "Home",
    route: "/",
    editorUrl: "/static-pages/home",
    type: "Main Landing",
    sections: [
      "HeroSection",
      "HighlightsSection",
      "AboutSection",
      "ObjectivesSection",
      "RepresentationSection",
      "InitiativesSection",
      "LeadershipSection",
      "MembershipSection",
      "NewsSection",
      // + Membership Enquiry block, stored once under membership › MembershipEnquirySection
    ],
    metaTitle: "ICCI – Indian Chamber of Construction Industry",
    metaDescription:
      "The Indian Chamber of Construction Industry (ICCI) unites contractors, builders, consultants, suppliers and allied professionals to collaborate, innovate and build a better India.",
  },
  {
    slug: "about",
    title: "About",
    route: "/about",
    editorUrl: "/static-pages/about",
    type: "Institutional",
    sections: [
      "AboutHeroSection",
      "AboutUsSection",
      "FocusAreasSection",
      "MissionVisionSection",
      "LeadershipSection",
      "ChaptersSection",
    ],
    metaTitle: "About – ICCI",
    metaDescription:
      "The Indian Chamber of Construction Industry is a not-for-profit organisation representing, promoting and protecting the interests of India’s construction and allied industries.",
  },
  {
    slug: "leadership",
    title: "Leadership",
    route: "/leadership",
    editorUrl: "/static-pages/leadership",
    type: "People",
    sections: [
      "LeadershipHeroSection",
      "RosterSection",
      "PresidentSection",
      "VicePresidentsSection",
      "SecretariesSection",
      "ExecutiveCommitteeSection",
    ],
    metaTitle: "Leadership – ICCI",
    metaDescription:
      "The national office bearers and National Executive Committee of the Indian Chamber of Construction Industry.",
  },
  {
    slug: "initiatives",
    title: "Initiatives",
    route: "/initiatives",
    editorUrl: "/static-pages/initiatives",
    type: "Programmes",
    sections: [
      "InitiativesHeroSection",
      "KeyInitiativesSection",
      "ObjectivesSection",
      "WhoWeRepresentSection",
    ],
    metaTitle: "Initiatives – ICCI",
    metaDescription: "ICCI's key initiatives, objectives and the stakeholders it represents.",
  },
  {
    slug: "events",
    title: "Events",
    route: "/events",
    editorUrl: "/static-pages/events",
    type: "Calendar",
    sections: ["EventsHeroSection", "UpcomingEventsSection", "PastEventsSection"],
    metaTitle: "Events – ICCI",
    metaDescription: "Upcoming and past ICCI conferences, meetings and workshops.",
  },
  {
    slug: "news-and-articles",
    title: "News & Articles",
    route: "/news",
    editorUrl: "/static-pages/news-and-articles",
    type: "Media",
    sections: ["NewsHeroSection", "NewsBrowserSection", "ArticlePageSection"],
    metaTitle: "News & Articles – ICCI",
    metaDescription:
      "Updates from the Indian Chamber of Construction Industry and the wider construction sector.",
  },
  {
    slug: "contact",
    title: "Contact",
    route: "/contact",
    editorUrl: "/static-pages/contact",
    type: "Enquiry",
    sections: ["ContactHeroSection", "ContactDetailsSection", "ContactFormSection"],
    metaTitle: "Contact – ICCI",
    metaDescription: "Get in touch with the Indian Chamber of Construction Industry.",
  },
  {
    slug: "membership",
    title: "Membership",
    route: "/membership",
    editorUrl: "/static-pages/membership",
    type: "Join",
    sections: [
      "MembershipHeroSection",
      "WhyJoinSection",
      "CategoriesSection",
      "HowToJoinSection",
      "MembershipEnquirySection",
    ],
    metaTitle: "Membership – ICCI",
    metaDescription: "Why join ICCI, membership categories, eligibility and how to apply.",
  },
];

export const canonicalFor = (route: string) => `${SITE_URL}${route === "/" ? "/" : route}`;

/** Website enquiry forms → CMS inbox pages. */
export const FORM_TYPES = [
  { key: "membership", label: "Membership Enquiries", short: "Membership Enquiry" },
  { key: "contact", label: "Contact Enquiries", short: "Contact Enquiry" },
] as const;

export const LEADER_ROLES = [
  "National President",
  "National Vice President",
  "National General Secretary",
  "National Joint Secretary",
  "National Treasurer",
  "National Executive Committee",
] as const;

export const LEADER_TIERS = [
  { key: "office-bearer", label: "National Office Bearer" },
  { key: "executive", label: "National Executive Committee" },
] as const;
