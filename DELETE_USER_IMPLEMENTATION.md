# Delete User Feature - Implementation Guide

## ✅ Implementation Complete

The full user deletion functionality has been implemented for admins. Users can now be permanently deleted from both Firebase Authentication and Firestore.

---

## 📁 Files Created/Modified

### 1. **Backend API Route** ✅
**File:** `frontend/app/api/admin/delete-user/route.ts`

**What it does:**
- Verifies admin authentication
- Prevents self-deletion
- Deletes user from Firebase Authentication
- Deletes user permissions from Firestore
- Logs action in audit trail
- Returns success/error response

**Endpoint:** `DELETE /api/admin/delete-user`

**Request Body:**
```json
{
  "userId": "firebase-auth-uid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User email@example.com has been permanently deleted",
  "deletedUserId": "firebase-auth-uid",
  "deletedUserEmail": "email@example.com"
}
```

---

### 2. **Frontend Function** ✅
**File:** `frontend/lib/firebase/user-management.ts`

**Added function:**
```typescript
export async function deleteUser(userId: string): Promise<void>
```

**Usage:**
```typescript
import { deleteUser } from "@/lib/firebase/user-management";

await deleteUser("user-uid");
```

---

### 3. **Delete User Dialog Component** ✅
**File:** `frontend/components/admin/DeleteUserDialog.tsx`

**Features:**
- Shows user information (email, admin status)
- Warning message about permanent deletion
- Requires typing "DELETE" to confirm
- Prevents accidental deletions
- Loading states during deletion
- Success/error toast notifications

**Props:**
```typescript
interface DeleteUserDialogProps {
  user: UserPermissions | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
```

---

## 🔌 Integration Instructions

### Step 1: Import the Component

Add to your admin dashboard page (e.g., `frontend/app/admin/page.tsx`):

```typescript
import { DeleteUserDialog } from "@/components/admin/DeleteUserDialog";
```

### Step 2: Add State Management

```typescript
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [selectedUserForDeletion, setSelectedUserForDeletion] = useState<UserPermissions | null>(null);
```

### Step 3: Add the Dialog Component

```tsx
<DeleteUserDialog
  user={selectedUserForDeletion}
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
  onSuccess={() => {
    // Refresh user list
    fetchUsers();
  }}
/>
```

### Step 4: Add Delete Button to User Table/List

Add a delete button for each user in your admin dashboard:

```tsx
<button
  onClick={() => {
    setSelectedUserForDeletion(user);
    setDeleteDialogOpen(true);
  }}
  className="text-red-600 hover:text-red-800"
  disabled={user.userId === currentUser.uid} // Prevent self-deletion
>
  <TrashIcon className="w-5 h-5" />
</button>
```

---

## 🛡️ Security Features

### 1. **Admin-Only Access**
- Endpoint verifies user has admin privileges
- Non-admins receive 403 Forbidden error

### 2. **Self-Deletion Prevention**
```typescript
if (userId === decodedClaims.uid) {
  return NextResponse.json(
    { error: "Cannot delete your own account" },
    { status: 400 }
  );
}
```

### 3. **Confirmation Required**
- User must type "DELETE" to confirm
- Prevents accidental deletions

### 4. **Audit Trail**
Every deletion is logged with:
- Action type: `user_deleted`
- Target user ID and email
- Whether user was admin
- Admin who performed deletion
- Timestamp

**Audit log location:** `adminAuditLog` collection in Firestore

---

## 🔍 What Gets Deleted

### 1. **Firebase Authentication** ✅
- User account removed
- User cannot sign in anymore
- Email becomes available for new account

### 2. **Firestore** ✅
- `userPermissions/{userId}` document deleted
- User loses all pillar access
- Admin status removed

### 3. **Audit Trail** ✅
- Action is logged (not deleted)
- Maintains record of who deleted whom and when

---

## ⚠️ What Doesn't Get Deleted

**Important:** This implementation only deletes:
- Firebase Auth account
- User permissions document

**If your app stores other user data**, you'll need to add deletion logic for:
- User-created documents
- User-uploaded files
- User activity logs
- Related data in other collections

**Example of extending deletion:**
```typescript
// In delete-user/route.ts, add:

// Delete user's documents
const userDocs = await db.collection("userDocuments")
  .where("userId", "==", userId)
  .get();

const deletionPromises = userDocs.docs.map(doc => doc.ref.delete());
await Promise.all(deletionPromises);

// Delete user's uploaded files
// ... storage deletion logic
```

---

## 🧪 Testing Checklist

### Before Testing:
- [ ] Backup your Firestore database
- [ ] Use test accounts, not real users
- [ ] Have a way to create new test users

### Tests to Perform:

#### 1. **Happy Path**
- [ ] Admin can delete regular user
- [ ] User is removed from Firebase Auth
- [ ] User permissions deleted from Firestore
- [ ] Success message shows deleted user's email
- [ ] User list refreshes after deletion
- [ ] Deleted user cannot sign in anymore

#### 2. **Security Tests**
- [ ] Non-admin cannot access delete endpoint
- [ ] Admin cannot delete their own account
- [ ] Confirmation input is case-sensitive ("DELETE" only)
- [ ] Cannot submit without typing "DELETE"

