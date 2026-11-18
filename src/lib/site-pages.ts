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
  slug: string; // CMS page slug (Page.slug, /api/pages/<slug>, /static-pages/<slug>)
  title: string;
  route: string; // website route
  editorUrl: string;
  type: string;
  sections: string[]; // Section.type values in website render order
  metaTitle: string;
  metaDescription: string;
  schema?: string;
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
    ],
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
            publisher: {
              "@id": "https://icci.co.in/#organization",
            },
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
            isPartOf: {
              "@id": "https://icci.co.in/#website",
            },
            about: {
              "@id": "https://icci.co.in/#organization",
            },
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
    editorUrl: "/static-pages/events",
    type: "Calendar",
    sections: ["EventsHeroSection", "UpcomingEventsSection", "PastEventsSection"],
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
    editorUrl: "/static-pages/news-and-articles",
    type: "Media",
    sections: ["NewsHeroSection", "NewsBrowserSection", "ArticlePageSection"],
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
    editorUrl: "/static-pages/contact",
    type: "Enquiry",
    sections: ["ContactHeroSection", "ContactDetailsSection", "ContactFormSection"],
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
