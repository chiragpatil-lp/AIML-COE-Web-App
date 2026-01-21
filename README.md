# AIML COE Web Application

A modern Next.js web application for the AIML Center of Excellence, built with React 19, Next.js 16, Firebase, and Tailwind CSS.

## Overview

This is a full-stack application for the AIML COE platform, featuring:
- **Frontend**: Next.js 16 application with responsive UI, modern components, and animations
- **Backend**: Firebase Cloud Functions for authentication, user management, and admin operations
- **Database**: Firestore with role-based access control and pillar-based permissions
- **Authentication**: Firebase Authentication with Google Sign-In
- **Deployment**: Automated CI/CD pipeline deploying frontend to Google Cloud Run

## Tech Stack

### Frontend
- **Framework**: Next.js 16.0.10
- **React**: 19.0.0
- **Styling**: Tailwind CSS 4.1.9, DaisyUI 5.5.14
- **Animations**: Framer Motion 12.4.10
- **UI Components**: Radix UI, shadcn/ui components
- **Package Manager**: pnpm

### Backend
- **Firebase Authentication**: Google Sign-In provider
- **Cloud Functions**: Firebase Functions v6 (Gen 2, Node.js 20)
- **Database**: Firestore (named database: `aiml-coe-web-app`)
- **Admin SDK**: 
  - Frontend API Routes: firebase-admin 13.6.0
  - Cloud Functions: firebase-admin 12.0.0

### Deployment
- **Frontend Hosting**: Google Cloud Run
- **CI/CD**: GitHub Actions
- **Container Registry**: Google Container Registry (GCR)

## Quick Start

### Prerequisites

- Node.js 20.9.0 or higher (required for Next.js 16 and Cloud Functions)
- pnpm 9.0.0 or higher (install globally: `npm install -g pnpm`)
- Git
- Firebase CLI (for functions development): `npm install -g firebase-tools`

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd AIML-COE-Web-App

# Install dependencies for all workspace packages
pnpm install

# Start frontend development server
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

### Root Level (workspace)
```bash
pnpm dev              # Start frontend development server
pnpm build            # Build frontend for production
pnpm lint             # Run frontend ESLint
pnpm deploy:functions # Deploy Cloud Functions to Firebase
pnpm fix-admin        # Run admin fix script
```

### Frontend (cd frontend/)
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
```

### Functions (cd functions/)
```bash
npm run build   # Compile TypeScript
npm run serve   # Start Firebase emulators
npm run deploy  # Deploy to Firebase
npm run logs    # View Cloud Functions logs
```

## Project Structure

```
AIML-COE-Web-App/
├── .github/
│   └── workflows/              # GitHub Actions CI/CD pipelines
│       ├── ci-validation.yml   # PR validation (lint, format, build)
│       └── cloud-run-deploy.yml # Production deployment to Cloud Run
├── docs/                       # Project documentation
│   ├── ADMIN-DASHBOARD.md
│   ├── CLOUD-FUNCTIONS.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   ├── FIRESTORE-SECURITY-RULES.md
│   ├── GCP-SETUP.md
│   ├── PILLAR-AUTHENTICATION.md
│   └── firebase/               # Firebase-specific documentation
├── frontend/                   # Next.js application
│   ├── app/                    # Next.js app directory (routes)
│   │   ├── admin/             # Admin dashboard page
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin operations
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   └── pillar/        # Pillar proxy endpoints
│   │   ├── auth/signin/       # Sign-in page
│   │   ├── dashboard/         # User dashboard
│   │   ├── migrate/           # Migration page
│   │   └── profile/           # User profile page
│   ├── components/            # React components
│   │   ├── admin/             # Admin-specific components
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard components
│   │   └── ui/                # shadcn/ui components
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx    # Authentication context
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   │   ├── firebase/          # Firebase configuration and utilities
│   │   └── types/             # TypeScript type definitions
│   ├── styles/                # Global styles
│   ├── terraform/             # Infrastructure as Code
│   ├── Dockerfile             # Docker configuration for Cloud Run
│   └── package.json           # Frontend dependencies
├── functions/                  # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts           # Functions entry point (Gen 2)
│   └── package.json           # Functions dependencies
├── scripts/                    # Utility scripts
│   ├── check-admin.js
│   ├── check-user-by-uid.js
│   ├── delete-user-completely.js
│   ├── fix-admin.js
│   └── initialize-current-user.js
├── firebase.json               # Firebase configuration
├── firestore.rules             # Firestore security rules
├── pnpm-workspace.yaml         # pnpm workspace configuration
└── package.json                # Root workspace scripts
```

## Key Features

### Authentication & Authorization
- **Firebase Authentication**: Google Sign-In integration
- **Role-Based Access Control**: Admin and user roles with custom claims
- **Pillar-Based Permissions**: Six pillar access levels (pillar1-pillar6)
- **Protected Routes**: Client-side and API-level route protection

### User Management (Admin Only)
- View all users and their permissions
- Add new users manually with custom permissions
- Edit user permissions (admin role, pillar access)
- Delete users (removes from both Auth and Firestore)
- Search and filter users
- Pillar access summary statistics

### Dashboard
- Personalized user dashboard based on pillar permissions
- Access to authorized pillar applications
- Profile management

### Cloud Functions
- **onUserCreate**: Automatically creates default permissions for new users
- **Admin API**: Server-side admin operations (set admin claims, update permissions)
- **Callable Functions**: Secure, authenticated function calls from client

## Documentation

All documentation is located in the `docs/` directory at the repository root.

**📚 [Complete Documentation Index](./docs/README.md)** - Comprehensive guide to all documentation

### Key Documentation:

- [Development Guide](./docs/DEVELOPMENT.md) - Local development setup and workflow
- [Deployment Guide](./docs/DEPLOYMENT.md) - CI/CD pipeline and deployment process
- [GCP Setup Guide](./docs/GCP-SETUP.md) - Google Cloud Platform configuration steps
- [Cloud Functions Guide](./docs/CLOUD-FUNCTIONS.md) - Cloud Functions implementation details
- [Admin Dashboard Guide](./docs/ADMIN-DASHBOARD.md) - Admin dashboard features
- [Firestore Security Rules](./docs/FIRESTORE-SECURITY-RULES.md) - Database security configuration
- [Pillar Authentication](./docs/PILLAR-AUTHENTICATION.md) - Pillar SSO integration
- [Terraform README](./frontend/terraform/README.md) - Infrastructure provisioning guide

## Firestore Database Configuration

This project uses a **named Firestore database** rather than the default database for environment isolation and security.

- **Database ID**: `aiml-coe-web-app`
- **Project**: `search-ahmed`
- **Location**: Multi-region (as configured in Firebase)

### CRITICAL: Code Implementation

When initializing Firestore in any part of the application (Frontend, Cloud Functions, or Scripts), you **MUST** specify the database ID:

**Frontend (Firebase Web SDK):**
```typescript
// frontend/lib/firebase/config.ts
import { getFirestore } from "firebase/firestore";

