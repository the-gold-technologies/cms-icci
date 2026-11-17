# ICCI CMS

Admin CMS for the **Indian Chamber of Construction Industry** website (`../icci`).

## Local setup

```bash
cp .env.example .env            # already done locally: DB icci_cms on localhost:5432
npm install
npx prisma migrate dev          # create tables
npm run seed:build              # regenerate seed JSON from ../icci (verbatim)
npm run seed                    # idempotent; prints a generated admin password on first run
npm run dev                     # http://localhost:3001
```

## Scripts

| Script                  | Purpose                                                                           |
| ----------------------- | --------------------------------------------------------------------------------- |
| `npm run seed:build`    | Rebuild `prisma/*-seed.json` from the website source                              |
| `npm run assets:upload` | Upload website images via sharp → Cloudinary, write `prisma/uploaded-assets.json` |
| `npm run seed`          | Seed DB (only missing content; `SEED_OVERWRITE=1` replaces content)               |
| `npm run verify`        | Parity checks from `.agents/rules/cms-content-parity.md` §7                       |
| `npm run build`         | Production build                                                                  |

## Viewing the database in pgAdmin 4

Register a server: host `localhost`, port `5432`, maintenance DB `postgres`, username `sudeeshkumar`, no password. Open **Databases › icci_cms › Schemas › public › Tables**.

## Docs

`AGENTS.md`, `.agents/rules/`, `docs/PLAN_AND_STATUS.md`, `docs/ARCHITECTURE.md`, `docs/CONTENT_INVENTORY.md`, `docs/FRONTEND_INTEGRATION.md` (website connection — on hold).
