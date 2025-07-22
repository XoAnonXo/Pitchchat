# PitchChat Builder - Replit Guide

## Overview

PitchChat Builder is a SaaS MVP that transforms startup documentation into AI-powered conversational pitch rooms. The application allows founders to upload documents (PDFs, presentations, spreadsheets), chat with an AI assistant about their startup, and share interactive chat links with investors. The platform uses a link-based subscription model where free tier users can create 1 pitch link and paid subscribers get unlimited link generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Type Safety**: Full TypeScript coverage with strict configuration

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with session management
- **File Processing**: Multer for file uploads with support for PDFs, DOCX, XLSX, PPTX
- **AI Integration**: OpenAI GPT-4o for chat functionality and text-embedding-3-large for embeddings

### Database Design
- **Primary Database**: PostgreSQL with pgvector extension for vector similarity search
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Schema Management**: Drizzle migrations with PostgreSQL dialect
- **Key Tables**:
  - `users` - User profiles and credits
  - `projects` - Startup project containers
  - `documents` - Uploaded files and metadata
  - `chunks` - Document chunks with embeddings
  - `links` - Shareable chat links
  - `conversations` - Chat sessions
  - `messages` - Individual chat messages

## Key Components

### Document Processing Pipeline
- **Upload Handling**: Multer-based file upload with 500MB limit
- **Text Extraction**: Automated content extraction from various file formats
- **Chunking Strategy**: Intelligent document splitting for optimal embedding
- **Vector Generation**: OpenAI embeddings stored in pgvector for semantic search
- **Status Tracking**: Real-time processing status updates

### AI Chat System
- **Retrieval Augmented Generation (RAG)**: Combines document chunks with OpenAI's GPT-4o
- **Context Management**: Maintains conversation history and document context
- **Citation System**: Tracks and provides source references for AI responses
- **Token Counting**: Monitors usage for billing and rate limiting

### Authentication & Authorization
- **Replit Auth Integration**: OAuth-based authentication with session management
- **User Management**: Profile creation and credit system
- **Session Persistence**: PostgreSQL-backed sessions with configurable TTL
- **Security**: HTTP-only cookies with secure configuration

### File Management
- **Local Storage**: Server-side file storage with organized directory structure
- **File Validation**: MIME type checking and size limits
- **Processing Queue**: Asynchronous document processing workflow
- **Cleanup Handling**: File deletion with database consistency

## Data Flow

### Document Upload Flow
1. User selects files through drag-and-drop interface
2. Frontend validates file types and sizes
3. Multer processes upload and stores files locally
4. Background processing extracts text and generates embeddings
5. Chunks are stored in database with vector embeddings
6. Real-time status updates notify user of completion

### Chat Interaction Flow
1. User sends message through chat interface
2. System performs vector similarity search on document chunks
3. Relevant chunks are retrieved and ranked
4. OpenAI API generates response using retrieved context
5. Response includes citations and source references
6. Conversation history is maintained for context

### Share Link Generation
1. User creates shareable link for specific project
2. System generates unique slug and configures access parameters
3. Investors access link and provide email for authentication
4. Magic link authentication creates temporary session
5. Chat interface provides access to project-specific AI assistant

## External Dependencies

### Core Services
- **OpenAI API**: GPT-4o for chat responses, text-embedding-3-large for embeddings
- **Neon Database**: Serverless PostgreSQL with pgvector extension
- **Replit Auth**: OAuth authentication service

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Backend bundling for production deployment

### UI Dependencies
- **Radix UI**: Comprehensive component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

## Deployment Strategy

### Development Environment
- **Hot Module Replacement**: Vite dev server with React Fast Refresh
- **Database Migrations**: Drizzle Kit push for schema changes
- **Environment Variables**: Centralized configuration for API keys and database URLs
- **Error Handling**: Comprehensive error boundaries and logging

### Production Build
- **Frontend**: Vite production build with optimized assets
- **Backend**: ESBuild bundling for Node.js deployment
- **Database**: Migration-based schema management
- **Monitoring**: Built-in request logging and error tracking

### Scalability Considerations
- **Stateless Architecture**: Session storage in database enables horizontal scaling
- **Vector Search**: pgvector provides efficient similarity search at scale
- **File Storage**: Local storage with potential for S3-compatible migration
- **Rate Limiting**: Token-based usage tracking for API cost management

The application is designed as a monorepo with clear separation between frontend, backend, and shared code, enabling efficient development and deployment workflows.

## Recent Changes: Latest modifications with dates