const db = getFirestore(app, "aiml-coe-web-app");
```

**Backend (Firebase Admin SDK):**
```typescript
// functions/src/index.ts
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

const db = getFirestore(admin.app(), 'aiml-coe-web-app');
```

**Scripts:**
```javascript
// scripts/fix-admin.js (correct pattern for named database)
const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');

admin.initializeApp({ projectId: 'search-ahmed' });
const db = getFirestore('aiml-coe-web-app');
```

**Note**: Some older scripts may use `admin.firestore()` which points to the default database. Always use the patterns above for the named database.

**⚠️ DO NOT** use `getFirestore(app)` or `admin.firestore()` without specifying the database ID, as these will point to the `(default)` database, which is not used by this application.

### Database Collections

- **`userPermissions`**: User access control and pillar permissions
  - Document ID: Firebase Auth UID
  - Fields: `userId`, `email`, `isAdmin`, `pillars`, `createdAt`, `updatedAt`

## CI/CD Pipeline

This project uses GitHub Actions to automatically deploy the frontend to Google Cloud Run on every push to the `main` branch.

**Status**: ✅ **LIVE AND DEPLOYED**

### Production Deployment
- **Service Name**: aiml-coe-web-app
- **Production URL**: https://aiml-coe-web-app-36231825761.us-central1.run.app
- **GCP Project**: search-ahmed
- **Region**: us-central1
- **Platform**: Google Cloud Run

### Automated Deployment Pipeline

**Trigger**: Push to `main` branch

**Workflow**: [.github/workflows/cloud-run-deploy.yml](./.github/workflows/cloud-run-deploy.yml)

**Steps**:
1. **Authentication**: Workload Identity Federation for secure GCP access
2. **Build**: Docker image build with Node.js 20 and embedded environment variables
3. **Push**: Image pushed to Google Container Registry (GCR)
4. **Deploy**: Deploy to Cloud Run with configuration:
   - Memory: 512Mi
   - CPU: 1
   - Max instances: 10
   - Min instances: 0 (scales to zero)
   - Concurrency: 80
   - Timeout: 300s
5. **Cleanup**: Automatic cleanup of old revisions (keeps last 10)

**Deployment Time**: ~3-4 minutes from push to live

### CI Validation (Pull Requests)

**Workflow**: [.github/workflows/ci-validation.yml](./.github/workflows/ci-validation.yml)

Before merging a PR, the following checks must pass:

```bash
cd frontend

# 1. Format check - ensures consistent code formatting
pnpm format:check

# 2. Lint check - identifies code quality issues
pnpm lint

