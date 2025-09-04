# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
**UPDATED 2025-08-30**: Full-stack Next.js 14 project planning application implementing the original responsive navigation template design. The application maintains 100% visual fidelity to the original HTML template while adding modern React architecture, TypeScript support, Prisma database integration, and Railway deployment configuration. Local PostgreSQL database now connected and operational with DataSpur branding.

# THE MAKE IT WORK FIRST MANIFESTO

## Core Truth

Every line of defensive code you write before proving your feature works is a lie you tell yourself about problems that don't exist.

## The Philosophy

### 1. Build the Happy Path FIRST
Write code that does the thing. Not code that checks if it can do the thing. Not code that validates before doing the thing. Code that DOES THE THING.

### 2. No Blockers. No Validation. No Defensive Coding.
Your first version should be naked functionality. Raw execution. Pure intent made manifest in code.

### 3. Let It Fail Naturally
When code fails, it should fail because of real problems, not artificial guards. Real failures teach. Defensive failures hide.

### 4. Add Guards ONLY for Problems That Actually Happen
That null check? Did it actually blow up in production? No? Delete it.
That validation? Did a user actually send bad data? No? Delete it.
That try-catch? Did it actually throw? No? Delete it.

### 5. Keep the Engine Visible
You should be able to read code and immediately see what it does. Not what it's defending against. Not what it's validating. What it DOES.

## The Anti-Patterns We Reject

