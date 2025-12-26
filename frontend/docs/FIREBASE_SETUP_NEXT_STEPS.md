# Firebase Authentication Implementation - Next Steps

## ✅ What Has Been Implemented

The Firebase Authentication system with Google OAuth has been successfully implemented on the `feat/firebase-auth-implementation` branch. Here's what's ready:

### Core Features
- ✅ Firebase SDK v12.7.0 installed and configured
- ✅ Google OAuth sign-in integration
- ✅ User permissions management via Firestore
- ✅ 6 strategic pillar access control system
- ✅ Admin role with full pillar access
- ✅ Protected routes with client-side authentication
- ✅ Responsive sign-in and dashboard pages
- ✅ Toast notifications for user feedback
- ✅ Environment variable configuration system

### Files Created
```
frontend/
├── .env.example                          # Environment variables template
├── lib/
│   ├── firebase/
│   │   └── config.ts                    # Firebase initialization
│   └── types/
│       └── auth.types.ts                # TypeScript interfaces
├── contexts/
│   └── AuthContext.tsx                  # Auth state management
├── components/
│   ├── auth/
│   │   ├── SignInButton.tsx            # Google sign-in button
│   │   └── SignOutButton.tsx           # Sign-out button
│   └── dashboard/
│       └── PillarGrid.tsx              # Pillar access grid
├── app/
│   ├── auth/
│   │   └── signin/
│   │       └── page.tsx                # Sign-in page
│   └── dashboard/
│       └── page.tsx                    # Dashboard page
└── middleware.ts                        # Route protection
```

---

## 🔧 Required Configuration Steps

### Step 1: Firebase Console Setup (You Need to Do This)

Since you're now a Firebase admin of the `search-ahmend` project, you need to:

1. **Go to Firebase Console**: https://console.firebase.google.com/

2. **Select or Create Project**:
   - If using existing project: Select `search-ahmed`
   - If creating new: Create project `aiml-coe-web-app`

3. **Enable Authentication**:
   - Click "Authentication" in sidebar
   - Click "Get started"
   - Go to "Sign-in method" tab
   - Enable "Google" provider
   - Set support email (required)
   - Click "Save"

4. **Register Web App**:
   - Click the Web icon (`</>`) in project overview
   - Register app: `AIML COE Web App`
   - **IMPORTANT**: Copy the Firebase configuration object
   // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7vMIPV3hPikteOOJycZGGaTIjth0evHs",
  authDomain: "search-ahmed.firebaseapp.com",
  projectId: "search-ahmed",
  storageBucket: "search-ahmed.firebasestorage.app",
  messagingSenderId: "36231825761",
  appId: "1:36231825761:web:b98d79df40740fa629dd20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


5. **Enable Firestore**:
   - Click "Firestore Database"
   - Click "Create database"
   - Choose production mode
   - Select region: `us-central1`
   - Click "Enable"

