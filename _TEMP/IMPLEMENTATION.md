# Project Planning Application Development Guideline

### Step 2: Initialize Next.js with Specific Version
```bash
npx create-next-app@latest . --typescript --tailwind --app --import-alias "@/*"
```
When prompted:
- Would you like to use ESLint? → Yes
- Would you like to use `src/` directory? → Yes

### Step 3: Install Required Dependencies
```bash
# Core dependencies
npm install next@13.5.6 react@18.2.0 react-dom@18.2.0

# Database and ORM
npm install @prisma/client@5.7.0 prisma@5.7.0

# Authentication (simplified initially)
npm install bcryptjs@2.4.3 jsonwebtoken@9.0.2
npm install --save-dev @types/bcryptjs @types/jsonwebtoken

# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-tabs @radix-ui/react-toast

# Form handling
npm install react-hook-form@7.48.2 zod@3.22.4 @hookform/resolvers@3.3.2

# Additional utilities
npm install date-fns@3.0.6 clsx@2.1.0
```

### Step 4: Create Project Structure
```bash
# Create directory structure
mkdir -p src/app/api
mkdir -p src/app/dashboard/{projects,tasks,documentation,operations,team,settings}
mkdir -p src/components/{layout,ui,dashboard,projects,tasks}
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/styles
mkdir -p public/uploads
mkdir -p scripts
mkdir -p backups
```

## Phase 2: Database Setup

### Step 5: Configure Environment Variables
Create `.env.local`:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/project_planning_dev"

# Auth (simplified for now)
JWT_SECRET="your-development-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Application
NODE_ENV="development"
```

Create `.env.production`:
```env
# Will be populated by Railway
DATABASE_URL="${DATABASE_URL}"
JWT_SECRET="${JWT_SECRET}"
NEXTAUTH_URL="${NEXTAUTH_URL}"
NODE_ENV="production"
```

### Step 6: Initialize Prisma
```bash
npx prisma init
```

### Step 7: Create Database Schema
Replace `prisma/schema.prisma` with:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  ADMIN
  USER
  VIEWER
}

enum ProjectStatus {
  PLANNING
  IN_PROGRESS
  ON_HOLD
  COMPLETED
  CANCELLED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum ProjectType {
  PERSONAL_PROJECT
  CLIENT_PROJECT
  INTERNAL_PROJECT
  RESEARCH_PROJECT
  MAINTENANCE
}

model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  password              String
  name                  String?
  role                  UserRole  @default(USER)
  isActive              Boolean   @default(true)
  sendDailyManifest     Boolean   @default(false)
  sendAfternoonManifest Boolean   @default(false)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  projects              ProjectMember[]
  tasksCreated          Task[]    @relation("TaskCreator")
  tasksAssigned         Task[]    @relation("TaskAssignee")
  comments              Comment[]
  documents             Documentation[]
  featureRequests       FeatureRequest[]
}

model Project {
  id           String         @id @default(cuid())
  name         String
  description  String?
  status       ProjectStatus  @default(PLANNING)
  priority     Priority       @default(MEDIUM)
  projectType  ProjectType    @default(PERSONAL_PROJECT)
  startDate    DateTime?
  endDate      DateTime?
  budget       Float?
  progress     Float          @default(0)
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  
  members      ProjectMember[]
  tasks        Task[]
  documents    Documentation[]
  links        ProjectLink[]
}

model ProjectMember {
  id        String   @id @default(cuid())
  projectId String
  userId    String
  role      String   @default("member")
  joinedAt  DateTime @default(now())
  
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([projectId, userId])
}

model Task {
  id           String    @id @default(cuid())
  title        String
  description  String?
  projectId    String
  creatorId    String
  assigneeId   String?
  status       String    @default("TODO")
  priority     Priority  @default(MEDIUM)
  category     String?
  estimatedHours Float?
  actualHours  Float?
  dueDate      DateTime?
  completedAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  project      Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  creator      User      @relation("TaskCreator", fields: [creatorId], references: [id])
  assignee     User?     @relation("TaskAssignee", fields: [assigneeId], references: [id])
  subtasks     Subtask[]
  comments     Comment[]
}

model Subtask {
  id          String   @id @default(cuid())
  taskId      String
  title       String
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  task        Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  taskId    String
  userId    String
  createdAt DateTime @default(now())
  
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id])
}

model Documentation {
  id          String   @id @default(cuid())
  title       String
  content     String
  category    String
  tags        String[]
  projectId   String?
  authorId    String
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  project     Project? @relation(fields: [projectId], references: [id])
  author      User     @relation(fields: [authorId], references: [id])
}

model FeatureRequest {
  id              String   @id @default(cuid())
  title           String
  description     String
  status          String   @default("PENDING")
  priority        Priority @default(MEDIUM)
  requesterId     String
  convertedToDoc  Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  requester       User     @relation(fields: [requesterId], references: [id])
}

model ProjectLink {
  id          String   @id @default(cuid())
  projectId   String
  title       String
  url         String
  description String?
  category    String?
  createdAt   DateTime @default(now())
  
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

### Step 8: Create and Run Database Migration
```bash
# Create database if it doesn't exist
createdb project_planning_dev

