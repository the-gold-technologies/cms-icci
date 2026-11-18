# Frontend Integration (ICCI website ↔ ICCI CMS)

> **Status: not connected.** The website (`../icci`) still renders from `icci/lib/content.ts`. This is the plan for when integration is approved.

## 1. Website env (`icci/.env.local`)

```env
CMS_URL="http://localhost:3001"
CMS_SHARED_SECRET="<same value as icci-cms/.env>"
```

## 2. Read API (public GET, JSON `{ success, data, seo }`)

| Endpoint                                                                                             | Returns                                 | Cache tag     |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------- |
| `/api/pages/<slug>` (home, about, leadership, initiatives, events, news-and-articles, contact, membership) | `{ [SectionType]: content }` + page SEO | `page:<slug>` |
| `/api/leaders`                                                                                       | leaders (office-bearer first, by order) | `leaders`     |
| `/api/news`, `/api/news/<id>`                                                                        | articles by order                       | `news`        |
| `/api/events`                                                                                        | events (upcoming first)                 | `events`      |
| `/api/seo/global`, `/api/nav-links`                                                                  | brand, contact, social, footer, menu    | `site`        |

Shared lists are read from their single home: objectives / initiatives / stakeholders from `initiatives`, categories / benefits / membership enquiry from `membership`.

## 3. Client sketch (`icci/lib/cms.ts`)

Fetch with `next: { tags, revalidate: 3600 }` and fall back to `lib/content.ts` on any error, so the site never breaks if the CMS is offline.

## 4. Revalidation

On every save the CMS POSTs `{ tags: string[] }` to `<website>/api/revalidate` with header `x-cms-secret`. The website route calls `revalidateTag` for each tag.

## 5. Forms

`POST /api/submissions` with header `x-cms-secret`, JSON:
`{ formType: "membership" | "contact", fullName, email, phone?, organisation?, membershipCategory?, state?, subject?, message }`.

## 6. Images

Image fields hold Cloudinary URLs once `npm run assets:upload` has run; add `res.cloudinary.com` to the website's `images.remotePatterns`.
