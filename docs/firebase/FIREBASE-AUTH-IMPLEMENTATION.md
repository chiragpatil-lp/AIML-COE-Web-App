# Firebase Authentication Implementation Guide

**Last Updated**: January 22, 2026
**Status**: Reference Document

## Overview

This guide provides step-by-step instructions for implementing Firebase Authentication with Google OAuth for the AIML COE Web App. The main app will authenticate users and redirect them to 6 separate pillar applications based on their permissions.

---

## Phase 1: Foundation Setup (Start Here)

### 1.1 Google Cloud Platform (GCP) Permissions Required

To set up Firebase Authentication, you need the following IAM roles on your GCP project:

**Minimum Required Roles:**

- `Firebase Admin` (roles/firebase.admin) - For creating and managing Firebase projects
- `Service Usage Admin` (roles/serviceusage.admin) - For enabling Firebase APIs
- `Cloud Resource Manager` (roles/resourcemanager.projectIamAdmin) - For managing project settings

**Recommended Roles:**

- `Owner` (roles/owner) - Simplest option, includes all necessary permissions
- OR combine these specific roles:
  - `Firebase Admin` (roles/firebase.admin)
  - `Cloud Identity and Access Management Admin` (roles/iam.securityAdmin)
  - `Service Account Admin` (roles/iam.serviceAccountAdmin)

**To Check Your Permissions:**

```bash
# In GCP Console:
# 1. Go to IAM & Admin > IAM
# 2. Find your user account
# 3. Verify you have one of the roles above
```

---

### 1.2 Firebase Project Setup Steps

**Step 1: Create Firebase Project**

1. Go to https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Enter project name: `aiml-coe-web-app` (or your preferred name)
4. (Optional) Enable Google Analytics - recommended for tracking auth events
5. Select your existing GCP project: `search-ahmed` OR create new
6. Click "Create project" and wait for completion

**Step 2: Enable Authentication**

1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click "Google" provider
5. Toggle "Enable"
6. Set support email (required)
7. Click "Save"

**Step 3: Register Web App**

1. In Firebase Console overview, click the Web icon (`</>`)
2. Register app with nickname: `AIML COE Web App`
3. (Optional) Set up Firebase Hosting - Skip for now
4. Copy the Firebase configuration object - YOU WILL NEED THIS!

Example config (keep this secret):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};
```

**Step 4: Configure Authorized Domains**

1. In Firebase Console > Authentication > Settings
2. Under "Authorized domains", add:
   - `localhost` (already added)
   - Your Cloud Run domain (get with: `gcloud run services describe aiml-coe-web-app --region=us-central1 --format='value(status.url)'`)
   - Any custom domains you plan to use

**Step 5: Enable Firestore Database**

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Choose production mode (we'll set rules later)
4. Select region: `us-central1` (same as your Cloud Run)
5. Click "Enable"

**Step 6: Set Firestore Security Rules**

1. Go to Firestore Database > Rules tab
2. Replace default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin by reading their permissions document
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/userPermissions/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/userPermissions/$(request.auth.uid)).data.isAdmin == true;
    }

    // User permissions collection
    match /userPermissions/{userId} {
      // Users can read their own permissions, and admins can read all permissions
      allow read: if (request.auth != null && request.auth.uid == userId) || isAdmin();

      // Admins can create/update/delete any user permissions
      allow write: if isAdmin();
    }
  }
}
```

3. Click "Publish"

**Important**: These rules use Firestore document checks (not custom claims) to verify admin status. This matches the actual deployed rules in the project.

---

### 1.3 Package Installation

**Install Firebase packages:**

```bash
cd frontend
pnpm add firebase
```

**Verify installation:**

- `firebase` (v12.7.0) - Full Firebase SDK including Auth and Firestore
- `firebase-admin` (v13.6.0) - Firebase Admin SDK for frontend API routes
- Note: Cloud Functions use `firebase-admin` (v12.0.0)

---

### 1.4 Environment Configuration