# 3. Build check - ensures production build succeeds
pnpm build
```

**Fix formatting issues:**
```bash
pnpm format
```

All checks must pass for the PR to be mergeable.

## Development Workflow

### Local Development

1. **Start the frontend development server**:
   ```bash
   pnpm dev
   ```
   Frontend runs at http://localhost:3000

2. **Start Firebase emulators** (optional, for testing Cloud Functions locally):
   ```bash
   cd functions
   npm run serve
   ```
   - Functions: http://localhost:5001
   - Firestore: http://localhost:8080
   - Auth: http://localhost:9099
   - Emulator UI: http://localhost:4000

### Making Changes

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test locally

3. Run validation checks:
   ```bash
   cd frontend
   pnpm format      # Format code
   pnpm lint        # Check for issues
   pnpm build       # Test production build
   ```

4. Commit and push:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request to `main`
   - CI validation will run automatically
   - All checks must pass before merging

6. After merge, automatic deployment to production will begin

### Project Monorepo Structure

This is a pnpm workspace with two packages:
- `frontend/`: Next.js application (uses pnpm)
- `functions/`: Firebase Cloud Functions (uses npm)

**Installing dependencies**:
- Root level: `pnpm install` (installs for all packages)
- Frontend: `cd frontend && pnpm install`
- Functions: `cd functions && npm install`
- Specific package: `pnpm --filter frontend add <package>`

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run linting and formatting: `cd frontend && pnpm lint && pnpm format`
4. Ensure build succeeds: `pnpm build`
5. Push your changes and create a Pull Request
6. Wait for CI validation to pass
7. Request review from team members

## Deployment

### Frontend Deployment

Frontend is automatically deployed to Google Cloud Run via GitHub Actions when changes are pushed to `main`.

**Manual deployment** (if needed):
```bash
cd frontend
# Ensure you have GCP credentials configured
gcloud builds submit --tag gcr.io/search-ahmed/aiml-coe-web-app
gcloud run deploy aiml-coe-web-app --image gcr.io/search-ahmed/aiml-coe-web-app --region us-central1
```

### Cloud Functions Deployment

Deploy Cloud Functions to Firebase:
```bash
# From root (uses workspace)
pnpm deploy:functions

# Or from functions directory (uses npm directly)
cd functions
npm run deploy
```

**Important**: Ensure you're authenticated with Firebase CLI:
```bash
firebase login
firebase use search-ahmed
```

### Firestore Security Rules Deployment

Deploy security rules:
```bash
firebase deploy --only firestore:rules
```

**⚠️ Note**: Due to named database configuration, rules may need to be deployed manually through Firebase Console. See [FIRESTORE-RULES-MANUAL-UPDATE.md](./FIRESTORE-RULES-MANUAL-UPDATE.md) for details.

## Troubleshooting

### Firebase Configuration Issues

If you see "Firestore is not initialized" errors:
1. Verify `.env.local` has all required `NEXT_PUBLIC_FIREBASE_*` variables
2. Check that Firebase configuration is correct in `frontend/lib/firebase/config.ts`
3. Ensure the named database `aiml-coe-web-app` exists in your Firebase project

### Permission Errors

If users can't access certain features:
1. Check user permissions in Firestore `userPermissions` collection
2. Verify Cloud Function `onUserCreate` is deployed and running
3. Use admin dashboard to manually adjust user permissions
4. Check Firestore security rules are deployed

### Build Errors

If build fails:
```bash
cd frontend
rm -rf .next node_modules
pnpm install
pnpm build
```

### Authentication Issues

If Google Sign-In doesn't work:
1. Verify Firebase Authentication is enabled for Google provider
2. Check authorized domains in Firebase Console
3. Ensure `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is correct in environment variables

## Environment Variables

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory for local development:

```bash
# Firebase Client Configuration (get from Firebase Console > Project Settings)
# These are safe to expose in client-side code
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Pillar Application URLs (Internal application endpoints)
NEXT_PUBLIC_PILLAR_1_URL=https://your-pillar-1-url
NEXT_PUBLIC_PILLAR_2_URL=https://your-pillar-2-url
NEXT_PUBLIC_PILLAR_3_URL=https://your-pillar-3-url
NEXT_PUBLIC_PILLAR_4_URL=https://your-pillar-4-url
NEXT_PUBLIC_PILLAR_5_URL=https://your-pillar-5-url
NEXT_PUBLIC_PILLAR_6_URL=https://your-pillar-6-url
```

See [frontend/.env.example](./frontend/.env.example) for a complete template.

### Cloud Functions Environment Variables

Cloud Functions use Firebase configuration automatically. No additional environment variables are required for local development.

For production deployment, ensure your Firebase project has the correct configuration.

## License

Private - All Rights Reserved

## Support

For issues or questions, please contact the AIML COE team.
