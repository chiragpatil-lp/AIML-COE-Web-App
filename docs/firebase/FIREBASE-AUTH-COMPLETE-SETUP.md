# Firebase Authentication - Complete Setup Guide

**Last Updated**: January 21, 2026
**Status**: ✅ Implemented, Deployed, and Production-Ready
**Branch**: `main` (merged and deployed)

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

### ✅ Core Features (Production)

1. **Firebase SDK v12.7.0** with modular imports
2. **Google OAuth Sign-In** with popup authentication and auto-redirect to dashboard
3. **Firestore Permission System** with user access control per pillar
4. **6 Strategic Pillar Access Control**:
   - Pillar 1: Strategy & Value Realization
   - Pillar 2: Innovation & IP Development
   - Pillar 3: Platforms & Engineering
   - Pillar 4: People & Capability Enablement
   - Pillar 5: COE Delivery Governance
   - Pillar 6: Communication & Market Intelligence
5. **Admin Role System** with custom claims and Firestore-based permissions
6. **Admin Panel** (`/admin`) - Full user management dashboard with:
   - View all users and their permissions
   - Edit user permissions (pillar access)
   - Toggle admin status with custom claims
   - Add users by email (pending permissions)
   - Delete users completely
   - Real-time permission updates
7. **Protected Dashboard** (`/dashboard`) with pillar grid
8. **Responsive Sign-In Page** (`/auth/signin`) with Google branding
9. **Toast Notifications** for user feedback (using Sonner)
10. **SSR-Safe Configuration** (client-side only Firebase initialization)
11. **Session Management** with secure HttpOnly cookies
12. **Token Refresh** mechanism (automatic every 50 minutes)
13. **Pillar SSO Integration** with token forwarding via API routes

### 📁 Key Files and Architecture

```
frontend/
├── .env.example                                    # Environment template
├── lib/
│   ├── firebase/
│   │   ├── config.ts                              # Firebase client init (aiml-coe-web-app DB)
│   │   ├── admin.ts                               # Firebase Admin SDK server-side
│   │   ├── permissions.ts                         # Permission validation utilities
│   │   └── user-management.ts                     # User CRUD operations
│   └── types/
│       └── auth.types.ts                          # TypeScript interfaces
├── contexts/
│   └── AuthContext.tsx                            # Global auth state management
├── components/
│   ├── auth/
│   │   ├── SignInButton.tsx                       # Google OAuth button
│   │   └── SignOutButton.tsx                      # Sign-out button
│   ├── admin/
│   │   ├── AddUserDialog.tsx                      # Add user by email
│   │   ├── EditUserPermissionsDialog.tsx          # Edit permissions modal
│   │   ├── DeleteUserDialog.tsx                   # Delete user confirmation
│   │   └── DebugAdminStatus.tsx                   # Admin status debug tool
│   └── dashboard/
│       └── PillarGrid.tsx                         # 6-pillar access grid
├── app/
│   ├── auth/
│   │   └── signin/
│   │       └── page.tsx                           # Sign-in page
│   ├── dashboard/
│   │   └── page.tsx                               # Protected dashboard
│   ├── admin/
│   │   └── page.tsx                               # Admin user management panel
│   ├── profile/
│   │   └── page.tsx                               # User profile page
│   ├── api/
│   │   ├── auth/
│   │   │   ├── session/route.ts                   # Session cookie management
│   │   │   └── initialize-user/route.ts           # User initialization fallback
│   │   ├── admin/
│   │   │   ├── set-admin-claim/route.ts           # Set admin custom claim
│   │   │   ├── update-permissions/route.ts        # Update pillar permissions
│   │   │   └── delete-user/route.ts               # Delete user endpoint
│   │   └── pillar/
│   │       └── [id]/route.ts                      # Pillar SSO redirect
│   └── layout.tsx                                 # Root layout with AuthProvider

functions/
└── src/
    └── index.ts                                   # Cloud Functions (Gen 2)
        ├── onUserCreate                           # Auto-create permissions on signup
        ├── setAdminClaim                          # Set admin custom claim (deprecated)
        ├── updateUserPermissions                  # Update permissions (deprecated)
        ├── getUserPermissions                     # Get permissions (deprecated)
        └── initializeUser                         # Manual user init (fallback)
```

**Note**: Most Cloud Functions are deprecated in favor of Next.js API routes for better integration and performance. Only `onUserCreate` (identity trigger) and `initializeUser` (fallback) are actively used.

