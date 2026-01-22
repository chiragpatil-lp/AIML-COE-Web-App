# Pillar Authentication - Quick Reference

**Last Updated**: January 22, 2026
**Status**: ✅ Production Ready

This is a quick reference guide for the most common operations related to Pillar authentication.

---

## 🚀 Quick Start - Local Development

### 1. Authenticate with Google Cloud

```bash
gcloud auth application-default login
```

### 2. Configure Main App

Create `frontend/.env.local` in the main app directory:

```env
NEXT_PUBLIC_PILLAR_1_URL=http://localhost:3001
```

### 3. Configure Pillar App

Create pillar app `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=search-ahmed
PILLAR_NUMBER=1
SESSION_SECRET=local-dev-secret-must-be-32-chars-long-minimum
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Grant Yourself Access

Firebase Console → Firestore → `aiml-coe-web-app` → `userPermissions` → Your UID → Set `isAdmin: true`

### 5. Start Servers

```bash
# Terminal 1 - Main App
cd AIML-COE-Web-App/frontend
pnpm dev

# Terminal 2 - Pillar 1
cd aiml-coe-pillar-strategy-value-dashboard/frontend
pnpm dev --port 3001
```

---

## 🔐 Granting User Access

### Make Someone an Admin (Full Access)

1. Firebase Console: https://console.firebase.google.com/project/search-ahmed/firestore
2. Database: `aiml-coe-web-app`
3. Collection: `userPermissions`
4. Find user document (by email or UID)
5. Set `isAdmin: true`
6. User signs out and back in

### Grant Access to Specific Pillar

1. Same as above, but:
2. Set `pillars.pillar1: true` (for Pillar 1)
3. Set `pillars.pillar2: true` (for Pillar 2)
4. etc.

---

## 🔑 Session Secrets

### What is SESSION_SECRET?

- Encrypts session cookies in Pillar apps
- **Must be at least 32 characters**
- Should be cryptographically random
- Different for each environment

### Generate a Secure Secret

```bash
openssl rand -base64 32
```

### Local Development

- Store in `.env.local` file
- Example: `SESSION_SECRET=local-dev-secret-must-be-32-chars-long-minimum`

### Production

```bash
# Upload to Google Secret Manager
openssl rand -base64 32 | \
gcloud secrets versions add pillar-1-session-secret --data-file=-

# Verify
gcloud secrets versions list pillar-1-session-secret
```

---

## 🏗️ Production Deployment

### Main App

1. Set GitHub Secrets (see PRODUCTION-DEPLOYMENT-CHECKLIST.md)
2. Push to `main` branch
3. GitHub Actions deploys automatically
4. Get URL:
   ```bash
   gcloud run services describe aiml-coe-web-app --region=us-central1 --format='value(status.url)'
   ```

### Pillar App

1. Generate and upload SESSION_SECRET (see above)
2. Set GitHub Secrets for pillar
3. Push to `main` branch
4. GitHub Actions deploys automatically
5. Get URL:
   ```bash
   gcloud run services describe aiml-coe-pillar-1 --region=us-central1 --format='value(status.url)'
   ```
6. Update main app's `PILLAR_1_URL` secret with this URL
7. Redeploy main app

---

## 🐛 Common Issues

### "User not found in database"

**Fix**: Grant user access in Firestore (see above)

### "iron-session: Password must be at least 32 characters long"

**Fix**: Generate new secret with `openssl rand -base64 32`

### "Access denied to Pillar X"

**Fix**: Set `isAdmin: true` or `pillars.pillarX: true` in Firestore

### Redirect to `/auth/unauthorized`

**Fix**: Check token is in URL, verify Firestore permissions, check logs

---

## 📊 Monitoring

### View Logs

```bash
# Main app logs
gcloud run services logs read aiml-coe-web-app --region=us-central1 --limit=50

# Pillar app logs
gcloud run services logs read aiml-coe-pillar-1 --region=us-central1 --limit=50

# Filter for errors
gcloud run services logs read aiml-coe-pillar-1 --region=us-central1 --filter="severity>=ERROR" --limit=50
```

### Check Service Status

```bash
# Main app
gcloud run services describe aiml-coe-web-app --region=us-central1

# Pillar app
gcloud run services describe aiml-coe-pillar-1 --region=us-central1
```

---

## 🔄 Maintenance

### Rotate Session Secret (Optional - Best Practice)

**Do you need to rotate?** ❌ No - it's optional but recommended for security

**When to rotate:**

- Optional: Every 3-6 months (security best practice)
- Required: After security incident or compromise

```bash
# Generate new secret
NEW_SECRET=$(openssl rand -base64 32)

