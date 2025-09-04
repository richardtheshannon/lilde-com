# Projects System Development Rollout

This document outlines the surgical, phased development approach for implementing basic project management functionality. Aligned with CONTRIBUTING.md guidelines for minimal, precise edits while maintaining the overall goal of a complete project management system.

## Development Philosophy

**Surgical Approach**: Following CONTRIBUTING.md guidelines for "minimal and surgical edits" - each phase builds incrementally without breaking existing functionality.

**Scope Simplification**: Focus on projects-only system, removing client relationships and contact management complexity.

**Database Strategy**: Use existing CLAUDE.md commands (`npm run db:push`, `npm run db:migrate:dev`) rather than introducing new validation scripts.

## Development Phases

### Phase 1: Basic Project Management (Current Focus)
**Goal**: Get core project CRUD operations working within Projects page and subnavigation.

**Scope**:
- Simplified Project model with work-focused types
- Basic project list, detail, create, and edit functionality
- No external relationships (no contacts, no client management)

### Future Phases (Deferred)
- **Phase 2**: Task management within projects
- **Phase 3**: Timeline events and project milestones  
- **Phase 4**: Advanced features (file management, notifications)

---

## Phase 1: Basic Project Management

### Database Schema Changes Required

#### 1. Update ProjectType Enum
**Current**: Client-focused types  
**New**: Work-focused types

```prisma
enum ProjectType {
  DEVELOPMENT
  DESIGN  
  MARKETING
  RESEARCH
  OTHER
}
```

#### 2. Simplify Project Model (Remove Relations)
**Remove these relations for Phase 1**:
- `contacts     ProjectContact[]` (entire contact system removed)
- `members      ProjectMember[]` (defer to Phase 2)
- `tasks        Task[]` (defer to Phase 2)  
- `timelineEvents TimelineEvent[]` (defer to Phase 3)
- `files        File[]` (defer to Phase 4)
- `notifications Notification[]` (defer to Phase 4)
- `categories   Category[]` (defer if needed)
- `documents    Document[]` (defer to Phase 4)
- `links        ProjectLink[]` (defer to Phase 3)

#### 3. Core Project Model for Phase 1

```prisma
model Project {
  id           String         @id @default(cuid())
  name         String
  description  String?
  projectGoal  String?
  projectValue Float?
  website      String?
  status       ProjectStatus  @default(PLANNING)
  priority     Priority       @default(MEDIUM)
  projectType  ProjectType    @default(DEVELOPMENT)
  startDate    DateTime?
  endDate      DateTime?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  // Essential relation only
  owner        User           @relation("ProjectOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  ownerId      String

  @@map("projects")
}
```

### Project Enumerations

```prisma
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
  URGENT
}

enum ProjectType {
  POTENTIAL_CLIENT
  QUALIFIED_CLIENT
  CURRENT_CLIENT
  PAST_CLIENT
  PERSONAL_PROJECT
  PROFESSIONAL_PROJECT
}
```

### Related Entities

#### ProjectMember (Many-to-Many with Users)
**Location**: `prisma/schema.prisma:212-225`

```prisma
model ProjectMember {
  id        String            @id @default(cuid())
  role      ProjectMemberRole @default(MEMBER)
  joinedAt  DateTime          @default(now())
  updatedAt DateTime          @updatedAt

  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId String

  @@unique([userId, projectId])
  @@map("project_members")
}

enum ProjectMemberRole {
  ADMIN
  MEMBER
  VIEWER
}
```

#### ProjectContact (Many-to-Many with Contacts)
**Location**: `prisma/schema.prisma:175-186`

```prisma
model ProjectContact {
  id        String   @id @default(cuid())
  projectId String
  contactId String
  createdAt DateTime @default(now())

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  contact Contact @relation(fields: [contactId], references: [id], onDelete: Cascade)

  @@unique([projectId, contactId])
  @@map("project_contacts")
}
```

#### ProjectLink (One-to-Many External URLs)
**Location**: `prisma/schema.prisma:162-173`

```prisma
model ProjectLink {
  id        String   @id @default(cuid())
  title     String
  url       String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@map("project_links")
}
```

#### Task (One-to-Many Project Tasks)
**Location**: `prisma/schema.prisma:246-274`