### 📦 Dependencies

- `firebase@12.7.0` - Firebase Client SDK (Authentication + Firestore)
- `firebase-admin@13.6.0` - Firebase Admin SDK (Frontend API routes)
- `firebase-admin@12.0.0` - Firebase Admin SDK (Cloud Functions)
- `firebase-functions@6.1.1` - Cloud Functions SDK (Gen 2)

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
  appId: "YOUR_APP_ID",
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
2. **Select database**: `aiml-coe-web-app` from the dropdown
3. **Delete all existing rules**
4. **Paste the following**:

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

5. Click **Publish**

✅ **Result**: Security rules enforce permission-based access

**Security Rules Explanation**:

- **`read`**: Users can read their own permissions; admins can read all permissions (by checking Firestore document)
- **`write`**: Only admins can create, update, or delete permission documents
- **Admin Check**: Uses the `isAdmin()` helper function that reads the user's own permissions document to verify admin status

**Important Note**: The current rules use Firestore document lookup for admin verification. This means:
- Each admin operation requires an extra Firestore read (to check admin status)
- This is within the free tier limits for typical usage
- Alternative approach using custom claims (`request.auth.token.admin`) is available in `firestore.rules.backup` but not currently deployed

**How New Users Get Permissions**:

Since users cannot self-register (no `allow create` for non-admins), new user permissions are created by:
- The `onUserCreate` Cloud Function (automatic on first sign-in)
- The `/api/auth/initialize-user` API route (fallback)
- Admin panel "Add User" feature (pre-authorization)

### Step 6: Configure Authorized Domains

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Verify `localhost` is listed (should be by default)
3. For production, add your Cloud Run domain:
   - `aiml-coe-web-app-[project-id].us-central1.run.app`
   - Any custom domains (if configured)

✅ **Result**: OAuth popups will work on authorized domains

### Step 7: Deploy Cloud Functions

Cloud Functions are required for automatic user initialization on first sign-in.

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Navigate to functions directory**:
   ```bash
   cd functions
   npm install
   ```

4. **Build and deploy**:
   ```bash
   npm run build
   firebase deploy --only functions
   ```

**Deployed Functions**:
- `onUserCreate` - Creates default permissions for new users (identity trigger)
- `initializeUser` - Fallback for manual user initialization (callable)
- ~~`setAdminClaim`~~ - Deprecated (use Next.js API route)
- ~~`updateUserPermissions`~~ - Deprecated (use Next.js API route)
- ~~`getUserPermissions`~~ - Deprecated (use Next.js API route)

**Note**: Most Cloud Functions have been replaced with Next.js API routes for better performance and integration. Only identity triggers remain in Cloud Functions.

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

# Firebase Admin SDK (for API routes - optional for local dev)
FIREBASE_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Alternative: Legacy service account JSON (deprecated)
# FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

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
   - "AIML COE" title
   - "Welcome" card
   - "Sign in with Google" button with Google logo
3. **Click**: "Sign in with Google"
4. **Verify**: Google OAuth popup appears
5. **Select**: Your Google account
6. **Grant**: Permissions if prompted
7. **Verify**: 
   - Popup closes automatically
   - **Auto-redirects to dashboard** at http://localhost:3000/dashboard

### Test 2: Dashboard Access

After successful sign-in, you should automatically be on the dashboard:

1. **Verify you see**:
   - Welcome message with your name
   - Your email address
   - "Profile" button (top right)
   - "Sign Out" button (top right)
   - Grid of 6 Strategic Pillars with descriptions and images

2. **Verify pillar badges**:
   - All pillars show **"Access not granted"** badge (gray)
   - This is expected for new users!

3. **If you're an admin**:
   - "Admin Panel" button appears in the header
   - All pillars show **"Admin Access"** badge (green)

### Test 3: Firestore Document Creation