### ❌ Fortress Validation
```javascript
function doThing(x) {
  if (!x) throw new Error('x is required');
  if (typeof x !== 'string') throw new Error('x must be string');
  if (x.length < 3) throw new Error('x too short');
  if (x.length > 100) throw new Error('x too long');
  // 50 more lines of validation...
  
  return x.toUpperCase(); // The actual work, buried
}

**Original Template**: Preserved in `_TEMP/template.html` (formerly `index.html`)  
**Current Architecture**: Next.js 14 + TypeScript + Prisma + PostgreSQL  
**Database**: `hla-dataspur` (PostgreSQL local instance)

## Current Architecture Status

### Technology Stack
- **Framework**: Next.js 14.2.22 with App Router
- **Language**: TypeScript 5.9.2
- **Database**: PostgreSQL with Prisma ORM 5.7.0
- **Authentication**: NextAuth.js 4.24.5 (configured, not implemented)
- **Styling**: Tailwind CSS 3.4.17 + Custom CSS (migrated from template)
- **UI Components**: Radix UI primitives
- **Deployment**: Railway platform ready

### Development Status
- ✅ **Layout & Navigation**: Complete - Exact template match with simplified menu
- ✅ **Component Architecture**: Complete - React components with hooks
- ✅ **Database Schema**: Complete - Full project management models
- ✅ **Database Connection**: Connected to local PostgreSQL (hla-dataspur)
- ✅ **Development Environment**: Functional on http://localhost:3000
- ✅ **Projects Navigation**: Complete - Sidebar updated, full-featured Projects page implemented
- ✅ **Dashboard Layout**: Complete - Two-column layout with proper alignment
- ✅ **Debug Tools**: Border debug toggle in footer for development
- ✅ **Branding**: Highline logo and DataSpur text in header
- ❌ **Authentication**: NextAuth configured but not active
- ❌ **Project CRUD Operations**: Ready for database integration
- ❌ **Production Deployment**: Ready for Railway deployment

## Navigation Architecture (Preserved from Template)

### Navigation Hierarchy
1. **Header Navigation** (Top Bar - Natural Flow)
   - **UPDATED 2025-08-30**: Highline logo image + "DataSpur" text (left side)
   - Static positioning (not fixed)
   - **Component**: `src/components/layout/header.tsx`

2. **Main Menu Sidebar** (Right Side - Fixed Position)
   - Always-visible navigation icons stacked vertically at bottom
   - Logout icon always visible at top of sidebar (no bottom border)
   - **Logo placeholder** at very top when expanded (120x60px)
   - Expandable sidebar shows header icons + navigation items with titles + sub-navigation
   - Content and footer adjust margins when expanded (64px collapsed → 280px expanded)
   - **UPDATED 2025-08-30**: Simplified navigation - only Home Dashboard and Projects remain
   - Navigation items: **Home Dashboard** (links to /), **Projects** (with sub-nav)
   - Dehaze button at bottom of navigation stack with 55px padding-bottom
   - **Sub-navigation support** for expandable menu items
   - **Component**: `src/components/layout/sidebar.tsx`

3. **Footer Navigation** (Bottom - Natural Flow)
   - Three equal sections (left, center, right)
   - Left: Format Indent Increase icon
   - Center: Code icon
   - Right: Light Mode toggle + **Debug Border toggle** + Expand Circle Up icon
   - **UPDATED 2025-08-30**: Added border debug toggle (border_style/border_outer icons)
   - Adjusts margins to accommodate sidebar expansion
   - **Component**: `src/components/layout/footer.tsx`

### Key Technical Features (Now React Components)

#### Material Design Integration
- Uses Google Material Symbols font library (loaded via CDN in layout.tsx)
- Consistent icon sizing: Main nav icons 24px with 40x40px containers, sub-nav icons 20px
- Uniform hover behavior (opacity: 0.7)
- Font-variation-settings preserved in globals.css

#### Responsive Sidebar Navigation (React State Management)
- **Collapsed State**: 64px width, icons only, logo hidden
- **Expanded State**: 280px width, shows logo, header icons, navigation items with titles, and sub-navigation
- **Mobile**: Expands to 85% width (max 350px), logo text hidden
- **State Management**: React useState hooks in sidebar.tsx
- **Content Response**: MutationObserver watches for sidebar class changes
- Smooth CSS transitions (0.3s duration) preserved from original

#### Sub-Navigation System (React Components)
- **Expandable Menu Items**: Products, Services, Portfolio have sub-navigation
- **Expand Indicators**: Right-pointing arrows that rotate 90° when expanded
- **Animation**: Smooth max-height transitions for sub-menu reveal
- **State Management**: React Set for active sub-navigation items
- **Auto-Close**: Sub-menus close when main sidebar collapses
- **Visual Hierarchy**: Sub-items are smaller (36px height, 14px font) and indented 20px

## File Structure (Updated)

```
hla-dataspur-v1/
├── src/                           # Next.js source directory
│   ├── app/                       # App Router directory
│   │   ├── api/health/           # Health check endpoint
│   │   ├── dashboard/            # Dashboard pages with shared layout
│   │   │   ├── layout.tsx        # Dashboard layout (Header/Sidebar/Footer)
│   │   │   └── projects/         # Projects management
│   │   │       └── page.tsx      # Projects list with sorting/filtering
│   │   ├── layout.tsx            # Root layout with metadata
│   │   ├── page.tsx              # Home page component
│   │   └── globals.css           # Complete CSS migration from template
│   ├── components/layout/        # Layout components
│   │   ├── header.tsx           # Header component
│   │   ├── sidebar.tsx          # Sidebar navigation component
│   │   └── footer.tsx           # Footer component
│   └── lib/
│       └── prisma.ts            # Database client singleton
├── prisma/
│   └── schema.prisma            # Complete database schema
├── _TEMP/                       # Documentation & original files
│   ├── template.html           # Original HTML template (preserved)
│   ├── CLAUDE.md               # This file
│   ├── OVERVIEW.md             # Architecture reference
│   ├── IMPLEMENTATION.md       # Implementation guide
│   ├── CONTRIBUTING.md         # Development guidelines
│   ├── xdev_nextjs_transformation_log.md  # Complete change log
│   └── xdev_projects_navigation_implementation.md  # Projects feature implementation
├── .env                        # Environment variables
├── railway.json               # Railway deployment config
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies & scripts
```

## Development Commands (Updated)

### Development
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production (includes Prisma generate)
npm start            # Start production server
npm run start:prod   # Production start with migrations
```

### Database Operations
```bash
npm run db:push           # Push schema changes (accepts data loss)
npm run db:migrate:dev    # Create and apply development migration
npm run db:deploy         # Deploy migrations to production
npm run db:generate       # Generate Prisma client
```

### Health Check
- **Endpoint**: `/api/health`
- **Purpose**: Railway health checks and database connectivity verification

## Database Schema (New)

