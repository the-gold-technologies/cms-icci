# ICCI CMS — Plan & Status

CMS for the Indian Chamber of Construction Industry website (`../icci`). Built on the `lfcs-school-cms` architecture.
Last updated: 2026-11-17.

## Phase 1 — Foundation ✅
- [x] Scaffold copied from `lfcs-school-cms` (Next.js 16, Prisma, NextAuth, Cloudinary + sharp, Tailwind v4)
- [x] ICCI branding: saffron `#ee6a2c` primary; shared CMS navy sidebar, gold accent, Inter + Playfair (same look as the other CMSs)
- [x] Prisma schema for ICCI (`Leader`, `NewsItem`, `Event`, `Submission`, `GlobalConfig`, `Page`/`Section`, `NavLink`, `DynamicCategory`)
- [x] Local PostgreSQL `icci_cms` (localhost:5432), migration `init`, seed run
- [x] `AGENTS.md` and `.agents/rules/*` renamed/updated for ICCI

## Phase 2 — Content ✅
- [x] `docs/CONTENT_INVENTORY.md` (page → section → fields)
- [x] `scripts/build-seed-from-website.js` — verbatim seed JSON from `icci/lib/content.ts` + transcribed inline copy
- [x] `prisma/seed.js` — idempotent; never resets an existing admin password; `SEED_OVERWRITE=1` to replace content
- [x] 30 website images compressed to WebP (sharp, ≤2000 px, q82) and uploaded to Cloudinary `icci/` (`npm run assets:upload`); DB switched with `npm run assets:apply`; seed resolves them via `prisma/uploaded-assets.json`

## Phase 3 — Page editors ✅ (8 pages, 39 sections)
- [x] Home (9 sections + shared membership enquiry banner)
- [x] About (6) · Leadership (6) · Initiatives (4) · Events (3) · News & Articles (3) · Contact (3) · Membership (5)

## Phase 4 — Collections ✅
- [x] Leaders (list by tier, create/edit, portrait + face-position, bio, reorder)
- [x] News & Articles (categories, slug, body paragraphs, reorder; first 4 shown on home)
- [x] Events (upcoming/past, reorder)
- [x] Submissions inbox: Membership Enquiries, Contact Enquiries (+ SMTP alert e-mail)

## Phase 5 — Global & SEO ✅
- [x] Menu links (6 main links + Become a Member button)
- [x] Social Media & Footer (logos, header brand lines, contact details, ordered social links, footer copy)
- [x] Page SEO seeded from each website page's `metadata`; global SEO + Organization JSON-LD
- [x] sitemap.xml (pages + `/news/<slug>`), robots.txt

## Phase 6 — Verification ✅
- [x] `npm run verify` — key coverage, DB vs seed, website ↔ CMS string diff: all pass
- [x] `npm run build` passes
- [x] Smoke test: login, all editors return 200, unauthenticated writes rejected, save round-trip unchanged

## Phase 7 — Website integration ⏸ (on hold — not to be connected yet)
- [ ] `icci/lib/cms.ts` client + `/api/revalidate` route on the website
- [ ] Pages read CMS content with `icci/lib/content.ts` as the offline fallback
- [ ] Forms post to `/api/submissions`
See `docs/FRONTEND_INTEGRATION.md`.

## Open questions for the Chamber
- Public domain assumed `https://icci.co.in` (from the contact e-mail) — confirm.
- Website news articles, state chapters and the join process are placeholders on the site itself; replace in the CMS when real copy arrives.
