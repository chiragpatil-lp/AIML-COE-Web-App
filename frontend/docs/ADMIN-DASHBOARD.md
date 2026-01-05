# Admin Dashboard - User Permission Management

**Last Updated**: January 5, 2026
**Status**: ✅ Implemented and Ready for Testing

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
- **Edit Permissions**: Grant or revoke access to specific pillars for individual users
- **Manage Admin Roles**: Promote users to administrators or revoke admin privileges
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
- **Actions**: "Edit" button to modify user permissions

### 3. Search and Filter

- Real-time search by email address or user ID
- Instant filtering of user list as you type

### 4. Permission Editor Dialog

A modal dialog for editing user permissions with:
- **User Information**: Displays email and user ID
- **Admin Access Toggle**: Single switch to grant/revoke administrator privileges
  - When enabled, user automatically gets access to all pillars
  - When disabled, individual pillar access can be managed
- **Individual Pillar Access**: Six toggle switches for granular access control
  - Each pillar labeled with its full name
  - Color-coded numbered badges (1-6)
  - Toggles automatically disabled when user is an admin
- **Save/Cancel Actions**: Persistent changes to Firestore

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
- **Back Navigation**: "Back to Dashboard" button in header
- **URL**: `/admin`

---

## Technical Implementation

### File Structure

```
frontend/
├── app/
│   └── admin/
│       └── page.tsx                 # Main admin dashboard page
├── components/
│   └── admin/
│       └── EditUserPermissionsDialog.tsx  # Permission editor modal
├── lib/
│   └── firebase/
│       ├── admin.ts                 # Server-side Firebase Admin SDK functions
│       └── user-management.ts       # Client-side Firestore functions
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
- `selectedUser`: Currently selected user for editing
- `editDialogOpen`: Dialog open/close state
- `summary`: Pillar access statistics

**Key Functions**:
- `loadUsers()`: Fetches all users and statistics from Firestore
- `handleEditUser(user)`: Opens edit dialog for selected user
- `handleEditSuccess()`: Reloads user list after successful update

#### 2. `/components/admin/EditUserPermissionsDialog.tsx`

**Purpose**: Modal dialog for editing user permissions

**Props**:
- `user`: UserPermissions object to edit
- `open`: Dialog visibility state
- `onOpenChange`: Callback to change dialog state
- `onSuccess`: Callback after successful save

**State Management**:
- `isAdmin`: Local state for admin toggle
- `pillars`: Local state for pillar access toggles
- `isSaving`: Loading state during save operation

**Key Functions**:
- `handlePillarToggle(pillarKey)`: Toggles individual pillar access
- `handleSave()`: Saves changes to Firestore and triggers success callback

#### 3. `/lib/firebase/admin.ts` (Server-Side)

**Purpose**: Firebase Admin SDK functions for server-side operations

**Functions**:
- `getFirebaseAdminApp()`: Initializes Firebase Admin SDK
  - Uses Application Default Credentials in Cloud Run
  - Uses service account JSON in development
- `verifyIdToken(token)`: Verifies Firebase ID tokens
- `getUserPermissions(userId)`: Fetches user permissions from Firestore
- `isUserAdmin(userId)`: Checks if user is an admin

#### 4. `/lib/firebase/user-management.ts` (Client-Side)

**Purpose**: Client-side Firestore functions for admin operations

**Functions**:
- `getAllUserPermissions()`: Fetches all users from Firestore
- `updateUserPermissions(userId, updates)`: Updates user permissions
- `createUserPermissions(email, permissions)`: Creates pre-authorized user
- `isUserAdmin(userId)`: Client-side admin check
- `getPillarAccessSummary()`: Calculates access statistics

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

#### Understanding the Visual Indicators

**Role Badges**:
- Blue badge with shield icon = Administrator
- Gray badge = Regular user

**Pillar Access Circles**:
- Blue circle with white number = Access granted to that pillar
- Gray circle with gray number = Access denied to that pillar
- "All Pillars (6/6)" text = User is an admin with full access

---

## Security Considerations

### 1. Client-Side Security

- Admin dashboard is protected by client-side authentication check
- Non-admin users are immediately redirected to regular dashboard
- Firestore security rules prevent unauthorized data access

### 2. Server-Side Security

- All sensitive operations use Firebase Admin SDK
- Token verification happens server-side
- Firestore rules enforce write restrictions:
  ```javascript
  // Only admins can write to userPermissions
  allow write: if request.auth != null && 
                  request.auth.token.admin == true;
  ```

### 3. Data Validation

- All permission updates validated before saving
- User existence checked before updates
- Timestamp automatically updated on each change

### 4. Audit Trail

- `updatedAt` timestamp tracks when permissions were last changed
- Console logs capture permission modification events
- Future enhancement: Add audit log collection

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

### Issue: "Failed to update permissions"

**Cause**: Firestore write error or network issue

**Solution**:
1. Check network connectivity
2. Verify Firestore security rules allow writes
3. Ensure user ID is valid
4. Check browser console for error details

### Issue: Admin Panel button not visible on dashboard

**Cause**: User is not an admin or permissions not loaded

**Solution**:
1. Verify `permissions.isAdmin === true` in browser console:
   ```javascript
   // In browser console
   console.log(window.__NEXT_DATA__.props.pageProps.permissions);
   ```
2. Sign out and sign back in
3. Check Firestore for correct permissions

### Issue: Search not working

**Cause**: JavaScript error or state issue

**Solution**:
1. Check browser console for errors
2. Refresh the page
3. Clear browser cache if needed

---

## Future Enhancements

### Planned Features

1. **Bulk Operations**
   - Select multiple users for batch permission updates
   - Import/export user permissions via CSV

2. **Audit Logs**
   - Track all permission changes with timestamp and admin who made the change
   - Export audit logs for compliance

3. **User Invitation System**
   - Pre-create user permissions before first sign-in
   - Send invitation emails with custom messages

4. **Advanced Filtering**
   - Filter by role (admin/user)
   - Filter by pillar access
   - Filter by last activity date

5. **Permission Templates**
   - Create named permission templates (e.g., "Finance Team", "Engineering Lead")
   - Apply templates to multiple users

6. **User Activity Dashboard**
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

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Check Firestore database configuration
4. Verify Firebase Admin SDK initialization
5. Contact AIML COE development team

---

**Version**: 1.0.0
**Last Updated**: January 5, 2026
**Status**: Production Ready

