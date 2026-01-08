# Privacy and data handling audit

## Scope and evidence
- Data models: `shared/schema.ts`
- Investor contact flows: `server/routes/conversationRoutes.ts`, `server/routes/chatRoutes.ts`, `client/src/components/ContactTeamDialog.tsx`, `client/src/pages/investor-chat.tsx`
- User export/delete: `server/routes/userRoutes.ts`, `client/src/pages/settings.tsx`, `server/storage.ts`
- File handling: `server/fileProcessor.ts`, `server/routes/documentRoutes.ts`
- Email notifications: `server/brevo.ts`, `server/routes/conversationRoutes.ts`, `server/routes/chatRoutes.ts`

## PII and sensitive data touchpoints
- User identity data: `users.email`, `users.firstName`, `users.lastName`, `users.profileImageUrl`, `users.password` (hashed), `users.googleId` in `shared/schema.ts`.
- Billing identifiers: `users.stripeCustomerId`, `users.stripeSubscriptionId`, `tokenPurchases.stripePaymentIntentId` in `shared/schema.ts`.
- Investor contact data (non-authenticated): `conversations.investorEmail`, `contactName`, `contactPhone`, `contactCompany`, `contactWebsite` in `shared/schema.ts` and `server/routes/conversationRoutes.ts`.
- Message content (free-form PII): `messages.content` in `shared/schema.ts`, created via `server/routes/chatRoutes.ts`.
- Uploaded document contents: stored in `documents`, `chunks` with extracted text/embeddings and raw files on disk via `server/fileProcessor.ts`.
- Third-party integration credentials: `integrations.credentials` JSON blob in `shared/schema.ts`.

## Data collection and sharing flows
- Investor chat collects email and message content in `server/routes/chatRoutes.ts`; investor email is also set from `client/src/pages/investor-chat.tsx`.
- Investor contact form accepts name/phone/company/website without auth in `server/routes/conversationRoutes.ts`, with client entry in `client/src/components/ContactTeamDialog.tsx`.
- Contact details and investor emails are emailed through Brevo templates in `server/brevo.ts`, triggered from `server/routes/conversationRoutes.ts` and `server/routes/chatRoutes.ts`.
- Document uploads are saved to disk (`UPLOAD_DIR`) and parsed into chunks/embeddings in `server/fileProcessor.ts`.

## Export and deletion coverage
- Data export endpoint `/api/user/export` returns user profile, projects, documents, and links, but does not include conversations, messages, contact details, token usage, or integrations in `server/routes/userRoutes.ts`.
- Account deletion `/api/user/delete` calls `storage.deleteUserData`, which deletes DB rows for projects, documents, links, conversations, messages, token usage, and user in `server/storage.ts`.
- Uploaded files are deleted during single-document deletion (`server/routes/documentRoutes.ts`), but `deleteUserData` does not remove files on disk in `server/storage.ts` and does not call `deleteUploadedFile` from `server/fileProcessor.ts`.

## Risks and gaps
- Incomplete data export: conversations/messages and investor contact details are omitted from `/api/user/export`, so subject access requests are incomplete. Evidence: `server/routes/userRoutes.ts`.
- Orphaned uploads on account deletion: `deleteUserData` deletes database records but not files under `UPLOAD_DIR`, leaving document content on disk. Evidence: `server/storage.ts`, `server/fileProcessor.ts`.
- No retention policy enforcement: no TTL or purge routine for conversations/messages/contacts or uploaded files is present in code. Evidence: `shared/schema.ts`, `server/storage.ts`.
- No investor self-service deletion: investor contact data is stored on conversation records, but there is no endpoint for non-authenticated investors to request deletion. Evidence: `server/routes/conversationRoutes.ts`.
- Analytics uses raw investor emails for unique visitor counts, which increases exposure risk in metrics. Evidence: `server/storage.ts`.

## Recommended remediation
- Expand `/api/user/export` to include conversations, messages, contact details, token usage, and integration metadata (with credential redaction). Document the export schema in `docs/audit/07_privacy_compliance.md` once implemented.
- Update `deleteUserData` to remove uploaded files for documents (invoke `deleteUploadedFile` or store file paths and delete in batch) and add a periodic cleanup job for orphaned files.
- Define and enforce a retention policy (e.g., auto-expire investor contact data and chat logs after N days unless required for compliance).
- Add an investor deletion/request flow (tokenized email-based delete or link-level opt-out) for conversations tied to public links.
- Hash or pseudonymize investor emails for analytics counters and store the raw email separately with stricter access controls.

## Typecheck
- `npm run check` failed: `server/openai.ts(108,28): error TS18047: 'openai' is possibly 'null'.`
