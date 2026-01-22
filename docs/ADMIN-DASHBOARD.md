# Admin Dashboard - User Permission Management

**Last Updated**: January 22, 2026
**Status**: ✅ Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Access Control](#access-control)
4. [User Interface](#user-interface)
5. [Technical Implementation](#technical-implementation)
6. [Usage Guide](#usage-guide)
7. [Security Considerations](#security-considerations)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The Admin Dashboard provides a centralized interface for administrators to manage user permissions and access control for the AIML COE platform and its six strategic pillars.

### Key Capabilities

- **View All Users**: See a comprehensive list of all users with their current access levels
- **Add New Users**: Pre-authorize users by email before they sign in (Pending Invitations)
- **Edit Permissions**: Grant or revoke access to specific pillars for individual users
- **Manage Admin Roles**: Promote users to administrators or revoke admin privileges
- **Delete Users**: Permanently remove users and their access
- **Access Statistics**: View real-time statistics on user distribution and pillar access
- **Search Functionality**: Quickly find users by email or user ID

---

## Features

### 1. Dashboard Statistics

The admin dashboard displays key metrics at a glance:

- **Total Users**: Number of registered users in the system
- **Administrators**: Count of users with admin privileges
- **Pillar Access**: Breakdown showing how many users have access to each pillar (1-6)

### 2. User Management Table

A comprehensive table showing:

- **Email**: User's email address and truncated user ID
- **Role**: Badge indicating "Admin" or "User" status
- **Pillar Access**: Visual indicators (numbered circles) showing access to each pillar
  - Blue circle with number = Access granted
  - Gray circle with number = Access denied
- **Last Updated**: Date when permissions were last modified
- **Actions**:
  - "Edit" button to modify user permissions
  - "Delete" button to permanently remove a user

### 3. Add User (Pre-authorization)

Allows admins to add a user by email before they have registered:

- **Pending Status**: Creates a "pending" permission record linked to the email.
- **Auto-Association**: When the user signs in for the first time with that email, the system automatically detects the pending record and applies the pre-configured permissions (Admin role, Pillar access).
- **No Email Notification**: Currently does not send an email; admins must share the link manually.

### 4. Search and Filter

- Real-time search by email address or user ID
- Instant filtering of user list as you type

### 5. Permission Editor Dialog

A modal dialog for editing existing user permissions with:

- **User Information**: Displays email and user ID
- **Admin Access Toggle**: Single switch to grant/revoke administrator privileges
  - When enabled, user automatically gets access to all pillars
  - When disabled, individual pillar access can be managed
- **Individual Pillar Access**: Six toggle switches for granular access control
  - Each pillar labeled with its full name
  - Color-coded numbered badges (1-6)
  - Toggles automatically disabled when user is an admin
- **Save/Cancel Actions**: Persistent changes to Firestore

### 6. User Deletion Dialog

A safety-focused dialog for permanently deleting users:

- **Identity Verification**: Shows user email and admin status
- **Safety Lock**: Requires typing "DELETE" to enable the confirm button
- **Self-Protection**: "Delete" button is disabled for your own account
- **Impact Warning**: Clearly lists that Auth account and permissions will be removed

---

## Access Control

### Who Can Access the Admin Dashboard?

Only users with `isAdmin: true` in their Firestore `userPermissions` document can access the admin dashboard.

### Access Flow

1. User navigates to `/admin`
2. System checks if user is authenticated
3. System verifies `permissions.isAdmin === true`
4. If not admin:
   - Error toast: "Access denied. Admin privileges required."
   - Automatic redirect to `/dashboard`
5. If admin:
   - Dashboard loads with full functionality

### Granting First Admin Access

Since the admin dashboard requires an existing admin to grant access, the first admin must be created manually:

1. Sign in to the application
2. Note your Firebase Auth UID (visible in browser console or Firebase Console)
3. Go to Firebase Console → Firestore Database
4. Navigate to `aiml-coe-web-app` database
5. Open `userPermissions` collection
6. Find your user document (by UID)
7. Set `isAdmin: true`
8. Sign out and sign back in
9. Navigate to `/dashboard` and click "Admin Panel" button

---

## User Interface

### Design Principles

The admin dashboard follows the existing AIML COE design system:

- **Typography**: Plus Jakarta Sans font family
- **Primary Color**: `#146e96` (teal blue)
- **Accent Colors**:
  - Pillar 1, 3, 5: `#f2545b` (coral red)
  - Pillar 2, 4, 6: `#2c3e50` (dark blue)
- **Layout**: Consistent with dashboard page styling
- **Spacing**: 8px grid system
- **Border Radius**: Rounded corners (16-24px for cards)

### Navigation

- **From Dashboard**: Click "Admin Panel" button (visible only to admins)
- **Back Navigation**: "Back" button in header
- **URL**: `/admin`

---

## Technical Implementation

### File Structure

```
frontend/
├── app/
│   ├── admin/
│   │   └── page.tsx                 # Main admin dashboard page
│   └── api/
│       ├── admin/                   # Admin API Routes
│       │   ├── delete-user/
│       │   │   └── route.ts         # User deletion endpoint
│       │   ├── set-admin-claim/
│       │   │   └── route.ts         # Admin role endpoint
│       │   └── update-permissions/
│       │       └── route.ts         # Pillar permissions endpoint
│       └── auth/
│           └── initialize-user/
│               └── route.ts         # Endpoint to apply pending permissions
├── components/
│   └── admin/
│       ├── AddUserDialog.tsx              # Add new user modal
│       ├── DebugAdminStatus.tsx           # Admin status debug component
│       ├── DeleteUserDialog.tsx           # User deletion modal
│       └── EditUserPermissionsDialog.tsx  # Permission editor modal
├── lib/
│   └── firebase/
│       ├── admin.ts                 # Server-side Firebase Admin SDK functions
│       ├── permissions.ts           # Permission validation utilities
│       └── user-management.ts       # Client-side functions & API wrappers
└── docs/
    └── ADMIN-DASHBOARD.md          # This file
```

### Key Components

#### 1. `/app/admin/page.tsx`

**Purpose**: Main admin dashboard page with user list and statistics

**State Management**:

- `users`: Array of all UserPermissions
- `filteredUsers`: Filtered array based on search query
- `searchQuery`: Current search input
- `loadingUsers`: Loading state for data fetch
- `selectedUser`: Currently selected user for editing/deleting
- `editDialogOpen`, `addUserDialogOpen`, `deleteDialogOpen`: Dialog visibility states
- `summary`: Pillar access statistics

**Key Functions**:

- `loadUsers()`: Fetches all users and statistics from Firestore
- `handleEditUser(user)`: Opens edit dialog for selected user
- `handleDeleteUser(user)`: Opens delete dialog for selected user
- `setAddUserDialogOpen(true)`: Opens add user dialog

#### 2. `/components/admin/AddUserDialog.tsx`

**Purpose**: Modal dialog to pre-authorize a new user.

**Functionality**:
- Accepts Email, Admin Status, and Pillar Permissions.
- Calls `createUserPermissions` to create a Firestore document with `isPending: true`.
- Does NOT interact with Firebase Auth (user creates their own account later).

#### 3. `/components/admin/EditUserPermissionsDialog.tsx`

**Purpose**: Modal dialog for editing user permissions

**Key Functions**:

- `handlePillarToggle(pillarKey)`: Toggles individual pillar access
- `handleSave()`: Calls `/api/admin/update-permissions` or `/api/admin/set-admin-claim`

#### 4. `/components/admin/DeleteUserDialog.tsx`

**Purpose**: Modal dialog for confirming user deletion

**Key Logic**:
- Requires typing "DELETE" (case-sensitive) to enable the confirmation button.
- Calls `/api/admin/delete-user` on confirmation.

#### 5. `/app/api/admin/...` (API Routes)

**Purpose**: Secure server-side endpoints for admin actions.

- `delete-user/route.ts`: Deletes user from Auth and Firestore. Checks for admin privileges, prevents self-deletion, and **logs to `adminAuditLog`**.
- `update-permissions/route.ts`: Updates pillar access for non-admin permissions.
- `set-admin-claim/route.ts`: Promotes/demotes admins. Sets both custom claims and updates Firestore.

**Additional API Route:**
- `/app/api/auth/initialize-user/route.ts`: Fallback endpoint to manually initialize user permissions if `onUserCreate` trigger fails. Checks for pending permissions by email.

---

## Usage Guide

### For Administrators

#### Viewing All Users

1. Navigate to `/admin`
2. View the statistics cards at the top:
   - Total users count
   - Number of administrators
   - Access breakdown for each pillar
3. Scroll to the user management table

#### Adding a New User

1. Click the **Add User** button (top right of the user table).
2. Enter the user's **Email Address**.
3. Toggle permissions:
   - **Administrator Access**: Grants full access.
   - **Pillar Access**: Select specific pillars if not an admin.
4. Click **Add User**.
   - A success message will appear.
   - The user will have these permissions applied automatically when they first sign in with that email.

#### Searching for a User

1. In the admin dashboard, locate the search bar (top right of user table)
2. Type an email address or user ID
3. Table filters in real-time

#### Editing User Permissions

1. Find the user in the table
2. Click the "Edit" button in the Actions column
3. In the dialog that opens:
   - **To grant admin access**: Toggle "Administrator Access" ON
     - User automatically gets access to all pillars
     - Individual pillar toggles become disabled
   - **To grant specific pillar access**:
     - Ensure "Administrator Access" is OFF
     - Toggle individual pillars ON/OFF as needed
4. Click "Save Changes"
5. Wait for success confirmation toast
6. User list automatically refreshes with updated permissions

#### Deleting a User

1. Find the user in the table.
2. Click the red **Delete** button (trash icon).
   - *Note: You cannot delete your own account. The button will be disabled.*
3. In the confirmation dialog:
   - Review the user's email and details.
   - Type **DELETE** in the confirmation box (must be uppercase).
   - Click the **Delete User** button.
4. The user is permanently removed from Authentication and Firestore.

---

## Security Considerations

### 1. Client-Side Security

- Admin dashboard is protected by client-side authentication check
- Non-admin users are immediately redirected to regular dashboard
- "Delete" button is visually disabled for the current user

### 2. Server-Side Security (API Routes)

- All API routes (`/api/admin/...`) verify the caller's ID token.
- Explicitly checks `isAdmin: true` in Firestore before performing any action.
- **Self-Deletion Prevention**: The delete endpoint rejects requests where `targetUserId === currentUserId`.

### 3. Data Validation

- All permission updates validated before saving
- User existence checked before updates
- Timestamp automatically updated on each change

### 4. Audit Trail

- **Deletions**: Logged to `adminAuditLog` collection with action `user_deleted`.
- **Permission Updates**: Logged to `adminAuditLog` collection with action `permissions_updated`.
- **Admin Role Changes**: Logged to `adminAuditLog` collection with action `admin_claim_set`.
- **Timestamps**: The `updatedAt` field on the user document is also updated on every change.

---

## Troubleshooting

### Issue: "Access denied. Admin privileges required."

**Cause**: User is not an admin or permissions not loaded

**Solution**:

1. Verify `isAdmin: true` in Firestore for your user
2. Sign out and sign back in to refresh permissions
3. Check browser console for errors
4. Verify Firestore database name is `aiml-coe-web-app`

### Issue: "Failed to load users"

**Cause**: Firestore connection error or permission denied

**Solution**:

1. Check Firestore security rules
2. Verify Firebase configuration in `.env.local`
3. Check browser console for detailed error
4. Ensure user has admin privileges

### Issue: "User not initialized" after adding them

**Cause**: Email mismatch or "Pending" logic failed.

**Solution**:
1. Ensure the user signed in with the *exact* email address used in "Add User".
2. Check if the user document exists in `userPermissions` with `isPending: true`.
3. Check browser console for errors during the user's sign-in process.

---

## Future Enhancements

### Planned Features

1. **Bulk Operations**

   - Select multiple users for batch permission updates
   - Import/export user permissions via CSV

2. **Audit Log Viewer**

   - Create a UI in the admin panel to view the `adminAuditLog` collection.
   - Filter logs by admin, target user, or action type.

3. **Email Notifications**

   - Automatically send an invitation email when a user is added.
   - Notify users when their permissions are updated.

4. **Permission Templates**

   - Create named permission templates (e.g., "Finance Team", "Engineering Lead")
   - Apply templates to multiple users

5. **User Activity Dashboard**
   - Last login timestamp
   - Pillar usage statistics per user
   - Active vs. inactive user reporting

---

## Related Documentation

- [Pillar Authentication Guide](./PILLAR-AUTHENTICATION.md)
- [Quick Reference](./PILLAR-QUICK-REFERENCE.md)
- [Firebase Auth Implementation](./firebase/FIREBASE-AUTH-IMPLEMENTATION.md)
- [Production Deployment](./PRODUCTION-DEPLOYMENT-CHECKLIST.md)

---

**Version**: 1.1.0
**Last Updated**: January 21, 2026
**Status**: Production Ready