```prisma
model Task {
  id             String     @id @default(cuid())
  title          String
  description    String?
  status         TaskStatus @default(TODO)
  priority       Priority   @default(MEDIUM)
  startDate      DateTime?
  dueDate        DateTime?
  completedAt    DateTime?
  estimatedHours Float?
  actualHours    Float?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  project      Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId    String
  assignee     User?       @relation(fields: [assigneeId], references: [id], onDelete: SetNull)
  assigneeId   String?
  category     Category?   @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  categoryId   String?
  parent       Task?       @relation("TaskSubtasks", fields: [parentId], references: [id], onDelete: Cascade)
  parentId     String?
  subtasks     Task[]      @relation("TaskSubtasks")
  comments     Comment[]
  timeEntries  TimeEntry[]
  files        File[]

  @@map("tasks")
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  COMPLETED
  CANCELLED
}
```

#### TimelineEvent (Project Milestones)
**Location**: `prisma/schema.prisma:360-373`

```prisma
model TimelineEvent {
  id          String   @id @default(cuid())
  title       String
  description String?
  eventDate   DateTime?
  isCompleted Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId String

  @@map("timeline_events")
}
```

---

## API Architecture

### Core Project Endpoints

#### GET `/api/projects`
**Location**: `src/app/api/projects/route.ts:11-43`

```typescript
// Returns ALL projects (Note: Security concern - no user filtering)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // MODIFICATION: Fetches ALL projects from database
    const projects = await prisma.project.findMany({
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { tasks: true, members: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Projects GET error:', error)
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}
```

#### POST `/api/projects`
**Location**: `src/app/api/projects/route.ts:61-130`

**Zod Validation Schema**:
```typescript
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required.'),
  description: z.string().optional().nullable(),
  projectGoal: z.string().optional().nullable(),
  projectValue: z.number().optional().nullable(),
  website: z.string().optional().nullable(),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.PLANNING),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  projectType: z.nativeEnum(ProjectType).default(ProjectType.PERSONAL_PROJECT),
  startDate: z.union([z.string(), z.null()]).optional().transform((val) => val && val !== '' ? new Date(val) : null),
  endDate: z.union([z.string(), z.null()]).optional().transform((val) => val && val !== '' ? new Date(val) : null),
});
```

**Creation with Transaction**:
```typescript
const newProject = await prisma.$transaction(async (tx) => {
  const project = await tx.project.create({
    data: {
      name,
      description,
      projectGoal,
      projectValue,
      website,
      status,
      priority,
      projectType,
      startDate,
      endDate,
      ownerId: userId
    }
  });

  // Auto-create default timeline events
  const timelineEventsToCreate = defaultTimelineEvents.map(event => ({
    ...event,
    projectId: project.id,
  }));

  await tx.timelineEvent.createMany({
    data: timelineEventsToCreate,
  });

  return project;
});
```

#### GET `/api/projects/[id]`
**Location**: `src/app/api/projects/[id]/route.ts:15-52`

```typescript
const project = await prisma.project.findUnique({
  where: { id: params.id },
  include: {
    owner: { select: { id: true, name: true, email: true } },
    members: { include: { user: { select: { id: true, name: true, email: true } } } },
    contacts: { include: { contact: true } },
    tasks: { orderBy: { createdAt: 'desc' }, include: { assignee: { select: { id: true, name: true, email: true } } } },
    timelineEvents: { orderBy: { eventDate: 'asc' } },
    _count: { select: { tasks: true, members: true, files: true } },
  },
});

// Clean up nested data for frontend consumption
const projectWithCleanedData = {
  ...project,
  members: project.members.map((member: MemberWithUser) => member.user),
  contacts: project.contacts.map((projectContact: ProjectContactWithContact) => projectContact.contact),
};
```

#### PUT `/api/projects/[id]`
**Location**: `src/app/api/projects/[id]/route.ts:54-94`

```typescript
const updatedProject = await prisma.project.update({
  where: { id: params.id },
  data: {
    name,
    description,
    projectGoal,
    projectValue, // Support for project financial value
    website,
    status,
    priority,
    projectType,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
  },
});
```

#### DELETE `/api/projects/[id]`
**Location**: `src/app/api/projects/[id]/route.ts:96-115`

```typescript
await prisma.project.delete({
  where: { id: params.id },
});
// Cascading deletion handled by Prisma relations
```

### Contact Management Endpoint

#### POST `/api/projects/[id]/contacts`
**Location**: `src/app/api/projects/[id]/contacts/route.ts`

