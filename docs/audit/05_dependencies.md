# Dependency and supply-chain audit

## Scope
- `package.json` dependencies and devDependencies
- `npm audit --production` execution

## Key dependencies (selected)
- Runtime framework: `express@^4.21.2`, `react@^18.3.1`, `react-dom@^18.3.1`, `wouter@^3.3.5`
- Auth/session: `passport@^0.7.0`, `passport-local@^1.0.0`, `passport-google-oauth20@^2.0.0`, `passport-apple@^2.0.2`, `express-session@^1.18.1`, `connect-pg-simple@^10.0.0`, `openid-client@^6.6.2`, `jsonwebtoken@^9.0.2`
- Data + DB: `drizzle-orm@^0.39.1`, `drizzle-zod@^0.7.0`, `@neondatabase/serverless@^0.10.4`, `zod@^3.24.2`
- LLM + AI: `openai@^5.10.1`, `@anthropic-ai/sdk@^0.37.0`, `@google/genai@^1.10.0`
- Integrations: `@slack/web-api@^7.9.3`, `@notionhq/client@^4.0.1`, `googleapis@^153.0.0`, `asana@^3.1.0`, `jira.js@^5.2.1`, `dropbox@^10.34.0`, `@stripe/stripe-js@^7.9.0`, `stripe@^18.5.0`
- Realtime/upload: `ws@^8.18.0`, `multer@^2.0.1`, `bufferutil@4.1.0`
- UI/tooling: `@radix-ui/*@^1.x`, `@tanstack/react-query@^5.60.5`, `tailwindcss-animate@^1.0.7`

## Supply-chain findings
- `npm audit --production` failed due to network restrictions (unable to reach `registry.npmjs.org`), so advisories could not be retrieved.
- The audit command also reported it could not write logs to `/Users/mac/.npm/_logs`.

## Risks and recommendations
- Risk: Without a successful `npm audit` run, known vulnerabilities in runtime dependencies may be missed.
  - Recommendation: Re-run `npm audit --omit=dev` with network access and writable npm log directory; capture results in this audit.
- Risk: Large integration surface area (OAuth providers, third-party APIs) increases dependency exposure.
  - Recommendation: Pin or regularly review high-risk packages (`passport*`, `openid-client`, `ws`, `multer`, `jsonwebtoken`) and track CVEs in release monitoring.

## Typecheck
- `npm run check` fails: `server/openai.ts(108,28): error TS18047: 'openai' is possibly 'null'.`
