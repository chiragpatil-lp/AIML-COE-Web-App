# Development Guide

This guide covers local development setup, workflows, and best practices for the AIML COE Web Application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Development Workflow](#development-workflow)
- [Project Architecture](#project-architecture)
- [Code Style & Conventions](#code-style--conventions)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

1. **Node.js** - Version 20.9.0 or higher (required for Next.js 16)

   ```bash
   node --version  # Should be >= 20.9.0
   ```

   **Important**: Next.js 16 requires Node.js >= 20.9.0. Using an older version will result in build failures.

2. **pnpm** - Package manager

   ```bash
   npm install -g pnpm
   pnpm --version
   ```

3. **Git** - Version control
   ```bash
   git --version
   ```

### Optional Tools

- **VS Code** - Recommended IDE with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AIML-COE-Web-App/frontend
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies listed in `package.json` using the lockfile (`pnpm-lock.yaml`) to ensure consistent versions.

### 3. Environment Configuration

Create a `.env.local` file in the frontend directory:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
# Add other environment variables as needed
```

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Development Workflow

### Branch Strategy

- `main` - Production branch (auto-deploys to Cloud Run)
- `feature/<name>` - Feature branches
- `bugfix/<name>` - Bug fix branches

### Typical Workflow

1. **Create a new branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test locally**

   ```bash
   pnpm dev
   ```

3. **Run linting and formatting**

   ```bash
   pnpm lint
   pnpm format
   ```

4. **Build and test production build**

   ```bash
   pnpm build
   pnpm start
   ```

5. **Commit changes**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

Follow conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

Example:

```bash
git commit -m "feat(auth): add user authentication flow"
git commit -m "fix(ui): resolve button alignment issue on mobile"
git commit -m "docs: update README with deployment instructions"
```

## Project Architecture

### Directory Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── ...                # Other routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature-specific components
├── public/               # Static assets
│   ├── images/
│   └── icons/
├── styles/               # Global styles
├── lib/                  # Utility functions and helpers
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── docs/                 # Documentation
```

### Key Technologies

- **Next.js 16** - React framework with App Router
- **React 19** - UI library with new features
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Framer Motion** - Animation library
- **Three.js** - 3D graphics
- **TypeScript** - Type safety

## Code Style & Conventions

### TypeScript

- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` type when possible

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

// Avoid
let user: any;
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks

```typescript
// components/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
```

### Styling

- Use Tailwind CSS utility classes
- Use DaisyUI components when available
- Follow mobile-first responsive design

```tsx
<div className="container mx-auto px-4 md:px-6 lg:px-8">
  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
    Responsive Heading
  </h1>
</div>
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Hooks: `use*.ts` (e.g., `useAuth.ts`)
- Types: `*.types.ts` (e.g., `user.types.ts`)

## Common Tasks

### Adding a New Component

1. Create component file in appropriate directory
2. Define props interface
3. Implement component
4. Export component
5. Add to index file if needed

### Adding a New Page

1. Create route in `app/` directory
2. Create `page.tsx` in the route folder
3. Optionally add `layout.tsx` for route-specific layout

```
app/
└── dashboard/
    ├── layout.tsx
    └── page.tsx
```

### Adding Dependencies

```bash
# Add production dependency
pnpm add <package-name>

# Add dev dependency
pnpm add -D <package-name>
```

### Updating Dependencies

```bash
# Check for outdated packages
pnpm outdated

# Update all dependencies
pnpm update

# Update specific package
pnpm update <package-name>
```

### Running Tests

```bash
# TODO: Add test commands when test suite is set up
# pnpm test
# pnpm test:watch
# pnpm test:coverage
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill process on port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev
```

### Node Modules Issues

If you encounter dependency issues:

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Errors

If build fails:

1. **Check Node.js version**

   ```bash
   node --version  # Must be >= 20.9.0
   ```

   If using older version, upgrade Node.js:

   - Use [nvm](https://github.com/nvm-sh/nvm): `nvm install 20 && nvm use 20`
   - Or download from [nodejs.org](https://nodejs.org/)

2. Check TypeScript errors: `pnpm lint`
3. Clear Next.js cache: `rm -rf .next`
4. Rebuild: `pnpm build`

### Hot Reload Not Working

1. Check file permissions
2. Restart dev server
3. Clear browser cache

## Performance Tips

- Use dynamic imports for large components
- Optimize images with Next.js Image component
- Use React.memo for expensive components
- Implement proper code splitting

## Production Deployment

This project automatically deploys to Google Cloud Run on every push to `main`.

- **Live URL**: https://aiml-coe-web-app-36231825761.us-central1.run.app
- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **GCP Setup**: See [GCP-SETUP.md](./GCP-SETUP.md)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Deployment Guide](./DEPLOYMENT.md)
- [GCP Setup Guide](./GCP-SETUP.md)

## Need Help?

- Check existing documentation
- Search GitHub issues
- Contact the team lead
- Create a new issue with detailed description
