# Project Planner - Next.js Application

A modern project planning application built with Next.js 15, TypeScript, and Tailwind CSS, featuring a responsive navigation layout with an expandable sidebar.

## Features

- **Responsive Navigation**: Right-side expandable sidebar with Material Design icons
- **Hierarchical Menu Structure**: Support for sub-navigation with smooth animations
- **Project Management**: Organized sections for projects, tasks, team, and reports
- **Modern UI**: Dark theme with clean, minimalist design
- **TypeScript**: Full type safety throughout the application
- **Modular Architecture**: Following clean architecture principles

## Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Material Symbols (Google Fonts)
- **Database**: PostgreSQL (to be configured)
- **Deployment**: Railway-ready

## Project Structure

```
hla-dataspur-v1/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page component
│   └── globals.css        # Global styles with Tailwind
├── core/                  # Core shared components
│   └── components/
│       ├── header.tsx     # Top navigation header
│       ├── sidebar.tsx    # Expandable sidebar navigation
│       └── footer.tsx     # Footer with action buttons
├── modules/               # Feature modules (modular monolith)
│   └── projects/         # Projects module
│       ├── components/
│       ├── services/
│       └── types/
├── infrastructure/        # Cross-cutting concerns
│   └── database/         # Database configuration
└── _TEMP/                # Documentation and templates

```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL (for future database integration)
- Git

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

Create a production build:

```bash
npm run build
```

### Production

Start the production server:

```bash
npm start
```

## Navigation Structure

The application features a sophisticated navigation system:

- **Projects**: Active, Completed, Templates
- **Tasks**: Today, Week, All Tasks
- **Team**: Team management
- **Reports**: Analytics and reporting
- **Resources**: Documents, Links, Tools, Guidelines
- **Settings**: Application configuration

## UI Components

### Sidebar
- Collapsible right-side navigation
- 64px collapsed width, 280px expanded
- Smooth transitions and hover effects
- Sub-navigation support with expand indicators

### Layout
- Fixed sidebar with natural document flow
- Responsive margins that adjust to sidebar state
- Material Design icons throughout
- Dark theme with subtle transparency effects

## Development Guidelines

Following the CONTRIBUTING.md standards:
- **File naming**: kebab-case (e.g., `project-card.tsx`)
- **Minimal edits**: Be surgical and precise with changes
- **Modular components**: Built for reusability
- **Documentation**: Clear technical documentation

## Future Enhancements

- PostgreSQL database integration
- User authentication system
- Real-time collaboration features
- Advanced project analytics
- Task automation workflows
- Resource management system

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

ISC