1. **Go to**: Firebase Console → Firestore Database → Data tab
2. **Select database**: `aiml-coe-web-app` from dropdown
3. **Navigate to**: `userPermissions` collection
4. **Verify your document exists**:
   - Document ID: Your user ID (e.g., `I1MmPgyzZwaij1mH3aAgPHwvk8c2`)
   - Fields:
     ```
     userId: "I1MmPgyzZwaij1mH3aAgPHwvk8c2"
     email: "user@example.com"
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

### Test 4: Admin Panel (Admin Users Only)

If you have admin access:

1. **Click**: "Admin Panel" button in dashboard header
2. **Verify you see**:
   - User management table with all users
   - Search functionality
   - "Add User" button
   - Action buttons (Edit, Delete) for each user
   - Summary cards showing access statistics

3. **Test user management**:
   - Click "Edit" on a user to modify permissions
   - Toggle pillar access switches
   - Toggle admin status
   - Save changes and verify they persist

✅ **All tests passing = Authentication is fully functional!**

---

## Making Your First Admin User

New users have no pillar access by default. To grant yourself or others admin access, you have two options:

### Option 1: Via Firestore Console (Manual)

1. **Firebase Console** → **Firestore Database** → **Data** tab
2. **Select database**: `aiml-coe-web-app` from dropdown
3. Click **`userPermissions`** collection
4. Click the user document you want to make admin
5. Find the **`isAdmin`** field (currently: `false`)
6. **Click on `false`** to edit
7. Change to: **`true`**
8. Press **Enter** or click the **checkmark** to save

### Option 2: Via Admin Panel (Recommended)

If you already have at least one admin user:

1. **Sign in** as an admin
2. **Navigate to**: http://localhost:3000/admin
3. **Search** for the user you want to make admin
4. **Click** the "Edit" button (pencil icon)
5. **Toggle** the "Admin Role" switch to ON
6. **Click** "Save Changes"

The admin panel will:
- Update the Firestore `isAdmin` field
- Set the `admin` custom claim on the user's JWT token
- Log the change in the audit log

### Applying Admin Changes

After setting `isAdmin: true`:

1. The user must **Sign Out** and **Sign In** again
2. Navigate to: http://localhost:3000/dashboard
3. Verify:
   - **"Admin Panel" button** appears in the header
   - All 6 pillars show **"Admin Access" badge** (green)
   - All pillars are clickable (if URLs are configured)

**Admin Access Logic**:

- When `isAdmin: true`, user has access to ALL pillars automatically
- Individual pillar permissions (`pillar1`, `pillar2`, etc.) are only checked for non-admin users
- See [AuthContext.tsx#L313-L318](../frontend/contexts/AuthContext.tsx) for the `hasAccessToPillar` function

---

## Architecture & Technical Details

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. User visits /auth/signin                                         │
│ 2. Clicks "Sign in with Google" button                              │
│ 3. Firebase opens Google OAuth popup                                │
│ 4. User authenticates with Google account                           │
│ 5. Firebase creates/updates user in Firebase Auth                   │
│ 6. Cloud Function onUserCreate triggered (for new users)            │
│ 7. Default permissions document created in Firestore                │
│ 8. AuthContext.useEffect triggered (onAuthStateChanged)             │
│ 9. Session cookie created via /api/auth/session                     │
│ 10. fetchPermissions() queries Firestore                            │
│ 11. If no document exists, calls /api/auth/initialize-user          │
│ 12. User auto-redirected to /dashboard                              │
│ 13. Dashboard renders with accessible pillars highlighted           │
│ 14. Token refreshed automatically every 50 minutes                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Admin Panel Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. Admin user navigates to /admin                                   │
│ 2. AuthContext verifies isAdmin = true                              │
│ 3. getAllUserPermissions() fetches all users from Firestore         │
│ 4. Admin can:                                                        │
│    a. Search/filter users                                           │
│    b. Edit permissions via EditUserPermissionsDialog                │
│    c. Toggle admin status via /api/admin/set-admin-claim            │
│    d. Update pillar access via /api/admin/update-permissions        │
│    e. Delete user via /api/admin/delete-user                        │
│ 5. Changes trigger Firestore updates + audit logging                │
│ 6. User must re-authenticate to see permission changes              │
└─────────────────────────────────────────────────────────────────────┘
```

