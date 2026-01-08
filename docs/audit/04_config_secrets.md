# Configuration and secrets handling audit

## Scope

Reviewed server-side configuration and secret handling with focus on environment variable usage, validation, and exposure risks.

## Evidence sources

- `server/customAuth.ts`
- `server/replitAuth.ts`
- `server/db.ts`
- `server/routes/subscriptionRoutes.ts`
- `server/routes/emailRoutes.ts`
- `server/routes/integrationRoutes.ts`
- `server/routes/documentRoutes.ts`
- `server/openai.ts`
- `server/aiModels.ts`
- `server/brevo.ts`
- `server/utils/timing.ts`
- `server/index.ts`

## Environment variable inventory

| Variable | Purpose | Evidence |
| --- | --- | --- |
| `PORT` | HTTP server port | `server/index.ts` |
| `DATABASE_URL` | Primary database connection | `server/db.ts`, `server/replitAuth.ts` |
| `DATABASE_URL_POOLER` | Pooled DB connection override | `server/db.ts`, `server/replitAuth.ts` |
| `LOG_DB_QUERIES` | Toggle DB query timing logs | `server/db.ts` |
| `LOG_TIMINGS` | Toggle timing logs | `server/utils/timing.ts` |
| `UPLOAD_DIR` | Upload storage directory | `server/routes/documentRoutes.ts` |
| `SESSION_SECRET` | Session signing secret | `server/customAuth.ts`, `server/replitAuth.ts` |
| `SESSION_STORE` | Session storage backend selection | `server/customAuth.ts` |
| `SESSION_DISABLE_TOUCH` | Session touch disable toggle | `server/customAuth.ts` |
| `SESSION_PRUNE_INTERVAL_SECONDS` | Session prune interval | `server/customAuth.ts` |
| `NODE_ENV` | Prod vs dev behavior | `server/customAuth.ts`, `server/routes/subscriptionRoutes.ts` |
| `PRODUCTION_URL` | Base URL for OAuth/email/Stripe redirects | `server/customAuth.ts`, `server/routes/subscriptionRoutes.ts`, `server/brevo.ts` |
| `PUBLIC_BASE_URL` | Alternate base URL for Stripe redirects | `server/routes/subscriptionRoutes.ts` |
| `REPLIT_DOMAINS` | Allowed hostnames and Replit auth domains | `server/routes/subscriptionRoutes.ts`, `server/routes/emailRoutes.ts`, `server/replitAuth.ts` |
| `REPL_ID` | Replit OIDC client ID | `server/replitAuth.ts` |
| `ISSUER_URL` | Replit OIDC issuer override | `server/replitAuth.ts` |
| `INTERNAL_API_KEY` | Internal email endpoints auth | `server/routes/emailRoutes.ts` |
| `BREVO_API_KEY` | Brevo transactional email API key | `server/brevo.ts`, `server/routes/emailRoutes.ts` |
| `STRIPE_SECRET_KEY` | Stripe API key | `server/routes/subscriptionRoutes.ts`, `server/customAuth.ts` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature validation | `server/routes/subscriptionRoutes.ts` |
| `STRIPE_ANNUAL_PRICE_ID` | Annual plan price lookup | `server/routes/subscriptionRoutes.ts` |
| `STRIPE_SYNC_ON_AUTH` | Toggle Stripe sync on auth | `server/customAuth.ts` |
| `STRIPE_SYNC_TTL_SECONDS` | Stripe sync cooldown | `server/customAuth.ts` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `server/customAuth.ts` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `server/customAuth.ts` |
| `GOOGLE_DRIVE_CLIENT_ID` | Google Drive integration client ID | `server/routes/integrationRoutes.ts` |
| `GOOGLE_DRIVE_CLIENT_SECRET` | Google Drive integration client secret | `server/routes/integrationRoutes.ts` |
| `OPENAI_API_KEY` | OpenAI API key | `server/openai.ts`, `server/aiModels.ts` |
| `OPENAI_API_KEY_ENV_VAR` | OpenAI API key fallback | `server/openai.ts` |
| `ANTHROPIC_API_KEY` | Anthropic API key | `server/aiModels.ts` |
| `GEMINI_API_KEY` | Gemini API key | `server/aiModels.ts` |
| `CI` | Load test guard in CI | `server/__tests__/load/api-load.test.ts` |
| `SKIP_LOAD_TESTS` | Load test guard for local runs | `server/__tests__/load/api-load.test.ts` |

## Findings and risks

### High

- `BREVO_API_KEY` partially logged in plain text during email tests (`server/routes/emailRoutes.ts`). Even a partial key in logs can be used for secret enumeration or give attackers confirmation of key validity. This should be removed or guarded by a local-only flag.

### Medium

- No centralized environment validation at startup. Most settings are read ad hoc, so missing or malformed values surface as runtime errors (example: `SESSION_SECRET` in `server/replitAuth.ts` uses non-null assertions; LLM API keys in `server/aiModels.ts` are read without guardrails). This increases the chance of deploying with insecure defaults or broken integrations.
- Stripe webhook verification is skipped when `STRIPE_WEBHOOK_SECRET` is unset in non-production (`server/routes/subscriptionRoutes.ts`). This is intentional for dev, but it is easy to misconfigure and accidentally ship without signature verification. A startup-time check in production would reduce risk.

### Low

- Base URL inputs (`PRODUCTION_URL`, `PUBLIC_BASE_URL`, `REPLIT_DOMAINS`) are accepted without strict validation and used to build redirect links (`server/routes/subscriptionRoutes.ts`, `server/customAuth.ts`, `server/brevo.ts`). A malformed value could generate invalid redirect URLs or point to unintended domains.
- `UPLOAD_DIR` defaults to a relative path (`./uploads`) without guardrails (`server/routes/documentRoutes.ts`). If the working directory changes, file storage could land in unexpected locations.

## Recommendations

1. Add a small env validation module at startup (zod, envalid, or custom) and fail fast on missing/invalid secrets. Include strict checks for `SESSION_SECRET`, DB URLs, and provider API keys.
2. Remove logging of sensitive values (even partial) and replace with boolean presence checks only.
3. Enforce production-only requirements (Stripe webhook secret, HTTPS base URL, secure session cookie settings) via startup validation tied to `NODE_ENV`.
4. Normalize and validate base URLs (strip trailing slashes, enforce https, and verify host against an allowlist) before use in redirects and email links.

## Typecheck

`npm run check` failed with: `server/openai.ts(108,28): error TS18047: 'openai' is possibly 'null'.`
