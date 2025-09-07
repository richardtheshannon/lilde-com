     
# TODO_MVP
/* DO NOT REMOVE THE FOLLOWING PLACEHOLDER PROMPT:

Read CLAUDE.md and TODO_MVP.md in the _TEMP directory. Then proceed with implementing these steps from TODO_MVP.md: 
#### 1. **src/app/globals.css**. 
Mark what's done when done. I am running "npm run dev" already on http://localhost:3000/ in another terminal. Warn me when I am at 20% of my context.

Read CLAUDE.md in the _TEMP directory. I am running "npm run dev" already on http://localhost:3000/ in another terminal. Warn me when I am at 20% of my context. Dont suggest anything just tell me when you are ready. 

Update CLAUDE.md in the _TEMP directory, with any relevant application update overviews. 
*/

## Compacted Layout Implementation Plan

### Overview
Transform the application to use space-efficient compacted layouts that match the style of `/dashboard/projects` page, reducing vertical scrolling and maximizing content visibility.

### Key Design Principles
1. **Horizontal over Vertical**: Place elements side-by-side when possible
2. **Unified Form Sections**: Use consistent `form-section` styling with Material icons
3. **Compact Button Groups**: Horizontal button arrangements instead of vertical stacking
4. **Grid-based Layouts**: Use CSS Grid for efficient space utilization
5. **Consistent Container Structure**: `safe-margin` → `create-project-container` pattern

### Files to Modify

#### 1. **src/app/globals.css**
- [ ] Add new `.compact-mode` classes for reduced spacing
- [ ] Create `.form-actions-compact` for horizontal button layouts
- [ ] Add `.form-grid-compact` for tighter form field arrangements
- [ ] Define `.stats-grid-compact` for condensed statistics
- [ ] Add `.table-compact` for denser table layouts
- [ ] Create responsive breakpoints for compact mode

#### 2. **src/app/dashboard/projects/[id]/edit/page.tsx**
- [ ] Replace `max-w-4xl mx-auto` with `create-project-container`
- [ ] Convert form to use `form-section` structure
- [ ] Change button layout from vertical to horizontal
- [ ] Use `form-grid` for field arrangements
- [ ] Apply consistent styling from projects page

#### 3. **src/app/dashboard/projects/[id]/page.tsx**
- [ ] Reorganize sections into compact grid layouts
- [ ] Combine status/priority controls into single row
- [ ] Consolidate statistics into horizontal cards
- [ ] Reduce spacing between timeline events
- [ ] Make action buttons inline with content

#### 4. **src/app/dashboard/projects/new/page.tsx**
- [ ] Adjust form-grid to use more columns on wider screens
- [ ] Place Status and Priority selectors side-by-side
- [ ] Compact the timeline generation section
- [ ] Reduce vertical spacing between form sections

#### 5. **src/app/page.tsx** (Home Page)
- [ ] Convert two-column layout to more compact arrangement
- [ ] Add dashboard widgets in grid format
- [ ] Implement quick stats cards
- [ ] Add recent activity feed in compact format

#### 6. **src/components/layout/sidebar.tsx**
- [ ] Add compact mode toggle in user settings
- [ ] Store compact preference in localStorage
- [ ] Apply compact class to root element when enabled

#### 7. **src/components/timeline/TimelinePreview.tsx**
- [ ] Create horizontal timeline option for compact mode
- [ ] Reduce event card sizes
- [ ] Use inline editing for timeline events

#### 8. **src/components/forms/MarkdownUploader.tsx**
- [ ] Make upload area more compact
- [ ] Place file info and actions horizontally

### Specific Changes Per File

#### **globals.css** - New Classes to Add
```css
/* Compact Mode Classes */
.compact-mode .form-section { margin-bottom: 1rem; }
.compact-mode .form-section-title { margin-bottom: 0.75rem; }
.compact-mode .stats-grid { gap: 0.5rem; }
.compact-mode .form-grid { gap: 1rem; }

/* Horizontal Button Groups */
.form-actions-compact {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

/* Compact Form Grid */
.form-grid-compact {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

/* Inline Controls */
.inline-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}
```

#### **Edit Project Page** - Structure Changes
- Header: Title and close button on same line
- Basic Info: 3 fields per row instead of 2
- Project Details: Status, Priority, Type in one row
- Dates: Start and End date side-by-side
- Actions: Cancel and Update buttons horizontally aligned

#### **Project Detail Page** - Layout Optimization
- Header: Title, edit, delete buttons in single row
- Status Bar: Status badge, priority, progress in one line
- Quick Actions: Inline status/priority dropdowns
- Statistics: 5-6 cards in single row
- Timeline: Compact event cards with less padding

#### **New Project Page** - Form Compaction
- Combine related fields in same row
- Timeline config: Spacing and date selector inline
- Reduce section padding
- Make buttons more compact

#### **Home Page** - Dashboard Layout
- Replace lorem ipsum with dashboard widgets
- Add quick stats bar at top
- Recent projects grid (3-4 columns)
- Activity feed in compact list format

### Implementation Sequence
1. [ ] Create compact CSS classes in globals.css
2. [ ] Add compact mode toggle to sidebar settings
3. [ ] Update Edit Project page with new layout
4. [ ] Refactor Project Detail page for compactness
5. [ ] Optimize New Project page form layout
6. [ ] Transform Home page into dashboard
7. [ ] Update timeline components for compact display
8. [ ] Test responsive behavior on all screen sizes

### Expected Benefits
- **30-40% reduction** in vertical scrolling
- **Better information density** without sacrificing readability
- **Consistent design language** across all pages
- **Improved workflow efficiency** with less navigation
- **Mobile-friendly** with intelligent responsive stacking