### Pillar SSO Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. User clicks on accessible pillar in dashboard                    │
│ 2. PillarGrid.handlePillarClick() invoked                           │
│ 3. Fresh ID token obtained from Firebase (force refresh)            │
│ 4. Opens /api/pillar/[id]?token=<idToken> in new tab               │
│ 5. API route verifies token server-side                             │
│ 6. API route checks user permissions for that pillar                │
│ 7. If authorized, redirects to pillar app with token                │
│ 8. Pillar app receives and validates token                          │
│ 9. Pillar app grants access based on token claims                   │
└─────────────────────────────────────────────────────────────────────┘
```

### Permission System

**Firestore Collection**: `userPermissions/{userId}`

**Document Structure**:

```typescript
interface UserPermissions {
  userId: string; // Firebase Auth UID
  email: string; // User's email from Google
  isAdmin: boolean; // Admin flag (grants all access)
  pillars: {
    pillar1: boolean; // Strategy & Value Realization
    pillar2: boolean; // Innovation & IP Development
    pillar3: boolean; // Platforms & Engineering
    pillar4: boolean; // People & Capability Enablement
    pillar5: boolean; // COE Delivery Governance
    pillar6: boolean; // Communication & Market Intelligence
  };
  createdAt: Date; // Document creation timestamp
  updatedAt: Date; // Last update timestamp
}
```

### Code Architecture

**Key Files and Their Responsibilities**:

1. **[frontend/lib/firebase/config.ts](../../frontend/lib/firebase/config.ts)**:
   - Initializes Firebase client SDK (singleton pattern)
   - Connects to `aiml-coe-web-app` Firestore database
   - Only initializes in browser (SSR-safe with `typeof window !== 'undefined'`)
   - Gracefully handles missing environment variables

2. **[frontend/lib/firebase/admin.ts](../../frontend/lib/firebase/admin.ts)**:
   - Server-side Firebase Admin SDK initialization
   - Verifies ID tokens and session cookies
   - Checks admin status from Firestore
   - Used by API routes for privileged operations

3. **[frontend/lib/firebase/permissions.ts](../../frontend/lib/firebase/permissions.ts)**:
   - Type guards for validating permissions data
   - Firestore Timestamp conversion utilities
   - Ensures type safety across client and server

4. **[frontend/lib/firebase/user-management.ts](../../frontend/lib/firebase/user-management.ts)**:
   - Client-side user management functions
   - Fetches all users (admin only)
   - Updates permissions via API routes
   - Calculates pillar access statistics

5. **[frontend/contexts/AuthContext.tsx](../../frontend/contexts/AuthContext.tsx)**:
   - Global authentication state (React Context)
   - Listens to `onAuthStateChanged` for auth state
   - Fetches/creates user permissions from Firestore with retry logic
   - Manages session cookies via API routes
   - Automatic token refresh every 50 minutes
   - Provides `signInWithGoogle()`, `signOut()`, `hasAccessToPillar()` functions
   - Exports `useAuth()` hook for components

6. **[frontend/components/auth/SignInButton.tsx](../../frontend/components/auth/SignInButton.tsx)**:
   - Renders Google OAuth button
   - Calls `signInWithGoogle()` from AuthContext
   - Auto-redirects to dashboard on success
   - Shows toast notifications on error

7. **[frontend/components/dashboard/PillarGrid.tsx](../../frontend/components/dashboard/PillarGrid.tsx)**:
   - Displays 6 strategic pillars in a grid with images
   - Checks `hasAccessToPillar(number)` for each pillar
   - Renders badges: "Access not granted", "Authorized", or "Admin Access"
   - Handles pillar clicks with token-based SSO flow
   - Opens pillar URLs via `/api/pillar/[id]` with fresh token

8. **[frontend/app/dashboard/page.tsx](../../frontend/app/dashboard/page.tsx)**:
   - Protected route (redirects to /auth/signin if not authenticated)
   - Shows loading spinner while auth state is being determined
   - Displays user info, PillarGrid, and navigation buttons
   - "Admin Panel" button for admin users

9. **[frontend/app/admin/page.tsx](../../frontend/app/admin/page.tsx)**:
   - Admin-only user management dashboard
   - Displays all users in sortable table
   - Search and filter functionality
   - Edit, add, and delete user operations
   - Real-time permission updates

10. **[frontend/app/api/auth/session/route.ts](../../frontend/app/api/auth/session/route.ts)**:
    - Creates and manages HttpOnly session cookies
    - Verifies Firebase ID tokens server-side
    - Handles cookie expiration and refresh

11. **[frontend/app/api/admin/set-admin-claim/route.ts](../../frontend/app/api/admin/set-admin-claim/route.ts)**:
    - Sets admin custom claims on user JWT tokens
    - Updates Firestore permissions document
    - Logs changes to audit log collection
    - Admin-only endpoint

12. **[frontend/app/api/admin/update-permissions/route.ts](../../frontend/app/api/admin/update-permissions/route.ts)**:
    - Updates pillar permissions for users
    - Validates permission data structure
    - Logs changes to audit log
    - Admin-only endpoint

13. **[frontend/app/api/pillar/[id]/route.ts](../../frontend/app/api/pillar/[id]/route.ts)**:
    - Verifies user token server-side
    - Checks user has access to requested pillar
    - Redirects to pillar app with validated token
    - Implements SSO integration

14. **[functions/src/index.ts](../../functions/src/index.ts)**:
    - Cloud Functions for Firebase (Gen 2)
    - `onUserCreate`: Auto-creates permissions on new user signup (identity trigger)
    - `initializeUser`: Fallback for manual user initialization (callable)
    - Checks for pending permissions by email (pre-provisioning support)
    - Deprecated callable functions (replaced by Next.js API routes)

### Security Features

✅ **Client-side authentication** with Firebase SDK
✅ **Firestore security rules** enforce read/write permissions based on admin status
✅ **Server-side token verification** for all API routes using Firebase Admin SDK
✅ **HttpOnly session cookies** for secure session management
✅ **Custom claims** for admin role (JWT-based)
✅ **Automatic token refresh** every 50 minutes to prevent expiration
✅ **Environment variables** protect sensitive config (though client keys are safe to expose)
✅ **HTTPS-only** (enforced by Cloud Run in production)
✅ **OAuth scopes** limited to `profile` and `email`
✅ **Admin-only modifications**: Only admins can create/update/delete user permissions
✅ **Audit logging**: All admin actions logged to `adminAuditLog` collection
✅ **Pending permissions**: Pre-provision users by email before they sign up
✅ **SSR-safe initialization**: Firebase only initializes client-side
✅ **No middleware dependency**: Route protection handled by AuthContext + API routes

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

**Cause**: Security rules don't allow the operation or Cloud Function hasn't run

**Solution**:

1. Verify Firestore security rules are deployed:
   - Firebase Console → Firestore Database → Rules tab
   - Check rules match the current implementation (admin-only writes)
   - Click "Publish" if rules were updated

2. Check if Cloud Function `onUserCreate` is deployed:
   ```bash
   firebase functions:list
   ```
   - Should see `onUserCreate` in the list
   - If not, deploy: `cd functions && firebase deploy --only functions`

3. For existing users without permissions:
   - Use `/api/auth/initialize-user` endpoint (called automatically by AuthContext)
   - Or manually create document in Firestore Console

---

### Issue: Sign-in succeeds but no redirect to dashboard

**Cause**: JavaScript error or race condition

**Solution**:

- Check browser console for errors
- Verify [SignInButton.tsx](../../frontend/components/auth/SignInButton.tsx) includes `router.push("/dashboard")`
- Clear browser cache and cookies
- Try in incognito mode

**Current Status**: Auto-redirect is implemented and working in production.

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

**Cause**: Firebase trying to initialize during SSR/build or missing environment variables

**Solution**:

- Check [frontend/lib/firebase/config.ts](../../frontend/lib/firebase/config.ts) has `typeof window !== 'undefined'` check
- Verify environment variables are set in build environment
- Build should succeed even without Firebase config (graceful degradation)
- For Docker builds, ensure `ARG` and `ENV` variables are properly set in Dockerfile

---

### Issue: Pillars clickable but nothing happens

**Cause**: Pillar URLs not configured or SSO flow failing

**Solution**:

1. Open `frontend/.env.local`
2. Set pillar URLs:
   ```bash
   NEXT_PUBLIC_PILLAR_1_URL=https://your-pillar1-domain.com
   NEXT_PUBLIC_PILLAR_2_URL=https://your-pillar2-domain.com
   # ... etc
   ```
3. Restart dev server: `pnpm dev`
4. Check browser console for token errors
5. Verify `/api/pillar/[id]` route exists and is working

---

### Issue: User document not created in Firestore

**Cause**: Cloud Function `onUserCreate` not running or security rules blocking creation

**Solution**:

1. Check Cloud Function logs:
   ```bash
   firebase functions:log --only onUserCreate
   ```

2. Verify function is deployed:
   ```bash
   firebase functions:list
   ```

3. Check function execution in Firebase Console:
   - Functions → Dashboard → onUserCreate
   - Look for recent executions and errors

4. Fallback: Use manual initialization:
   - AuthContext automatically calls `/api/auth/initialize-user` if document doesn't exist
   - Check browser Network tab for this API call

---

### Issue: Admin panel shows "Access denied"

**Cause**: User is not an admin or admin claim not set

**Solution**:

1. Verify `isAdmin: true` in Firestore:
   - Firebase Console → Firestore → userPermissions → [your-user-id]
   - Check `isAdmin` field

2. Check if custom claim is set:
   - Use [DebugAdminStatus](../../frontend/components/admin/DebugAdminStatus.tsx) component
   - Shows both Firestore status and JWT claims

3. Force re-authentication:
   - Sign out completely
   - Clear browser cookies
   - Sign in again

4. Manually set admin claim via API:
   ```bash
   curl -X POST http://localhost:3000/api/admin/set-admin-claim \
     -H "Content-Type: application/json" \
     -d '{"userId":"YOUR_USER_ID","isAdmin":true}'
   ```

---

### Issue: Token expired errors in pillar apps

**Cause**: Token lifetime exceeded or refresh not working

**Solution**:

- Verify token refresh is running (check console logs every 50 minutes)
- Check [AuthContext.tsx](../../frontend/contexts/AuthContext.tsx) has token refresh interval
- Firebase ID tokens expire after 1 hour - refresh runs at 50 minutes
- User may need to re-authenticate if they've been idle for over 1 hour

---

## Deployment to Production

### Prerequisites

- Firebase project configured with Google OAuth enabled
- Cloud Run service provisioned in GCP
- GitHub secrets configured for CI/CD
- Firebase Admin SDK credentials configured in Cloud Run environment

### Step 1: GitHub Secrets

Add these secrets to your GitHub repository:

**Navigate to**: GitHub Repository → Settings → Secrets and variables → Actions

**Add these secrets** (click "New repository secret"):

```
# GCP Authentication
GCP_PROJECT_ID=your-gcp-project-id
GCP_WORKLOAD_IDENTITY_PROVIDER=projects/123456789/locations/global/workloadIdentityPools/...
GCP_SERVICE_ACCOUNT=deploy@project-id.iam.gserviceaccount.com
DOCKER_IMAGE_NAME=aiml-coe-web-app

