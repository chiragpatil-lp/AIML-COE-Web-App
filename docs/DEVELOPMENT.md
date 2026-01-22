# Development Guide

**Last Updated**: January 22, 2026
**Status**: ✅ Production Ready

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

1. **Node.js** - Version 20.0.0 or higher (required for Next.js 16)

   ```bash
   node --version  # Should be >= 20.0.0
   ```

   **Important**: Next.js 16 requires Node.js >= 20.0.0. Using an older version will result in build failures.

2. **pnpm** - Version 9.0.0 or higher

   ```bash
   npm install -g pnpm
   pnpm --version  # Should be >= 9.0.0
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
cd AIML-COE-Web-App
```

### 2. Install Dependencies

This is a monorepo with workspaces for `frontend` and `functions`. Install dependencies from the root:

```bash
pnpm install
```

This will install all dependencies for both workspaces using the lockfiles to ensure consistent versions.

Alternatively, install for specific workspaces:

```bash
cd frontend && pnpm install  # Frontend only
cd functions && pnpm install # Functions only
```

### 3. Environment Configuration

Create a `.env.local` file in the `frontend/` directory. Use `frontend/.env.example` as a template:

```bash
# Firebase Client Configuration (required)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=search-ahmed
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK (SERVER-SIDE ONLY - for API routes)
FIREBASE_SERVICE_ACCOUNT_KEY=your-service-account-json

# Pillar Application URLs (if testing pillar integrations)
NEXT_PUBLIC_PILLAR_1_URL=https://your-pillar-1-url
NEXT_PUBLIC_PILLAR_2_URL=https://your-pillar-2-url
NEXT_PUBLIC_PILLAR_3_URL=https://your-pillar-3-url
NEXT_PUBLIC_PILLAR_4_URL=https://your-pillar-4-url
NEXT_PUBLIC_PILLAR_5_URL=https://your-pillar-5-url
NEXT_PUBLIC_PILLAR_6_URL=https://your-pillar-6-url
```

**Note**: Get Firebase configuration from Firebase Console > Project Settings.

### 4. Start Development Server

From the root directory:

```bash
pnpm dev
```

Or from the frontend directory:

```bash
cd frontend
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 5. Firebase Emulators (Optional)

For local development with Firebase emulators:

```bash
firebase emulators:start
```

Emulator ports:
- Functions: 5001
- Firestore: 8080
- Auth: 9099
- Emulator UI: 4000

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
   pnpm --filter frontend format
   ```

4. **Build and test production build**

   ```bash
   pnpm build
   pnpm --filter frontend start
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
AIML-COE-Web-App/          # Monorepo root
├── frontend/              # Next.js application
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API Routes (Backend Logic)
│   │   │   ├── admin/    # Admin operations (delete-user, set-admin-claim, update-permissions)
│   │   │   ├── auth/     # Auth operations (initialize-user, session)
│   │   │   └── pillar/   # Pillar proxy routes
│   │   ├── admin/        # Admin dashboard page
│   │   ├── auth/         # Auth pages (signin)
│   │   ├── dashboard/    # User dashboard page
│   │   ├── profile/      # User profile page
│   │   ├── migrate/      # Migration page
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components (shadcn/ui + custom)
│   │   ├── admin/       # Admin-specific components
│   │   ├── auth/        # Auth-specific components
│   │   ├── dashboard/   # Dashboard-specific components
│   │   └── ...          # Feature components (Hero, Navbar, Footer, etc.)
│   ├── contexts/        # React contexts (AuthContext)
│   ├── hooks/           # Custom React hooks (use-toast, use-mobile)
│   ├── lib/             # Utility functions and types
│   │   ├── firebase/    # Firebase SDK wrappers (config, admin, permissions, user-management)
│   │   └── types/       # TypeScript type definitions
│   ├── styles/          # Global styles
│   └── terraform/       # Infrastructure as Code
├── functions/            # Firebase Cloud Functions (Gen 2)
│   ├── src/             # Function source code
│   │   └── index.ts     # Cloud Functions (onUserCreate trigger)
│   └── deploy.sh        # Deployment script
├── scripts/              # Utility scripts (admin management, user checks)
├── docs/                 # Documentation
└── pnpm-workspace.yaml   # Monorepo workspace configuration
```

