# Contributing Guidelines

## Local Development

### Running the Application Locally
```bash
npm run dev
```

## Deployment Process

### Live Publishing
Always push to the main GitHub repository. Suggest and ask if a branch is needed.

### Pre-Deployment Checklist
1. **Run pre-deployment check**
   ```bash
   npm run predeploy:check
   ```

2. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: lots of little updates"
   ```

3. **Push to GitHub**
   ```bash
   git push
   ```
   *Railway handles the rest!*

## Database Conventions

When making database changes, **ALWAYS** follow these steps:

1. **Create migration**
   ```bash
   npx prisma migrate dev --create-only --NAME_IT
   ```

2. **Validate migration**
   ```bash
   npm run db:validate
   ```

3. **Apply migration locally**
   ```bash
   npx prisma migrate dev
   ```

4. **Test thoroughly**
   ```bash
   npm test
   ```

## Coding Standards

### Style and Formatting Rules
Always be minimal and surgical with edits and updates. Be precise and meticulous. Use available resources before suggesting additional installations or third-party systems.

### File Naming Convention
**Standard:** `kebab-case` (e.g., `my-component-name`)

- **Consistency is paramount** - Apply uniformly across the entire codebase to reduce cognitive load and improve maintainability
- **Be descriptive but concise** - File names should clearly indicate their purpose without being overly verbose. Aim for self-documenting names that new developers can understand immediately
- **Avoid generic names** - Don't use `utils.js`, `helpers.js`, or `data.js` at the root level. Be specific about what utilities or data they contain
- **Document conventions** - Maintain this CONTRIBUTING.md file with explicit naming conventions
- **No version stamps** - Avoid version numbers or dates in filenames for source code. Use Git for version control instead

### Module/Component Structure Guidelines
All modules and components should be structured for modular reusability. For example, if we use a date-picker, it should be documented and available for reuse throughout the application.

## Documentation Requirements

### CLAUDE.md
**Maximum 500 lines** describing the application as a technical overview. The goal is to describe the purpose, architecture, file structure, and key information for any developer to fully understand the entire application's development and process.  
*Tone: Concise and efficient communication*

### README.md
Each page, component, and feature should have one centralized README.md file clearly explaining:
- Technical features
- Implementation standards
- Conflict and error strategies

### OVERVIEW.md
Complete, detailed technical documentation including:
- Entire application framework
- Dependencies
- Architecture
- Infrastructure
- Complete directory tree map
- Everything applicable for a developer to rebuild the application from scratch

### TREE_MAP.md
Architecture decision records noted in a complete directory tree.

## Error Handling Strategies
Run debugging scripts for console logging errors.

## File Structure

### Modular Monolith Architecture
Self-contained modules that could theoretically be extracted into microservices:

```
src/
  modules/
    auth/
      api/
      components/
      pages/
      services/
      index.ts      # Module public API
    catalog/
      api/
      components/
      services/
    checkout/
  core/             # Shared kernel
    components/
    utils/
    types/
  infrastructure/   # Cross-cutting concerns
    api/
    logging/
    monitoring/
```