# Firebase Client Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (for server-side operations)
FIREBASE_CLIENT_EMAIL=service-account@project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Pillar Application URLs
PILLAR_1_URL=https://pillar1.example.com
PILLAR_2_URL=https://pillar2.example.com
PILLAR_3_URL=https://pillar3.example.com
PILLAR_4_URL=https://pillar4.example.com
PILLAR_5_URL=https://pillar5.example.com
PILLAR_6_URL=https://pillar6.example.com
```

### Step 2: Cloud Run Environment Variables

The GitHub Actions workflow in [.github/workflows/cloud-run-deploy.yml](../../.github/workflows/cloud-run-deploy.yml) automatically sets environment variables during deployment.

You can also manually set them:

```bash
gcloud run services update aiml-coe-web-app \
  --region us-central1 \
  --set-env-vars "NEXT_PUBLIC_FIREBASE_API_KEY=$FIREBASE_API_KEY" \
  --set-env-vars "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN" \
  --set-env-vars "NEXT_PUBLIC_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID" \
  --set-env-vars "FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL" \
  --set-env-vars "FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY"
```

### Step 3: Deploy Cloud Functions

Cloud Functions must be deployed separately from the Next.js application:

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

**Important**: The `onUserCreate` function is required for automatic user initialization.

### Step 4: Add Production Domain to Firebase

1. **Firebase Console** → **Authentication** → **Settings** → **Authorized domains**
2. Click **Add domain**
3. Enter your Cloud Run domain: `aiml-coe-web-app-[project-id].us-central1.run.app`
4. Add any custom domains if configured
5. Click **Add**

### Step 5: Deploy via GitHub Actions

```bash
# Ensure all changes are committed
git status