### Core Models
- **User**: Authentication, roles, preferences, notifications
- **Project**: Project management core with status, priority, type
- **ProjectMember**: Team assignments with roles
- **Task**: Task management with subtasks and time tracking
- **TimelineEvent**: Project milestones and events
- **ProjectContact**: External contacts per project
- **ProjectLink**: External resources and links
- **Comment**: Task discussions and collaboration
- **Notification**: User alerts and system messages
- **FeatureRequest**: Feature tracking and conversion to documentation
- **Documentation**: Knowledge base with categories and tags

### Enums
- **UserRole**: ADMIN, USER, VIEWER
- **ProjectStatus**: PLANNING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED
- **Priority**: LOW, MEDIUM, HIGH, URGENT
- **ProjectType**: PERSONAL_PROJECT, CLIENT_PROJECT, INTERNAL_PROJECT, RESEARCH, OTHER
- **TaskStatus**: TODO, IN_PROGRESS, REVIEW, DONE, CANCELLED

## Component Architecture (New)

### Layout Components
All components maintain exact visual design from original template:

#### Header Component (`src/components/layout/header.tsx`)
```tsx
- Fixed top header (60px height)
- Logo with home icon + "Main Logo" text
- Mobile responsive (hides logo text on mobile)
- Natural document flow positioning
```

#### Sidebar Component (`src/components/layout/sidebar.tsx`)
```tsx
- Fixed right-side navigation (z-index: 100)
- React state management for expansion
- Sub-navigation state with Set data structure
- Complete navigation hierarchy with Link components
- Material Symbols icons with proper font settings
- Responsive behavior preserved from original
```

#### Footer Component (`src/components/layout/footer.tsx`)
```tsx
- Three-section layout with flex containers
- Icon buttons with Material Symbols
- Responsive margins based on sidebar state
- Event handlers ready for functionality
```

### State Management Strategy
- **Sidebar Expansion**: useState boolean in sidebar component
- **Sub-Navigation**: useState Set for active sub-menus
- **Content Adjustment**: MutationObserver monitors sidebar classes
- **Future**: Context API ready for global state management

## CSS Architecture (Preserved & Enhanced)

### Migration Strategy
- **Complete CSS Migration**: All template styles moved to `src/app/globals.css`
- **Tailwind Integration**: Added alongside custom CSS (not replacing)
- **Component Styles**: Custom CSS classes preserved for exact template match
- **Responsive Breakpoints**: Original mobile breakpoints maintained

### Key CSS Classes (Preserved)
```css
.main-menu-sidebar              /* Core sidebar container */
.main-menu-sidebar.expanded     /* Expanded state (280px width) */
.menu-icon-link                 /* Navigation link styling */
.sub-nav                        /* Sub-navigation containers */
.nav-circle.main               /* Toggle button with ::before content */
.header, .footer               /* Layout sections with margins */
.content                       /* Content area with responsive margins */
```

### Material Design Integration
```css
.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    user-select: none;
}
```

## Icon Specifications (Unchanged)
- **Main Navigation**: 24px icons in 40x40px containers
- **Sub-Navigation**: 20px icons in 36px height containers
- **Expand Arrows**: 16px keyboard_arrow_right icons that rotate 90°
- **Navigation Icons**: **folder_open** (Projects), build, info, mail, work, article, logout
- **Sub-Navigation Icons** (Projects): view_list, trending_up, task_alt, pause_circle
- **Other Sub-Navigation Icons**: psychology, support_agent, school, web, phone_android, palette, photo_camera
- **Header Icons** (expanded only): settings, info, person, logout (no bottom border)
- **Footer Icons**: format_indent_increase, code, light_mode, expand_circle_up
- **Main Control**: dehaze (24px, positioned at bottom of nav stack)

## Environment Configuration

### Required Environment Variables (.env)
```bash
# UPDATED 2025-08-30: Local database configuration
DATABASE_URL="postgresql://hla_user:hla_secure_2025@localhost:5432/hla-dataspur?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

### Optional Email Configuration
```bash
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM=""
```

## Deployment Configuration (New)

### Railway Configuration (`railway.json`)
```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "region": "us-west1"
  }
}
```

### Production Readiness Checklist
- ✅ Health check endpoint configured
- ✅ Database migrations on deploy
- ✅ Environment variables template
- ✅ Build process includes Prisma generation
- ❌ Database connection string needed
- ❌ Authentication secrets needed
- ❌ SMTP configuration needed (optional)

## Navigation States (React Implementation)

### Sidebar State Management
```typescript
const [isExpanded, setIsExpanded] = useState(false)
const [activeSubNavs, setActiveSubNavs] = useState<Set<string>>(new Set())

