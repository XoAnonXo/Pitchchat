# Performance and testing audit summary

## Scope and evidence
- Test orchestration and coverage: `package.json` (scripts), `vitest.config.ts`, `playwright.config.ts`, `e2e/auth.spec.ts`, `e2e/navigation.spec.ts`, `e2e/ui-components.spec.ts`, `e2e/email-preview.spec.ts`, `server/__tests__/auth.test.ts`, `server/__tests__/chatRoutes.test.ts`, `server/__tests__/registration.test.ts`, `server/__tests__/validation.test.ts`, `server/__tests__/pricing.test.ts`, `server/__tests__/fileProcessor.test.ts`.
- Performance tooling: `lighthouserc.cjs`, `bundle-size.config.json`, `vite.config.ts`, `server/__tests__/load/api-load.test.ts`.

## Current performance posture
- Lighthouse CI configuration includes desktop budgets and three-run sampling for `/`, `/auth`, `/analytics` via `npm run lighthouse` (`lighthouserc.cjs`).
- Bundle size budgets exist for core and vendor chunks (`bundle-size.config.json`) and build chunking is explicitly defined (`vite.config.ts`).
- Load testing exists for API endpoints with p99 latency thresholds, but uses a mock server and is skipped in CI by default (`server/__tests__/load/api-load.test.ts`).

## Performance risks
- **High**: Bundle size budgets are defined but there is no automated enforcement script wired into CI in this repo; regressions can ship unless someone runs the tooling manually (`bundle-size.config.json`, `package.json`, `vite.config.ts`).
- **Medium**: Load tests target mocked endpoints and do not exercise the real database, cache, or external API stack; production latency bottlenecks can be missed (`server/__tests__/load/api-load.test.ts`).
- **Medium**: Lighthouse runs are configured but appear manual (no CI pipeline config found in-repo), so performance budgets may drift (`lighthouserc.cjs`, `package.json`).

## Testing coverage gaps
- **High**: Unit/coverage focus is server-only; there are no client component/unit tests configured in Vitest (`vitest.config.ts`).
- **Medium**: E2E coverage is Chromium-only; no cross-browser or mobile viewport coverage is configured (`playwright.config.ts`).
- **Low**: Load tests are skipped in CI or when `SKIP_LOAD_TESTS` is set, which reduces confidence in steady-state throughput in automated runs (`server/__tests__/load/api-load.test.ts`).

## Prioritized remediation (severity)
1. **High**: Add a CI job or script to enforce bundle size budgets (e.g., integrate `bundle-size.config.json` with a size-check tool and fail on regressions).
2. **High**: Introduce client-side unit/component tests (Vitest + React Testing Library) to cover critical UI flows and validation.
3. **Medium**: Run Lighthouse CI in the pipeline for deploy previews or main branch to enforce the budgets already defined in `lighthouserc.cjs`.
4. **Medium**: Add load tests that hit the real server stack with representative data (DB + auth) or run the existing tests against a staging environment.
5. **Low**: Expand Playwright coverage to at least one additional browser/device profile to catch rendering/perf regressions.

## Typecheck status
- `npm run check` failed: `server/openai.ts(108,28): error TS18047: 'openai' is possibly 'null'.`
