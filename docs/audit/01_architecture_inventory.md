# Architecture and Route Inventory

## Scope
- Frontend pages and route mapping
- Backend route modules
- Core data access points (database, storage layer, file storage)

## Evidence format
- File references point to the authoritative source for each item.

## Frontend pages
Source inventory: `client/src/pages`.

- `analytics.tsx`
- `auth.tsx`
- `conversations.tsx`
- `dashboard.tsx`
- `documents.tsx`
- `forgot-password.tsx`
- `investor-chat.tsx`
- `landing.tsx`
- `links.tsx`
- `not-found.tsx`
- `reset-password.tsx`
- `settings.tsx`

Route mapping is defined in `client/src/App.tsx` with auth-gated and public flows:

Public or unauthenticated paths:
- `/` -> `Landing`
- `/auth` -> `AuthPage`
- `/forgot-password` -> `ForgotPasswordPage`
- `/reset-password/:token` -> `ResetPasswordPage`
- `/chat/:slug` -> `InvestorChat`
- Auth-gated redirects to `/auth`: `/dashboard`, `/documents/:projectId`, `/links/:projectId`, `/conversations`, `/analytics`, `/settings`

Authenticated paths:
- `/` and `/dashboard` -> `Dashboard`
- `/documents/:projectId` -> `DocumentsPage`
- `/links/:projectId` -> `LinksPage`
- `/conversations` -> `ConversationsPage`
- `/analytics` -> `AnalyticsPage`
- `/settings` -> `SettingsPage`
- `/chat/:slug` -> `InvestorChat`
- Fallback -> `NotFound`

Evidence: `client/src/App.tsx`.

## Backend route modules
Route modules are defined in `server/routes/*.ts` and exported via `server/routes/index.ts`.

- `server/routes/analyticsRoutes.ts`
- `server/routes/chatRoutes.ts`
- `server/routes/conversationRoutes.ts`
- `server/routes/documentRoutes.ts`
- `server/routes/emailRoutes.ts`
- `server/routes/integrationRoutes.ts`
- `server/routes/linkRoutes.ts`
- `server/routes/projectRoutes.ts`
- `server/routes/subscriptionRoutes.ts`
- `server/routes/userRoutes.ts`

The primary Express router wiring and API surface is implemented in `server/routes.ts`.

Evidence: `server/routes/index.ts`, `server/routes.ts`.

## Core data access points
- Database connection and Drizzle ORM client: `server/db.ts`.
- Storage layer (all data reads/writes for users, projects, documents, links, conversations, messages, integrations, tokens): `server/storage.ts`.
- Schema definitions and table mappings: `shared/schema.ts`.
- File persistence for uploads and document processing: `server/fileProcessor.ts` (uses `UPLOAD_DIR`/`uploads` filesystem).

Evidence: `server/db.ts`, `server/storage.ts`, `shared/schema.ts`, `server/fileProcessor.ts`.
