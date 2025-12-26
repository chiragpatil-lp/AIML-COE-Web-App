# Firebase Authentication - Complete Setup Guide

**Last Updated**: December 26, 2024
**Status**: ✅ Implemented and Tested
**Branch**: `feat/firebase-auth-implementation`

---

## Table of Contents

1. [Overview](#overview)
2. [What Has Been Implemented](#what-has-been-implemented)
3. [Firebase Console Configuration](#firebase-console-configuration)
4. [Local Development Setup](#local-development-setup)
5. [Testing the Implementation](#testing-the-implementation)
6. [Making Your First Admin User](#making-your-first-admin-user)
7. [Architecture & Technical Details](#architecture--technical-details)
8. [Troubleshooting](#troubleshooting)
9. [Deployment to Production](#deployment-to-production)
10. [Next Phase (Phase 2)](#next-phase-phase-2)

---

## Overview

This document provides a complete record of the Firebase Authentication implementation for the AIML COE Web App. It includes:

- **Google OAuth** sign-in integration
- **Firestore-based permissions** system for 6 strategic pillars
- **Admin role** with full access
- **Client-side authentication** with React Context
- **Protected routes** and dashboard

### Key Information

- **Firebase Project**: `search-ahmed` (shared project)
- **Firestore Database**: `aiml-coe-web-app` (named database for isolation)
- **Edition**: Standard
- **Region**: `us-central1`
- **Authentication Method**: Google OAuth (popup flow)

---

## What Has Been Implemented

### ✅ Core Features

1. **Firebase SDK v12.7.0** with modular imports
2. **Google OAuth Sign-In** with popup authentication
3. **Firestore Permission System** storing user access per pillar
4. **6 Strategic Pillar Access Control**:
   - Pillar 1: Strategy & Value Realization
   - Pillar 2: Innovation & IP Development
   - Pillar 3: Platforms & Engineering
   - Pillar 4: People & Capability Enablement
   - Pillar 5: COE Delivery Governance
   - Pillar 6: Communication & Market Intelligence
5. **Admin Role System** (admins have access to all pillars)
6. **Protected Dashboard** with pillar grid
7. **Responsive Sign-In Page** with Google branding
8. **Toast Notifications** for user feedback (using Sonner)
9. **SSR-Safe Configuration** (client-side only Firebase initialization)

### 📁 Files Created (13 files)

```
frontend/
├── .env.example                          # Environment template
├── .env.local                           # Local environment (gitignored)
├── lib/
│   ├── firebase/
│   │   └── config.ts                    # Firebase init (uses aiml-coe-web-app DB)
│   └── types/
│       └── auth.types.ts                # TypeScript interfaces
├── contexts/
│   └── AuthContext.tsx                  # Auth state management
├── components/
│   ├── auth/
│   │   ├── SignInButton.tsx            # Google OAuth button
│   │   └── SignOutButton.tsx           # Sign-out button
│   └── dashboard/
│       └── PillarGrid.tsx              # 6-pillar access grid
├── app/
│   ├── auth/
│   │   └── signin/
│   │       └── page.tsx                # Sign-in page
│   ├── dashboard/
│   │   └── page.tsx                    # Protected dashboard
│   └── layout.tsx                      # Updated with AuthProvider
└── middleware.ts                        # Route protection
```

### 📦 Dependencies Added

- `firebase@12.7.0` - Firebase SDK (Authentication + Firestore)

---

## Firebase Console Configuration

### Step 1: Access Firebase Console

**URL**: https://console.firebase.google.com/project/search-ahmed

You need Firebase Admin permissions on the `search-ahmed` GCP project.

### Step 2: Enable Google Authentication

1. Navigate to **Authentication** → **Sign-in method**
2. Click **Google** provider
3. Toggle to **Enable**
4. Set **Support Email**: `chirag.patil@onixnet.com` (or your email)
5. Click **Save**

✅ **Result**: Google OAuth is now enabled for the project

### Step 3: Register Web Application

1. Go to **Project Overview** (gear icon → Project settings)
2. Scroll to **Your apps** section
3. Click the **Web** icon (`</>`)
4. Register app with nickname: `AIML COE Web App`
5. Copy the Firebase configuration object

**Example Configuration** (replace with your actual values):
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

⚠️ **Security Note**: These credentials are safe to expose in client-side code. Firebase security is enforced via Firestore security rules and Authentication settings.

### Step 4: Create Firestore Database

1. Navigate to **Firestore Database**
2. Click **Create database**
3. Select **Start in production mode**
4. Configuration:
   - **Database ID**: `aiml-coe-web-app` ← **Important: Named database for isolation**
   - **Edition**: Standard (recommended for this use case)
   - **Location**: `us-central1` (or your preferred region)
5. Click **Enable**
6. Wait 30-60 seconds for provisioning

✅ **Result**: Firestore database `aiml-coe-web-app` created in Standard edition

**Why Named Database?**
- The `search-ahmed` project is shared across multiple applications
- Using `aiml-coe-web-app` instead of `(default)` prevents conflicts
- Each app can have its own isolated database

### Step 5: Set Firestore Security Rules

⚠️ **Critical**: This step is required for the app to work!

1. Go to **Firestore Database** → **Rules** tab
2. **Delete all existing rules**
3. **Paste the following**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /userPermissions/{userId} {
      // Users can read their own permissions
      allow read: if request.auth != null && request.auth.uid == userId;

      // Users can CREATE their own document on first sign-in
      // BUT cannot give themselves admin or pillar access
      allow create: if request.auth != null &&
                       request.auth.uid == userId &&
                       request.resource.data.isAdmin == false &&
                       request.resource.data.pillars.pillar1 == false &&
                       request.resource.data.pillars.pillar2 == false &&
                       request.resource.data.pillars.pillar3 == false &&
                       request.resource.data.pillars.pillar4 == false &&
                       request.resource.data.pillars.pillar5 == false &&
                       request.resource.data.pillars.pillar6 == false;

      // Only admins can UPDATE or DELETE existing documents
      allow update, delete: if request.auth != null &&
                               request.auth.token.admin == true;
    }

    // Admins can read all user permissions
    match /userPermissions/{document=**} {
      allow read: if request.auth != null &&
                     request.auth.token.admin == true;
    }
  }
}
```

4. Click **Publish**

✅ **Result**: Security rules enforce permission-based access

**Security Rules Explanation**:
- **`read`**: Users can read their own permissions document
- **`create`**: New users can create their document with all permissions set to `false`
- **`update/delete`**: Only admins (via custom claims) can modify permissions
- **Validation**: The `create` rule ensures users can't grant themselves access

### Step 6: Configure Authorized Domains

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Verify `localhost` is listed (should be by default)
3. For production, add:
   - `aiml-coe-web-app-36231825761.us-central1.run.app`
   - Any custom domains

✅ **Result**: OAuth popups will work on authorized domains

---

## Local Development Setup

### Step 1: Environment Variables

The `.env.local` file has already been created with the Firebase configuration:

**Location**: `frontend/.env.local`

```bash
# Firebase Configuration (replace with your actual values from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Pillar Application URLs (configure when ready)
NEXT_PUBLIC_PILLAR_1_URL=
NEXT_PUBLIC_PILLAR_2_URL=
NEXT_PUBLIC_PILLAR_3_URL=
NEXT_PUBLIC_PILLAR_4_URL=
NEXT_PUBLIC_PILLAR_5_URL=
NEXT_PUBLIC_PILLAR_6_URL=
```

⚠️ **Note**: `.env.local` is in `.gitignore` and will not be committed

### Step 2: Install Dependencies

```bash
cd frontend
pnpm install
```

Firebase SDK (v12.7.0) is already in `package.json`.

### Step 3: Start Development Server

```bash
pnpm dev
```

Server will start at: http://localhost:3000

---

## Testing the Implementation

### Test 1: Sign-In Flow

1. **Navigate to**: http://localhost:3000/auth/signin
2. **Verify you see**:
   - "AIML COE" title with gradient effect
   - "Welcome" card
   - "Sign in with Google" button with Google logo
3. **Click**: "Sign in with Google"
4. **Verify**: Google OAuth popup appears
5. **Select**: Your Google account
6. **Grant**: Permissions if prompted
7. **Verify**: Popup closes automatically

### Test 2: Dashboard Access

1. **Navigate manually to**: http://localhost:3000/dashboard
2. **Verify you see**:
   - Welcome message with your name
   - Your email address
   - "Sign Out" button (top right)
   - Grid of 6 Strategic Pillars with descriptions

3. **Verify pillar badges**:
   - All pillars show **"Access not granted"** badge (gray)
   - This is expected for new users!

### Test 3: Firestore Document Creation

1. **Go to**: Firebase Console → Firestore Database → Data tab
2. **Navigate to**: `userPermissions` collection
3. **Verify your document exists**:
   - Document ID: Your user ID (e.g., `I1MmPgyzZwaij1mH3aAgPHwvk8c2`)
   - Fields:
     ```
     userId: "I1MmPgyzZwaij1mH3aAgPHwvk8c2"
     email: "chirag.patil@onixnet.com"
     isAdmin: false
     pillars: {
       pillar1: false,
       pillar2: false,
       pillar3: false,
       pillar4: false,
       pillar5: false,
       pillar6: false
     }
     createdAt: (timestamp)
     updatedAt: (timestamp)
     ```

✅ **All tests passing = Authentication is working!**

---

## Making Your First Admin User

New users have no pillar access by default. To grant yourself admin access:

### Step 1: Find Your User Document

1. **Firebase Console** → **Firestore Database** → **Data** tab
2. Click **`userPermissions`** collection
3. Click your document (user ID from testing above)

### Step 2: Edit isAdmin Field

1. Find the **`isAdmin`** field (currently: `false`)
2. **Click on `false`** to edit
3. Change to: **`true`**
4. Press **Enter** or click the **checkmark** to save

### Step 3: Refresh Authentication

1. In the web app, click **"Sign Out"** button
2. Navigate to: http://localhost:3000/auth/signin
3. Click **"Sign in with Google"** again
4. Navigate to: http://localhost:3000/dashboard

### Step 4: Verify Admin Access

**You should now see**:
- **Green "Administrator" badge** next to your email
- All 6 pillars showing **"Admin Access" badge** (green)
- All pillars are clickable (if URLs are configured)

✅ **You now have full admin access to all strategic pillars!**

**Admin Access Logic**:
- When `isAdmin: true`, user has access to ALL pillars automatically
- Individual pillar permissions (`pillar1`, `pillar2`, etc.) are only checked for non-admin users
- See `AuthContext.tsx:119-124` for the `hasAccessToPillar` function

---

## Architecture & Technical Details

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User visits /auth/signin                                 │
│ 2. Clicks "Sign in with Google" button                      │
│ 3. Firebase opens Google OAuth popup                        │
│ 4. User authenticates with Google account                   │
│ 5. Firebase creates/updates user in Firebase Auth           │
│ 6. AuthContext.useEffect triggered (onAuthStateChanged)     │
│ 7. fetchPermissions() queries Firestore                     │
│ 8. If no document exists, create default (all false)        │
│ 9. If document exists, load permissions into React state    │
│ 10. User navigates to /dashboard (manually for now)         │
│ 11. Dashboard renders with accessible pillars highlighted   │
└─────────────────────────────────────────────────────────────┘
```

### Permission System

**Firestore Collection**: `userPermissions/{userId}`

**Document Structure**:
```typescript
interface UserPermissions {
  userId: string;              // Firebase Auth UID
  email: string;               // User's email from Google
  isAdmin: boolean;            // Admin flag (grants all access)
  pillars: {
    pillar1: boolean;          // Strategy & Value Realization
    pillar2: boolean;          // Innovation & IP Development
    pillar3: boolean;          // Platforms & Engineering
    pillar4: boolean;          // People & Capability Enablement
    pillar5: boolean;          // COE Delivery Governance
    pillar6: boolean;          // Communication & Market Intelligence
  };
  createdAt: Date;             // Document creation timestamp
  updatedAt: Date;             // Last update timestamp
}
```

### Code Architecture

**Key Files and Their Responsibilities**:

1. **`lib/firebase/config.ts`**:
   - Initializes Firebase app (singleton pattern)
   - Connects to `aiml-coe-web-app` Firestore database
   - Only initializes in browser (SSR-safe with `typeof window !== 'undefined'`)
   - Gracefully handles missing environment variables

2. **`contexts/AuthContext.tsx`**:
   - Global authentication state (React Context)
   - Listens to `onAuthStateChanged` for auth state
   - Fetches/creates user permissions from Firestore
   - Provides `signInWithGoogle()`, `signOut()`, `hasAccessToPillar()` functions
   - Exports `useAuth()` hook for components

3. **`components/auth/SignInButton.tsx`**:
   - Renders Google OAuth button
   - Calls `signInWithGoogle()` from AuthContext
   - Shows toast notifications on success/error

4. **`components/dashboard/PillarGrid.tsx`**:
   - Displays 6 strategic pillars in a grid
   - Checks `hasAccessToPillar(number)` for each pillar
   - Renders badges: "Access not granted", "Authorized", or "Admin Access"
   - Opens pillar URLs in new tab when clicked (if accessible and URL configured)

5. **`app/dashboard/page.tsx`**:
   - Protected route (redirects to /auth/signin if not authenticated)
   - Shows loading spinner while auth state is being determined
   - Displays user info and PillarGrid component

6. **`middleware.ts`**:
   - Next.js middleware for basic route protection
   - Allows public routes (/auth/signin, /, /api)
   - Client-side AuthContext handles actual authentication

### Security Features

✅ **Client-side authentication** with Firebase SDK
✅ **Firestore security rules** enforce read/write permissions
✅ **Environment variables** protect sensitive config (but safe to expose in client)
✅ **HTTPS-only** (enforced by Cloud Run in production)
✅ **OAuth scopes** limited to `profile` and `email`
✅ **Self-registration protection**: Users can create their own document but can't grant themselves permissions
✅ **Admin-only updates**: Only admins (via custom claims) can modify permissions

### TypeScript Type Safety

All authentication state, user data, and permissions are fully typed:

- `User` - Firebase Auth user object
- `UserPermissions` - Firestore permission document
- `AuthContextType` - Auth context interface
- `PillarInfo` - Pillar configuration object

See `lib/types/auth.types.ts` for all type definitions.

---

## Troubleshooting

### Issue: "Missing or insufficient permissions" (Firestore)

**Cause**: Security rules don't allow the operation

**Solution**:
1. Verify you updated Firestore security rules (Step 5 above)
2. Check the rules include the `allow create:` block for new users
3. Click "Publish" in Firebase Console after updating rules

---

### Issue: Sign-in succeeds but stays on sign-in page

**Cause**: Auto-redirect not implemented yet

**Solution**:
- Manually navigate to http://localhost:3000/dashboard
- This is expected behavior in current implementation
- Auto-redirect will be added in a future update

---

### Issue: "Firebase: Error (auth/popup-blocked)"

**Cause**: Browser is blocking popups

**Solution**:
- Allow popups for `localhost:3000`
- Check browser settings → Site settings → Popups
- Alternative: Use redirect flow instead of popup (requires code change)

---

### Issue: "Firebase: Error (auth/unauthorized-domain)"

**Cause**: Domain not in authorized domains list

**Solution**:
1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add the domain where the error occurred
3. For localhost: Should already be there by default

---

### Issue: Build fails with Firebase error

**Cause**: Firebase trying to initialize during SSR/build without env vars

**Solution**:
- The code is designed to handle this gracefully
- Check `lib/firebase/config.ts` - should have `typeof window !== 'undefined'` check
- Build should succeed even without Firebase config
- Verify you're on the latest commit of `feat/firebase-auth-implementation` branch

---

### Issue: Pillars clickable but nothing happens

**Cause**: Pillar URLs not configured in environment

**Solution**:
1. Open `frontend/.env.local`
2. Set pillar URLs:
   ```bash
   NEXT_PUBLIC_PILLAR_1_URL=https://your-pillar1-domain.com
   NEXT_PUBLIC_PILLAR_2_URL=https://your-pillar2-domain.com
   # ... etc
   ```
3. Restart dev server: `pnpm dev`

---

### Issue: User document not created in Firestore

**Cause**: Security rules too restrictive

**Solution**:
1. Check Firestore rules include the `allow create:` block
2. Verify user is authenticated (check browser console)
3. Sign out and sign in again
4. Check browser console for specific error messages

---

## Deployment to Production

### Step 1: GitHub Secrets

Add these secrets to your GitHub repository:

**Navigate to**: GitHub Repository → Settings → Secrets and variables → Actions

**Add these secrets** (click "New repository secret"):

```
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

### Step 2: Update GitHub Actions Workflow

**File**: `.github/workflows/main.yml`

The workflow should inject Firebase environment variables during build. Example:

```yaml
- name: Build
  env:
    NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
    NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
  run: |
    cd frontend
    pnpm install
    pnpm build
```

### Step 3: Add Production Domain to Firebase

1. **Firebase Console** → **Authentication** → **Settings** → **Authorized domains**
2. Click **Add domain**
3. Enter: `aiml-coe-web-app-36231825761.us-central1.run.app`
4. Click **Add**

### Step 4: Merge and Deploy

```bash
# Ensure all changes are committed
git status

# Switch to main branch
git checkout main

# Merge feature branch
git merge feat/firebase-auth-implementation

# Push to trigger deployment
git push origin main
```

### Step 5: Verify Production Deployment

1. **Wait for GitHub Actions** to complete
2. **Visit**: https://aiml-coe-web-app-36231825761.us-central1.run.app/auth/signin
3. **Test sign-in flow** (same as local testing)
4. **Verify Firestore** documents are created in `aiml-coe-web-app` database

---

## Next Phase (Phase 2)

### Planned Features

#### 1. Admin Panel (`/app/admin/users/page.tsx`)
- List all users from Firestore
- Search and filter users
- Toggle pillar access per user (toggle switches)
- Edit user permissions without Firestore Console
- Audit log for permission changes

#### 2. Auto-Redirect After Sign-In
- Redirect to dashboard automatically after successful sign-in
- Remember intended destination (redirect to originally requested page)

#### 3. Cloud Functions for Custom Claims
- Deploy Firebase Cloud Function
- Set admin custom claims on user JWT
- More secure than Firestore-only admin checks
- Only callable by existing admins

#### 4. Enhanced Permissions
- Section-level permissions within pillars
- Permission groups/roles (e.g., "Data Team" role)
- Time-based access (temporary permissions with expiration)
- Approval workflow (users request access, admins approve)

#### 5. Email Notifications
- Email when permissions are granted
- Email when permissions are revoked
- Weekly digest of permission changes (for admins)

---

## Testing Checklist

### ✅ Phase 1 - Basic Authentication (COMPLETED)

- [x] Firebase config loads without errors
- [x] Sign-in page displays correctly
- [x] Google Sign-in button appears with Google logo
- [x] Click sign-in opens OAuth popup
- [x] Successfully sign in with Google account
- [x] User document auto-created in Firestore
- [x] Dashboard shows user name and email
- [x] Pillar grid shows all 6 pillars with descriptions
- [x] All pillars show "Access not granted" for new user
- [x] Sign out works correctly

### ✅ Phase 1 - Admin Access (COMPLETED)

- [x] Manually set `isAdmin: true` in Firestore
- [x] Sign out and sign back in
- [x] Dashboard shows "Administrator" badge
- [x] All pillars show "Admin Access" badge (green)
- [x] All pillars are clickable (if URLs configured)

### 🔄 Phase 1 - Additional Testing (Optional)

- [ ] Manually set `pillar1: true` for non-admin user
- [ ] Verify Pillar 1 shows "Authorized" badge
- [ ] Verify other pillars show "Access not granted"
- [ ] Test sign-in with multiple Google accounts
- [ ] Test sign-in on different browsers

---

## Summary

✅ **Firebase Authentication is fully implemented and tested**

**Current State**:
- Branch: `feat/firebase-auth-implementation` (3 commits)
- Firebase Project: `search-ahmed`
- Firestore Database: `aiml-coe-web-app` (Standard, us-central1)
- Test User: chirag.patil@onixnet.com (admin)
- Status: Ready for production deployment

**Key Achievements**:
- Self-service user registration with safe defaults
- Permission-based pillar access control
- Admin role with full access
- Firestore security rules enforcing permissions
- SSR-safe Firebase initialization
- Full TypeScript type safety

**Next Steps**:
1. Merge to `main` branch (when ready)
2. Deploy to Cloud Run production
3. Add more admin users via Firestore Console
4. Plan Phase 2 features (admin panel, auto-redirect, etc.)

---

**Document Prepared By**: Claude Code
**Last Reviewed**: December 26, 2024
**Maintained By**: AIML COE Team