**Create `.env.local` file** (frontend/.env.local):

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Pillar Application URLs (configure these)
NEXT_PUBLIC_PILLAR_1_URL=https://strategy.your-domain.com
NEXT_PUBLIC_PILLAR_2_URL=https://innovation.your-domain.com
NEXT_PUBLIC_PILLAR_3_URL=https://platforms.your-domain.com
NEXT_PUBLIC_PILLAR_4_URL=https://people.your-domain.com
NEXT_PUBLIC_PILLAR_5_URL=https://governance.your-domain.com
NEXT_PUBLIC_PILLAR_6_URL=https://communication.your-domain.com
```

**Update `.gitignore`** (if not already present):

```
.env.local
.env*.local
```

**Create `.env.example`** (frontend/.env.example):

```bash
# Firebase Configuration (get these from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Pillar Application URLs
NEXT_PUBLIC_PILLAR_1_URL=
NEXT_PUBLIC_PILLAR_2_URL=
NEXT_PUBLIC_PILLAR_3_URL=
NEXT_PUBLIC_PILLAR_4_URL=
NEXT_PUBLIC_PILLAR_5_URL=
NEXT_PUBLIC_PILLAR_6_URL=
```

---

### 1.5 File Structure

**New files to create:**

```
frontend/
├── lib/
│   ├── firebase/
│   │   ├── config.ts              # Firebase initialization
│   │   ├── admin.ts               # Admin SDK initialization
│   │   ├── permissions.ts         # User permission helpers
│   │   └── user-management.ts     # User management helpers
│   └── types/
│       └── auth.types.ts          # TypeScript types
├── contexts/
│   └── AuthContext.tsx            # Auth context provider & hook
├── components/
│   ├── auth/
│   │   ├── SignInButton.tsx       # Google Sign-in button
│   │   └── SignOutButton.tsx      # Sign-out button
│   └── dashboard/
│       └── PillarGrid.tsx         # Grid showing accessible pillars
├── app/
│   ├── auth/
│   │   └── signin/
│   │       └── page.tsx           # Sign-in page
│   └── dashboard/
│       └── page.tsx               # Dashboard after login
└── app/
    └── api/                       # API Routes
        ├── auth/                  # Auth endpoints
        └── admin/                 # Admin endpoints
```

---

### 1.6 Implementation Steps

#### Step 1: Firebase Configuration

**Create `frontend/lib/firebase/config.ts`:**

```typescript
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFunctions, type Functions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Check if Firebase config is valid
const isConfigValid = Object.values(firebaseConfig).every(
  (value) => value !== "",
);

// Initialize Firebase (singleton pattern for Next.js)
// Only initialize if config is valid and we're in the browser
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let functions: Functions | undefined;

if (typeof window !== "undefined" && isConfigValid) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app, "aiml-coe-web-app"); // Use named database
  functions = getFunctions(app);
}

export { app, auth, db, functions };
```

#### Step 2: TypeScript Types

**Create `frontend/lib/types/auth.types.ts`:**

```typescript
import { User } from "firebase/auth";

