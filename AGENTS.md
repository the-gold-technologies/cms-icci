# ICCI CMS — AI Agent Operational Guidelines

## Overview

This CMS application provides administrative management for the Indian Chamber of Construction Industry website (`icci`, sibling folder `../icci`).
It is built strictly adhering to the architectural patterns established in `lfcs-school-cms` / `kokalachi-cms`.

- Local database: PostgreSQL `icci_cms` on `localhost:5432` (see `.env`; viewable in pgAdmin 4).
- Dev server: `npm run dev` → http://localhost:3001 (the website runs on :3000).

## Rules for AI Assistants

1. **Reference Docs First**: Before adding features or making modifications, review `docs/PLAN_AND_STATUS.md`, `docs/ARCHITECTURE.md` and `docs/CONTENT_INVENTORY.md`.
2. **Keep Status Updated**: When completing a module or file, update the checklist in `docs/PLAN_AND_STATUS.md`.
3. **Preserve Resilient Fallback**: Always maintain zero-downtime static fallbacks in `icci/lib/content.ts` so the live ICCI website never breaks if the CMS is offline.
4. **Sharp Image Optimization**: Never upload uncompressed image buffers directly to Cloudinary. Always process through `sharp` (WebP conversion + max 2000px downscale). Seed images go through `npm run assets:upload` and `prisma/uploaded-assets.json`.
5. **Component Parity**: Any changes to frontend sections in `icci` must be mirrored in `src/app/static-pages/` editors in `icci-cms`, in `scripts/build-seed-from-website.js`, and in `src/lib/site-pages.ts`.
6. **Empty Value Fallbacks**: Always provide an empty value (`""`, `[]`, or `{}`) at logical OR (`||` / `??`) fallback options (e.g. `initialData?.field || ""` or `?? ""`) and include empty `<option value="">` in select elements.
7. **Shared Lists Are Stored Once**: Objectives, key initiatives and stakeholders live on the Initiatives page; membership categories, benefits and the membership enquiry block live on the Membership page. Home shows them via "managed elsewhere" banners — never duplicate them.
8. **Detailed Rules**: Follow `.agents/rules/coding-rules.md`, `.agents/rules/cms-content-parity.md` and `.agents/rules/cms-ui-and-structure.md`.