```typescript
// Validates project membership before allowing contact addition
const isOwnerOrMember =
  project.ownerId === currentUser.id ||
  project.members.some((member) => member.userId === currentUser.id);

if (!isOwnerOrMember) {
  return NextResponse.json(
    { error: "Forbidden: You are not a member of this project" },
    { status: 403 }
  );
}

// Creates ProjectContact junction table entry
const newProjectContact = await prisma.projectContact.create({
  data: {
    projectId: projectId,
    contactId: contactId,
  },
  include: {
    contact: true,
  }
});
```

### Links Management Endpoints
- **POST/GET/DELETE** `/api/projects/[id]/links`
- **DELETE** `/api/projects/[id]/links/[linkId]`
- Full CRUD operations for external URL management

---

## Frontend Components

### Project List View
**Location**: `src/app/dashboard/projects/page.tsx`

**Key Features**:
```typescript
// View mode management with session storage
const [viewMode, setViewMode] = useSessionStorage<'card' | 'table'>('projectsViewMode', 'table');

// Multi-column sorting
type SortKey = 'name' | 'status' | 'priority' | 'endDate' | 'projectType' | 'projectValue';
const [sortConfig, setSortConfig] = useState<{ key: SortKey | ''; direction: SortDirection }>({ 
  key: 'name', 
  direction: 'ascending' 
});

// Real-time search filtering
const filteredProjects = useMemo(() => {
  return projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [projects, searchTerm]);
```

**Badge Components**:
```typescript
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PLANNING': return <Badge variant="outline">Planning</Badge>
    case 'IN_PROGRESS': return <Badge className="bg-blue-500 text-white">In Progress</Badge>
    case 'ON_HOLD': return <Badge variant="secondary">On Hold</Badge>
    case 'COMPLETED': return <Badge className="bg-green-500 text-white">Completed</Badge>
    case 'CANCELLED': return <Badge variant="destructive">Cancelled</Badge>
    default: return <Badge>{status}</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'LOW': return <Badge variant="outline" className="border-green-500 text-green-500">Low</Badge>
    case 'MEDIUM': return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Medium</Badge>
    case 'HIGH': return <Badge variant="outline" className="border-orange-500 text-orange-500">High</Badge>
    case 'URGENT': return <Badge variant="destructive">Urgent</Badge>
    default: return <Badge>{priority}</Badge>
  }
}

const getProjectTypeBadge = (projectType: string) => {
  const formattedType = projectType.replace(/_/g, ' ');
  return <Badge variant="secondary">{formattedType}</Badge>
}
```

### Project Detail View
**Location**: `src/app/dashboard/projects/[id]/page.tsx`

**Layout Structure**:
- **3-column responsive layout**: Details (left) + Sidebar (right)
- **Collapsible sections** with state management
- **Real-time updates** with optimistic UI

**Collapsible Section Management**:
```typescript
type CollapsibleSectionName = 'projectDetails' | 'timelineEvents' | 'tasks' | 'contacts' | 'files';

const [openSections, setOpenSections] = useState<Record<CollapsibleSectionName, boolean>>({
  projectDetails: false,
  timelineEvents: true,
  tasks: true,
  contacts: false,
  files: true,
});

const CollapsibleHeader = ({ sectionName, title, action }: { 
  sectionName: CollapsibleSectionName, 
  title: string, 
  action?: React.ReactNode 
}) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4 md:gap-0">
    <div 
      className="flex items-center gap-3 cursor-pointer flex-grow"
      onClick={() => toggleSection(sectionName)}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <ChevronDown
        size={24}
        className={`text-muted-foreground transition-transform duration-300 ${openSections[sectionName] ? 'rotate-180' : ''}`}
      />
    </div>
    {action && <div className="w-full md:w-auto md:ml-4 flex-shrink-0">{action}</div>}
  </div>
);
```

**Timezone Handling**:
```typescript
// Custom helper function for date input timezone correction
const adjustDateForTimezone = (dateString: string): Date => {
  if (!dateString) return new Date(NaN);
  const date = new Date(dateString);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + timezoneOffset);
};

// Usage in project updates
const bodyPayload = {
  ...projectToEdit,
  projectValue: projectToEdit.projectValue ? parseFloat(projectToEdit.projectValue.toString()) : null,
  startDate: projectToEdit.startDate ? adjustDateForTimezone(projectToEdit.startDate) : null,
  endDate: projectToEdit.endDate ? adjustDateForTimezone(projectToEdit.endDate) : null,
};
```