#### 3. **Edge Cases**
- [ ] Deleting user that doesn't exist in Auth (only Firestore)
- [ ] Deleting user that doesn't exist in Firestore (only Auth)
- [ ] Network error handling
- [ ] Multiple rapid delete attempts (should be prevented)

#### 4. **Audit Trail**
- [ ] Check `adminAuditLog` collection after deletion
- [ ] Verify all required fields are present
- [ ] Confirm correct admin is logged as performer

---

## 📊 Complete Integration Example

Here's a complete example of integrating into your admin dashboard:

```tsx
"use client";

import { useState, useEffect } from "react";
import { DeleteUserDialog } from "@/components/admin/DeleteUserDialog";
import { EditUserPermissionsDialog } from "@/components/admin/EditUserPermissionsDialog";
import { getAllUserPermissions } from "@/lib/firebase/user-management";
import type { UserPermissions } from "@/lib/types/auth.types";

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserPermissions | null>(null);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserForDeletion, setSelectedUserForDeletion] = useState<UserPermissions | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await getAllUserPermissions();
      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      {/* User Table */}
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.email}</td>
              <td>{user.isAdmin ? "Yes" : "No"}</td>
              <td>
                {/* Edit Button */}
                <button
                  onClick={() => {
                    setSelectedUserForEdit(user);
                    setEditDialogOpen(true);
                  }}
                >
                  Edit
                </button>
                
                {/* Delete Button */}
                <button
                  onClick={() => {
                    setSelectedUserForDeletion(user);
                    setDeleteDialogOpen(true);
                  }}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialogs */}
      <EditUserPermissionsDialog
        user={selectedUserForEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={fetchUsers}
      />
      
      <DeleteUserDialog
        user={selectedUserForDeletion}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
```

---

## 🎨 UI/UX Features

### Confirmation Dialog Includes:
1. **User Information Card**
   - Email address
   - Admin badge (if applicable)

2. **Warning Banner**
   - Red color scheme (indicates danger)
   - List of what will be deleted
   - "Cannot be undone" warning

3. **Confirmation Input**
   - Must type "DELETE" exactly
   - Case-sensitive validation
   - Auto-focus on open

4. **Action Buttons**
   - Cancel (gray) - closes dialog
   - Delete (red) - executes deletion
   - Disabled states during loading
   - Loading spinner during deletion

5. **Toast Notifications**
   - Success: Shows deleted user's email
   - Error: Shows error message

---

## 🔄 Error Handling

The implementation handles various error scenarios:

| Scenario | Handling |
|----------|----------|
| User not authenticated | 401 error |
| Non-admin tries to delete | 403 error |
| Invalid userId | 400 error with message |
| Try to delete own account | 400 error "Cannot delete your own account" |
| User doesn't exist in Auth | Continues with Firestore deletion |
| User doesn't exist in Firestore | Continues with Auth deletion |
| Network error | Shows error toast |
| Audit logging fails | Logs error, doesn't fail request |

---

## 📝 Audit Log Structure

Each deletion creates an audit log entry:

```typescript
{
  action: "user_deleted",
  targetUserId: "deleted-user-uid",
  targetUserEmail: "deleted@example.com",
  targetUserWasAdmin: true/false,
  performedBy: "admin-uid",
  performedByEmail: "admin@example.com",
  timestamp: Firestore.FieldValue.serverTimestamp()
}
```

**Query audit logs:**
```typescript
const auditLogs = await db
  .collection("adminAuditLog")
  .where("action", "==", "user_deleted")
  .orderBy("timestamp", "desc")
  .get();
```

---

## 🚀 Next Steps

1. **Add Delete Button to Admin Dashboard**
   - Follow integration example above
   - Style button with red color scheme
   - Add icon (trash/delete icon)

2. **Test Thoroughly**
   - Use test accounts
   - Verify audit logs
   - Check both Auth and Firestore

3. **Consider Additional Features (Optional)**
   - Bulk delete functionality
   - Soft delete option (disable instead of delete)
   - Restore deleted user (would require keeping data)
   - Export user data before deletion

4. **Documentation for Other Admins**
   - Document the deletion process
   - Train admins on when to delete vs disable
   - Establish deletion policies

---

## 🔐 Security Best Practices

✅ **Already Implemented:**
- Admin-only access
- Self-deletion prevention
- Confirmation required
- Audit trail logging
- Server-side validation

**Consider Adding:**
- [ ] Super admin requirement for admin deletion
- [ ] Time-delayed deletion (grace period)
- [ ] Email notification to deleted user
- [ ] Require second admin approval for admin deletion

---

## 📊 Summary

| Component | Status | Location |
|-----------|--------|----------|
| Backend API Route | ✅ Complete | `app/api/admin/delete-user/route.ts` |
| Frontend Function | ✅ Complete | `lib/firebase/user-management.ts` |
| Delete Dialog UI | ✅ Complete | `components/admin/DeleteUserDialog.tsx` |
| Security | ✅ Complete | Admin-only, confirmation required |
| Audit Trail | ✅ Complete | Logged in `adminAuditLog` |
| Error Handling | ✅ Complete | All edge cases covered |

**Integration Required:** Add delete button to admin dashboard and import the dialog component.

---

**Last Updated:** 2026-01-08  
**Status:** ✅ Ready for Integration  
**Architecture:** Next.js API Route (consistent with other admin operations)
