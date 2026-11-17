# ICCI Website — Content Inventory

Derived from the website source in `../icci` (rule: `.agents/rules/cms-content-parity.md` §1).
Seed values are generated verbatim by `scripts/build-seed-from-website.js` (arrays straight from `icci/lib/content.ts`).

Heading convention: `headline` + saffron `scriptAccent` + `headlineSuffix` (suffix keeps its leading space and final full stop).

## Static pages

### home — `/`  
Source: `app/page.tsx, components/HeroCarousel.tsx, components/sections.tsx`

| # | Section (`Section.type`) | Fields | Data from elsewhere |
|---|---|---|---|
| 1 | `HeroSection` | `tagline`: text<br>`headline`: text<br>`scriptAccent`: text<br>`headlineSuffix`: text<br>`primaryCtaLabel`: text<br>`primaryCtaLink`: text<br>`secondaryCtaLabel`: text<br>`secondaryCtaLink`: text<br>`slides`: array[5] of {tag, title, text, image, imageAlt}<br>`trustPoints`: string[2]<br>`membersValue`: text<br>`membersLabel`: text<br>`membersCtaLabel`: text<br>`membersCtaLink`: text<br>`fieldsLabel`: text<br>`fields`: array[4] of {label, image, imageAlt} |  |
| 2 | `HighlightsSection` | `stats`: array[4] of {value, label} |  |
| 3 | `AboutSection` | `tagline`: text<br>`headline`: text<br>`description`: text (2 paragraphs)<br>`highlight`: text<br>`cards`: array[4] of {title, text} |  |
| 4 | `ObjectivesSection` | `tagline`: text<br>`headline`: text<br>`linkLabel`: text<br>`linkHref`: text | cards → initiatives › ObjectivesSection |
| 5 | `RepresentationSection` | `tagline`: text<br>`headline`: text<br>`intro`: text | list → initiatives › WhoWeRepresentSection |
| 6 | `InitiativesSection` | `tagline`: text<br>`headline`: text<br>`intro`: text<br>`linkLabel`: text<br>`linkHref`: text | cards → initiatives › KeyInitiativesSection |
| 7 | `LeadershipSection` | `tagline`: text<br>`headline`: text<br>`intro`: text<br>`linkLabel`: text<br>`linkHref`: text | cards → Leader collection (office-bearer) |
| 8 | `MembershipSection` | `tagline`: text<br>`headline`: text<br>`intro`: text<br>`linkLabel`: text<br>`linkHref`: text<br>`benefitsHeading`: text | categories → membership › CategoriesSection; benefits → membership › WhyJoinSection |
| 9 | `NewsSection` | `tagline`: text<br>`headline`: text<br>`linkLabel`: text<br>`linkHref`: text<br>`readMoreLabel`: text | stories → NewsItem (first 4 by order) |
| 10 | Membership Enquiry (`#join`) | — | stored once in membership › `MembershipEnquirySection` |

### about — `/about`  
Source: `app/about/page.tsx`

| # | Section (`Section.type`) | Fields | Data from elsewhere |
|---|---|---|---|
| 1 | `AboutHeroSection` | `tagline`: text<br>`headline`: text<br>`scriptAccent`: text<br>`headlineSuffix`: text<br>`image`: text<br>`imageAlt`: text |  |
| 2 | `AboutUsSection` | `tagline`: text<br>`image`: text<br>`imageAlt`: text<br>`badgeLabel`: text<br>`badgeTitle`: text<br>`lead`: text<br>`more`: text (3 paragraphs) |  |
| 3 | `FocusAreasSection` | `tagline`: text<br>`headline`: text<br>`items`: array[4] of {title, text} |  |
| 4 | `MissionVisionSection` | `missionTagline`: text<br>`missionLead`: text<br>`missionMore`: text (4 paragraphs)<br>`visionTagline`: text<br>`visionLead`: text<br>`visionMore`: text (4 paragraphs) |  |
| 5 | `LeadershipSection` | `tagline`: text<br>`headline`: text<br>`intro`: text<br>`linkLabel`: text<br>`linkHref`: text | cards → Leader collection (office-bearer) |
| 6 | `ChaptersSection` | `tagline`: text<br>`headline`: text<br>`intro`: text<br>`chapters`: array[7] of {state, head, contact} |  |

