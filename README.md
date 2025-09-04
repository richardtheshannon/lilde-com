# HLA DataSpur - Project Management Application

A modern project management application built with Next.js 14, TypeScript, Prisma, and PostgreSQL. Features a responsive navigation system with an expandable sidebar and comprehensive project tracking capabilities.

## Features

- **Responsive Navigation**: Right-side expandable sidebar with Material Design icons
- **Project Management**: Complete CRUD operations for projects, tasks, and team management
- **Database-Driven**: Full PostgreSQL integration with Prisma ORM
- **Modern UI**: Dark theme with clean, minimalist design  
- **TypeScript**: Full type safety throughout the application
- **Production-Ready**: Configured for Railway deployment with health checks

## Tech Stack

- **Framework**: Next.js 14.2.22 with App Router
- **Language**: TypeScript 5.9.2
- **Database**: PostgreSQL with Prisma ORM 5.7.0
- **Authentication**: NextAuth.js 4.24.5 (configured)
- **Styling**: Tailwind CSS 3.4.17 + Custom CSS
- **Icons**: Material Symbols (Google Fonts)
- **Deployment**: Railway-ready with health checks

## Project Structure

```
hla-dataspur-v1/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/health/        # Health check endpoint
│   │   ├── dashboard/         # Dashboard pages
│   │   │   └── projects/      # Projects management
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/layout/    # Layout components
│   │   ├── header.tsx       # Header component
│   │   ├── sidebar.tsx      # Sidebar navigation
│   │   └── footer.tsx       # Footer component
│   └── lib/
│       └── prisma.ts        # Prisma client
├── prisma/
│   └── schema.prisma        # Database schema
├── _TEMP/                   # Documentation
├── .env.example            # Environment template
├── railway.json            # Railway config
└── package.json            # Dependencies

```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hla-dataspur-v1.git
   cd hla-dataspur-v1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. Run database migrations:
   ```bash
   npm run db:migrate:dev
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm run start:prod
   ```

## Railway Deployment

### Setup on Railway

1. **Create Railway Account**: Sign up at [railway.app](https://railway.app)

2. **Connect GitHub Repository**:
   - In Railway dashboard, click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account and select the repository

3. **Configure PostgreSQL**:
   - In your Railway project, click "New"
   - Select "Database" → "Add PostgreSQL"
   - Railway will automatically provide the DATABASE_URL

4. **Set Environment Variables**:
   In Railway project settings, add:
   ```
   DATABASE_URL=[automatically provided by Railway]
   NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]
   NEXTAUTH_URL=https://your-app.up.railway.app
   NODE_ENV=production
   ```

5. **Deploy**:
   - Railway will automatically deploy when you push to your connected branch
   - The build command runs: `npm run build`
   - The start command runs: `npm run start:prod`

6. **Verify Deployment**:
   - Check health endpoint: `https://your-app.up.railway.app/api/health`
   - Database migrations run automatically on deploy

### Database Commands

```bash
# Development
npm run db:push          # Push schema changes (dev)
npm run db:migrate:dev   # Create migration (dev)
npm run db:generate      # Generate Prisma Client

# Production
npm run db:deploy        # Apply migrations (prod)
npm run start:prod       # Start with migrations
```

## Navigation Structure

The application features a clean navigation system:

- **Home Dashboard**: Project overview and statistics
- **Projects**: Complete project management with sub-navigation:
  - Project List - View all projects
  - Active Projects - Currently in progress
  - Completed - Finished projects
  - On Hold - Paused projects

## UI Components

### Sidebar
- Collapsible right-side navigation
- 64px collapsed width, 280px expanded
- Smooth transitions and hover effects
- Sub-navigation support with expand indicators
- Session persistence for user preferences

### Layout
- Fixed sidebar with natural document flow
- Responsive margins that adjust to sidebar state
- Material Design icons throughout
- Dark theme with Highline branding
- Two-column content layout

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes Prisma generate)
- `npm start` - Start production server
- `npm run start:prod` - Production start with migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate:dev` - Create development migration
- `npm run db:deploy` - Deploy migrations to production
- `npm run db:generate` - Generate Prisma client

## License

ISC