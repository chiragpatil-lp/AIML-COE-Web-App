# Cloud Functions Architecture

**Last Updated:** January 21, 2026
**Status:** ✅ Active Strategy

---

## 🔍 Executive Summary

The AIML COE Web Application uses a **Hybrid Architecture** for backend logic, combining **Firebase Cloud Functions** (for event-driven triggers) and **Next.js API Routes** (for user-initiated administrative actions).

**Key Decision:** 
- **Keep:** Identity triggers (`onUserCreate`) in Cloud Functions.
- **Migrate:** All callable functions (admin operations) to Next.js API Routes to solve CORS issues and improve performance.

---

## 📊 Function Status

| Function Name | Type | Status | Purpose |
|---------------|------|--------|---------|
| `onUserCreate` | Trigger | ✅ **ACTIVE** | Automatically assigns permissions when a user signs up. Handles "Pending Permissions" workflow. |
| `setAdminClaim` | Callable | ❌ **DEPRECATED** | Replaced by `/api/admin/set-admin-claim` |
| `updateUserPermissions` | Callable | ❌ **DEPRECATED** | Replaced by `/api/admin/update-permissions` |
| `getUserPermissions` | Callable | ❌ **DEPRECATED** | Replaced by direct Firestore reads (client-side) |
| `initializeUser` | Callable | ❌ **DEPRECATED** | Replaced by `/api/auth/initialize-user` |

---

## ✅ Active Cloud Functions

### 1. `onUserCreate` (Identity Trigger)

**Location:** `functions/src/index.ts`
**Trigger:** `beforeUserCreated` (Gen 2 Identity Trigger)

**Why it MUST be a Cloud Function:**
This logic executes *during* the user creation process at the Firebase Auth level. It cannot be moved to an API route because there is no client-side hook that reliably fires *before* the account is finalized but *after* the user clicks "Sign Up".

**The "Pending Permissions" Workflow:**
This function enables the feature where admins can grant permissions to a user **before they sign up**.

1. **Admin Pre-Authorizes:**
   - Admin creates a "Pending Permission" document in Firestore (`pending_BASE64EMAIL`).
   - Doc contains: `isPending: true`, `isAdmin: boolean`, `pillars: {...}`.

2. **User Signs Up:**
   - `onUserCreate` trigger fires automatically.
   - It checks Firestore for a pending doc matching the user's email.

3. **Automatic Resolution:**
   - **If Found:** It copies the pre-assigned permissions to the new user's `userPermissions` document and deletes the pending doc.
   - **If Not Found:** It creates a default `userPermissions` document (all false).

**Result:** Users have the correct access immediately upon first login.

---

## 🚀 Migration to API Routes

We moved all administrative actions to Next.js API Routes to resolve persistent CORS issues with Callable Cloud Functions and to leverage the Next.js server environment.

### Benefits
- **No CORS Issues:** API routes run on the same origin as the frontend (or handle CORS natively).
- **Better Performance:** Removes the "Cold Start" latency of Cloud Functions for admin actions.
- **Unified Logic:** Backend logic lives closer to the frontend code in `app/api`.
- **Security:** Uses `firebase-admin` SDK with HttpOnly cookies for secure session management.

### New API Endpoints

| Old Cloud Function | New API Route | Method |
|--------------------|---------------|--------|
| `setAdminClaim` | `/api/admin/set-admin-claim` | `POST` |
| `updateUserPermissions` | `/api/admin/update-permissions` | `POST` |
| `deleteUser` (New) | `/api/admin/delete-user` | `DELETE` |
| `initializeUser` | `/api/auth/initialize-user` | `POST` |

---

## 🛠️ Deployment

### Deploying Cloud Functions
Only the `onUserCreate` function needs to be deployed.

```bash
cd functions
npm run build
firebase deploy --only functions:onUserCreate
```

### Deploying API Routes
API routes are deployed automatically with the Next.js frontend to Cloud Run. No separate deployment step is needed.

---

## 🔐 Security Model

### Cloud Functions
- **Trigger Security:** Runs with internal privileges tied to the Firebase Auth event.

### API Routes
- **Authentication:** Verifies the Firebase Session Cookie (`firebase-token`) passed in the request.
- **Authorization:** Checks `isAdmin` status in Firestore before allowing any modification.
- **Audit Trail:** Critical actions (like `deleteUser`) are logged to the `adminAuditLog` collection in Firestore.