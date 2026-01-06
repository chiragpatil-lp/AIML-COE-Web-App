# Manual Firestore Rules Update for aiml-coe-web-app Database

## Quick Fix Steps

### Step 1: Check Your Admin Status

1. **Refresh your browser** on the admin dashboard
2. **Open Browser Console** (F12 or Ctrl+Shift+I)
3. **Look for** `=== ADMIN DEBUG INFO ===`
4. **Copy the User ID** shown in the console

### Step 2: Verify Your User Document in Firestore

1. Go to: https://console.firebase.google.com/project/search-ahmed/firestore/databases/aiml-coe-web-app/data/~2FuserPermissions

2. Look for a document with YOUR User ID (from Step 1)

3. Verify it has:
   ```json
   {
     "userId": "YOUR_USER_ID",
     "email": "your.email@example.com",
     "isAdmin": true,  // ← Must be true!
     "pillars": { ... },
     "createdAt": ...,
     "updatedAt": ...
   }
   ```

4. **If `isAdmin` is false or missing**, click the document and edit it to set `isAdmin: true`

### Step 3: Update Firestore Rules (Manual Method)

**Option A: Via Firebase Console (Recommended)**

1. Go to: https://console.firebase.google.com/project/search-ahmed/firestore/rules

2. **IMPORTANT**: At the top, select database: **`aiml-coe-web-app`** from the dropdown

3. Replace ALL the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/userPermissions/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/userPermissions/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // User permissions collection
    match /userPermissions/{userId} {
      // Users can read their own permissions, and admins can read all permissions
      allow read: if (request.auth != null && request.auth.uid == userId) || isAdmin();
      
      // Admins can create/update/delete any permissions
      allow write: if isAdmin();
    }
  }
}
```

4. Click **"Publish"**

5. Wait 10-30 seconds for rules to propagate

**Option B: Via gcloud (If Console doesn't work)**

```bash
# 1. Create a rules file specifically for aiml-coe-web-app
cat > firestore-aiml-coe-web-app.rules << 'EOF'
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
  }
}
EOF

# 2. Install alpha components (if not already installed)
gcloud components install alpha --quiet

# 3. Deploy rules to the specific database
gcloud alpha firestore rules deploy \
  --database=aiml-coe-web-app \
  --project=search-ahmed \
  firestore-aiml-coe-web-app.rules
```

### Step 4: Clear Browser Cache and Test

1. **Sign out** of the application
2. **Clear browser cache** (Ctrl+Shift+Delete)
   - Select "Cookies and other site data"
   - Select "Cached images and files"
   - Click "Clear data"
3. **Close all browser tabs** for your app
4. **Open a fresh tab** and go to `http://localhost:3000`
5. **Sign in again**
6. **Go to** `/admin`
7. **Try adding a user**

### Step 5: Verify Rules Are Active

In browser console, you should see:

```
=== ADMIN DEBUG INFO ===
User ID: [your-uid]
Email: [your-email]
Is Admin: true
======================
```

Then when you try to add a user, you should NOT see the permission error.

---

## Troubleshooting

### "Still getting permission denied"

**Check 1: Correct Database Selected**
- In Firebase Console → Firestore → Rules
- Verify dropdown shows `aiml-coe-web-app` (NOT "(default)")

**Check 2: Your User Document**
- User ID in console matches document ID in Firestore
- `isAdmin: true` is set correctly (boolean, not string)

**Check 3: Rules Published**
- Check "Last published" timestamp is recent
- Wait 30 seconds after publishing

**Check 4: Fresh Authentication**
- Sign out completely
- Clear cookies
- Sign back in
- Your auth token needs to be fresh

### "Can't find my user document"

Your user document should be at:
```
Collection: userPermissions
Document ID: [Your User ID from console]
```

If it doesn't exist:
1. Go to Firestore Console
2. Navigate to `userPermissions` collection
3. Click "Add document"
4. Document ID: [Your User ID]
5. Add fields:
   - `userId`: [Your User ID] (string)
   - `email`: [Your Email] (string)
   - `isAdmin`: `true` (boolean)
   - `pillars`: (map with pillar1-pillar6 all set to `false`)
   - `createdAt`: (timestamp - current time)
   - `updatedAt`: (timestamp - current time)

### "Rules not deploying"

If using Firebase Console and rules won't publish:
1. Check for syntax errors (red underlines)
2. Make sure you selected the correct database from dropdown
3. Try using gcloud method instead (Option B above)

---

## What the Rules Do

### Before (Broken - Uses Custom Claims):
```javascript
allow write: if request.auth.token.admin == true;
```
This checks for a custom claim which you don't have set.

### After (Working - Uses Firestore Document):
```javascript
function isAdmin() {
  return request.auth != null &&
         exists(/databases/$(database)/documents/userPermissions/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/userPermissions/$(request.auth.uid)).data.isAdmin == true;
}

allow write: if isAdmin();
```
This checks your Firestore document's `isAdmin` field.

---

## After Fixing

Once it works, you should be able to:
- ✅ Add new users by email
- ✅ Edit existing user permissions
- ✅ Toggle admin status for users
- ✅ Manage pillar access

---

## Need More Help?

Share these from your browser console:
1. The `=== ADMIN DEBUG INFO ===` output
2. Your User ID
3. Screenshot of your Firestore user document
4. Screenshot of the Firebase Rules console showing which database is selected

