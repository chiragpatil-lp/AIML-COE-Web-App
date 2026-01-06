# Firestore Security Rules for AIML COE Web App

## Current Rules (Updated for Admin Dashboard)

Copy these rules to Firebase Console → Firestore Database → Rules:

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
      // Users can read their own permissions
      allow read: if request.auth != null && request.auth.uid == userId;

      // Admins can read all permissions (for admin dashboard)
      allow read: if isAdmin();

      // Admins can write/update any user permissions
      allow write, update, delete: if isAdmin();

      // Allow creation of new permission documents by admins
      allow create: if isAdmin();
    }
  }
}
```

## How to Apply These Rules

### Method 1: Firebase Console (Recommended for Quick Fix)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `search-ahmed`
3. Click **Firestore Database** in the left sidebar
4. Click the **Rules** tab at the top
5. Replace the existing rules with the rules above
6. Click **Publish**

### Method 2: Firebase CLI

```bash
# Save the rules to a file
cat > firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/userPermissions/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/userPermissions/$(request.auth.uid)).data.isAdmin == true;
    }

    match /userPermissions/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow read: if isAdmin();
      allow write, update, delete, create: if isAdmin();
    }
  }
}
EOF

# Deploy the rules
firebase deploy --only firestore:rules
```

## What Changed?

### Old Rules (Problematic)

```javascript
// ❌ This checks for custom claims (requires Cloud Functions)
allow write: if request.auth != null &&
                request.auth.token.admin == true;
```

### New Rules (Working)

```javascript
// ✅ This checks the Firestore document directly
function isAdmin() {
  return request.auth != null &&
         exists(/databases/$(database)/documents/userPermissions/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/userPermissions/$(request.auth.uid)).data.isAdmin == true;
}

allow write: if isAdmin();
```

## Important Notes

### Security Considerations

1. **The `isAdmin()` function makes an extra read** to check permissions on every write

   - This counts against your Firestore read quota
   - For 5 admins making 100 writes/day each = 500 extra reads/day
   - Well within the free tier (50K reads/day)

2. **Users can't change their own permissions** because:

   - The `isAdmin()` check happens BEFORE the write
   - Users can't write to their own document to make themselves admin
   - Only existing admins can modify permissions

3. **Alternative: Custom Claims** (More Secure, Requires Setup)
   - Custom claims are stored in the Firebase Auth token
   - Don't require extra Firestore reads
   - Require Cloud Functions to set/update
   - See [Custom Claims Setup](#custom-claims-setup-optional) below

## Testing After Rule Update

1. **Apply the rules** using Method 1 or 2 above
2. **Wait 10-30 seconds** for rules to propagate
3. **Refresh your browser** (hard refresh: Ctrl+Shift+R)
4. **Try adding a user** again in the admin dashboard
5. You should see a success message!

## Troubleshooting

### "Still getting permission denied"

1. **Check rule deployment**:

   - Go to Firebase Console → Firestore → Rules
   - Verify the new rules are there
   - Check the "Last deployed" timestamp

2. **Verify your admin status**:

   ```javascript
   // In browser console
   console.log("My user ID:", firebase.auth().currentUser.uid);
   // Go to Firestore and verify this user has isAdmin: true
   ```

3. **Check browser console** for specific error details

4. **Try signing out and back in** to refresh your session

### "Function not found: isAdmin"

- Make sure you copied the ENTIRE rules including the `isAdmin()` function definition
- The function must be defined INSIDE the `match /databases/{database}/documents` block

### "Invalid token" errors

- Sign out and sign back in to get a fresh token
- Clear browser cache and cookies

## Custom Claims Setup (Optional)

For production environments with many admins, custom claims are more efficient:

### Create Cloud Function

```typescript
// functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const setAdminClaim = functions.https.onCall(async (data, context) => {
  // Only existing admins can set admin claims
  if (!context.auth?.token?.admin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can set admin claims",
    );
  }

  const { uid, isAdmin } = data;

  await admin.auth().setCustomUserClaims(uid, { admin: isAdmin });

  return { success: true };
});
```

### Then use the original rules

```javascript
allow write: if request.auth != null &&
                request.auth.token.admin == true;
```

---

## Quick Reference

| What           | Where           | Value              |
| -------------- | --------------- | ------------------ |
| Database Name  | Firestore       | `aiml-coe-web-app` |
| Collection     | Firestore       | `userPermissions`  |
| Admin Field    | Document        | `isAdmin: true`    |
| Security Rules | Firestore Rules | See above          |

---

**Next Steps**: Apply the security rules and try adding a user again!
