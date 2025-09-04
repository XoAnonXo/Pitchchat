# PitchChat Builder - Replit Guide

## Overview
PitchChat Builder is a SaaS MVP designed to convert startup documentation into AI-powered conversational pitch rooms. It enables founders to upload various document types (PDFs, presentations, spreadsheets), interact with an AI assistant about their startup, and share interactive chat links with investors. The platform operates on a link-based subscription model, offering free tier users one pitch link and paid subscribers unlimited link generation. The vision is to streamline investor communication, enhance pitch effectiveness, and provide actionable insights through AI-driven interactions.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
### Frontend
- **Framework**: React 18 with TypeScript (Vite build tool)
- **UI**: shadcn/ui (Radix UI primitives), Tailwind CSS (custom design tokens)
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Type Safety**: Full TypeScript

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **Database ORM**: Drizzle ORM
- **Authentication**: Custom email/password system with Google OAuth integration, PostgreSQL-backed session management.
- **File Processing**: Multer for uploads (PDFs, DOCX, XLSX, PPTX, XLS) with text extraction and intelligent chunking.
- **AI Integration**: OpenAI GPT-4o for chat, text-embedding-3-large for embeddings.
- **Email Service**: Brevo for notifications (investor engagement, weekly reports, password resets).

### Database
- **Primary Database**: PostgreSQL with `pgvector` extension for vector similarity search.
- **Session Storage**: PostgreSQL-backed sessions.
- **Schema Management**: Drizzle migrations.
- **Key Tables**: `users`, `projects`, `documents`, `chunks`, `links`, `conversations`, `messages`, `passwordResetTokens`.

### Core Features
- **Document Processing**: Upload handling (up to 500MB), text extraction from various formats, chunking, OpenAI vector generation, and real-time processing status. Supports duplicate detection and text cleaning.
- **AI Chat System**: Retrieval Augmented Generation (RAG) using OpenAI's GPT-4o, context management, citation system, token counting.
- **Authentication**: Custom email/password and Google OAuth, secure password hashing (scrypt), PostgreSQL-backed sessions.
- **File Management**: Local server-side storage, file validation, asynchronous processing queue.
- **Share Links**: Unique slug generation, magic link authentication for investors.
- **Pricing & Subscription**: Link-based model (1 free link, unlimited paid), 10x margin on OpenAI costs, Stripe integration for future payments.
- **Analytics**: Comprehensive analytics page with metrics, charts, and link performance tracking.
- **Notifications**: Email alerts for investor engagement, weekly reports, and contact form submissions via Brevo.
- **UI/UX**: Hume-style minimalist design with a black theme, consistent card-based layouts, and responsive components.

## External Dependencies
- **OpenAI API**: GPT-4o, text-embedding-3-large.
- **Neon Database**: Serverless PostgreSQL.
- **Brevo (formerly Sendinblue)**: Email service for transactional and marketing emails.
- **Stripe**: Payment processing for subscriptions.
- **Vite**: Frontend build tool.
- **Drizzle Kit**: Database migration and schema management.
- **ESBuild**: Backend bundling.
- **Radix UI**: UI component primitives.
- **Tailwind CSS**: Styling framework.
- **Lucide React**: Icon library.
- **@testsprite/testsprite-mcp**: For automated testing.
- **xlsx**: For Excel file (XLS/XLSX) text extraction.
- **pdfjs-dist**: For PDF text extraction.