**Task Management with Sorting**:
```typescript
type SortKey = 'status' | 'priority' | 'dueDate';
type SortDirection = 'asc' | 'desc';

const sortedTasks = useMemo(() => {
  if (!project?.tasks) return [];
  const sorted = [...project.tasks];
  if (!sortKey) return sorted;

  const priorityOrder: Record<Task['priority'], number> = { 'LOW': 0, 'MEDIUM': 1, 'HIGH': 2, 'URGENT': 3 };
  const statusOrder: Record<Task['status'], number> = { 'TODO': 0, 'IN_PROGRESS': 1, 'IN_REVIEW': 2, 'COMPLETED': 3, 'CANCELLED': 4 };

  sorted.sort((a, b) => {
    if (sortKey === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
    if (sortKey === 'status') return statusOrder[a.status] - statusOrder[b.status];
    if (sortKey === 'dueDate') {
      if (!a.dueDate) return 1; if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  if (sortDirection === 'desc') sorted.reverse();
  return sorted;
}, [project?.tasks, sortKey, sortDirection]);
```

### Key Specialized Components

#### ProjectLinksTable
**Location**: `src/components/projects/ProjectLinksTable.tsx`
- Manages external URL references
- CRUD operations for project links
- Table-based interface with actions

#### TimelineSection
**Referenced in**: `src/app/dashboard/projects/[id]/page.tsx:521`
- Handles project milestone management
- Progress visualization
- Event creation and completion tracking

#### AddContactDialog
**Referenced in**: `src/app/dashboard/projects/[id]/page.tsx:533`
- Links existing contacts to projects
- Contact selection interface
- Validation for duplicate assignments

---

## Business Logic

### ProjectService
**Location**: `src/services/project/project.service.ts`

```typescript
export class ProjectService extends BaseService {
  /**
   * Get all projects with optional filters
   */
  async getProjects(options?: {
    includeContacts?: boolean;
    includeTasks?: boolean;
    status?: string;
  }) {
    const include: Prisma.ProjectInclude = {};
    
    if (options?.includeContacts) {
      include.contacts = true;
    }
    
    if (options?.includeTasks) {
      include.tasks = {
        where: { completedAt: null },
        orderBy: { dueDate: 'asc' },
        take: 5
      };
    }
    
    const where: Prisma.ProjectWhereInput = {};
    
    if (options?.status) {
      where.status = options.status as any;
    }
    
    return await this.prisma.project.findMany({
      where,
      include,
      orderBy: { createdAt: 'desc' }
    });
  }
  
  /**
   * Get project statistics
   */
  async getProjectStats() {
    const [total, inProgress, completed] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.project.count({ 
        where: { status: 'IN_PROGRESS' } 
      }),
      this.prisma.project.count({ 
        where: { status: 'COMPLETED' } 
      })
    ]);
    
    return {
      total,
      inProgress,
      completed,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  }
}
```

---

## Project Lifecycle

### 1. Creation Flow
1. **Navigation**: User goes to `/dashboard/projects/new`
2. **Form Validation**: Zod schema validates input data
3. **API Call**: POST to `/api/projects` with validated data
4. **Database Transaction**: 
   - Create project record
   - Auto-generate default timeline events
5. **Response**: Return project with relations
6. **Redirect**: Navigate to project detail view

### 2. Management Flow

#### Status Progression
```
PLANNING → IN_PROGRESS → COMPLETED/CANCELLED
                     ↓
                  ON_HOLD → IN_PROGRESS
```

#### Task Management Workflow
1. **Task Creation**: Within project context
2. **Assignment**: Link to project members
3. **Progress Tracking**: Status updates and time tracking
4. **Completion**: Mark complete with timestamp

#### Contact Association
1. **Contact Selection**: Choose from existing contacts
2. **Permission Check**: Validate project membership
3. **Junction Creation**: Create ProjectContact record
4. **Relationship**: Many-to-many via junction table

#### Timeline Management
1. **Default Events**: Auto-created on project creation
2. **Custom Events**: User-defined milestones
3. **Progress Tracking**: Completion percentage calculation
4. **Visual Display**: Timeline charts and progress indicators

### 3. Data Relationships

```
User (Owner) ←→ Project ←→ ProjectMember (Users)
                   ↓
                Task ←→ User (Assignee)
                   ↓
              TimelineEvent
                   ↓
              ProjectContact ←→ Contact
                   ↓
              ProjectLink
                   ↓
              Document/File
```