# Generate migration
npx prisma migrate dev --name initial_schema

# Generate Prisma Client
npx prisma generate
```

## Phase 3: Template Layout Conversion

### Step 9: Extract Template Styles
Create `src/styles/template.css`:
```css
/* Material Symbols Settings */
.material-symbols-outlined {
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
    user-select: none;
}

/* Maintain exact measurements from template */
:root {
    --header-height: 60px;
    --footer-height: 60px;
    --sidebar-collapsed: 64px;
    --sidebar-expanded: 280px;
    --content-margin: 20px;
    --nav-icon-size: 24px;
    --nav-container: 40px;
    --sub-nav-icon-size: 20px;
    --sub-nav-height: 36px;
}

/* Dark theme colors */
.dark-theme {
    --bg-primary: #2a2a2a;
    --bg-secondary: rgba(42, 42, 42, 0.95);
    --text-primary: #fff;
    --text-secondary: rgba(255,255,255,0.8);
    --text-tertiary: rgba(255,255,255,0.6);
    --border-color: rgba(255,255,255,0.1);
    --hover-bg: rgba(255,255,255,0.05);
}

/* Layout structure */
.app-layout {
    min-height: 100vh;
    background: var(--bg-primary);
    color: var(--text-primary);
}

/* Header styles */
.app-header {
    height: var(--header-height);
    background: var(--bg-secondary);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

/* Main sidebar */
.main-sidebar {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: var(--sidebar-collapsed);
    transition: width 0.3s;
    z-index: 100;
}

.main-sidebar.expanded {
    width: var(--sidebar-expanded);
    background: var(--bg-primary);
    border-left: 1px solid var(--border-color);
}

/* Content area */
.main-content {
    margin-left: var(--content-margin);
    margin-right: calc(var(--sidebar-collapsed) + var(--content-margin));
    min-height: calc(100vh - var(--header-height) - var(--footer-height) - 40px);
    transition: margin-right 0.3s;
}

.main-content.sidebar-expanded {
    margin-right: calc(var(--sidebar-expanded) + var(--content-margin));
}

/* Footer */
.app-footer {
    height: var(--footer-height);
    background: var(--bg-secondary);
    margin-left: var(--content-margin);
    margin-right: var(--sidebar-collapsed);
    transition: margin-right 0.3s;
}

.app-footer.sidebar-expanded {
    margin-right: var(--sidebar-expanded);
}
```

### Step 10: Create Root Layout Component
Create `src/app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/styles/template.css'
import { AppShell } from '@/components/layout/AppShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Project Planning App',
  description: 'Comprehensive project management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark-theme">
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
        />
      </head>
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
```

### Step 11: Create AppShell Component
Create `src/components/layout/AppShell.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="app-layout">
      <Header />
      <Sidebar 
        expanded={sidebarExpanded} 
        onToggle={() => setSidebarExpanded(!sidebarExpanded)} 
      />
      <main className={`main-content ${sidebarExpanded ? 'sidebar-expanded' : ''}`}>
        {children}
      </main>
      <Footer expanded={sidebarExpanded} />
    </div>
  )
}
```

### Step 12: Create Header Component
Create `src/components/layout/Header.tsx`:
```tsx
'use client'

import Link from 'next/link'

export function Header() {
  return (
    <header className="app-header">
      <Link href="/" className="logo">
        <span className="material-symbols-outlined">home</span>
        <span className="logo-text">Project Planning</span>
      </Link>
    </header>
  )
}
```

### Step 13: Create Sidebar Component with App Navigation
Create `src/components/layout/Sidebar.tsx`:
```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  expanded: boolean
  onToggle: () => void
}

