# Authorization and Data Access Audit

## Scope
- Projects, documents, links, and conversations access control in server routes and storage calls.
- Focus on ownership checks, cross-tenant isolation, and public link behavior.

## Evidence Overview
- Project ownership checks on CRUD routes: `server/routes/projectRoutes.ts`.
- Document access checks tied to project ownership: `server/routes/documentRoutes.ts`.
- Link access checks tied to project ownership and link membership: `server/routes/linkRoutes.ts`.
- Conversation access checks for authenticated dashboards: `server/routes/conversationRoutes.ts`.
- Public link access to documents/messages via slug: `server/routes/chatRoutes.ts`.
- Storage layer provides unscoped getters; routes enforce ownership: `server/storage.ts`.

## Access Control Map
- Projects
  - GET/PATCH/DELETE verify `project.userId === req.user.id`: `server/routes/projectRoutes.ts`.
- Documents
  - List/upload/download require project ownership: `server/routes/documentRoutes.ts`.
  - Delete validates document -> project -> owner chain: `server/routes/documentRoutes.ts`.
- Links
  - List/create/update/delete require project ownership and link membership: `server/routes/linkRoutes.ts`.
- Conversations (owner view)
  - List uses user-scoped query: `server/routes/conversationRoutes.ts`.
  - Messages endpoint verifies conversation belongs to user via project-derived list: `server/routes/conversationRoutes.ts`.
- Conversations (investor/public)
  - Chat routes authorize by active link slug + conversation link match: `server/routes/chatRoutes.ts`.
  - Contact submission is unauthenticated and uses only `conversationId`: `server/routes/conversationRoutes.ts`.

## Findings
### 1) Unauthenticated contact submission can target any conversation ID
- Evidence: `POST /api/conversations/:conversationId/contact` has no auth or link/slug verification and directly updates `conversationId` contact fields, then triggers email alerts: `server/routes/conversationRoutes.ts`.
- Impact: Anyone who guesses a UUID can overwrite contact data and trigger emails for any project, causing spam and data integrity issues. Cross-tenant write risk.
- Recommendation: Require a signed token or link slug + conversation ownership check (e.g., validate conversation belongs to an active link and optionally require a short-lived token embedded in the investor session). Add rate limiting.

### 2) Expired links can still access conversation messages
- Evidence: `GET /api/chat/:slug/messages/:conversationId` checks link status but does not check `expiresAt` like other chat endpoints: `server/routes/chatRoutes.ts`.
- Impact: Message history remains accessible even after link expiration, weakening revocation semantics.
- Recommendation: Mirror expiration checks from other chat endpoints and return 404 for expired links.

### 3) Authorization is enforced only in routes; storage getters are unscoped
- Evidence: `storage.getProject`, `storage.getDocument`, `storage.getLink` return by ID without user scoping: `server/storage.ts`.
- Impact: Any new route that skips ownership checks can introduce IDOR risk.
- Recommendation: Add helper methods that accept `userId` and enforce ownership, or use a centralized authorization guard for common resource types.

## Notes on Current Strengths
- Most project/document/link routes consistently enforce ownership checks and link-to-project membership before updates or deletes: `server/routes/projectRoutes.ts`, `server/routes/documentRoutes.ts`, `server/routes/linkRoutes.ts`.
- Public chat routes bind conversation access to link slug and conversation link match, reducing cross-link leakage: `server/routes/chatRoutes.ts`.

## Typecheck Status
- `npm run check` failed: `server/openai.ts(108,28): error TS18047: 'openai' is possibly 'null'.`
