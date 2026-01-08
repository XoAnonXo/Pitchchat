# Pitchchat Backend

A modular, type-safe backend for Pitchchat, an AI-powered document assistant for startup pitches.

## 🚀 Architecture

The backend has been recently refactored into a modular structure for better maintainability and scalability.

- **`server/index.ts`**: Entry point. Sets up Express, Vite (in dev), and static serving.
- **`server/routes.ts`**: Main router shell that mounts modular routes.
- **`server/routes/`**: contains focused route modules:
  - `auth.routes.ts`: Password and OAuth (Google) authentication.
  - `projects.routes.ts`: Project and document management.
  - `links.routes.ts`: Pitch link creation and public investor chat.
  - `integrations.routes.ts`: Syncing with GitHub, Notion, Dropbox, etc.
  - `analytics.routes.ts`: Usage tracking and pricing data.
  - `stripe.routes.ts`: Subscription management and webhooks.
  - `email.routes.ts`: Transactional email services (Brevo).
  - `user.routes.ts`: User profile and conversation history.
- **`server/middleware/`**: Centralized logic for auth, uploads, and project validation.
- **`server/brevo.ts`**: Dedicated service for all email communication.
- **`server/storage.ts`**: Type-safe data access layer using Drizzle ORM.

## 🛠 Tech Stack

- **Node.js**: Express with TypeScript.
- **Database**: PostgreSQL with Drizzle ORM.
- **AI**: OpenAI, Anthropic, and Google Gemini integrations.
- **Payments**: Stripe.
- **Email**: Brevo (SendinBlue) Transactional API.
- **Frontend**: React + Vite (located in `/client`).

## ⚙️ Environment Variables

Ensure the following variables are set in your environment:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret for session management |
| `STRIPE_SECRET_KEY` | Stripe API Secret Key |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook signing secret |
| `BREVO_API_KEY` | API Key for Brevo email services |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `PRODUCTION_URL` | Base URL for the production app |
| `REPLIT_DOMAINS` | (Optional) Allowed domains for Replit auth |
| `PSEO_ORIGIN` | (Optional) Enables reverse proxy to the standalone `pseo/` Next.js app (e.g. `http://localhost:3000` in dev or your deployed pSEO origin in prod) |

## 📦 Scripts

- `npm run dev`: Start development server with Vite and tsx.
- `npm run dev:pseo`: Start the standalone pSEO Next.js app (under `pseo/`).
- `npm run dev:with-pseo`: Start the main app with pSEO reverse proxy enabled (expects pSEO on `http://localhost:3000`).
- `npm run build`: Build for production.
- `npm run check`: Run TypeScript type checking (`tsc`).
- `npm run db:push`: Push local schema changes to the database.
- `tsx scripts/cleanup-orphaned-uploads.ts --dry-run`: Report orphaned upload files (omit `--dry-run` to delete; requires `DATABASE_URL`).

## 📄 Setup Guides

- [Google OAuth Setup](GOOGLE_OAUTH_SETUP.md)
- [Production Deployment](PRODUCTION_OAUTH_SETUP.md)
- [Replit Configuration](replit.md)
