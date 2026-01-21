# Firestore Security Rules for AIML COE Web App

## Overview

The AIML COE Web App uses a **hybrid approach** for admin authorization:

1. **Custom Claims**: Set on user tokens via `setCustomUserClaims()` for fast, token-based checks
2. **Firestore Document**: `userPermissions/{userId}` contains `isAdmin` field as source of truth
3. **Security Rules**: Currently use Firestore document checks (not custom claims)

**Database**: `aiml-coe-web-app` (named Firestore database)

## Current Deployed Rules

These are the **currently active** rules in `firestore.rules`:

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

**Note**: The `adminAuditLog` collection is written to by the application but has no explicit security rules currently. This should be addressed in production.

## How to Deploy These Rules

### Method 1: Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `search-ahmed`
3. Click **Firestore Database** in the left sidebar
4. **IMPORTANT**: Select database **`aiml-coe-web-app`** from the dropdown at the top
5. Click the **Rules** tab
6. Replace the existing rules with the rules above
7. Click **Publish**

### Method 2: Firebase CLI

The project is already configured to deploy rules from `firestore.rules`:

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules
```

**Configuration** (from `firebase.json`):
```json
{
  "firestore": {
    "databases": {
      "aiml-coe-web-app": {
        "rules": "firestore.rules"
      }
    }
  }
}
```

## Implementation Details

### Current Approach: Firestore Document Check

The deployed rules check the Firestore `userPermissions` collection:

```javascript
// ✅ Current implementation (firestore.rules)
function isAdmin() {
  return request.auth != null &&
         exists(/databases/$(database)/documents/userPermissions/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/userPermissions/$(request.auth.uid)).data.isAdmin == true;
}

allow write: if isAdmin();
```

**Pros:**
- Simple to implement
- No Cloud Functions required for rule evaluation
- Works immediately

**Cons:**
- Extra Firestore read on every admin operation (counts against quota)
- Slightly higher latency

### Alternative Approach: Custom Claims (Available in backup)

The `firestore.rules.backup` file contains an alternative implementation using custom claims:

```javascript
// Alternative approach (firestore.rules.backup)
function isAdmin() {
  return request.auth != null && request.auth.token.admin == true;
}
```

**Pros:**
- No extra Firestore reads (token-based)
- Faster evaluation
- More scalable

**Cons:**
- Requires Cloud Function to set/update claims
- Token refresh needed when claims change
- More complex to set up

### Hybrid Implementation in Code

The application code uses **both approaches**:

1. **Custom claims are set** when admin status changes:
   - `frontend/app/api/admin/set-admin-claim/route.ts`
   - `functions/src/index.ts` (`setAdminClaim` function)
   - Both call `auth().setCustomUserClaims(userId, { admin: isAdmin })`

2. **Firestore document is updated** simultaneously:
   - Keeps `userPermissions/{userId}.isAdmin` in sync
   - Used by security rules for authorization

3. **Audit logging** to `adminAuditLog` collection:
   - Records all admin claim changes
   - Currently lacks security rules (should be added)

## Security Considerations

### Current Rules (Firestore Document Check)

1. **Extra Firestore Read on Each Admin Operation**
   - The `isAdmin()` function makes an additional read to check permissions
   - This counts against your Firestore read quota
   - Estimated usage: 5 admins × 100 operations/day = 500 extra reads/day
   - Well within free tier (50,000 reads/day)

2. **Users Cannot Escalate Their Own Privileges**
   - The `isAdmin()` check happens BEFORE the write
   - Users cannot write to their own document to make themselves admin
   - Only existing admins can modify permissions

3. **Custom Claims Are Also Set (Hybrid Approach)**
   - Code sets both custom claims AND Firestore document
   - Custom claims are available in `request.auth.token.admin`
   - Could switch to custom claims in rules for better performance

4. **⚠️ Missing Security Rule: adminAuditLog Collection**
   - The application writes audit logs to `adminAuditLog` collection
   - **No security rules currently protect this collection**
   - **Recommended fix**: Add the following to `firestore.rules`:
     ```javascript
     match /adminAuditLog/{logId} {
       allow read: if isAdmin();
       allow write: if isAdmin();
     }
     ```

### Switching to Custom Claims (Optional)

To use custom claims in security rules (better performance):

1. Copy rules from `firestore.rules.backup`
2. Deploy the updated rules
3. Have users sign out and back in to refresh tokens

**Trade-off**: Requires token refresh when admin status changes, but eliminates extra Firestore reads.

## Testing After Rule Updates

1. **Deploy the rules** using Method 1 or 2 above
2. **Wait 10-30 seconds** for rules to propagate globally
3. **Hard refresh your browser** (Ctrl+Shift+R or Cmd+Shift+R)
4. **Test admin operations**:
   - Add a user in the admin dashboard
   - Update user permissions
   - Delete a user
5. **Check browser console** for any permission errors

### Verification Steps

**Check your admin status:**
```javascript
// In browser console
const user = firebase.auth().currentUser;
console.log("User ID:", user?.uid);