### July 18, 2025 - Multi-Model AI & Platform Integrations
- Added support for multiple AI models including OpenAI GPT-4o, Anthropic Claude, Google Gemini, and xAI Grok
- Created AIModelSelector component for dynamic model selection in chat interface
- Built comprehensive IntegrationPanel component for connecting to external platforms
- Added integration routes for GitHub, Notion, Google Drive, Dropbox, Asana, and Jira
- Enhanced dashboard with "Import from Platforms" button and AI model selector
- Updated chat interface to accept and pass model parameter to backend
- Created dialog component for modal interfaces
- Installed required dependencies: asana, jira.js packages

### July 18, 2025 - Comprehensive Color System Implementation
- Implemented exact color palette specifications with all requested colors
- Updated CSS variables to match precise hex codes: #2152FF primary, #EBF1FF secondary, #F8FAFB cards
- Added specialized text colors: #1A1A26 primary text, #72788F secondary text, #B5B8CB placeholders
- Created utility color classes: text-success (#2DB47D), text-alert (#FFA900), text-placeholder
- Added gradient utility (.gradient-primary) from #2152FF to #5C8AF7
- Implemented shadow utilities: shadow-soft (blue tint), shadow-subtle (neutral)
- Applied new color system across dashboard, cards, buttons, and UI components
- Enhanced visual hierarchy with proper border colors (#E0E3EB) and background variants

### July 18, 2025 - Figma Integration Implementation
- Added Figma as an available integration platform
- Implemented Figma API integration with Personal Access Token authentication
- Created importFromFigma method to extract text content, comments, and design documentation
- Added route handler for Figma initial connection and sync operations
- Extracts text from all pages, frames, components, and text nodes
- Imports file comments for additional context
- Supports up to 20 recent Figma files per sync

### July 21, 2025 - UI Simplification & Black Theme Implementation
- Changed AI model display from selectable dropdown to static "o3" display
- Completely replaced orange (#FFA500) color scheme with black throughout the interface
- Updated all primary buttons, icons, and accents to use black (#000000) with gray-800 hover state
- Modified sidebar navigation selected state to use gray-100 background with black text
- Hidden delete functionality from main dashboard documents list by adding optional hideDelete prop
- Updated FileUpload component to use black theme for drag states and decorative elements
- Changed ChatInterface to use black for user messages and AI avatar backgrounds
- Maintained Hume-style design principles with cleaner, minimalist black aesthetic
- Redesigned documents management page to match dashboard layout with consistent sidebar navigation
- Removed source filtering from documents page to simplify the interface
- Applied consistent card-based design with stats overview and clean document list
- Created conversations page to track all shared link interactions with visitor details, full chat history, tokens used, and cost analytics
- Added conversations API endpoints to fetch user conversations and messages
- Implemented expandable conversation view showing detailed chat history with proper role indicators
- Added conversations navigation link across all pages with consistent black theme styling
- Created exhaustive analytics page with comprehensive metrics and visualizations
- Added getDetailedAnalytics method to storage layer for comprehensive data aggregation
- Implemented multiple chart types: area charts for time series, bar charts for project performance, pie charts for document distribution
- Added link performance table showing top performing links with engagement metrics
- Created visitor engagement section with top visitors and average metrics
- Included summary cards with gradient backgrounds showing key performance indicators
- Integrated analytics navigation across all pages maintaining consistent design system

### July 21, 2025 - Settings Page Implementation
- Created comprehensive settings page with user profile management
- Added API keys management section for OpenAI, Anthropic, Google AI, and xAI
- Implemented notification preferences with toggles for email alerts, weekly reports, and product updates
- Built billing and credits section with gradient card showing available credits
- Added data & privacy section with export data, change password, and 2FA options
- Implemented account deletion flow with confirmation dialog and email verification
- Updated all navigation links across pages to include settings
- Maintained consistent black theme and Hume-style design throughout

### July 21, 2025 - Email Notifications & Weekly Reports
- Removed API keys section from settings page as users cannot add their own keys
- Hidden product updates toggle from notification preferences
- Added email notification fields (emailAlerts, weeklyReports) to user schema
- Implemented email alert system that triggers when new investor starts conversation
- Created email notification endpoints for investor engagement alerts
- Designed weekly report email template with key metrics, project performance, and visitor stats
- Added automatic email notification when investors engage with shared pitch links
- Implemented user notification preference updates through API
- Email templates include comprehensive analytics: conversations, tokens, costs, and top performers
- Weekly reports can be triggered via POST to /api/email/weekly-report endpoint

### July 21, 2025 - Contact Team Feature for Investor Chat
- Added "Contact the Team" button below investor chat interface
- Created ContactTeamDialog component allowing investors to optionally provide contact details
- Added contact fields to conversations table: contactName, contactPhone, contactCompany, contactWebsite, contactProvidedAt
- Implemented POST /api/conversations/:conversationId/contact endpoint to save contact information
- Enhanced conversations page with notification bell icon for conversations with contact details
- Added contact details display in expanded conversation view with formatted layout
- Contact information shown includes name, phone (WhatsApp/Telegram), company, and website
- Founders receive visual notification on dashboard when investors provide contact information
- All contact fields are optional to reduce friction for investors

### July 21, 2025 - Custom Authentication System Implementation
- Replaced Replit Auth with custom email/password authentication system
- Created comprehensive auth page with login and registration forms
- Updated database schema to support password storage and OAuth providers
- Added password hashing with scrypt for secure password storage
- Created customAuth.ts module to handle all authentication logic
- Updated all routes from `/api/login` to `/auth` throughout the application
- Changed logout routes from `/api/logout` to `/api/auth/logout`
- Updated all server routes to use `req.user.id` instead of `req.user.claims.sub`
- Added support for future Google and Apple sign-in integration
- Implemented proper session management with PostgreSQL-backed sessions
- Created clean, minimalist auth page matching Hume-style design with black accents

### July 21, 2025 - Chat & File Upload Fixes
- Fixed ChatInterface model error by removing hardcoded "o3" model parameter (uses default gpt-4o)
- Kept visual "o3" badge for display purposes while using supported models in backend
- Fixed missing FileText import in FileUpload component
- Improved file upload to handle multiple files sequentially instead of simultaneously
- Added visual progress indicators showing upload status for each file
- Fixed ChatInterface unauthorized redirect to use `/auth` instead of `/api/login`
- Fixed logout 404 error by changing logout endpoint from POST to GET and redirecting to `/auth`

### July 21, 2025 - Document Management Enhancements
- Fixed document deletion by properly handling foreign key constraints with chunks table
- Added duplicate document detection to prevent same files from being uploaded multiple times
- Created checkDuplicateDocument method in storage layer
- Updated upload endpoint to check for duplicates before creating documents
- Modified FileUpload component to track and notify about duplicates
- Shows toast notification with count of duplicates found and ignored
- Fixed PDF processing error by converting Buffer to Uint8Array for pdfjs-dist
- Added text cleaning function to remove null bytes and invalid UTF-8 sequences
- Added Cyrillic font support with Noto Sans for better international text rendering

### July 21, 2025 - Investor Chat & Dashboard UI Improvements
- Fixed critical __dirname error in document download endpoint by using process.cwd()
- Changed all "o3" references to "4o" throughout the platform
- Removed "o3" badge from investor chat page (now shows "Powered by OpenAI")
- Created DocumentDownloadDialog component for selective document downloads
- Added checkboxes for document selection with "Download Selected" functionality
- Extended Cyrillic font support to document download dialog using Noto Sans font family
- Removed decorative circle backgrounds from FileUpload component for cleaner design
- Fixed ChatInterface layout issue by changing from fixed height (700px) to responsive (h-full)
- Made AI assistant chat section properly scrollable on dashboard
- Updated dashboard container to properly handle overflow for chat interface

### July 21, 2025 - Platform Pricing System Implementation
- Implemented comprehensive monetization system with 10x margin on OpenAI costs
- Created pricing.ts module with accurate OpenAI pricing and platform multipliers
- Platform charges $0.10 per 1K tokens for GPT-4o (vs OpenAI's ~$0.01) 
- Platform charges $0.0013 per 1K tokens for embeddings (vs OpenAI's $0.00013)
- Updated all cost tracking throughout system to display platform pricing instead of raw tokens
- Modified conversation cost calculations to use calculatePlatformCost function
- Added pricing information card to dashboard showing "AI Usage Price: $0.10/1K tokens"
- Updated analytics and conversations pages to display costs in platform dollars
- Configured Stripe integration for future payment processing
- Added pricing endpoint (/api/pricing) to provide pricing breakdown to frontend
- Updated document processing to calculate embedding costs using platform pricing

### July 21, 2025 - Google OAuth & Brevo Email Integration
- Added Google OAuth sign-in functionality with "Continue with Google" buttons on auth page
- Updated database schema with googleId field and added getUserByGoogleId method
- Fixed landing page "Create your pitch room" button to redirect to /auth instead of /api/login
- Configured Google OAuth strategy with proper user creation and account linking
- Added Brevo email service integration for investor engagement alerts and weekly reports
- Created comprehensive email templates with professional styling and branding
- Updated investor engagement notifications to use Brevo instead of SendGrid
- Enhanced weekly report emails with detailed analytics and engagement metrics
- Added automatic email notifications when investors start conversations with pitch rooms

### July 21, 2025 - Complete Password Reset Flow Implementation
- Added forgot password and reset password pages with comprehensive UI
- Created passwordResetTokens table in database schema with token expiration handling
- Implemented storage methods: createPasswordResetToken, getPasswordResetToken, deletePasswordResetToken, updateUserPassword
- Added /api/auth/forgot-password endpoint that sends reset emails via Brevo
- Added /api/auth/reset-password endpoint that validates tokens and updates passwords
- Created professional email templates: password reset, welcome email, password changed confirmation, account deletion
- Updated registration process to automatically send welcome emails to new users with 1,000 free tokens
- Added password changed confirmation email when users successfully reset their password
- Implemented secure token generation using crypto.randomBytes with 1-hour expiration
- Added "Forgot password?" link to login form on authentication page
- All email templates use PitchChat branding with responsive HTML design and black CTA buttons

### July 21, 2025 - Enhanced Email Notifications for Investor Interactions
- Created two new email templates: sendInvestorContactEmail and sendFounderContactAlert
- Added email notification to investors when they submit contact details, confirming their information was shared
- Investors receive a personalized email with a link to revisit their conversation on pitchchat.ai
- Founders receive immediate email alert when investors share contact details with all contact information formatted
- Updated contact submission endpoint to trigger both email notifications automatically
- Investor emails include summary of shared contact details and continue conversation button
- Founder emails include pro tip to review conversation history before reaching out
- All new email templates use consistent PitchChat.ai branding with black accent colors
- Existing investor engagement email already sends when investors first start chatting with pitch rooms

### July 21, 2025 - Email Testing and Validation Improvements
- Added comprehensive input validations to ContactTeamDialog with error messages for name, phone, company, and website
- Enhanced email validation on investor chat page with detailed regex-based error feedback
- Created test email endpoint (/api/email/test-all) to send all 4 email types for testing
- Added "Send Test Emails" button in Settings → Notifications section
- Updated Brevo sender email to use replit.com domain to avoid domain verification issues
- Added detailed logging to debug email sending issues with Brevo API
- Note: Email delivery requires proper Brevo API key configuration and sender domain verification

### July 22, 2025 - Link-Based Subscription Model Implementation
- Completely pivoted from token-based to link-based subscription model
- Free tier users can now create 1 pitch link, paid subscribers get unlimited links
- Removed all token checking and deduction logic from link creation process
- Updated dashboard to display link limits instead of token balances
- Removed token deduction from investor chat functionality
- Updated settings page billing section to show subscription status and link limits
- Removed one-time token purchase endpoints and functionality
- Updated Stripe webhook handlers to remove token addition logic
- Simplified pricing structure to focus on monthly/annual subscriptions only
- Added getUserLinksCount method to storage layer for tracking link usage
- Updated all UI references from tokens/credits to link-based limits
- Maintained existing Stripe integration for subscription management
- Fixed Stripe configuration with proper price IDs: monthly ($29) and annual ($278.40)
- Re-enabled subscription limits after Stripe price IDs were configured
- System now properly enforces 1 link for free users, unlimited for paid subscribers
- Fixed critical PostgreSQL array query error in getUserLinksCount function
- Created comprehensive links management page at /links/:projectId with full CRUD functionality
- Added "Manage Links" button to dashboard for easy navigation
- Implemented copy-to-clipboard functionality for sharing links with investors
- Fixed navigation routing issue where links were broken after visiting links page (dashboard route is `/` not `/dashboard`)

### July 22, 2025 - Deployment Fix for Top-Level Await Issue
- Fixed critical deployment issue in server/brevo.ts that caused esbuild bundling failure
- Replaced top-level await with dynamic import inside initializeBrevo function
- Moved SibApiV3Sdk import from module level to function level to avoid bundling conflicts
- Updated sendBrevoEmail function to initialize Brevo client on each call instead of at module load
- This resolves "Top-level await in server/brevo.ts is incompatible with esbuild bundling process" error
- Application can now be successfully deployed to production environments