interface NavItem {
  label: string
  icon: string
  href?: string
  subItems?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    label: 'Projects',
    icon: 'folder',
    href: '/dashboard/projects',
    subItems: [
      { label: 'All Projects', icon: 'list', href: '/dashboard/projects' },
      { label: 'Active', icon: 'play_circle', href: '/dashboard/projects/active' },
      { label: 'Archived', icon: 'archive', href: '/dashboard/projects/archived' },
    ]
  },
  {
    label: 'Tasks',
    icon: 'task_alt',
    href: '/dashboard/tasks',
    subItems: [
      { label: 'My Tasks', icon: 'person', href: '/dashboard/tasks/my' },
      { label: 'Team Tasks', icon: 'groups', href: '/dashboard/tasks/team' },
      { label: 'Calendar', icon: 'calendar_month', href: '/dashboard/tasks/calendar' },
    ]
  },
  {
    label: 'Documentation',
    icon: 'description',
    href: '/dashboard/documentation',
    subItems: [
      { label: 'Guides', icon: 'menu_book', href: '/dashboard/documentation/guides' },
      { label: 'API Docs', icon: 'api', href: '/dashboard/documentation/api' },
      { label: 'Templates', icon: 'content_copy', href: '/dashboard/documentation/templates' },
    ]
  },
  {
    label: 'Operations',
    icon: 'dashboard',
    href: '/dashboard/operations'
  },
  {
    label: 'Team',
    icon: 'group',
    href: '/dashboard/team',
    subItems: [
      { label: 'Members', icon: 'badge', href: '/dashboard/team/members' },
      { label: 'Roles', icon: 'admin_panel_settings', href: '/dashboard/team/roles' },
      { label: 'Activity', icon: 'timeline', href: '/dashboard/team/activity' },
    ]
  },
  {
    label: 'Settings',
    icon: 'settings',
    href: '/dashboard/settings'
  },
]

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [activeSubNav, setActiveSubNav] = useState<string | null>(null)

  const toggleSubNav = (label: string) => {
    if (!expanded) return
    setActiveSubNav(activeSubNav === label ? null : label)
  }

  return (
    <div className={`main-sidebar ${expanded ? 'expanded' : ''}`}>
      {/* Header area with logout */}
      <div className="sidebar-header">
        {expanded && (
          <div className="header-icons">
            <button className="icon-btn">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button className="icon-btn">
              <span className="material-symbols-outlined">info</span>
            </button>
            <button className="icon-btn">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        )}
        <button className="logout-btn">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>

      {/* Logo area */}
      {expanded && (
        <div className="sidebar-logo">
          <img 
            src="/logo-placeholder.svg" 
            alt="Logo" 
            className="logo-image"
          />
        </div>
      )}

      {/* Navigation items */}
      <nav className="sidebar-nav">
        {navigationItems.map((item) => (
          <div key={item.label} className="nav-group">
            <Link
              href={item.href || '#'}
              className={`nav-link ${pathname === item.href ? 'active' : ''}`}
              onClick={(e) => {
                if (item.subItems) {
                  e.preventDefault()
                  toggleSubNav(item.label)
                }
              }}
            >
              {expanded && <span className="nav-label">{item.label}</span>}
              {expanded && item.subItems && (
                <span className={`expand-icon material-symbols-outlined ${
                  activeSubNav === item.label ? 'expanded' : ''
                }`}>
                  keyboard_arrow_right
                </span>
              )}
              <span className="material-symbols-outlined">{item.icon}</span>
            </Link>
            
            {/* Sub-navigation */}
            {item.subItems && expanded && (
              <div className={`sub-nav ${activeSubNav === item.label ? 'expanded' : ''}`}>
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.label}
                    href={subItem.href || '#'}
                    className={`sub-nav-link ${pathname === subItem.href ? 'active' : ''}`}
                  >
                    <span className="sub-nav-label">{subItem.label}</span>
                    <span className="material-symbols-outlined">{subItem.icon}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Toggle button */}
        <button className="nav-toggle" onClick={onToggle}>
          <span className="material-symbols-outlined">dehaze</span>
        </button>
      </nav>
    </div>
  )
}
```

### Step 14: Create Footer Component
Create `src/components/layout/Footer.tsx`:
```tsx
'use client'

interface FooterProps {
  expanded: boolean
}

export function Footer({ expanded }: FooterProps) {
  return (
    <footer className={`app-footer ${expanded ? 'sidebar-expanded' : ''}`}>
      <div className="footer-section footer-left">
        <button className="footer-icon">
          <span className="material-symbols-outlined">format_indent_increase</span>
        </button>
      </div>
      <div className="footer-section footer-center">
        <button className="footer-icon">
          <span className="material-symbols-outlined">code</span>
        </button>
      </div>
      <div className="footer-section footer-right">
        <button className="footer-icon">
          <span className="material-symbols-outlined">light_mode</span>
        </button>
        <button className="footer-icon">
          <span className="material-symbols-outlined">expand_circle_up</span>
        </button>
      </div>
    </footer>
  )
}
```

## Phase 4: Simplified Authentication

### Step 15: Create Mock Auth Context
Create `src/lib/auth-context.tsx`:
```tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'USER' | 'VIEWER'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    // Mock authentication - replace with real API call later
    if (email && password) {
      setUser({
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'USER'
      })
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### Step 16: Create Login Page
Create `src/app/login/page.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
    router.push('/dashboard')
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
```

## Phase 5: Core API Routes

### Step 17: Create Prisma Client Singleton
Create `src/lib/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Step 18: Create Projects API Route
Create `src/app/api/projects/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        _count: {
          select: {
            tasks: true,
            documents: true,
          }
        }
      }
    })
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        status: body.status || 'PLANNING',
        priority: body.priority || 'MEDIUM',
        projectType: body.projectType || 'PERSONAL_PROJECT',
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        budget: body.budget || null,
      }
    })
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
```

### Step 19: Create Tasks API Route
Create `src/app/api/tasks/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')
  
  try {
    const tasks = await prisma.task.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        project: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        subtasks: true,
        _count: {
          select: {
            comments: true,
          }
        }
      }
    })
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        projectId: body.projectId,
        creatorId: body.creatorId || '1', // Mock user ID
        assigneeId: body.assigneeId,
        status: body.status || 'TODO',
        priority: body.priority || 'MEDIUM',
        category: body.category,
        estimatedHours: body.estimatedHours,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      }
    })
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
```

## Phase 6: Dashboard Pages

### Step 20: Create Dashboard Layout
Create `src/app/dashboard/layout.tsx`:
```tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-container">
      {children}
    </div>
  )
}
```

### Step 21: Create Dashboard Home Page
Create `src/app/dashboard/page.tsx`:
```tsx
export default function DashboardPage() {
  return (
    <div className="dashboard-home">
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Active Projects</h3>
          <p>Loading...</p>
        </div>
        <div className="dashboard-card">
          <h3>Pending Tasks</h3>
          <p>Loading...</p>
        </div>
        <div className="dashboard-card">
          <h3>Team Activity</h3>
          <p>Loading...</p>
        </div>
        <div className="dashboard-card">
          <h3>Recent Documents</h3>
          <p>Loading...</p>
        </div>
      </div>
    </div>
  )
}
```

### Step 22: Create Projects Page
Create `src/app/dashboard/projects/page.tsx`:
```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  description: string
  status: string
  priority: string
  _count: {
    tasks: number
    documents: number
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to fetch projects:', error)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading projects...</div>

  return (
    <div className="projects-page">
      <div className="page-header">
        <h1>Projects</h1>
        <button className="btn-primary">New Project</button>
      </div>
      
      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="project-meta">
              <span className="status">{project.status}</span>
              <span className="priority">{project.priority}</span>
            </div>
            <div className="project-stats">
              <span>{project._count.tasks} tasks</span>
              <span>{project._count.documents} docs</span>
            </div>
            <Link href={`/dashboard/projects/${project.id}`}>
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Phase 7: Railway Deployment Setup

### Step 23: Create Railway Configuration
Create `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate && npm run build"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "region": "us-west1"
  }
}
```

### Step 24: Create Health Check Endpoint
Create `src/app/api/health/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Database connection failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
```

### Step 25: Update Package.json Scripts
Update `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:migrate:dev": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "db:seed": "node prisma/seed.js",
    "postinstall": "prisma generate"
  }
}
```

### Step 26: Create Seed Script
Create `prisma/seed.js`:
```javascript
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log({ admin })

  // Create sample project
  const project = await prisma.project.create({
    data: {
      name: 'Initial Project',
      description: 'This is a sample project to get started',
      status: 'PLANNING',
      priority: 'MEDIUM',
      projectType: 'INTERNAL_PROJECT',
    },
  })

  console.log({ project })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## Phase 8: Railway Deployment

### Step 27: Initialize Git Repository
```bash
git add .
git commit -m "Initial project setup with template layout"
```

### Step 28: Create GitHub Repository
```bash
# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/project-planning-app.git
git branch -M main
git push -u origin main
```

### Step 29: Setup Railway Project
```bash
# Install Railway CLI if not already installed
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize Railway project
railway init

# Link to GitHub repository
railway link
```

### Step 30: Configure Railway Environment
```bash
# Add environment variables in Railway dashboard or CLI
railway variables set DATABASE_URL="postgresql://..."
railway variables set JWT_SECRET="your-production-secret"
railway variables set NEXTAUTH_URL="https://your-app.railway.app"
```

### Step 31: Deploy to Railway
```bash
# Deploy the application
railway up

# Or trigger deployment via git push
git push origin main
```

### Step 32: Run Database Migrations on Railway
```bash
# Connect to Railway environment
railway run npx prisma migrate deploy

# Seed initial data
railway run npm run db:seed
```

## Phase 9: Post-Deployment Verification

### Step 33: Verify Deployment
1. Visit your Railway app URL
2. Check health endpoint: `https://your-app.railway.app/api/health`
3. Test login functionality
4. Verify navigation works correctly
5. Check that the layout matches the template exactly

### Step 34: Monitor Logs
```bash
# View deployment logs
railway logs

# View live logs
railway logs -f
```

### Step 35: Setup Database Backups
Create `scripts/backup-database.js`:
```javascript
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const backupDir = path.join(__dirname, '..', 'backups')
const backupFile = path.join(backupDir, `backup-${timestamp}.sql`)

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir)
}

const command = `pg_dump ${process.env.DATABASE_URL} > ${backupFile}`

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Backup failed: ${error}`)
    return
  }
  console.log(`Backup created: ${backupFile}`)
})
```

## Final Steps

### Step 36: Update Documentation
Create/Update `CLAUDE.md` with:
- Current project structure
- Navigation mapping from template to app features
- Component hierarchy
- API endpoints documentation
- Deployment instructions

### Step 37: Create README.md
```markdown
# Project Planning Application

