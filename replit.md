# PitchChat Builder - Replit Guide

## Overview

PitchChat Builder is a SaaS MVP that transforms startup documentation into AI-powered conversational pitch rooms. The application allows founders to upload documents (PDFs, presentations, spreadsheets), chat with an AI assistant about their startup, and share interactive chat links with investors.

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