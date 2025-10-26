# Contributing to NewTube

First off, thank you for considering contributing to NewTube! It's people like you that make NewTube such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Style Guides](#style-guides)
  - [Git Commit Messages](#git-commit-messages)
  - [TypeScript Style Guide](#typescript-style-guide)
  - [React/Next.js Guidelines](#reactnextjs-guidelines)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment (see README.md)
4. Create a new branch for your contribution
5. Make your changes
6. Test your changes thoroughly
7. Submit a pull request

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected to see
- **Include screenshots or GIFs** if applicable
- **Include your environment details** (OS, browser, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List some examples** of how it would be used
- **Include mockups or wireframes** if applicable

### Your First Code Contribution

Unsure where to begin? You can start by looking through:

- **Good First Issue** labels - simpler issues that are good for newcomers
- **Help Wanted** labels - issues that need assistance

### Pull Requests

1. **Branch Naming**
   - Feature: `feature/description`
   - Bug fix: `fix/description`
   - Hotfix: `hotfix/description`
   - Documentation: `docs/description`

2. **Before Submitting**
   - Ensure all tests pass
   - Run linting: `npm run lint`
   - Update documentation if needed
   - Follow the style guides

3. **PR Description Template**
   ```markdown
   ## Description
   Brief description of what this PR does

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## How Has This Been Tested?
   Describe the tests you ran

   ## Checklist
   - [ ] My code follows the style guidelines
   - [ ] I have performed a self-review
   - [ ] I have commented my code where necessary
   - [ ] I have updated the documentation
   - [ ] My changes generate no new warnings
   - [ ] I have added tests that prove my fix/feature works
   - [ ] New and existing tests pass locally
   ```

4. **After Submitting**
   - Respond to feedback promptly
   - Make requested changes
   - Keep your PR up to date with the main branch

## Style Guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

**Examples:**
```
feat: Add video playlist feature
fix: Resolve authentication redirect issue
docs: Update README with deployment instructions
refactor: Optimize video upload component
test: Add tests for comment functionality
```

**Commit Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### TypeScript Style Guide

- Use TypeScript for all new files
- Define types/interfaces for all props and function parameters
- Avoid using `any` - use `unknown` if type is truly unknown
- Use `const` for variables that won't be reassigned
- Use descriptive variable and function names

**Example:**
```typescript
// Good
interface VideoCardProps {
  video: Video;
  onSelect: (videoId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onSelect }) => {
  // component logic
};

// Avoid
const VideoCard = (props: any) => {
  // component logic
};
```

### React/Next.js Guidelines

1. **Component Structure**
   - Use functional components with hooks
   - Keep components small and focused
   - Extract reusable logic into custom hooks
   - Use Server Components by default, Client Components when needed

2. **File Organization**
   - One component per file
   - Co-locate related files (component, styles, tests)
   - Use index files to export from directories

3. **Naming Conventions**
   - Components: PascalCase (e.g., `VideoPlayer.tsx`)
   - Utilities: camelCase (e.g., `formatDate.ts`)
   - Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_LIMIT`)
   - Hooks: camelCase with "use" prefix (e.g., `useVideoPlayer`)

4. **State Management**
   - Use React hooks for local state
   - Use TanStack Query for server state
   - Prefer server-side data fetching when possible

5. **Styling**
   - Use Tailwind CSS utility classes
   - Follow mobile-first responsive design
   - Use Radix UI for accessible components
   - Keep custom CSS minimal

## Development Setup

### Environment Variables

Ensure all required environment variables are set in `.env.local`:

```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=

# Video Processing
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

# File Uploads
UPLOADTHING_TOKEN=

# Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### Running Tests

```bash
# Run linting
npm run lint

# Run type checking
npx tsc --noEmit

# Build the project
npm run build
```

### Database Changes

When modifying the database schema:

1. Update schema in `src/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Push to database: `npm run db:push`
4. Test your changes thoroughly

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── (auth)/      # Authentication pages
│   ├── (home)/      # Main app pages
│   ├── (studio)/    # Creator studio pages
│   └── api/         # API routes & webhooks
├── components/      # Reusable UI components
├── db/             # Database schema & config
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── modules/        # Feature modules (tRPC)
└── trpc/           # tRPC configuration
```

### Adding a New Feature

1. **Create Feature Module** in `src/modules/[feature-name]/`
   - `server/router.ts` - tRPC router
   - `server/service.ts` - Business logic
   - `ui/` - React components
   - `types.ts` - TypeScript types

2. **Add Database Tables** (if needed)
   - Update `src/db/schema.ts`
   - Generate and push migrations

3. **Create UI Components**
   - Add to `src/components/` or feature module
   - Use existing Radix UI components when possible

4. **Add Routes** in `src/app/`
   - Create route directories
   - Add `page.tsx` and `layout.tsx` as needed

5. **Update Documentation**
   - Update README.md
   - Add inline code comments
   - Update API documentation if applicable

## Questions?

Don't hesitate to ask questions in the issues or discussions section. We're here to help!

## Recognition

Contributors will be recognized in our README and release notes. Thank you for making NewTube better!

---

**Happy Contributing! 🎉**