// Check custom claim (if set)
user?.getIdTokenResult().then(token => {
  console.log("Admin claim:", token.claims.admin);
});
```

**Verify Firestore document:**
1. Go to Firebase Console → Firestore → `aiml-coe-web-app` database
2. Open `userPermissions` collection
3. Find your user document by UID
4. Verify `isAdmin: true`

## Troubleshooting

### "Permission denied" errors

1. **Verify rules are deployed to the correct database:**
   - Go to Firebase Console → Firestore → Rules
   - Ensure database dropdown shows `aiml-coe-web-app`
   - Check "Last deployed" timestamp is recent

2. **Check your admin status in Firestore:**
   ```javascript
   // Browser console
   firebase.auth().currentUser?.uid
   // Copy this UID, then check in Firestore Console:
   // aiml-coe-web-app/userPermissions/{your-uid}
   // Verify: isAdmin === true
   ```

3. **Verify the rules function is defined:**
   - Ensure the `isAdmin()` function is inside the `match /databases/{database}/documents` block
   - Function must be defined BEFORE it's used

4. **Check browser console for detailed errors:**
   - Open Developer Tools (F12)
   - Look for Firebase permission errors
   - Error messages will indicate which rule failed

### "Function not found: isAdmin" error

- The function definition is missing or in the wrong location
- Copy the ENTIRE rules file including the function definition
- Function must be defined inside `match /databases/{database}/documents {}`

### "Invalid token" or "Token expired" errors

- Sign out and sign back in to refresh your Firebase token
- Clear browser cache and cookies
- If using custom claims (backup rules), users must refresh tokens after admin status changes

### Rules not taking effect

1. **Wrong database selected:**
   - Rules must be deployed to `aiml-coe-web-app` database specifically
   - Check the database dropdown in Firebase Console

2. **Propagation delay:**
   - Wait 30-60 seconds after deploying
   - Hard refresh browser (Ctrl+Shift+R)

3. **Cached tokens:**
   - Sign out and back in
   - Clear browser storage

### AdminAuditLog permission denied

The `adminAuditLog` collection is not protected by security rules in the current `firestore.rules`. If you see errors:

1. Add rules for `adminAuditLog` (see Security Considerations section)
2. Deploy updated rules
3. Test again

## Recommended Production Setup

### Add adminAuditLog Protection

Add to `firestore.rules` before the closing braces:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/userPermissions/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/userPermissions/$(request.auth.uid)).data.isAdmin == true;
    }

    match /userPermissions/{userId} {
      allow read: if (request.auth != null && request.auth.uid == userId) || isAdmin();
      allow write: if isAdmin();
    }
    
    // ADD THIS:
    match /adminAuditLog/{logId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
  }
}
```

### Consider Migrating to Custom Claims

For production at scale, consider switching to custom claims (available in `firestore.rules.backup`):

**Benefits:**
- Eliminates extra Firestore reads (better performance)
- Lower latency for admin checks
- More scalable for high-traffic scenarios

**Implementation:**
1. Custom claim setting is already implemented in the code
2. Copy rules from `firestore.rules.backup` to `firestore.rules`
3. Deploy: `firebase deploy --only firestore:rules`
4. Have all users sign out and back in to refresh tokens

**Trade-offs:**
- Requires token refresh when admin status changes
- Users see old admin status until they refresh their session

## Quick Reference

| Item                    | Value                          | Location                               |
| ----------------------- | ------------------------------ | -------------------------------------- |
| Firebase Project        | `search-ahmed`                 | Firebase Console                       |
| Firestore Database Name | `aiml-coe-web-app`             | Named database (not default)           |
| Rules File              | `firestore.rules`              | Repository root                        |
| Backup Rules File       | `firestore.rules.backup`       | Repository root (custom claims)        |
| Permissions Collection  | `userPermissions`              | Firestore                              |
| Audit Log Collection    | `adminAuditLog`                | Firestore (⚠️ needs security rules)    |
| Admin Field             | `isAdmin: boolean`             | `userPermissions/{userId}`             |
| Custom Claim            | `admin: boolean`               | Firebase Auth token (also set by code) |
| Deploy Command          | `firebase deploy --only firestore:rules` | From repository root          |

---

**Related Documentation:**
- [Admin Dashboard](./ADMIN-DASHBOARD.md)
- [Cloud Functions](./CLOUD-FUNCTIONS.md)
- [Firebase Auth Setup](./firebase/FIREBASE-AUTH-COMPLETE-SETUP.md)