# Upload to Secret Manager
echo "$NEW_SECRET" | gcloud secrets versions add pillar-1-session-secret --data-file=-

# Redeploy pillar app (automatic, triggered by GitHub Actions on next push)
```

**Impact**: All users will need to re-authenticate after rotation.

**Recommendation**: Set a strong secret during initial setup and leave it unchanged unless your organization's security policy requires rotation or there's a security incident.

### Audit User Permissions (Monthly)

1. Go to Firebase Console → Firestore → `aiml-coe-web-app` → `userPermissions`
2. Review all user documents
3. Remove access for departed users
4. Ensure permissions match organizational roles

### Update Dependencies (Monthly)

```bash
cd frontend
pnpm update
pnpm audit
pnpm build  # Ensure no breaking changes
```

---

## 📝 Important Files

### Main App

- `/app/api/pillar/[id]/route.ts` - Pillar redirect API
- `/components/dashboard/PillarGrid.tsx` - Pillar cards UI
- `/.env.local` - Local environment (gitignored)
- `/docs/PILLAR-AUTHENTICATION.md` - Complete guide

### Pillar App (in separate pillar repositories)

- `/app/auth/verify/route.ts` - Token verification endpoint
- `/middleware.ts` - Route protection
- `/lib/auth/session.ts` - Session management
- `/lib/auth/verify-token.ts` - Token verification logic
- `/lib/firebase/admin.ts` - Firebase Admin SDK setup
- `/.env.local` - Local environment (gitignored)
- `/SETUP.md` - Complete setup guide

---

## 📚 Full Documentation

For detailed information, see:

1. **[PILLAR-AUTHENTICATION.md](./PILLAR-AUTHENTICATION.md)** - Complete authentication guide
2. **[PRODUCTION-DEPLOYMENT-CHECKLIST.md](./PRODUCTION-DEPLOYMENT-CHECKLIST.md)** - Production deployment
3. **[Firebase Authentication Setup](./firebase/FIREBASE-AUTH-COMPLETE-SETUP.md)** - Firebase auth setup
4. **[Pillar 1 SETUP.md](../../aiml-coe-pillar-strategy-value-dashboard/SETUP.md)** - Pillar app setup

---

## 🆘 Getting Help

- **Documentation Issues**: Check [PILLAR-AUTHENTICATION.md](./PILLAR-AUTHENTICATION.md)
- **Deployment Issues**: Check [PRODUCTION-DEPLOYMENT-CHECKLIST.md](./PRODUCTION-DEPLOYMENT-CHECKLIST.md)
- **Firebase Issues**: Check [Firebase docs](./firebase/)
- **Logs**: Use `gcloud run services logs read SERVICE_NAME --region=us-central1`

---

## Key Concepts

### Authentication Flow

```
User clicks Pillar card
  ↓
Main app /api/pillar/1 (server-side)
  ↓
Redirects to: pillar-url/auth/verify?token=...&pillar=1
  ↓
Pillar verifies token, checks Firestore
  ↓
Creates encrypted session
  ↓
Redirects to Pillar dashboard
```

### Firestore Schema

```javascript
Collection: userPermissions (in 'aiml-coe-web-app' database)
Document ID: {user_uid}

{
  userId: "abc123",
  email: "user@example.com",
  isAdmin: false,  // true = access to all pillars
  pillars: {
    pillar1: true,   // true = access to this pillar
    pillar2: false,
    pillar3: false,
    pillar4: false,
    pillar5: false,
    pillar6: false
  }
}
```

### Environment Variables

**Main App** (must have `NEXT_PUBLIC_` prefix for client-side):

- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase client API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app ID
- `FIREBASE_SERVICE_ACCOUNT_KEY` - (Server-side) Full JSON service account key
- `NEXT_PUBLIC_PILLAR_1_URL` through `NEXT_PUBLIC_PILLAR_6_URL` - Pillar URLs

**Pillar App**:

- `SESSION_SECRET` - 32+ char encryption key (from Secret Manager in prod)
- `PILLAR_NUMBER` - Which pillar this is (1-6)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- `NEXT_PUBLIC_MAIN_APP_URL` - Main app URL (for logout redirect)

---

**For complete details, see [PILLAR-AUTHENTICATION.md](./PILLAR-AUTHENTICATION.md)**