---

## Implementation Details

### Timeline Events Template
**Location**: `timeline-template.js` (referenced in API)

Default events created for new projects:
```javascript
export const defaultTimelineEvents = [
  {
    title: "Project Kickoff",
    description: "Initial project meeting and planning",
    eventDate: null,
    isCompleted: false
  },
  {
    title: "Requirements Gathering",
    description: "Collect and document project requirements",
    eventDate: null,
    isCompleted: false
  },
  {
    title: "Design Phase",
    description: "Create project designs and mockups",
    eventDate: null,
    isCompleted: false
  },
  {
    title: "Development Phase",
    description: "Implementation and coding",
    eventDate: null,
    isCompleted: false
  },
  {
    title: "Testing Phase",
    description: "Quality assurance and testing",
    eventDate: null,
    isCompleted: false
  },
  {
    title: "Project Delivery",
    description: "Final delivery and handover",
    eventDate: null,
    isCompleted: false
  }
];
```

### Color Coding System

**Project Status Colors**:
```typescript
const getStatusColor = (status: string) => ({
  PLANNING: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  ON_HOLD: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800"
}[status] || "bg-gray-100 text-gray-800");
```

**Priority Colors**:
```typescript
const getPriorityColor = (priority: string) => ({
  LOW: "bg-slate-100 text-slate-800",
  MEDIUM: "bg-indigo-100 text-indigo-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800"
}[priority] || "bg-slate-100 text-slate-800");
```

### Performance Optimizations

1. **Database Indexing**: Foreign keys automatically indexed by Prisma
2. **Selective Includes**: Only load necessary relations
3. **Optimistic UI Updates**: Immediate feedback with server sync
4. **Session Storage**: UI preferences persist across sessions
5. **Memoized Filtering**: Prevent unnecessary re-computations

---

## Security & Permissions

### Authentication Requirements
- **NextAuth Session**: Required for all API endpoints
- **User Validation**: Session user must exist in database

### Authorization Levels

#### Project Ownership
- **Owner**: Full CRUD permissions
- **Members**: Can view, add contacts (with validation)
- **Non-members**: No access (should be enforced)

#### API Security Issues
⚠️ **Security Concern**: `GET /api/projects` returns ALL projects regardless of user

**Current Implementation**:
```typescript
// SECURITY ISSUE: No user filtering
const projects = await prisma.project.findMany({
  // Missing: where: { ownerId: userId }
  include: { /* ... */ }
});
```

**Recommended Fix**:
```typescript
const projects = await prisma.project.findMany({
  where: {
    OR: [
      { ownerId: userId },
      { members: { some: { userId: userId } } }
    ]
  },
  include: { /* ... */ }
});
```

### Data Validation
- **Zod Schemas**: Server-side input validation
- **TypeScript**: Compile-time type safety
- **Prisma**: Database constraint enforcement
- **Form Validation**: Client-side validation with server fallback

---

## File References

### Database Schema
- `prisma/schema.prisma` - Complete database schema

### API Endpoints
- `src/app/api/projects/route.ts` - Main projects CRUD
- `src/app/api/projects/[id]/route.ts` - Individual project operations
- `src/app/api/projects/[id]/contacts/route.ts` - Contact management
- `src/app/api/projects/[id]/links/route.ts` - Links management
- `src/app/api/projects/[id]/links/[linkId]/route.ts` - Individual link operations

### Frontend Pages
- `src/app/dashboard/projects/page.tsx` - Project list view
- `src/app/dashboard/projects/[id]/page.tsx` - Project detail view
- `src/app/dashboard/projects/new/page.tsx` - Project creation
- `src/app/dashboard/projects/[id]/edit/page.tsx` - Project editing

### Components
- `src/components/projects/ProjectLinksTable.tsx` - Links management
- `src/components/projects/AddContactDialog.tsx` - Contact assignment
- `src/components/projects/EditTaskDialog.tsx` - Task management
- `src/components/projects/EditContactDialog.tsx` - Contact editing
- `src/components/projects/TimelineSection.tsx` - Timeline management

### Services
- `src/services/project/project.service.ts` - Business logic layer

### Configuration
- `timeline-template.js` - Default timeline events template

---

This documentation provides complete implementation details for recreating the Projects system in another application. The system serves as the central organizing entity for task management, contact relationships, document storage, and project timeline tracking, with comprehensive CRUD operations and a responsive user interface.