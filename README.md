# EduWings

**Inspiring the Next Generation of Aviation Professionals.**

An aviation awareness programme bringing the world of flight into Kenyan primary and secondary
classrooms — the science that holds an aircraft up, the fourteen careers behind every departure,
and the exact route from a school desk to a job in the industry.

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

**No configuration is required.** The entire public site — every page, fourteen career pathways,
articles, events, gallery and forms — renders from content bundled in the repository. You do not
need a database, an API key, or an account to run, review or build this project.

Adding Supabase credentials later switches the same pages over to live data and unlocks the admin
console. No page code changes.

---

## Architecture

Six decisions shape everything else. They are worth reading before changing anything.

### 1. A content layer, not a database dependency

Every read goes through `ContentSource` (`src/lib/content/source.ts`), an interface with two
implementations:

| Implementation          | Backed by                                   | Active when                  |
| ----------------------- | ------------------------------------------- | ---------------------------- |
| `staticContentSource`   | Typed seed content compiled into the bundle | No Supabase credentials      |
| `supabaseContentSource` | Live Postgres rows                          | Supabase credentials present |

`getContentSource()` picks one. Pages never know which. This is what lets the project satisfy two
requirements that normally conflict: it builds and runs with an empty `.env`, _and_ it is backed by
a real editable database in production.

Sorting and filtering are mirrored between the two implementations, so switching backends produces
the same output — not merely the same types.

### 2. Editorial content lives in the repository; managed content lives in the database

Careers, the FAQ, activities, the timeline and impact statistics are authored, versioned and code
reviewed (`src/lib/content/careers.ts`, `editorial.ts`). They change a few times a year and benefit
from type checking and pull requests.

Articles, events, gallery items, partners, testimonials, schools and programme modules go through
the CMS, because they change weekly and non-engineers must be able to change them.

### 3. Row Level Security is the authorisation boundary

Not the application. `supabase/migrations/…_row_level_security.sql` enforces that anonymous callers
read published rows and nothing else, that staff manage content, and that **nobody but the service
role reads personal data submitted through forms**.

Server Actions in the admin console use the _session-scoped_ client, never the service role, so a
missing permission check in application code still cannot write data the user is not entitled to
write. The role checks in `src/lib/admin/actions.ts` exist to produce readable errors, not to
provide security.

The `proxy.ts` redirect for `/admin` is user experience, not a security control.

### 4. Seven admin screens, one implementation

`src/lib/admin/resources.ts` describes each CMS resource declaratively — its table, columns, form
fields and lifecycle. A single pair of dynamic routes (`/admin/[resource]` and
`/admin/[resource]/[id]`) renders all of them. Adding an eighth resource is a config entry, not a
directory.

The four screens that are genuinely different — submissions, subscribers, media, users — keep their
own static routes, which take precedence over the dynamic segment.

### 5. One schema per form, used on both sides

`src/lib/validation/schemas.ts` defines each form once. The client form uses it through
`zodResolver`; the API route validates the same payload with the same schema. A field cannot be
validated in the browser but not on the server.

Every public endpoint is built by `createFormRoute()`, which applies same-origin verification, rate
limiting, honeypot rejection and validation in a fixed order — so a new form cannot ship without
them.

### 6. Photography and fallback art

The founder portrait and fourteen career photographs are served locally through `AppImage`.
Career images are licensed stock illustrations of the relevant work, not EduWings staff or visits.
`src/lib/content/career-photos.ts` supplies images and attribution; `/photo-credits` publishes the
source, author, licence and changes. Original source metadata is kept in
`docs/content/career-photo-sources.json`. Preserve attribution and share-alike terms when replacing
or adapting an image.

Other content without a photograph retains the deterministic on-brand SVG fallback. CMS image
fields can replace those placeholders with photographs of the actual activity or event.

---

## Environment

Every variable is optional. Each block unlocks one capability; the admin console shows which are
live at `/admin/settings`.