### Backend Architecture: Hybrid Approach

We use a hybrid approach for backend logic to optimize for performance and cost:

1.  **Next.js API Routes (`frontend/app/api/*`)**
    *   **Use Case:** User-initiated actions (e.g., "Delete User", "Update Permissions", "Set Admin Claim").
    *   **Reason:** Eliminates "Cold Start" latency, avoids CORS issues, and shares the Next.js environment.
    *   **Security:** Validates Firebase ID tokens and Admin privileges server-side using Firebase Admin SDK.
    *   **Current API Routes:**
        - `/api/admin/delete-user` - Delete users
        - `/api/admin/set-admin-claim` - Set admin claims
        - `/api/admin/update-permissions` - Update user permissions
        - `/api/auth/initialize-user` - Initialize new user
        - `/api/auth/session` - Get session data
        - `/api/pillar/[id]` - Proxy requests to pillar applications

2.  **Cloud Functions (`functions/src/index.ts`)**
    *   **Use Case:** Background event triggers that run automatically.
    *   **Reason:** Logic that *must* run automatically in response to Firebase events (like user signup) and cannot be triggered by the client.
    *   **Current Functions:**
        - `onUserCreate` (beforeUserCreated trigger) - Automatically assigns default permissions when a new user signs up
        - `setAdminClaim`, `updateUserPermissions`, `getUserPermissions`, `initializeUser` - HTTP callable functions deployed but primarily for backup/direct access
    *   **Note:** Most user-initiated operations use Next.js API routes instead of callable Cloud Functions for better performance.

### Key Technologies

**Frontend Framework:**
- **Next.js 16** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type safety and improved DX

**Styling:**
- **Tailwind CSS 4** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind (custom theme)
- **shadcn/ui** - Accessible component library built on Radix UI

**UI Components & Libraries:**
- **Radix UI** - Unstyled, accessible component primitives
- **Framer Motion** - Animation library
- **Sonner** - Toast notifications
- **Lucide React** - Icon library
- **React Hook Form** - Form handling with Zod validation

**3D & Visualization:**
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber
- **Recharts** - Charting library

**Backend & Database:**
- **Firebase** - Authentication, Firestore database, Cloud Functions
- **Firebase Admin SDK** - Server-side Firebase operations

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

**For frontend:**

```bash
# From root directory
pnpm --filter frontend add <package-name>
pnpm --filter frontend add -D <package-name>

# Or from frontend directory
cd frontend
pnpm add <package-name>
pnpm add -D <package-name>
```

**For functions:**

```bash
# From functions directory
cd functions
pnpm add <package-name>
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

**Status**: Test suite is not yet implemented.

```bash
# No test commands available yet
# Future: pnpm test, pnpm test:watch, pnpm test:coverage
```

**Note**: Testing framework and test files need to be set up.

### Common Development Commands

**From root directory:**

```bash
pnpm dev              # Start frontend dev server
pnpm build            # Build frontend for production
pnpm lint             # Run ESLint on frontend
pnpm deploy:frontend  # Deploy frontend (via Cloud Run workflow)
pnpm deploy:functions # Deploy Cloud Functions (cd functions && pnpm run deploy)
pnpm fix-admin        # Run admin fix script
```

**Note**: The `deploy:functions` script changes to the functions directory and runs deployment.

**Frontend-specific (from frontend/ directory):**

```bash
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting
```

**Functions-specific (from functions/ directory):**

```bash
pnpm build            # Compile TypeScript
pnpm serve            # Run Firebase emulators
pnpm deploy           # Deploy to Firebase
pnpm logs             # View function logs
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
   node --version  # Must be >= 20.0.0
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