### leadership — `/leadership`  
Source: `app/leadership/page.tsx`

| # | Section (`Section.type`) | Fields | Data from elsewhere |
|---|---|---|---|
| 1 | `LeadershipHeroSection` | `tagline`: text<br>`headline`: text<br>`scriptAccent`: text<br>`headlineSuffix`: text<br>`image`: text<br>`imageAlt`: text |  |
| 2 | `RosterSection` | `groups`: array[5] of {label, role}<br>`executiveLabel`: text | names → Leader collection by role |
| 3 | `PresidentSection` | `tagline`: text<br>`headline`: text<br>`readProfileLabel`: text |  |
| 4 | `VicePresidentsSection` | `tagline`: text<br>`headline`: text |  |
| 5 | `SecretariesSection` | `tagline`: text<br>`headline`: text |  |
| 6 | `ExecutiveCommitteeSection` | `tagline`: text<br>`headline`: text |  |

### initiatives — `/initiatives`  
Source: `app/initiatives/page.tsx`

| # | Section (`Section.type`) | Fields | Data from elsewhere |
|---|---|---|---|
| 1 | `InitiativesHeroSection` | `tagline`: text<br>`headline`: text<br>`scriptAccent`: text<br>`headlineSuffix`: text<br>`image`: text<br>`imageAlt`: text |  |
| 2 | `KeyInitiativesSection` | `tagline`: text<br>`headline`: text<br>`intro`: text<br>`items`: array[4] of {tag, title, text} |  |
| 3 | `ObjectivesSection` | `tagline`: text<br>`headline`: text<br>`items`: array[6] of {title, text} |  |
| 4 | `WhoWeRepresentSection` | `tagline`: text<br>`headline`: text<br>`intro`: text<br>`ctaLabel`: text<br>`ctaLink`: text<br>`stakeholders`: string[8] |  |

### events — `/events`  
Source: `app/events/page.tsx`

| # | Section (`Section.type`) | Fields | Data from elsewhere |
|---|---|---|---|
| 1 | `EventsHeroSection` | `tagline`: text<br>`headline`: text<br>`scriptAccent`: text<br>`headlineSuffix`: text<br>`image`: text<br>`imageAlt`: text |  |
| 2 | `UpcomingEventsSection` | `tagline`: text<br>`headline`: text<br>`emptyText`: text<br>`emptyCtaLabel`: text<br>`emptyCtaLink`: text | items → Event (isPast=false) |
| 3 | `PastEventsSection` | `tagline`: text<br>`headline`: text<br>`emptyText`: text<br>`emptyCtaLabel`: text<br>`emptyCtaLink`: text | items → Event (isPast=true) |

### news-and-articles — `/news`  
Source: `app/news/page.tsx, components/NewsBrowser.tsx, app/news/[slug]/page.tsx`

| # | Section (`Section.type`) | Fields | Data from elsewhere |
|---|---|---|---|
| 1 | `NewsHeroSection` | `tagline`: text<br>`headline`: text<br>`scriptAccent`: text<br>`headlineSuffix`: text<br>`image`: text<br>`imageAlt`: text |  |
| 2 | `NewsBrowserSection` | `allLabel`: text<br>`latestBadge`: text<br>`readFullStoryLabel`: text<br>`browseTitle`: text<br>`shareTitle`: text<br>`shareText`: text<br>`shareCtaLabel`: text<br>`shareCtaLink`: text | items/categories → NewsItem, DynamicCategory(news) |
| 3 | `ArticlePageSection` | `backLabel`: text<br>`backLink`: text<br>`moreTitle`: text |  |

### contact — `/contact`  
Source: `app/contact/page.tsx, components/Forms.tsx`

| # | Section (`Section.type`) | Fields | Data from elsewhere |
|---|---|---|---|
| 1 | `ContactHeroSection` | `tagline`: text<br>`headline`: text<br>`scriptAccent`: text<br>`headlineSuffix`: text<br>`image`: text<br>`imageAlt`: text |  |
| 2 | `ContactDetailsSection` | `addressLabel`: text<br>`phoneLabel`: text<br>`emailLabel`: text<br>`mapTitle`: text<br>`mapEmbedUrl`: text | address/phone/email → GlobalConfig |
| 3 | `ContactFormSection` | `formTitle`: text<br>`fields`: array[4] of {name, label, placeholder}<br>`submitLabel`: text<br>`successTitle`: text<br>`successText`: text<br>`resetLabel`: text |  |