# Push to main branch to trigger deployment
git push origin main
```

The GitHub Actions workflow will:
1. Build Docker image with environment variables
2. Push image to Google Container Registry
3. Deploy to Cloud Run with specified configuration
4. Tag revision with commit SHA
5. Clean up old revisions (keeps last 10)

### Step 6: Verify Production Deployment

1. **Wait for GitHub Actions** to complete (check Actions tab)
2. **Visit**: https://aiml-coe-web-app-[project-id].us-central1.run.app
3. **Test sign-in flow**:
   - Navigate to `/auth/signin`
   - Sign in with Google
   - Verify redirect to dashboard
   - Check pillar access
4. **Test admin panel** (if you're an admin):
   - Navigate to `/admin`
   - Verify user management works
   - Test permission updates

### Step 7: Monitor and Debug

**Cloud Run Logs**:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=aiml-coe-web-app" --limit 50 --format json
```

**Cloud Functions Logs**:
```bash
firebase functions:log
```

**Firestore Data**:
- Firebase Console → Firestore Database
- Select `aiml-coe-web-app` database
- Check `userPermissions` collection

---

## Next Phase Features

The following features are planned but **NOT YET IMPLEMENTED**:

### Phase 2 - Enhanced Features (Planned)

#### 1. Email Notifications