// Toggle main sidebar
const toggleMenu = () => {
  setIsExpanded(!isExpanded)
  if (isExpanded) setActiveSubNavs(new Set()) // Close all sub-navs
}

// Toggle individual sub-navigation
const toggleSubNav = (title: string, e: React.MouseEvent) => {
  // Only works when main sidebar is expanded
  // Closes other sub-navs when opening new one
}
```

### Content Area Response
```typescript
// Monitor sidebar class changes to adjust content margins
useEffect(() => {
  const observer = new MutationObserver(() => {
    const sidebar = document.querySelector('.main-menu-sidebar')
    const isExpanded = sidebar?.classList.contains('expanded')
    setIsSidebarExpanded(isExpanded)
  })
  // Observe sidebar element for class changes
}, [])
```

## Troubleshooting (Updated)

### Common Development Issues
- **Build Errors**: Ensure PostgreSQL connection string format is correct
- **TypeScript Errors**: All components are properly typed with interfaces
- **CSS Conflicts**: Custom CSS takes precedence over Tailwind where needed
- **Sidebar State**: React state management replaces vanilla JavaScript
- **Icon Loading**: Material Symbols CDN loaded in layout.tsx head
- **Mobile Responsive**: Original breakpoints preserved in globals.css

### Debug Mode
- **React DevTools**: Use for component state inspection
- **Network Tab**: Verify Material Symbols font loading
- **Console**: Check for hydration errors or state issues
- **Prisma Studio**: Use `npx prisma studio` for database inspection

## Next Development Phase

### Recent Implementation (2025-08-29)
✅ **Projects Navigation System**: Complete implementation replacing Products navigation
- **Sidebar Navigation**: Updated with Projects menu and sub-navigation
- **Dashboard Layout**: Consistent layout inheritance for all dashboard pages  
- **Projects Page**: Full-featured sortable/searchable table with filtering
- **Data Structure**: Complete TypeScript interfaces matching database schema
- **URL Routing**: Support for filtered views via query parameters

### Immediate Implementation Priorities
1. **Database Setup**: Configure PostgreSQL connection
2. **Authentication**: Implement NextAuth.js providers
3. **Project CRUD**: Connect Projects page to database API routes
4. **Project Details**: Individual project view and editing interface

### Architecture Benefits Gained
- **Component Reusability**: Layout components can be used across pages
- **Type Safety**: Full TypeScript integration with Prisma types
- **State Management**: React hooks for complex interactions
- **API Routes**: Server-side functionality with Next.js API routes
- **Database Integration**: Type-safe database operations with Prisma
- **Production Deployment**: Railway-ready configuration

### Maintained Template Features
- **Visual Design**: 100% identical to original template
- **Navigation Behavior**: All interactions preserved
- **Responsive Design**: Mobile breakpoints unchanged
- **Performance**: CSS transitions and animations intact
- **Accessibility**: Material Design icon standards maintained

## Future Development Notes
- **Authentication Ready**: NextAuth.js configured for immediate implementation
- **Database Ready**: Complete schema for project management features
- **API Ready**: Health check endpoint demonstrates API route pattern
- **Deployment Ready**: Railway configuration complete
- **Component Architecture**: Layout components ready for page composition
- **State Management**: React patterns established for complex features
- **Type Safety**: TypeScript interfaces ready for data modeling

## Rollback Strategy
Complete rollback instructions available in `_TEMP/xdev_nextjs_transformation_log.md`

**Quick Rollback**: Restore `_TEMP/template.html` to root as `index.html` and remove Next.js files.

---

## Session Updates (2025-08-30)

### Morning Session - Database & Initial UI Setup
1. **Database**: Connected PostgreSQL locally (`hla-dataspur` database, `hla_user` user)
2. **Navigation**: Simplified to 2 items only (Home Dashboard + Projects)  
3. **Branding**: Added Highline logo and DataSpur text to header
4. **Debug Tool**: Added green border toggle in footer (dev tool)
5. **Layout**: Home page now 2-column Lorem ipsum (1/3 right-aligned, 2/3 left-aligned)
6. **Spacing**: Reduced safe-margin padding to 15px, removed min-height

### Afternoon Session - UI Enhancements & Layout Standardization
1. **Layout Consistency**: Applied standardized two-column layout across all pages
2. **Semantic CSS Classes**: Replaced Tailwind utilities with semantic class names (`main-content-left`, `main-content-right`)
3. **Sidebar Enhancements**: 
   - Updated to Highline Primary Logo (220px max-width)
   - Added clickable navigation when collapsed
   - Fixed expand icon visibility issues
   - Implemented session persistence for expanded/collapsed state
4. **Footer Improvements**:
   - Replaced light_mode icon with place_item icon
   - Added fixed footer toggle functionality with session persistence
   - Updated background color to #2a2a2a when fixed
5. **Navigation UX**: Icons now clickable when sidebar collapsed, navigate to appropriate pages
6. **Layout Stability**: Added scrollbar gutter to prevent layout shifts between pages
7. **Projects Page**: Redesigned with consistent two-column layout, added stats summary

### Technical Improvements Made
- **Session Persistence**: User preferences (sidebar state, footer position) persist across sessions
- **Code Organization**: Replaced inline styles with semantic CSS classes
- **Scrollbar Handling**: Eliminated brief scrollbar appearance and layout shifts
- **Responsive Design**: Maintained all responsive behavior while improving consistency

### Files Modified Today
**Morning Session:**
- `.env` - Database connection string
- `src/app/globals.css` - Debug styles, spacing adjustments  
- `src/components/layout/sidebar.tsx` - Simplified navigation
- `src/components/layout/header.tsx` - Logo and branding
- `src/components/layout/footer.tsx` - Debug toggle button
- `src/app/page.tsx` - Two-column layout

**Afternoon Session:**
- `src/app/page.tsx` - Enhanced content, applied CSS classes
- `src/components/layout/sidebar.tsx` - Logo update, navigation functionality, persistence
- `src/components/layout/footer.tsx` - Icon replacement, fixed footer feature, persistence
- `src/app/globals.css` - New CSS classes, scrollbar stability fixes
- `src/app/dashboard/projects/page.tsx` - Complete layout standardization

### New Features Available
- **Fixed Footer Toggle**: Click place_item icon in footer to fix/unfix footer position
- **Persistent Sidebar State**: Sidebar open/closed preference saves across sessions
- **Clickable Collapsed Navigation**: Navigation icons work even when sidebar is collapsed
- **Consistent Layout Pattern**: Standardized two-column layout ready for all pages
- **Layout Stability**: No more layout shifts when switching between pages

### Development Status Updates
- ✅ **Layout System**: Standardized two-column pattern implemented
- ✅ **Session Persistence**: User preferences saved locally
- ✅ **Navigation UX**: Enhanced sidebar and footer functionality
- ✅ **Visual Consistency**: Highline branding integrated throughout
- ✅ **Code Quality**: Semantic CSS classes and improved organization
- ✅ **Responsive Design**: Maintained across all improvements

### How to Continue Development
1. Database is ready at `postgresql://hla_user:hla_secure_2025@localhost:5432/hla-dataspur`
2. Debug borders: Click border icon in footer to visualize divs
3. Fixed footer: Click place_item icon in footer to toggle fixed positioning
4. Layout pattern ready: Use main-content-left/main-content-right classes for new pages
5. All CRUD operations ready to implement (schema deployed)
6. Authentication configured but needs provider setup

### Detailed Session Logs
- **Morning Session**: `_TEMP/xdev_database_ui_enhancements_20250830.md`
- **Afternoon Session**: `_TEMP/xdev_ui_enhancements_session_20250830.md` (complete rollback instructions)

---

**Last Updated**: 2025-08-30 (Afternoon Session Complete)  
**Status**: ✅ Development Environment Fully Operational  
**Database**: ✅ Connected | **Debug Tools**: ✅ Working | **Layout**: ✅ Standardized | **UX**: ✅ Enhanced