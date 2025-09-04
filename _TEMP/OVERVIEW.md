# Project Planning Application - Technical Handover Documentation

## Metadata
- **Project Name**: project-planning-app
- **Repository URL**: https://github.com/richardtheshannon/project-planning-app.git
- **Primary Branch**: master
- **Commit Hash**: f50dd2c
- **Generation Timestamp**: 2025-08-29T00:00:00Z
- **Generator**: Automated handover summary

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Core Architectural Model](#core-architectural-model)
3. [Technical Overview and Current State](#technical-overview-and-current-state)
4. [Key Functionalities](#key-functionalities)
5. [System Architecture](#system-architecture)
6. [Data Model](#data-model)
7. [APIs and Integrations](#apis-and-integrations)
8. [Frontend](#frontend)
9. [Backend/Services](#backend-services)
10. [Background Jobs/Workers](#background-jobsworkers)
11. [Infrastructure and DevOps](#infrastructure-and-devops)
12. [Dependencies](#dependencies)
13. [Setup, Configuration, and Running](#setup-configuration-and-running)
14. [Testing and Quality](#testing-and-quality)
15. [Directory Map](#directory-map)
16. [Challenges, Errors, Failures, Revisions, and Resolutions](#challenges-errors-failures-revisions-and-resolutions)
17. [Known Issues and Limitations](#known-issues-and-limitations)
18. [Update/Change Management Policy](#updatechange-management-policy)
19. [Security, Privacy, and Compliance](#security-privacy-and-compliance)
20. [Glossary and Acronyms](#glossary-and-acronyms)

## Executive Summary

The project-planning-app is a comprehensive web-based project management system built with Next.js 13.5.6, TypeScript, and PostgreSQL, deployed on Railway infrastructure. The application provides multi-user collaborative project management capabilities with features including task tracking, financial management, documentation, team collaboration, and automated email notifications via scheduled cron jobs.

## Core Architectural Model

This application is designed as a collaborative, multi-user platform. It is not a user-centric application. All authenticated users have access to and manage a single, shared database. Any data created or modified by one user will be visible to all other users.

## Technical Overview and Current State

### Architecture
- **Framework**: Next.js 13.5.6 with App Router
- **Language**: TypeScript 5.3.0
- **Database**: PostgreSQL with Prisma ORM 5.7.0
- **Authentication**: NextAuth.js 4.24.5 with credentials provider
- **Styling**: Tailwind CSS 3.3.0 with Radix UI components
- **Deployment**: Railway platform with Nixpacks builder

### Current Development State
The application is in active development with recent commits focusing on:
- Project links feature (commit: 4ed7401)
- Prisma client regeneration fixes (commit: f50dd2c)

The master branch serves as both development and production branch per CLAUDE.md instructions.

## Key Functionalities

### Project Management
- Multi-project tracking with status, priority, and type classification
- Task management with subtasks, categories, and time tracking
- Timeline events and milestones tracking
- Project contacts and team member management
- Project links for external resources

### Team Collaboration
- User roles (ADMIN, USER, VIEWER)
- Project member assignments with role-based permissions
- Comments on tasks
- Real-time notifications
- Daily and afternoon manifest emails via cron jobs

### Documentation System
- Feature request tracking with conversion to documentation
- Documentation management with categories and tags
- Layout templates for various document types
- Help mode with closeable notifications

### Operations Dashboard
- Daily items tracking
- Interactive calendar view
- Overdue task monitoring
- Quick actions interface

## System Architecture

### Components and Services

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│  - Next.js Frontend                                      │
│  - React Components                                      │
│  - Tailwind CSS + Radix UI                             │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Next.js Application                     │
│  - App Router                                           │
│  - API Routes                                           │
│  - Server Components                                    │
│  - NextAuth.js                                         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                    Prisma ORM                           │
│  - Type-safe database client                            │
│  - Migration management                                 │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  PostgreSQL Database                     │
│  - Relational data storage                              │
│  - JSON field support                                   │
└─────────────────────────────────────────────────────────┘

External Services:
- Google APIs (Gmail integration)
- Nodemailer (Email delivery)
```

### Data Flow
1. **Authentication Flow**: 
   - User credentials → NextAuth → Prisma → PostgreSQL
   - JWT token generation and session management

2. **API Request Flow**:
   - Client request → Next.js API route → Prisma query → Database
   - Response transformation → JSON response → Client

3. **File Upload Flow**:
   - Multipart form data → Formidable parsing → File system storage
   - Database record creation with file metadata

## Data Model

### Core Entities

#### User Model
```prisma
model User {
  id                    String    @id @default(cuid())
  email                 String?   @unique
  password              String?
  role                  UserRole  @default(USER)
  isActive              Boolean   @default(false)
  sendDailyManifest     Boolean   @default(false)
  sendAfternoonManifest Boolean   @default(false)
  enableCloseableNotifications Boolean @default(true)
  closedNotifications   Json?     @default("[]")
}
```
*File: prisma/schema.prisma:15-49*

#### Project Model
```prisma
model Project {
  id           String         @id @default(cuid())
  name         String
  description  String?
  status       ProjectStatus  @default(PLANNING)
  priority     Priority       @default(MEDIUM)
  projectType  ProjectType    @default(PERSONAL_PROJECT)
  startDate    DateTime?
  endDate      DateTime?
}
```
*File: prisma/schema.prisma:133-160*

### Database Migrations
Recent migrations tracked in `prisma/migrations/`:
- 20250820063145_init_postgres: Initial PostgreSQL setup
- 20250828030225_add_project_links: Latest feature addition

### Environment Variables
- DATABASE_URL: PostgreSQL connection string
- NEXTAUTH_SECRET: Authentication secret
- NEXTAUTH_URL: Application URL for auth callbacks

## APIs and Integrations

### Internal API Routes

#### Authentication
- `/api/auth/[...nextauth]`: NextAuth.js dynamic route
- `/api/auth/register`: User registration
- `/api/register`: Alternative registration endpoint

#### Project Management
- `/api/projects`: CRUD operations for projects
- `/api/projects/[id]`: Individual project operations
- `/api/projects/[id]/contacts`: Project contact management
- `/api/projects/[id]/links`: Project links management

#### Task Management
- `/api/tasks`: Task CRUD operations
- `/api/timeline-events`: Timeline event management

#### Documentation
- `/api/documentation`: Documentation management
- `/api/feature-requests`: Feature request tracking
- `/api/feature-requests/[id]/convert-to-documentation`: Conversion endpoint

### External Integrations

#### Google APIs
```javascript
const { google } = require('googleapis');
```
*Package: @google-cloud/local-auth@3.0.1*
Used for Gmail integration and email services.

#### Email Services
- Nodemailer for SMTP email delivery
- Google OAuth2 for Gmail API access
- PDF generation with jspdf for invoice attachments

## Frontend

### Framework and Routing
- Next.js 13.5.6 with App Router
- File-based routing in `src/app/`
- Server and Client Components separation

### Key Components

#### Layout Structure
```typescript
// src/app/layout.tsx
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});
```
*File: src/app/layout.tsx:11-22*

#### Dashboard Components
- `FeatureRequests.tsx`: Feature request management
- `MonthlyTimeline.tsx`: Timeline visualization
- `InteractiveCalendar.tsx`: Calendar interface
- `QuickActionsCard.tsx`: Quick action buttons

### State Management
- React Hook Form for form handling
- Zustand/Context for global state (inferred from hooks)
- Server-side data fetching with Next.js

### UI Component Library
Radix UI primitives with custom styling:
- Dialog, Dropdown, Tabs, Toast
- Form components with Zod validation
- Data tables with sorting and filtering
- Custom theme provider for dark/light modes

## Backend/Services

### Server Configuration
```javascript
// server.js
const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

// Initialize CRON jobs after server starts
setTimeout(() => {
  const cronUrl = dev 
    ? `http://localhost:${port}/api/init`
    : `http://localhost:${port}/api/init`;
  
  fetch(cronUrl)
    .then(res => res.json())
    .then(data => console.log('[SERVER] CRON initialization:', data))
}, 5000);
```
*File: server.js:6-37*

### Authentication Service
```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!user.isActive) {
          throw new Error("Your account has not been activated.");
        }
      }
    })
  ],
  session: { strategy: "jwt" }
}
```
*File: src/lib/auth.ts:8-56*

### Database Service
- Prisma client singleton pattern
- Connection pooling configuration
- Migration management scripts

### Email Service
- Template-based email generation
- PDF attachment support
- SMTP and Gmail API integration

## Background Jobs/Workers

### Cron Jobs
Configured via `/api/cron/` endpoints:
- `/api/cron/send-manifest`: Daily manifest email
- `/api/cron/send-afternoon-manifest`: Afternoon manifest email

Implementation uses node-cron library initialized on server startup.

### Scheduled Tasks
- User notification digests
- Overdue task reminders

## Infrastructure and DevOps

### Deployment Platform
**Railway** (railway.app)
- Region: us-west1
- Builder: Nixpacks
- Health check: `/api/health`
- Restart policy: ON_FAILURE with max 10 retries

### Configuration
```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "region": "us-west1"
  }
}
```
*File: railway.json:1-21*

### CI/CD Pipeline
- Direct push to master branch triggers deployment
- Prisma migrations run on deployment via `npm run start:prod`
- No feature branches per CLAUDE.md policy

### Environment Management
- Development: Local PostgreSQL or Railway dev database
- Production: Railway-managed PostgreSQL
- Secrets stored in Railway environment variables

## Dependencies

### Production Dependencies (Major)
```json
{
  "@prisma/client": "^5.7.0",
  "next": "13.5.6",
  "next-auth": "4.24.5",
  "react": "^18.2.0",
  "prisma": "^5.7.0",
  "bcryptjs": "^2.4.3",
  "tailwindcss": "^3.3.0",
  "zod": "^4.0.15",
  "nodemailer": "^6.10.1",
  "googleapis": "^158.0.0",
  "jspdf": "^3.0.2",
  "recharts": "^3.1.2"
}
```
*File: package.json:35-84*

### Development Dependencies
```json
{
  "typescript": "^5.3.0",
  "autoprefixer": "^10.4.0",
  "eslint": "^8.55.0",
  "husky": "^9.1.7",
  "pg": "^8.11.3"
}
```
*File: package.json:86-107*

## Setup, Configuration, and Running

### Installation
```bash
npm install
```

### Database Setup
```bash
npm run db:migrate:dev  # Development migrations
npm run db:deploy       # Production deployment
```

### Development
```bash
npm run dev  # Start development server on port 3000
```

### Production Build
```bash
npm run build  # Builds and generates Prisma client
npm run start:prod  # Runs migrations and starts server
```

### Scripts Available
*File: package.json:9-30*
- `db:push`: Push schema changes with data loss acceptance
- `db:backup`: Create database backup
- `db:status`: Check migration status
- `dev:fresh`: Clean cache and restart dev server

## Testing and Quality

### Current Testing Status
Unknown - No test files or testing configuration found in provided sources.

### Code Quality Tools
- ESLint configuration present (eslint.config.mjs)
- TypeScript for type safety
- Husky for git hooks (prepare script)

### Build Configuration
```javascript
// next.config.js
typescript: {
  ignoreBuildErrors: true,  // TypeScript errors ignored
},
eslint: {
  ignoreDuringBuilds: true,  // ESLint errors ignored
}
```
*File: next.config.js:3-8*

## Directory Map

```
project-planning-V2/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── projects/       # Project management
│   │   │   ├── tasks/          # Task management
│   │   │   ├── documentation/  # Documentation system
│   │   │   └── cron/           # Scheduled jobs
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── operations/     # Operations management
│   │   │   ├── projects/       # Project views
│   │   │   ├── settings/       # Application settings
│   │   │   └── team/           # Team management
│   │   ├── auth/              # Authentication pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # Radix UI components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── operations/       # Operations components
│   │   └── projects/         # Project components
│   ├── lib/                  # Utility libraries
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── prisma.ts        # Prisma client
│   │   ├── email.ts         # Email services
│   │   └── pdf-generator.ts # PDF generation
│   ├── hooks/               # Custom React hooks
│   ├── services/            # Business logic services
│   ├── templates/           # Email/layout templates
│   └── types/              # TypeScript definitions
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── public/                 # Static assets
│   ├── uploads/           # User uploads
│   └── media/             # Application media
├── scripts/               # Utility scripts
│   ├── backup-database.js
│   ├── migrate-data.js
│   └── validate-migration.js
├── _TEMP/                 # Temporary documentation
├── backups/              # Database backups
├── server.js             # Custom server with cron
├── package.json          # Dependencies
├── railway.json          # Railway configuration
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── CLAUDE.md            # Development instructions
```

## Challenges, Errors, Failures, Revisions, and Resolutions

### Recent Issue Resolutions

#### 1. Prisma Client Generation Issue
**Commit**: f50dd2c (2025-08-29)
**Problem**: Prisma client not regenerating to include ProjectLink model
**Resolution**: Force Prisma client regeneration in build process

#### 2. Project Links Feature
**Commit**: 4ed7401 (2025-08-28)
**Problem**: Need for external resource linking in projects
**Resolution**: Added project_links table with responsive design implementation

#### 5. TypeScript Build Errors
**Commit**: 53e39bb (2025-08-25)
**Problem**: TypeScript errors blocking Operations Dashboard refactor
**Resolution**: Resolved type issues and finalized refactor

### Migration History
- Successfully migrated from MySQL to PostgreSQL (20250820063145_init_postgres)
- Added multiple feature enhancements via migrations without rollbacks

## Known Issues and Limitations

### Current Configuration Issues
1. **TypeScript errors ignored in build**: `ignoreBuildErrors: true` in next.config.js
2. **ESLint errors ignored in build**: `ignoreDuringBuilds: true` in next.config.js
3. **No test coverage**: Testing framework and tests not implemented

### Open Tasks (from git status)
- Modified: `src/templates/templates.json`
- Untracked: `src/templates/application/mobile-first.html`

### Platform Limitations
- Railway deployment limited to us-west1 region
- File uploads stored on local volume (not distributed storage)
- Cron jobs dependent on server uptime

## Update/Change Management Policy

**Always ask to review files before updating them so we can maintain current development and not break existing developments.**

### Git Workflow Policy (from CLAUDE.md)
- Always work on and push to the `master` branch directly
- Do NOT create or work on feature branches
- Railway deployment triggered by pushes to `master` branch only
- Avoid creating feature branches to prevent merge confusion

## Security, Privacy, and Compliance

### Authentication Security
- Password hashing with bcryptjs
- JWT token-based sessions
- User activation requirement before login
- Role-based access control (ADMIN, USER, VIEWER)

### Data Security
- NEXTAUTH_SECRET environment variable for session encryption
- Database credentials stored in environment variables
- HTTPS enforcement in production

### User Privacy
- Shared database model - all users see all data
- No user-specific data isolation
- Email addresses unique per user

### Compliance Considerations
- No documented GDPR/CCPA compliance measures
- No data encryption at rest documentation
- No audit logging implementation found

## Glossary and Acronyms

- **CRUD**: Create, Read, Update, Delete
- **JWT**: JSON Web Token
- **ORM**: Object-Relational Mapping
- **SSR**: Server-Side Rendering
- **ISR**: Incremental Static Regeneration
- **API**: Application Programming Interface
- **PDF**: Portable Document Format
- **SMTP**: Simple Mail Transfer Protocol
- **OAuth**: Open Authorization
- **cuid**: Collision-resistant Unique Identifier
- **Nixpacks**: Railway's buildpack system
- **Prisma**: TypeScript ORM for database access
- **NextAuth**: Authentication library for Next.js
- **Radix UI**: Unstyled, accessible UI components
- **Railway**: Platform-as-a-Service deployment platform