**Status**: Not Implemented

- Email when permissions are granted
- Email when permissions are revoked
- Weekly digest of permission changes (for admins)
- Welcome email for new users

**Requirements**:
- SendGrid or similar email service integration
- Email templates
- Cloud Function triggers for permission changes

#### 2. Enhanced Permissions

**Status**: Not Implemented

- Section-level permissions within pillars (sub-permissions)
- Permission groups/roles (e.g., "Data Team" role grants pillar 2 + 3)
- Time-based access (temporary permissions with expiration)
- Approval workflow (users request access, admins approve)

**Requirements**:
- Extended Firestore schema
- UI for permission requests
- Notification system

#### 3. Advanced Audit Logging

**Status**: Partially Implemented

Currently implemented:
- Basic audit log in `adminAuditLog` collection
- Records admin actions (permission updates, admin claim changes)

Not yet implemented:
- Detailed user action tracking
- Login/logout tracking
- Pillar access tracking
- Advanced audit log viewer in admin panel
- Export audit logs to CSV/JSON

#### 4. User Profile Enhancements

**Status**: Partially Implemented

Currently implemented:
- Basic profile page at `/profile`
- View own permissions

Not yet implemented:
- Edit profile information
- Upload profile picture
- Request access to additional pillars
- View access history

#### 5. Performance Optimizations

**Status**: Planned

- Implement caching for user permissions (Redis/Memorystore)
- Optimize Firestore queries with indexes
- Implement incremental static regeneration for public pages
- Add service worker for offline support

---

## Implementation Status Summary

### ✅ Fully Implemented and Production-Ready

- [x] Firebase Authentication with Google OAuth
- [x] Firestore permission system (6 pillars)
- [x] Admin role with custom claims
- [x] Admin panel for user management
- [x] Protected routes and dashboard
- [x] Session management with secure cookies
- [x] Token refresh mechanism
- [x] Pillar SSO integration with token forwarding
- [x] User CRUD operations (add, edit, delete)
- [x] Basic audit logging
- [x] Pending user provisioning (add by email)
- [x] Auto-redirect after sign-in
- [x] Responsive UI with proper styling

### 🚧 Partially Implemented

- [ ] Audit log viewer (logging exists, UI incomplete)
- [ ] User profile page (basic view only, no editing)

### ❌ Not Implemented

- [ ] Email notifications
- [ ] Sub-permissions (section-level access)
- [ ] Permission groups/roles
- [ ] Time-based access with expiration
- [ ] Approval workflow for access requests
- [ ] Advanced audit log export
- [ ] Performance caching (Redis)
- [ ] Offline support

---

## Testing Checklist

### ✅ Phase 1 - Basic Authentication (COMPLETED & VERIFIED)

- [x] Firebase config loads without errors
- [x] Sign-in page displays correctly with proper styling
- [x] Google Sign-in button appears with Google logo
- [x] Click sign-in opens OAuth popup
- [x] Successfully sign in with Google account
- [x] User document auto-created in Firestore (via Cloud Function)
- [x] **Auto-redirect to dashboard after sign-in**
- [x] Dashboard shows user name and email
- [x] Pillar grid shows all 6 pillars with descriptions and images
- [x] All pillars show "Access not granted" for new user
- [x] Sign out works correctly and clears session

### ✅ Phase 1 - Admin Access (COMPLETED & VERIFIED)

- [x] Manually set `isAdmin: true` in Firestore
- [x] Set admin custom claim via API or admin panel
- [x] Sign out and sign back in
- [x] Dashboard shows "Admin Panel" button
- [x] All pillars show "Admin Access" badge (green)
- [x] All pillars are clickable (if URLs configured)
- [x] Admin panel accessible at `/admin`

