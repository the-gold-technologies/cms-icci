# ICCI CMS

Headless Content Management System and administration portal for the **Indian Chamber of Construction Industry (ICCI)** web platform.

Built with **Next.js 16 (App Router)**, **Prisma ORM**, **PostgreSQL**, **Tailwind CSS**, and **NextAuth**.

---

## Features

- **Static Page Content Editors**: Modular, section-by-section content management across all public pages:
  - **Home**: Hero carousel, highlights strip, about the Chamber, objectives, industry representation, initiatives, office bearers preview, membership benefits, and latest news.
  - **About**: Narrative story, focus area pillars, mission & vision statements, leadership overview, and regional chapter directory.
  - **Initiatives**: Key policy advocacy, skill development, green construction, and stakeholder representation.
  - **Leadership**: Hierarchical tiers for National President, Vice Presidents, Secretariat & Treasurer, and National Executive Committee with bio modal popovers.
  - **Membership**: Value proposition benefits, category classifications, application steps, and eligibility requirements.
  - **Events**: Upcoming event spotlights and past archive records.
  - **News & Articles**: Editorial feed, category filters, sidebar topics, and single-article reader templates.
  - **Contact**: Secretariat contact details, interactive Google Maps embed, and enquiry form copy.
- **Dynamic Collections**: Dedicated CRUD modules for Leaders, Events, News Articles, Navigation Links, and Form Submissions.
- **Comprehensive SEO & Webmaster Suite**:
  - Global site metadata, Open Graph cards, and favicon/logo assets.
  - Per-page meta titles, descriptions, canonical URLs, target keywords, heading tags (`<h1>`–`<h6>`), and `noindex` controls.
  - Structured JSON-LD schema injection for search engines.
  - Dynamic XML Sitemap generator (`/sitemap.xml`) and customizable `robots.txt` (`/robots.txt`).
  - Webmaster integrations: Google Analytics 4 (GA4), Google Tag Manager (GTM), Google Search Console verification, and custom script injection.
- **Form Submissions & Email Alerts**:
  - Inboxes for General Contact enquiries and Membership applications.
  - Automated SMTP notification emails to the secretariat upon visitor submission.
- **Media Optimization & Cloudinary Integration**:
  - Direct media uploads with Sharp processing and Cloudinary CDN storage.
  - Automatic cleanup of orphaned Cloudinary assets upon content updates or deletions.
- **On-Demand Cache Invalidation**:
  - Real-time webhook notifications sent to the public website (`/api/revalidate`) using secure shared-secret authentication.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Runtime & Language**: Node.js 18+, TypeScript
- **Database & ORM**: PostgreSQL, Prisma Client 6
- **Authentication**: NextAuth v5 (Credentials provider with bcrypt password hashing)
- **Styling**: Tailwind CSS
- **Media & Email**: Cloudinary SDK, Sharp, Nodemailer

---

## Getting Started

### 1. Prerequisites

- **Node.js** 18.18.0 or higher
- **npm** 9 or higher
- **PostgreSQL** 14 or higher running locally or hosted

### 2. Installation

```bash
# Clone the repository and enter the directory
cd icci-cms

# Install dependencies
npm install
```

### 3. Environment Configuration

Copy the example environment template:

```bash
cp .env.example .env
```