export interface UserPermissions {
  userId: string;
  email: string;
  isAdmin: boolean;
  pillars: {
    pillar1: boolean; // Strategy & Value Realization
    pillar2: boolean; // Innovation & IP Development
    pillar3: boolean; // Platforms & Engineering
    pillar4: boolean; // People & Capability
    pillar5: boolean; // COE Delivery Governance
    pillar6: boolean; // Communication & Market Intelligence
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  permissions: UserPermissions | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  hasAccessToPillar: (pillarNumber: number) => boolean;
}

export interface PillarInfo {
  id: string;
  number: number;
  name: string;
  description: string;
  url: string;
  accentColor: string;
  enabled: boolean;
}
```

#### Step 3: Authentication Context

**Create `frontend/contexts/AuthContext.tsx`:**

Note: The actual implementation is more complex, handling session cookies, token refresh, and extensive error handling. See the source file for the complete implementation.

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import type { AuthContextType, UserPermissions } from '@/lib/types/auth.types';

// ... (AuthContext Implementation)
```

#### Step 4: Sign-In Components

**Create `frontend/components/auth/SignInButton.tsx`:**

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function SignInButton() {
  const { signInWithGoogle, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success('Successfully signed in!');
    } catch (error) {
      toast.error('Failed to sign in. Please try again.');
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={loading}
      className="flex items-center gap-2"
      size="lg"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Sign in with Google
    </Button>
  );
}
```

**Create `frontend/components/auth/SignOutButton.tsx`:**

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function SignOutButton() {
  const { signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out!');
    } catch (error) {
      toast.error('Failed to sign out. Please try again.');
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={loading}
      variant="outline"
    >
      Sign Out
    </Button>
  );
}
```

#### Step 5: Dashboard with Pillar Grid

**Create `frontend/components/dashboard/PillarGrid.tsx`:**

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import type { PillarInfo } from '@/lib/types/auth.types';

const PILLARS: PillarInfo[] = [
  {
    id: 'strategy',
    number: 1,
    name: 'Strategy & Value Realization',
    description: 'ROI tracking, leadership dashboards, and impact metrics',
    url: process.env.NEXT_PUBLIC_PILLAR_1_URL || '#',
    accentColor: '#f2545b',
    enabled: true,
  },
  {
    id: 'innovation',
    number: 2,
    name: 'Innovation & IP Development',
    description: 'AI accelerators, frameworks, and enterprise assets',
    url: process.env.NEXT_PUBLIC_PILLAR_2_URL || '#',
    accentColor: '#2c3e50',
    enabled: true,
  },
  {
    id: 'platforms',
    number: 3,
    name: 'Platforms & Engineering',
    description: 'Trusted tools, templates, and standards',
    url: process.env.NEXT_PUBLIC_PILLAR_3_URL || '#',
    accentColor: '#f2545b',
    enabled: true,
  },
  {
    id: 'people',
    number: 4,
    name: 'People & Capability Enablement',
    description: 'Skills development, training, and maturity assessment',
    url: process.env.NEXT_PUBLIC_PILLAR_4_URL || '#',
    accentColor: '#2c3e50',
    enabled: true,
  },
  {
    id: 'governance',
    number: 5,
    name: 'COE Delivery Governance',
    description: 'Quality assurance and continuous improvement',
    url: process.env.NEXT_PUBLIC_PILLAR_5_URL || '#',
    accentColor: '#f2545b',
    enabled: true,
  },
  {
    id: 'communication',
    number: 6,
    name: 'Communication & Market Intelligence',
    description: 'Market insights, AI trends, and COE showcase',
    url: process.env.NEXT_PUBLIC_PILLAR_6_URL || '#',
    accentColor: '#2c3e50',
    enabled: true,
  },
];

export function PillarGrid() {
  const { hasAccessToPillar, permissions } = useAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PILLARS.map((pillar) => {
        const hasAccess = hasAccessToPillar(pillar.number);

        return (
          <Card
            key={pillar.id}
            className={`relative overflow-hidden transition-all ${
              hasAccess
                ? 'hover:shadow-lg cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <div
              className="absolute top-0 left-0 w-1 h-full"
              style={{ backgroundColor: pillar.accentColor }}
            />
            <CardHeader className="pl-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">
                    {pillar.name}
                  </CardTitle>
                  <CardDescription>{pillar.description}</CardDescription>
                </div>
                {hasAccess && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(pillar.url, '_blank')}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {!hasAccess && (
                <p className="text-xs text-muted-foreground mt-2">
                  Access not granted
                </p>
              )}
              {permissions?.isAdmin && (
                <p className="text-xs text-green-600 mt-2">Admin Access</p>
              )}
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
```

#### Step 6: Create Pages

**Create `frontend/app/auth/signin/page.tsx`:**

```typescript
import { SignInButton } from '@/components/auth/SignInButton';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">AIML COE</h1>
          <p className="text-muted-foreground">
            Sign in to access the Center of Excellence platform
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <SignInButton />
        </div>
      </div>
    </div>
  );
}
```

**Create `frontend/app/dashboard/page.tsx`:**

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { PillarGrid } from '@/components/dashboard/PillarGrid';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, permissions, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.displayName}</h1>
            <p className="text-muted-foreground">
              {permissions?.isAdmin ? 'Administrator' : 'User'} • {user?.email}
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Your Pillars</h2>
          <p className="text-muted-foreground">
            Access your assigned strategic pillars below
          </p>
        </div>

        <PillarGrid />
      </div>
    </div>
  );
}
```

#### Step 7: Route Protection

Route protection is handled by `AuthContext.tsx` (client-side redirects) and API routes (server-side verification). Middleware is not currently used for this implementation as the application relies on client-side state for the layout and server-side checks for data.

#### Step 8: Update Root Layout

**Modify `frontend/app/layout.tsx`:**
Add AuthProvider wrapper around children:

```typescript
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.variable} ${plusJakartaSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
```

---

## Phase 2: Authorization & Admin Panel (Add Later)

### 2.1 Admin Panel for User Management

- Create admin dashboard at `/app/admin/users/page.tsx`
- List all users from Firestore
- Toggle pillar access per user
- Set admin status via Cloud Functions (custom claims)

### 2.2 Cloud Function for Custom Claims

- Deploy Firebase Cloud Function to set admin custom claims
- Only callable by existing admins
- Updates user's JWT token with admin flag

### 2.3 Enhanced Permissions

- Add section-level permissions within pillars
- Create permission management UI
- Implement permission inheritance

---

## Phase 3: Production Deployment

### 3.1 GitHub Secrets Configuration

Add these secrets to your GitHub repository:

```
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
```

### 3.2 Update GitHub Actions Workflow

Modify `.github/workflows/main.yml` to inject Firebase env vars during build.

### 3.3 Cloud Run Environment Variables

Set environment variables in Cloud Run:

- All `NEXT_PUBLIC_*` Firebase variables
- All `NEXT_PUBLIC_PILLAR_*_URL` variables

---

## Testing Checklist

### Phase 1 Testing

- [ ] Firebase config loads without errors
- [ ] Google Sign-in button appears
- [ ] Click Google Sign-in opens OAuth popup
- [ ] Successfully sign in with Google account
- [ ] User document created in Firestore
- [ ] Dashboard shows user name and email
- [ ] Pillar grid shows all 6 pillars (all locked for new user)
- [ ] Sign out works correctly
- [ ] Redirected to sign-in page after sign out

### Manual Admin Setup (First Time)

1. Sign in as yourself
2. Go to Firebase Console > Firestore
3. Find your user document in `userPermissions/{your-uid}`
4. Manually edit: set `isAdmin: true`
5. Sign out and sign back in
6. Verify all pillars are now accessible

---

## Security Considerations

1. **Never commit `.env.local`** - Already in .gitignore
2. **Use environment variables** - All secrets in env vars
3. **Firestore security rules** - Already configured to restrict access
4. **Custom claims for admin** - More secure than Firestore-only checks
5. **HTTPS only** - Cloud Run enforces this
6. **OAuth scopes** - Only request necessary scopes (profile, email)

---

## Migration Path

### Phase 1 → Phase 2

1. Deploy Cloud Function for custom claims
2. Create admin panel UI
3. Add user management features

### Phase 2 → Phase 3

1. Add section-level permissions to Firestore schema
2. Update AuthContext to handle granular permissions
3. Create permission management UI

---

## Troubleshooting

### Issue: "Firebase: Error (auth/popup-blocked)"

**Solution:** Allow popups in browser settings, or use redirect flow instead

### Issue: "Firebase: Error (auth/unauthorized-domain)"

**Solution:** Add domain to Firebase Console > Authentication > Settings > Authorized domains

### Issue: Firestore permission denied

**Solution:** Check Firestore security rules and user authentication status

### Issue: User not redirected after sign-in

**Solution:** Check that `AuthContext` is properly handling the `onAuthStateChanged` event and using `router.push('/dashboard')` or similar mechanism (via SignInButton logic).

---

## Next Steps After Implementation

1. **Set up first admin user** manually in Firestore
2. **Configure pillar URLs** in environment variables
3. **Test sign-in flow** end-to-end
4. **Create admin management UI** (Phase 2)
5. **Deploy to Cloud Run** with GitHub Actions

---

## Files Summary

### New Files (15 total)

1. `lib/firebase/config.ts` - Firebase initialization
2. `lib/firebase/admin.ts` - Admin SDK helpers
3. `lib/firebase/permissions.ts` - Permission helpers
4. `lib/firebase/user-management.ts` - User management functions
5. `lib/types/auth.types.ts` - TypeScript types
6. `contexts/AuthContext.tsx` - Auth context
7. `components/auth/SignInButton.tsx` - Sign-in component
8. `components/auth/SignOutButton.tsx` - Sign-out component
9. `components/dashboard/PillarGrid.tsx` - Pillar grid component
10. `app/auth/signin/page.tsx` - Sign-in page
11. `app/dashboard/page.tsx` - Dashboard page
12. `.env.local` - Environment variables (local)
13. `.env.example` - Environment template

### Modified Files (1 total)

1. `app/layout.tsx` - Add AuthProvider wrapper

### Configuration Files

1. Firestore security rules (set in Firebase Console)
2. Firebase Authentication settings (Google OAuth enabled)
