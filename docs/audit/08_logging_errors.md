# Error handling and observability audit

## Scope and evidence
- API request logging + error middleware: `server/index.ts`
- Logger helper and Vite error handling: `server/vite.ts`
- Route-level try/catch + console logging: `server/routes.ts`, `server/routes/*.ts`
- Email/logging of secrets + stack traces: `server/routes/emailRoutes.ts`
- File processing logs (content previews): `server/fileProcessor.ts`
- Optional timing utility: `server/utils/timing.ts`
- Client error handling pattern: `client/src/lib/queryClient.ts`, `client/src/pages/*.tsx`

## Current logging/error handling patterns
- Server request logging is implemented in `server/index.ts` using the `log()` helper, with optional response body logging for non-sensitive routes.
- Errors are handled per-route via `try/catch` blocks with `console.error()` and a JSON error response (for example, `server/routes.ts`, `server/routes/documentRoutes.ts`).
- The global error middleware returns `{ message }` and then throws the error (`server/index.ts`), which can terminate the process if uncaught.
- Observability is mostly stdout logging with `console.log`/`console.error` and a simple timestamped wrapper in `server/vite.ts`.
- Optional performance logging exists behind `LOG_TIMINGS` (`server/utils/timing.ts`).
- Client requests throw on non-OK responses; most pages catch and surface errors locally (`client/src/lib/queryClient.ts`, `client/src/pages/*`).

## Risks and gaps
- No structured logging or log levels beyond `console.*`, making it hard to filter or correlate issues in production. Evidence: `server/vite.ts`, `server/routes.ts`.
- No request IDs or correlation IDs in logs; tracing a request across async work (file processing, integrations) is difficult. Evidence: `server/index.ts`, `server/fileProcessor.ts`, `server/integrations.ts`.
- Sensitive data appears in logs: upload filenames and MIME types, email recipients, and even API key substrings in the test email endpoint. Evidence: `server/routes.ts`, `server/routes/emailRoutes.ts`.
- Some error responses include stack traces or raw error details (test email endpoint), which can leak internals to authenticated users. Evidence: `server/routes/emailRoutes.ts`.
- The global error handler throws after sending the response, which can crash the process and drop in-flight requests. Evidence: `server/index.ts`.
- No centralized error reporting or alerting (Sentry, Honeycomb, CloudWatch, etc.) or metrics for error rates, latency percentiles, or queue depth. Evidence: codebase has no instrumentation setup beyond `console.*` and optional timing logs.

## Recommended remediation
- Introduce a structured logger (pino/winston) with levels, JSON output, and redaction of secrets/PII; replace raw `console.*` in `server/routes.ts`, `server/fileProcessor.ts`, and integrations.
- Add a request/correlation ID middleware and propagate IDs into async tasks and logs.
- Remove or gate sensitive logging (API key substrings, raw file content previews); log only metadata needed for troubleshooting.
- Update the error middleware to avoid `throw err` after responding; log the error and return a consistent error envelope.
- Add a production-grade error reporter and metrics (error rate, p95/p99 latency, job failures) plus alerting thresholds.
- Ensure client-facing error responses never include stack traces or internal error objects.

## Typecheck
- `npm run check` failed: `server/openai.ts(108,28): error TS18047: 'openai' is possibly 'null'.`