### membership — `/membership`  
Source: `app/membership/page.tsx, components/sections.tsx, components/Forms.tsx`

| # | Section (`Section.type`) | Fields | Data from elsewhere |
|---|---|---|---|
| 1 | `MembershipHeroSection` | `tagline`: text<br>`headline`: text<br>`scriptAccent`: text<br>`headlineSuffix`: text<br>`image`: text<br>`imageAlt`: text |  |
| 2 | `WhyJoinSection` | `tagline`: text<br>`headline`: text<br>`intro`: text<br>`benefits`: string[8] |  |
| 3 | `CategoriesSection` | `tagline`: text<br>`headline`: text<br>`categories`: array[7] of {title, text}<br>`fallbackTitle`: text<br>`fallbackCtaLabel`: text<br>`fallbackCtaLink`: text |  |
| 4 | `HowToJoinSection` | `tagline`: text<br>`headline`: text<br>`steps`: array[4] of {title, text} |  |
| 5 | `MembershipEnquirySection` | `tagline`: text<br>`headline`: text<br>`intro`: text<br>`eligibilityTitle`: text<br>`eligibilityText`: text<br>`formTitle`: text<br>`fields`: array[7] of {name, label, placeholder}<br>`submitLabel`: text<br>`successTitle`: text<br>`successText`: text<br>`resetLabel`: text |  |

## Collections

| Model | Website use | Seed |
|---|---|---|
| `Leader` | Home + About (office bearers), Leadership page (all; by role/tier), profile pop-ups | 16 (7 office bearers, 9 executive) — `prisma/leaders-seed.json` |
| `NewsItem` | /news, /news/[slug], home (first 4) | 4 placeholder articles (website body text is itself placeholder) |
| `Event` | /events (upcoming / past) | 0 — the website has no events yet |
| `DynamicCategory` (type `news`) | News filter chips & sidebar | 4 categories |
| `Submission` | MembershipForm (`membership`), ContactForm (`contact`) | — |

## Global chrome (`GlobalConfig`, `NavLink`)

- Header: emblem (`logoMark`, `logoMarkWhite`), two brand lines, nav links (6 Main Links) + **Become a Member** action button → `NavLink`.
- Footer: full logo (`logo`), Follow Us / Quick Links / Reach Us headings, copyright → `footerContent`; Quick Links reuse the header Main Links; contact → `address`, `phone`, `email`.
- Social rail + footer icons → `socialLinks` (ordered; also mirrored to `facebookUrl`, `instagramUrl`, `linkedinUrl`, `xUrl`, `youtubeUrl`).
- Metadata: `app/layout.tsx` title/description → `siteTitle`, `siteDescription`; favicon → `app/apple-icon.png`; per-page metadata → `Page.metaTitle/metaDescription`.

## Shared data (stored once)

| Data | Stored in | Also rendered on |
|---|---|---|
| Objectives (6) | initiatives › `ObjectivesSection.items` | home Objectives |
| Key initiatives (4) | initiatives › `KeyInitiativesSection.items` | home Key Initiatives |
| Stakeholders (8) | initiatives › `WhoWeRepresentSection.stakeholders` | home Industry Representation |
| Membership categories (7) | membership › `CategoriesSection.categories` | home Membership, membership form category select |
| Benefits (8) | membership › `WhyJoinSection.benefits` | home Membership |
| Membership enquiry block | membership › `MembershipEnquirySection` | home (bottom) |
| Leadership section intro | home + about `LeadershipSection` (two identical copies) | — |

## Not modelled

- `SuggestionForm` (components/Forms.tsx) — exported but not rendered on any page.
- UI chrome: "Read more / Read less", aria labels ("Toggle menu", "Close", "Next field", carousel labels), "Show slide N".
- Icons fixed by position: highlights strip (people, map, voice, globe), About focus areas — not editable.
- Splash screen animation (uses the full logo from Global Config).

## Images

All seeded images (30: Unsplash placeholders, 12 leader portraits, 3 logos, apple icon) are listed by `npm run assets:upload`, which runs them through sharp (WebP q82, ≤2000 px) to Cloudinary and records them in `prisma/uploaded-assets.json`. Until that runs, the DB holds the website paths/URLs.
