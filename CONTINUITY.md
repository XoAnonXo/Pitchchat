## Goal (incl. success criteria):
- Review existing `pseo/` implementation in this repo and produce a concrete checklist of what’s already built vs. what’s missing to make pSEO pages “start working” (generated, routable, indexable, and deployable).

## Constraints/Assumptions:
- Repository is a TS/React + Node backend project (Vite + server routes); pSEO likely lives under `pseo/` with supporting status docs under `pseo_status/`.
- UNCONFIRMED: What “start working” means (local dev rendering vs. production deploy vs. indexed in Google Search Console). Will infer from current implementation.

## Key decisions:
- Start by inventorying `pseo/` + wiring (scripts, routes, sitemap/robots, build/deploy), then map gaps to a minimal launch path.
- `pseo/` is a standalone Next.js App Router app (not wired into root Vite/Express app yet); production needs a routing/proxy plan to serve `/investor-questions/*` under the main domain.
- Option #1 chosen: deploy `pseo/` as a separate service and reverse-proxy via the main Express app (`PSEO_ORIGIN`).
- Target deployment: Railway (UNCONFIRMED details; assume 2 services in one Railway project).
- Railway setup: create 2 services from the same GitHub repo (root `.` for main app, root `pseo/` for pseo app) + a shared Postgres; set `PSEO_ORIGIN` on main to the pseo service URL.

## State:
### Done:
- Created `CONTINUITY.md` (was missing).
- Read `pseo_status/*` + `docs/pseo_plan.md` and verified `pseo/` contains:
  - Next.js routes for `/investor-questions/*` with SSG via `generateStaticParams()` from `src/data/pilot-config.json`
  - Postgres schema + query layer, ingestion/seed scripts, sitemap/robots, CTA tracking, internal links
- Identified key runtime dependency: `pseo/src/db/client.ts` throws unless `PSEO_DATABASE_URL` or `DATABASE_URL` is set.
- Ran `pseo:validate-sitemaps` and `pseo:quality-check` successfully for 70 pilot items.
- Implemented Option #1 (reverse proxy) in main Express app:
  - New `server/pseoProxy.ts`
  - Wired in `server/index.ts` via `registerPseoProxy(app)`
  - Controlled by `PSEO_ORIGIN` env var
- Updated docs: `docs/pseo_plan.md` + root `README.md` with proxy configuration.
- Made pSEO Railway-friendly:
  - `pseo/package.json` start now uses `node scripts/start.mjs` to bind to `$PORT`
  - `pseo` lint is clean
- Fixed pSEO build blockers:
  - Map DB `null` → template `undefined` for optional fields (deck sections + checklist items)
  - `InvestorQuestionsTemplate` now safely handles optional `metrics`/`objections`
  - DB is lazily initialized (`getDb()`); pSEO can build with seed fallback if DB env isn’t set
  - Guarded `formatSlug()` against undefined params (prevents prerender crash)
- Committed + pushed pSEO/Railway proxy changes to `main` (commit `7ffd2d5`).
- Added `@types/pg` to `pseo` dependencies and pushed to `main` so Railway builds (commit `add4794`).
- Fixed Next.js 15+ params Promise issue: `params` must be awaited in page components.
- Browser verification complete:
  - ✅ pSEO pages render correctly with seed data (AI Seed, Blockchain Series A, etc.)
  - ✅ sitemap.xml proxied correctly with pitchchat.ai URLs
  - ✅ robots.txt proxied correctly with all sitemaps
  - ✅ Reverse proxy working through main app at port 5170
  - ✅ Main app homepage still works correctly
  - ✅ Navigation between pSEO pages works

### Now:
- Fixed investor chat scroll behavior

### Next:
- Commit the scroll fix
- Deploy to Railway production.
- Submit sitemaps to Google Search Console.

## Open questions (UNCONFIRMED if needed):
- What is the intended pSEO output target? (static pages baked into build, server-rendered pages, or client-side routes)
- What dataset/source should drive pSEO pages? (existing JSON in `pseo/`, DB, external API)
- How will `/investor-questions/*` be hosted under `https://pitchchat.ai`? (reverse proxy vs integrate Next into existing server)

## Working set (files/ids/commands):
- `CONTINUITY.md`
- `pseo_status/README.md`, `pseo_status/plan.md`, `pseo_status/todo.md`
- `docs/pseo_plan.md`
- `pseo/src/app/investor-questions/**`, `pseo/src/app/sitemap.ts`, `pseo/src/app/robots.ts`
- `pseo/scripts/{enrich_raw_source,ingest_source,quality_check,seed_pseo_db,migrate_pseo}.mjs`