6. **Set Firestore Security Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /userPermissions/{userId} {
         allow read: if request.auth != null && request.auth.uid == userId;
         allow write: if request.auth != null && request.auth.token.admin == true;
       }
       match /userPermissions/{document=**} {
         allow read: if request.auth != null && request.auth.token.admin == true;
       }
     }
   }
   ```

7. **Configure Authorized Domains**:
   - Go to Authentication > Settings > Authorized domains
   - Add:
     - `localhost` (already there)
     - `aiml-coe-web-app-36231825761.us-central1.run.app`
     - Any custom domains

### Step 2: Local Environment Setup

1. **Create `.env.local` file** in the `frontend/` directory:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. **Fill in Firebase credentials** (from Step 1.4):
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

3. **Configure Pillar URLs** (optional for now):
   ```bash
   NEXT_PUBLIC_PILLAR_1_URL=https://strategy.your-domain.com
   NEXT_PUBLIC_PILLAR_2_URL=https://innovation.your-domain.com
   # ... etc
   ```

### Step 3: Test Locally

1. **Install dependencies** (if not already done):
   ```bash
   cd frontend
   pnpm install
   ```

2. **Run development server**:
   ```bash
   pnpm dev
   ```

3. **Test the flow**:
   - Go to http://localhost:3000/auth/signin
   - Click "Sign in with Google"
   - Sign in with your Google account
   - You should be redirected to the dashboard
   - All pillars will show "Access not granted" (expected for new users)

### Step 4: Set Up Your First Admin User

1. **Sign in once** to create your user document in Firestore

2. **Go to Firebase Console** > Firestore Database

3. **Find your user document**:
   - Collection: `userPermissions`
   - Document ID: (your user ID)

4. **Manually edit the document**:
   - Set `isAdmin: true`
   - Set any pillar permissions you want (`pillar1: true`, etc.)

5. **Sign out and sign back in** to see the changes

---

## 🚀 Deployment Steps

### For Cloud Run (Existing CI/CD)

1. **Add GitHub Secrets** (in your GitHub repository):
   - Go to Settings > Secrets and variables > Actions
   - Add these secrets:
     ```
     FIREBASE_API_KEY
     FIREBASE_AUTH_DOMAIN
     FIREBASE_PROJECT_ID
     FIREBASE_STORAGE_BUCKET
     FIREBASE_MESSAGING_SENDER_ID
     FIREBASE_APP_ID
     ```

2. **Update GitHub Actions Workflow** (if needed):
   - The workflow should inject these as build-time environment variables
   - Check `.github/workflows/main.yml`

3. **Push to main** (after testing):
   ```bash
   # First merge the feature branch
   git checkout main
   git merge feat/firebase-auth-implementation
   git push origin main
   ```

4. **Verify deployment** on Cloud Run URL

---

## 📋 Testing Checklist

### Phase 1 - Basic Auth Flow
- [ ] Firebase config loads without errors
- [ ] Sign-in page displays correctly
- [ ] Google Sign-in button appears
- [ ] Click sign-in opens OAuth popup
- [ ] Successfully sign in with Google account
- [ ] User document created in Firestore
- [ ] Dashboard shows user name and email
- [ ] Pillar grid shows all 6 pillars
- [ ] All pillars show "Access not granted" for new user
- [ ] Sign out works correctly
- [ ] Redirected to sign-in page after sign out

### Phase 1 - Admin Access
- [ ] Manually set `isAdmin: true` in Firestore
- [ ] Sign out and sign back in
- [ ] All pillars now show "Admin Access" badge
- [ ] All pillars are clickable (if URLs configured)

### Phase 1 - Permission Testing
- [ ] Manually set `pillar1: true` for non-admin user
- [ ] Sign out and sign back in
- [ ] Pillar 1 shows "Authorized" badge
- [ ] Other pillars show "Access not granted"

---

## 🎯 Architecture Overview

### Authentication Flow
```
1. User visits /auth/signin
2. Clicks "Sign in with Google"
3. Firebase opens Google OAuth popup
4. User authenticates with Google
5. Firebase creates/updates user in Auth
6. AuthContext fetches permissions from Firestore
7. User redirected to /dashboard
8. Dashboard shows accessible pillars
```

### Permission System
- **Firestore Collection**: `userPermissions/{userId}`
- **Document Structure**:
  ```typescript
  {
    userId: string;
    email: string;
    isAdmin: boolean;
    pillars: {
      pillar1: boolean;  // Strategy & Value Realization
      pillar2: boolean;  // Innovation & IP Development
      pillar3: boolean;  // Platforms & Engineering
      pillar4: boolean;  // People & Capability Enablement
      pillar5: boolean;  // COE Delivery Governance
      pillar6: boolean;  // Communication & Market Intelligence
    };
    createdAt: Date;
    updatedAt: Date;
  }
  ```

### Security
- ✅ Client-side auth with Firebase SDK
- ✅ Firestore security rules enforce permissions
- ✅ Environment variables for sensitive config
- ✅ HTTPS-only (enforced by Cloud Run)
- ✅ OAuth scopes limited to profile and email

---

## 🔮 Next Phase (Phase 2)

### Admin Panel Features
- [ ] Create `/app/admin/users/page.tsx`
- [ ] List all users from Firestore
- [ ] Toggle pillar access per user
- [ ] Search and filter users
- [ ] Audit log for permission changes

### Cloud Functions
- [ ] Deploy function to set admin custom claims
- [ ] Only callable by existing admins
- [ ] Updates user JWT with admin flag
- [ ] More secure than Firestore-only checks

### Enhanced Permissions
- [ ] Section-level permissions within pillars
- [ ] Permission inheritance/groups
- [ ] Time-based access (temporary access)
- [ ] Approval workflow for access requests

---

## 📚 Documentation Reference

- **Implementation Guide**: `frontend/docs/FIREBASE-AUTH-IMPLEMENTATION.md`
- **Firebase Docs**: https://firebase.google.com/docs/auth
- **Firestore Security**: https://firebase.google.com/docs/firestore/security/get-started

---

## 🆘 Troubleshooting

### Issue: "Firebase: Error (auth/invalid-api-key)"
**Solution**: Check that environment variables are set correctly in `.env.local`

### Issue: "Firebase: Error (auth/popup-blocked)"
**Solution**: Allow popups in browser settings

### Issue: "Firebase: Error (auth/unauthorized-domain)"
**Solution**: Add domain to Firebase Console > Authentication > Settings > Authorized domains

### Issue: Firestore permission denied
**Solution**: Check Firestore security rules and user authentication status

### Issue: Build fails with Firebase error
**Solution**: The code is designed to handle missing env vars gracefully. Build should succeed even without Firebase config.

---

## ✅ Summary

You now have a fully functional Firebase Authentication system ready to use!

**Branch**: `feat/firebase-auth-implementation`
**Status**: ✅ Implementation complete, ready for configuration and testing
**Next Action**: Follow Step 1 to configure Firebase in the console, then Step 2 to set up local environment

If you encounter any issues, refer to the Troubleshooting section or the detailed implementation guide at `frontend/docs/FIREBASE-AUTH-IMPLEMENTATION.md`.