| Variable                                                    | Unlocks                                           |
| ----------------------------------------------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                      | Canonical URLs in SEO metadata, sitemap and email |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Live content, authentication, admin console       |
| `SUPABASE_SERVICE_ROLE_KEY`                                 | Persisting public form submissions (server-only)  |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO_ADMIN`            | Notification and acknowledgement email            |
| `NEXT_PUBLIC_ANALYTICS_SRC`, `NEXT_PUBLIC_ANALYTICS_DOMAIN` | Analytics script                                  |

Copy `.env.example` to `.env.local`. Values are validated once at load (`src/lib/env.ts`) — a
malformed value is a hard error, an absent one just disables a feature.

---

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the URL, anon key and service role key into `.env.local`.
3. Apply the migrations in `supabase/migrations/` in filename order — via the SQL editor, or
   `supabase db push` with the CLI linked to your project.
4. Seed the database from the same content the static site uses:

   ```bash
   npm run db:seed
   ```

5. Create your user (Supabase dashboard → Authentication → Add user), then grant yourself access:

   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

6. Sign in at `/login`.

Regenerate database types after any schema change:

```bash
SUPABASE_PROJECT_ID=xxxx npm run db:types
```

### Roles

| Role     | Can                                                                |
| -------- | ------------------------------------------------------------------ |
| `viewer` | Nothing — cannot open the console (the default for a new account)  |
| `editor` | Create, edit, publish and archive content                          |
| `admin`  | The above, plus permanent deletion, role changes and site settings |

---

## Project structure

```
src/
├── app/
│   ├── (marketing)/       Public site — its own header/footer shell
│   ├── admin/             CMS, guarded by auth and RLS
│   ├── api/               Form endpoints and search
│   └── login/
├── components/
│   ├── ui/                Design-system primitives
│   ├── forms/             Public forms and shared fields
│   ├── admin/             Console-specific components
│   ├── marketing/         Page sections
│   ├── cards/             Article, event and career cards
│   └── media/             AppImage and the placeholder art system
├── config/                Site facts, routes, navigation
├── lib/
│   ├── content/           Domain types, sources, seed content
│   ├── supabase/          Clients and the database contract
│   ├── admin/             Resource definitions and CRUD actions
│   ├── validation/        Zod schemas
│   ├── seo/               Metadata and structured data
│   └── email/             Transactional email
├── hooks/
└── proxy.ts               Session refresh and /admin redirect
supabase/migrations/       Schema, RLS, storage
scripts/seed.ts            Seeds the database from bundled content
```

Internal links resolve through `src/config/routes.ts` rather than string literals, so a URL change
is one edit and the compiler finds every consumer.

---

## Commands

| Command             | Does                                           |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Development server                             |
| `npm run build`     | Production build                               |
| `npm run verify`    | Typecheck, lint and build — run before pushing |
| `npm run typecheck` | `tsc --noEmit`                                 |
| `npm run lint`      | ESLint, including the React Compiler rules     |
| `npm run format`    | Prettier                                       |
| `npm run db:seed`   | Seed Supabase from bundled content             |

---

## Accessibility

Targeting WCAG 2.2 AA, built in rather than audited on:

- A skip link is the first tab stop on every page.
- Form fields are wired through shared components that always attach a label, description and error
  to the input — accessibility by construction rather than by review.
- `prefers-reduced-motion` collapses every animation to a plain fade; the carousel has no autoplay.
- Filters and lists announce their result counts through live regions.
- Focus treatment is defined once, globally, and never removed.
- Colour is authored in OKLCH so contrast ratios are predictable in both themes.

## Performance

- The home page hero is vector and CSS — the LCP element is text, not an image.
- 59 of 66 routes are statically prerendered; only authenticated and live-data routes are dynamic.
- Fonts are self-hosted by `next/font`; no third-party request, no layout shift.
- The icon registry is explicit, so only the icons actually used reach the client bundle.

## Security

- CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, Referrer and Permissions policies
  (`next.config.ts`). The CSP deliberately avoids a nonce so pages stay static — the reasoning is
  documented in that file.
- Same-origin verification on every mutating endpoint, plus per-IP rate limiting.
- Honeypot fields, checked server-side, answering with a success response so automated submitters
  learn nothing.
- Markdown rendering never enables raw HTML, so CMS content cannot inject script.
- CSV export escapes leading `=`, `+`, `-` and `@` to prevent spreadsheet formula injection.
- No card or M-Pesa details are collected on this site.

---

## Deployment

Vercel: import the repository, add the environment variables, deploy. `NEXT_PUBLIC_SITE_URL` should
be your production origin; without it the app infers the Vercel deployment URL.

It deploys successfully with no environment variables at all — serving the bundled content site.

---

## Designed for what comes next

The architecture anticipates these without pre-building them:

- **Student and teacher portals** — `profiles.role` is an enum with RLS keyed off it; new roles are
  a migration plus policies.
- **Courses, certificates, an LMS** — the content layer takes new domains without touching pages.
- **Payments** — donation forms currently record an _intent_ and trigger follow-up instructions.
  Taking payment means adding a provider behind the existing endpoint; the form and schema stay.
- **School registration, volunteer and sponsor portals** — submissions already carry a schemaless
  `payload`, so a new form needs no migration.

---

## Content and accuracy

Career catalogues describe independent Kenyan study routes, entry requirements, qualifications,
licensing and employment opportunities. They link to official provider and KCAA sources and show a
review date; no salary or professional-course pricing is published. EduWings provides school
awareness and guidance, not professional aviation qualifications. Recheck official sources before
changing admissions or licensing claims.

Published EduWings service fees live in `src/lib/content/service-fees.ts`. These are separate from
institutional course fees. Per-learner totals are subject to the stated minimum charge; external
field-trip costs are quoted separately. Simulator activities take place at host facilities after
the school modules, subject to facility conditions.

Partner and sponsor records in the seed data are illustrative placeholders. Never present one as a
real relationship; replace them through the CMS before launch.

---

## Credits

Founded by **Meldah Magova**. Built for schools across Kenya.
