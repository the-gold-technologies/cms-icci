# ICCI CMS — Architecture

## 1. Principles
1. **Separation** — `icci` is the public website; `icci-cms` is the admin dashboard and headless content API.
2. **Resilience** — the website must keep `icci/lib/content.ts` as an offline fallback (integration not done yet).
3. **Parity** — one editor per website section, same order; every key loaded and saved (`useSectionEditor` runs one `normalize()` on load and save).
4. **Store once** — lists rendered on two pages live on one page (see `docs/CONTENT_INVENTORY.md`).
5. **Optimised media** — uploads go through sharp (rotate, strip metadata, ≤2000 px, WebP q82) before Cloudinary; replaced/removed media is cleaned up.

## 2. Stack
Next.js 16.1 (App Router, `--webpack`) · React 19 · TypeScript · Tailwind v4 · PostgreSQL + Prisma 6.19 (`@prisma/adapter-pg`) · NextAuth v5 credentials · Cloudinary + sharp · react-hot-toast · lucide-react.

## 3. Data model (`prisma/schema.prisma`)
- `Page` (slug, SEO fields) → `Section` (type = website section name, `content` JSON), unique on `pageId+type`.
- `Leader` — slug (anchor), name, role, org, photo, faceX/faceY, bio `string[]`, tier `office-bearer|executive`, order.
- `NewsItem` — slug, title, category, date, img, excerpt, body `string[]`, order.
- `Event` — title, date, location, text, isPast, order.
- `DynamicCategory` (type `news`) · `Submission` (formType `membership|contact`) · `NavLink` · `GlobalConfig` (brand, contact, social, `footerContent`, SEO, robots/sitemap) · `User`.

## 4. Code layout
- `src/lib/site-pages.ts` — single list of website pages, routes, section order and page SEO (Sidebar, dashboard, SEO, sitemap).
- `src/lib/useSectionEditor.ts` — section state + save; `usePageData`.
- `src/lib/useCollection.ts` — list/delete/reorder for collections.
- `src/components/` — shared kit: `SectionShell`, `HeadingFields`, `RepeaterField`, `ManagedElsewhereBanner`, `BannerSectionEditor`, `IntroSectionEditor`, `ListSectionEditor`, `EnquiryFormFields` + the LFCS kit (`InputField`, `TextAreaField`, `ImagePickerField`, `CollapsibleCard`, `SaveButton`, `PageHeader`, ...).
- `src/app/static-pages/<slug>/` — page editor + `components/<Section>.tsx`.
- `src/app/api/<slug>/route.ts` — `createPageRouteHandlers(slug, title)`.
- `scripts/` — `build-seed-from-website.js`, `upload-website-assets.js`, `verify-parity.js`.

## 5. Security
All mutations call `checkAdminSession()`; website-originated submissions use `x-cms-secret`. The proxy redirects unauthenticated page requests to `/login`.