Open `.env` and fill in the values for your environment. Refer to [Environment Variables](#environment-variables) below for details.

### 4. Database Setup & Seeding

```bash
# Apply Prisma migrations to create the database schema
npx prisma migrate dev

# Seed default pages, initial content sections, global SEO, and admin account
npm run seed
```

> **Note**: On first run, `npm run seed` will create an initial administrator account based on `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` (or output a securely generated initial password in the terminal).

### 5. Running the Application

```bash
# Start the development server on port 3001
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to access the CMS login portal.

---

## Environment Variables

| Variable                   | Description                                                | Example / Default                                    |
| :------------------------- | :--------------------------------------------------------- | :--------------------------------------------------- |
| `DATABASE_URL`             | PostgreSQL connection string for pooled connection         | `postgresql://user:password@localhost:5432/icci_cms` |
| `DIRECT_URL`               | Direct PostgreSQL connection string for Prisma migrations  | `postgresql://user:password@localhost:5432/icci_cms` |
| `AUTH_SECRET`              | Secret key used by NextAuth to sign session tokens         | Random 32+ character string                          |
| `NEXTAUTH_URL`             | Canonical URL of the CMS application                       | `http://localhost:3001`                              |
| `NEXT_PUBLIC_WEBSITE_URL`  | URL of the frontend website for revalidation pings         | `http://localhost:3000`                              |
| `NEXT_PUBLIC_SITE_URL`     | Public production domain for canonical URLs and sitemaps   | `https://icci.co.in`                                 |
| `CMS_SHARED_SECRET`        | Shared secret header (`x-cms-secret`) for webhook security | Strong random secret string                          |
| `CLOUDINARY_CLOUD_NAME`    | Cloudinary cloud account name                              | `your-cloud-name`                                    |
| `CLOUDINARY_API_KEY`       | Cloudinary API key                                         | `your-api-key`                                       |
| `CLOUDINARY_API_SECRET`    | Cloudinary API secret                                      | `your-api-secret`                                    |
| `CLOUDINARY_FOLDER`        | Root asset folder in Cloudinary                            | `icci`                                               |
| `SMTP_HOST`                | Outgoing SMTP mail server                                  | `smtp.example.com`                                   |
| `SMTP_PORT`                | SMTP port (SSL/TLS: 465, STARTTLS: 587)                    | `465`                                                |
| `SMTP_SECURE`              | Whether to use SSL (`true` for port 465)                   | `true`                                               |
| `SMTP_USER`                | SMTP authentication username / sender email                | `contact@yourdomain.com`                             |
| `SMTP_PASS`                | SMTP authentication password or App Password               | `your-smtp-password`                                 |
| `SMTP_FROM_NAME`           | Sender display name for enquiry notifications              | `ICCI Website`                                       |
| `ADMIN_NOTIFICATION_EMAIL` | Secretariat recipient email for enquiry alerts             | `contact@yourdomain.com`                             |
| `SEED_ADMIN_EMAIL`         | Email for the default seeded administrator                 | `admin@yourdomain.com`                               |
| `SEED_ADMIN_PASSWORD`      | Password for the default seeded administrator              | `your-secure-password`                               |

---

## Available Scripts

| Command                | Action                                                            |
| :--------------------- | :---------------------------------------------------------------- |
| `npm run dev`          | Runs the Next.js development server on port `3001`                |
| `npm run build`        | Generates Prisma Client and creates an optimized production build |
| `npm run start`        | Starts the production server on port `3001`                       |
| `npm run seed`         | Seeds the database with default pages, sections, and navigation   |
| `npm run lint`         | Runs ESLint code quality checks                                   |
| `npm run format`       | Formats codebase using Prettier                                   |
| `npm run format:check` | Checks formatting consistency using Prettier                      |

---

## Project Structure

```text
icci-cms/
├── prisma/
│   ├── schema.prisma            # Prisma schema (Models: Page, Section, Leader, News, Event, etc.)
│   ├── migrations/              # Database migration history
│   └── seed.js                  # Database seed script
├── src/
│   ├── app/
│   │   ├── api/                 # Headless REST API routes
│   │   │   ├── pages/[slug]/    # Static page content and SEO retrieval/saving
│   │   │   ├── seo/             # Global SEO and per-page SEO management
│   │   │   ├── leaders/         # Leadership CRUD endpoints
│   │   │   ├── news/            # News & articles CRUD endpoints
│   │   │   ├── events/          # Events CRUD endpoints
│   │   │   ├── nav-links/       # Navigation menu CRUD endpoints
│   │   │   ├── submissions/     # Contact & membership enquiry collection
│   │   │   └── upload/          # Cloudinary asset upload endpoint
│   │   ├── static-pages/        # Section editors for all 8 website pages
│   │   ├── seo/                 # Global SEO, Page SEO, and Sitemap/Robots interfaces
│   │   ├── submissions/         # Enquiry inbox tables and detail views
│   │   ├── leaders/             # Leadership management views
│   │   ├── events/              # Events calendar manager
│   │   ├── news/                # News article editor and publisher
│   │   ├── navigation/          # Menu links and footer copy management
│   │   └── login/               # Administrator authentication interface
│   ├── components/              # Shared UI components and form controls
│   └── lib/                     # Utilities (Prisma client, Auth, Revalidation, Cloudinary)
├── public/                      # Static assets
└── .env.example                 # Safe environment configuration template
```

---

## Website Frontend Integration

The public website (`../icci`) fetches all dynamic content and SEO from this CMS at build time and on-demand using cached API fetchers:

- **Data Fetching**: The website accesses `/api/pages/[slug]`, `/api/seo/global`, `/api/leaders`, `/api/news`, `/api/events`, and `/api/nav-links`.
- **Cache Invalidation**: Whenever content or SEO is saved in this CMS, `revalidateWebsite()` sends a signed `POST` request to the website's `/api/revalidate` endpoint with the affected cache tags (`page:<slug>`, `site`, `leaders`, `news`, or `events`).
- **Form Forwarding**: Submissions from the public website's contact and membership forms are posted directly to `/api/submissions` with the shared secret.

---

## License

Private and proprietary. Designed and maintained for the Indian Chamber of Construction Industry.