### ✅ Phase 1 - Admin Panel (COMPLETED & VERIFIED)

- [x] Admin panel lists all users
- [x] Search and filter functionality works
- [x] Edit user permissions dialog opens
- [x] Toggle pillar access switches
- [x] Toggle admin status switch
- [x] Save changes persists to Firestore
- [x] Add user by email (pending permissions)
- [x] Delete user removes from Auth + Firestore
- [x] Changes appear in real-time
- [x] Audit log records all changes

### ✅ Phase 1 - Pillar SSO (COMPLETED & VERIFIED)

- [x] Click on accessible pillar opens in new tab
- [x] Token is generated and passed via API route
- [x] API route verifies token server-side
- [x] User is redirected to pillar app with token
- [x] Pillar app receives valid, fresh token
- [x] Token refresh prevents expiration issues

### 🔄 Additional Testing (Recommended)

- [ ] Test with multiple Google accounts
- [ ] Test sign-in on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices (responsive design)
- [ ] Test token expiration and refresh (wait 50+ minutes)
- [ ] Test permission changes take effect after re-auth
- [ ] Test pending user becomes active on first sign-in
- [ ] Load test with multiple concurrent users
- [ ] Security test: Try to access admin panel as non-admin
- [ ] Security test: Try to modify another user's permissions
- [ ] Security test: Try to access pillar without permission

---

## Summary

✅ **Firebase Authentication is fully implemented, deployed, and production-ready**

**Current State**:

- **Branch**: `main` (merged and deployed)
- **Firebase Project**: `search-ahmed` (or your configured project)
- **Firestore Database**: `aiml-coe-web-app` (Standard edition, us-central1)
- **Deployment**: Cloud Run (automated via GitHub Actions)
- **Status**: Production-ready with active users

**Key Achievements**:

- ✅ Google OAuth authentication with auto-redirect
- ✅ Comprehensive permission system (6 pillars + admin role)
- ✅ Full-featured admin panel for user management
- ✅ Secure session management with HttpOnly cookies
- ✅ Automatic token refresh (50-minute intervals)
- ✅ Pillar SSO integration with token forwarding
- ✅ Cloud Functions for automatic user initialization
- ✅ Firestore security rules with admin-based access control
- ✅ Audit logging for all admin actions
- ✅ Pending user provisioning (pre-add users by email)
- ✅ Complete CRUD operations for users (add, edit, delete)
- ✅ SSR-safe Firebase initialization
- ✅ Full TypeScript type safety
- ✅ Responsive UI with proper styling

**Architecture Highlights**:

- **Next.js API Routes**: Replace most Cloud Functions for better performance
- **Firestore Named Database**: `aiml-coe-web-app` for isolation in shared project
- **Custom Claims + Firestore**: Dual admin check for security and flexibility
- **Client + Server Validation**: Token verification on both sides
- **Graceful Fallbacks**: Manual user init if Cloud Function fails

**Production Metrics** (as of deployment):

- Total Users: View in admin panel
- Active Admins: View in admin panel
- Pillar Access Distribution: View in admin panel summary
- Average Token Lifetime: 50 minutes (with auto-refresh)
- Session Cookie Lifetime: Matches Firebase token (1 hour)

**Next Steps**:

1. ✅ System is production-ready - no critical tasks remaining
2. 📊 Monitor usage and performance via Cloud Run logs
3. 🔐 Regularly review audit logs in `adminAuditLog` collection
4. 📧 Consider implementing email notifications (Phase 2)
5. 🎯 Plan enhanced permissions (sub-permissions, roles) as needed
6. 📈 Implement caching (Redis) if performance becomes a concern

**Known Limitations**:

- No email notifications for permission changes (planned)
- No sub-permissions within pillars (planned)
- No permission expiration dates (planned)
- No approval workflow for access requests (planned)
- Audit log exists but no admin UI viewer yet (planned)

**Support & Maintenance**:

- **Documentation**: This file + other docs in `/docs` folder
- **Code Location**: `/frontend` for Next.js app, `/functions` for Cloud Functions
- **Logs**: Cloud Run logs + Firebase Functions logs
- **Monitoring**: GCP Console for Cloud Run, Firebase Console for Auth/Firestore

---

**Last Verified**: January 21, 2026
**Maintained By**: AIML COE Team
**Status**: ✅ Accurate and up-to-date as of verification date