## Overview
A comprehensive project management system built with Next.js, maintaining strict adherence to the original HTML template layout.

## Tech Stack
- Next.js 13.5.6
- TypeScript
- PostgreSQL + Prisma ORM
- Railway deployment
- Material Design Icons

## Quick Start
1. Clone repository
2. Install dependencies: `npm install`
3. Setup database: `npm run db:migrate:dev`
4. Run development server: `npm run dev`

## Deployment
Automatically deploys to Railway on push to main branch.

## Layout Structure
Strictly follows the HTML template design with:
- Fixed right sidebar navigation (64px collapsed, 280px expanded)
- Natural flow header and footer
- Margin-based content positioning
- Material Design icons throughout
```

## Troubleshooting

### Common Issues and Solutions

1. **Prisma Client Not Generated**
   ```bash
   npx prisma generate
   ```

2. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env.local
   - Ensure database exists

3. **Railway Deployment Fails**
   - Check build logs: `railway logs`
   - Verify environment variables are set
   - Ensure migrations run successfully

4. **Layout Not Matching Template**
   - Check that template.css is imported
   - Verify CSS variable values match exactly
   - Ensure sidebar state management is working

5. **Navigation Not Working**
   - Check Next.js routing structure
   - Verify Link components have correct href values
   - Ensure sub-navigation state is managed properly

## Development Guidelines

1. **Always maintain template layout structure** - No deviations from the original design
2. **Use exact measurements** - All spacing, widths, and heights must match
3. **Preserve animation timings** - 0.3s transitions throughout
4. **Keep icon consistency** - Material Symbols with specified sizes
5. **Follow git workflow** - Always push to main branch for Railway deployment
6. **Test thoroughly** - Verify layout on different screen sizes
7. **Document changes** - Update CLAUDE.md with any modifications

## Completion Checklist

- [ ] Project initialized with correct dependencies
- [ ] Database schema created and migrated
- [ ] Template layout perfectly replicated in React
- [ ] Navigation replaced with app features
- [ ] Basic authentication implemented
- [ ] Core API routes functional
- [ ] Dashboard pages created
- [ ] Railway deployment successful
- [ ] Documentation updated
- [ ] All layout measurements verified