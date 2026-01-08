# Auth and session security audit

## Scope
- Primary auth flow: local email/password + Google OAuth via Passport in `server/customAuth.ts`.
- Alternate Replit OIDC flow exists in `server/replitAuth.ts`, but `server/routes.ts` wires `setupAuth` from `server/customAuth.ts`.

## Evidence (auth/session implementation)
- Session store selection and cookie settings (`httpOnly`, `secure` in production, 1-week maxAge) in `server/customAuth.ts`.
- Session secret requirement in production and fallback dev secret in `server/customAuth.ts`.
- Passport local strategy with scrypt password hashing and timing-safe comparison in `server/customAuth.ts`.
- Google OAuth strategy and callback redirect to production base URL in `server/customAuth.ts`.
- Auth endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/user`, password reset routes in `server/customAuth.ts`.
- Rate limiting for auth and password reset endpoints in `server/index.ts`.
- Password reset token TTL (1 hour) and storage behavior in `server/storage.ts`.
- Replit OIDC session setup with `secure: true` cookie and refresh-token handling in `server/replitAuth.ts`.
- User object sanitized (password removed) before responses in `server/utils/sanitize.ts`.

## Session and cookie configuration notes
- Sessions use `connect-pg-simple` in production and `memorystore` in non-production (`server/customAuth.ts`).
- `saveUninitialized: false` and `resave: false` reduce unnecessary session writes (`server/customAuth.ts`).
- `secure` cookie flag is set only when `NODE_ENV === "production"`, `httpOnly: true` set always (`server/customAuth.ts`).
- No explicit `sameSite` or `domain` attributes are configured on the session cookie (`server/customAuth.ts`).

## Risks and gaps
- Missing `sameSite` on session cookies leaves CSRF protection to defaults; state-changing endpoints like `/api/auth/logout` and `/api/auth/forgot-password` can be triggered cross-site unless other protections exist. Evidence: session cookie config lacks `sameSite` in `server/customAuth.ts`.
- Session fixation risk: `req.login` is called without `req.session.regenerate`, so an attacker with a pre-auth session ID could preserve it across login. Evidence: `req.login` in `server/customAuth.ts`.
- Logout uses GET and does not require CSRF protection, increasing the chance of logout CSRF. Evidence: `app.get("/api/auth/logout", ...)` in `server/customAuth.ts`.
- Password reset tokens are generated with `Math.random()` and short token length; this is not cryptographically strong for sensitive reset flows. Evidence: `createPasswordResetToken` in `server/storage.ts`.
- Google OAuth redirect uses `PRODUCTION_URL`/hardcoded base URL; if environment is misconfigured, callbacks may redirect to the wrong origin and leak auth flows. Evidence: `baseUrl` usage in `server/customAuth.ts`.
- Session secret fallback to `dev-session-secret` in non-production increases risk if non-prod environments are exposed or misconfigured. Evidence: `sessionSecret || "dev-session-secret"` in `server/customAuth.ts`.

## Recommendations
- Set `sameSite: "lax"` (or `"strict"` if compatible) and `secure: true` alongside `trust proxy` to harden cookies in all environments; document exceptions for local dev. (`server/customAuth.ts`).
- Regenerate session on successful login (`req.session.regenerate`) before calling `req.login` to mitigate fixation. (`server/customAuth.ts`).
- Convert logout to POST and add CSRF protection for state-changing endpoints (logout, password reset, account updates). (`server/customAuth.ts`, `server/index.ts`).
- Replace `Math.random()` reset tokens with `crypto.randomBytes` and increase token length; store only a hash if possible. (`server/storage.ts`).
- Validate that `PRODUCTION_URL` matches the deployed origin and avoid hardcoded fallbacks in OAuth callback handling. (`server/customAuth.ts`).
- Ensure non-production environments are not exposed publicly when using a default session secret.

## Typecheck
- `npm run check` failed: `server/openai.ts(108,28): error TS18047: 'openai' is possibly 'null'.`
