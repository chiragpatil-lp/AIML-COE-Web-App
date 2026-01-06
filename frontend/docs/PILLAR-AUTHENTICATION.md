# Pillar Authentication & Redirect Flow

**Last Updated**: December 30, 2024
**Status**: ✅ Implemented and Tested

---

## Table of Contents

1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Architecture](#architecture)
4. [Local Development Setup](#local-development-setup)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)
7. [Security Considerations](#security-considerations)
8. [Maintenance Activities](#maintenance-activities)

---

## Overview

This document explains how users are securely redirected from the main AIML COE Web App to individual Pillar applications with single sign-on (SSO) authentication.

### Key Features

- **Single Sign-On**: Users sign in once to the main app
- **Token-based Authentication**: Firebase ID tokens passed to Pillar apps
- **Permission Verification**: Server-side validation of user access
- **Encrypted Sessions**: Pillar apps use iron-session for secure session management
- **Seamless UX**: Opens Pillar apps in new tab with clean URLs

---

## How It Works

### Authentication Flow

```
1. User clicks Pillar card in dashboard
   ↓
2. Main app opens /api/pillar/{id} in new tab
   ↓
3. Main app API route:
   - Retrieves Firebase token from cookies
   - Verifies user authentication
   - Checks user permissions in Firestore
   - Redirects to Pillar's /auth/verify endpoint with token
   ↓
4. Pillar app /auth/verify endpoint:
   - Receives Firebase token as query parameter
   - Verifies token with Firebase Admin SDK
   - Looks up user permissions in Firestore
   - Creates encrypted session cookie (iron-session)
   - Redirects to Pillar dashboard
   ↓
5. User accesses Pillar app
   - All subsequent requests use session cookie
   - No token in URL (clean, secure)
```

### URL Flow Example

```
Dashboard Click
  ↓
https://main-app.run.app/api/pillar/1
  ↓ (302 Redirect)
https://pillar-1.run.app/auth/verify?token={firebase_token}&pillar=1
  ↓ (302 Redirect after session creation)
https://pillar-1.run.app/
  ↓
User sees Pillar 1 Dashboard
```

---

## Architecture

### Main App Components

#### 1. `/app/api/pillar/[id]/route.ts`

**Purpose**: Server-side endpoint that validates and redirects users to Pillar apps

**Key Functions**:

- Retrieves Firebase ID token from cookies (Next.js 16+ requires `await cookies()`)
- Verifies token authenticity with Firebase Admin SDK
- Checks user permissions in Firestore (`userPermissions` collection)
- Constructs redirect URL with token: `{pillar_url}/auth/verify?token={token}&pillar={id}`

**Important Implementation Details**:

```typescript
// CRITICAL: In Next.js 15+, cookies() returns a Promise
const cookieStore = await cookies(); // ✅ Must await

// Construct verify URL with token
const verifyUrl = new URL(`/auth/verify`, pillarUrl);
verifyUrl.searchParams.set("token", token);
verifyUrl.searchParams.set("pillar", id);

// Redirect to Pillar's verify endpoint
return NextResponse.redirect(verifyUrl.toString(), { status: 302 });
```

#### 2. `/components/dashboard/PillarGrid.tsx`

**Purpose**: Dashboard UI that displays pillar cards and handles clicks

**Key Functions**:

```typescript
const handlePillarClick = (pillar: PillarInfo, hasAccess: boolean) => {
  if (!hasAccess || pillar.url === "#") {
    return;
  }

  // Token is sent automatically via cookie set by AuthContext
  const apiUrl = `/api/pillar/${pillar.number}`;

  // Open in new tab with the API endpoint that will verify and redirect
  window.open(apiUrl, "_blank", "noopener,noreferrer");
};
```

### Pillar App Components

Each Pillar app must implement:

#### 1. `/app/auth/verify/route.ts`

**Purpose**: Receives token from main app, verifies it, creates session

**Key Functions**:

- Accepts `token` and `pillar` query parameters
- Verifies token with Firebase Admin SDK
- Checks user permissions in Firestore
- Creates encrypted session using iron-session
- Redirects to dashboard with clean URL

#### 2. `/middleware.ts`

**Purpose**: Protects all routes except public paths

**Key Functions**:

- Checks for valid session on every request
- Redirects to `/auth/unauthorized` if no session
- Allows public paths: `/auth/verify`, `/auth/unauthorized`, `/auth/logout`

#### 3. `/lib/auth/session.ts`

**Purpose**: Manages encrypted session cookies using iron-session

**Key Configuration**:

```typescript
const sessionOptions = {
  password: process.env.SESSION_SECRET!, // Must be 32+ characters
  cookieName: process.env.SESSION_COOKIE_NAME || "pillar_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};
```

---

## Local Development Setup

### Prerequisites

1. **Google Cloud CLI** installed and authenticated
2. **Main app** running on port 3000
3. **Pillar app** running on port 3001 (or other port)

### Step 1: Authenticate with Google Cloud

```bash
gcloud auth application-default login
```

This allows Firebase Admin SDK to work locally without service account JSON files.

### Step 2: Configure Main App

Create `.env.local` in the main app:

```bash
# /home/lordpatil/AIML-COE-Web-App/frontend/.env.local
NEXT_PUBLIC_PILLAR_1_URL=http://localhost:3001
NEXT_PUBLIC_PILLAR_2_URL=http://localhost:3002
# ... etc
```

### Step 3: Configure Pillar App

Create `.env.local` in the Pillar app:

```bash
# Example: Pillar 1 .env.local
NEXT_PUBLIC_FIREBASE_PROJECT_ID=search-ahmed
PILLAR_NUMBER=1
SESSION_SECRET=local-dev-secret-must-be-32-chars-long-minimum
SESSION_MAX_AGE=86400
SESSION_COOKIE_NAME=pillar_session
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000
NODE_ENV=development
```

**IMPORTANT**: `SESSION_SECRET` must be at least 32 characters long!

### Step 4: Set Up Firestore Permissions

Ensure your user has permissions in Firestore:

1. Go to Firebase Console → Firestore Database
2. Select database: `aiml-coe-web-app`
3. Navigate to `userPermissions` collection
4. Find your user document (by UID)
5. Set `isAdmin: true` OR set specific pillar access: `pillars.pillar1: true`

### Step 5: Start Development Servers

**Terminal 1 - Main App**:

```bash
cd /home/lordpatil/AIML-COE-Web-App/frontend
pnpm dev
```

**Terminal 2 - Pillar 1**:

```bash
cd /home/lordpatil/aiml-coe-pillar-strategy-value-dashboard/frontend
pnpm dev --port 3001
```

### Step 6: Test

1. Open `http://localhost:3000`
2. Sign in with Google
3. Go to Dashboard
4. Click Pillar 1 card
5. Should redirect to `http://localhost:3001/auth/verify?token=...`
6. Then redirect to `http://localhost:3001` (Pillar 1 dashboard)

---

## Production Deployment

### Main App Production Setup

#### 1. GitHub Secrets Configuration

Set the following secrets in GitHub repository settings:

| Secret Name                    | Value                                 | Purpose                        |
| ------------------------------ | ------------------------------------- | ------------------------------ |
| `FIREBASE_API_KEY`             | From Firebase Console                 | Client-side Firebase config    |
| `FIREBASE_AUTH_DOMAIN`         | `search-ahmed.firebaseapp.com`        | Firebase auth domain           |
| `FIREBASE_PROJECT_ID`          | `search-ahmed`                        | Firebase project ID            |
| `FIREBASE_STORAGE_BUCKET`      | From Firebase Console                 | Firebase storage               |
| `FIREBASE_MESSAGING_SENDER_ID` | From Firebase Console                 | Firebase messaging             |
| `FIREBASE_APP_ID`              | From Firebase Console                 | Firebase app ID                |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Full JSON from Firebase Console       | Server-side Firebase Admin SDK |
| `PILLAR_1_URL`                 | `https://aiml-coe-pillar-1-*.run.app` | Pillar 1 production URL        |
| `PILLAR_2_URL`                 | `https://aiml-coe-pillar-2-*.run.app` | Pillar 2 production URL        |
| ...                            | ...                                   | ...                            |
| `PILLAR_6_URL`                 | `https://aiml-coe-pillar-6-*.run.app` | Pillar 6 production URL        |

#### 2. Deployment

The main app deploys automatically when you push to `main`:

```bash
git add .
git commit -m "feat: update pillar authentication"
git push origin main
```

GitHub Actions will:

1. Build Docker image with environment variables
2. Push to Google Container Registry
3. Deploy to Cloud Run
4. Set environment variables from secrets

### Pillar App Production Setup

For each Pillar app (example: Pillar 1):

#### 1. Create Session Secret

```bash
# Generate a secure random secret
openssl rand -base64 32

# Upload to Google Secret Manager
openssl rand -base64 32 | \
gcloud secrets versions add pillar-1-session-secret --data-file=-
```

**What is SESSION_SECRET?**

`SESSION_SECRET` is a cryptographic key used by `iron-session` to encrypt session cookies. It:

- **Encrypts session data** stored in cookies
- **Signs cookies** to prevent tampering
- **Must be at least 32 characters** long
- **Should be cryptographically random** (use `openssl rand -base64 32`)
- **Should never be committed** to version control
- **Should be different** for each environment (dev, staging, prod)

**Why it matters**:

- If compromised, attackers can forge session cookies
- If changed, all existing user sessions are invalidated
- Must be consistent across all app instances (horizontal scaling)

#### 2. GitHub Secrets for Pillar App

| Secret Name                      | Value                                | Purpose                        |
| -------------------------------- | ------------------------------------ | ------------------------------ |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | From Terraform output                | GitHub Actions auth            |
| `GCP_SERVICE_ACCOUNT`            | `github-ci-cd@...`                   | Service account for deployment |
| `GCP_PROJECT_ID`                 | `search-ahmed`                       | GCP project ID                 |
| `MAIN_APP_URL`                   | `https://aiml-coe-web-app-*.run.app` | Main app production URL        |

#### 3. Deploy Pillar App

```bash
cd /path/to/pillar-app
git add .
git commit -m "feat: configure production deployment"
git push origin main
```

Cloud Run deployment will:

1. Pull `SESSION_SECRET` from Secret Manager
2. Set environment variables
3. Use Cloud Run service account for Firebase Admin SDK (Application Default Credentials)

#### 4. Update Main App with Pillar URL

After deploying the Pillar app, get its URL:

```bash
gcloud run services describe aiml-coe-pillar-1 \
  --region=us-central1 \
  --format='value(status.url)'
```

Update the `PILLAR_1_URL` secret in the main app's GitHub repository, then redeploy the main app.

---

## Troubleshooting

### Issue: "An error occurred while processing your request"

**Cause**: Missing `await` for `cookies()` in Next.js 15+

**Solution**: Ensure the API route uses:

```typescript
const cookieStore = await cookies(); // ✅ Correct
// NOT: const cookieStore = cookies();  // ❌ Wrong in Next.js 15+
```

### Issue: "User not found in database"

**Causes**:

1. User doesn't have permissions in Firestore
2. Pillar app is looking in wrong Firestore database
3. Wrong collection name

**Solutions**:

1. Check Firestore `userPermissions` collection in `aiml-coe-web-app` database
2. Ensure Pillar app uses:
   ```typescript
   getFirestore(app, "aiml-coe-web-app"); // ✅ Named database
   // NOT: getFirestore()  // ❌ Default database
   ```
3. Verify collection is `userPermissions` not `users`

### Issue: "iron-session: Password must be at least 32 characters long"

**Cause**: `SESSION_SECRET` is too short

**Solution**:

```bash
# Generate a proper secret (44 characters)
openssl rand -base64 32
```

Update `.env.local` or Secret Manager with the new value.

### Issue: "Access denied to Pillar X"

**Cause**: User doesn't have permission for this pillar

**Solution**:

1. Go to Firebase Console → Firestore
2. Database: `aiml-coe-web-app`
3. Collection: `userPermissions`
4. Document: `{user_uid}`
5. Set either:
   - `isAdmin: true` (full access to all pillars)
   - `pillars.pillar1: true` (specific pillar access)

### Issue: Redirect to `/auth/unauthorized` on Pillar

**Causes**:

1. Token not being passed correctly
2. Token expired (1 hour expiry)
3. Firebase Admin SDK not configured

**Solutions**:

1. Check URL has token: `/auth/verify?token=...&pillar=1`
2. Sign out and sign in again to get fresh token
3. Run `gcloud auth application-default login` (local dev)

---

## Security Considerations

### Token Security

1. **Short-lived tokens**: Firebase ID tokens expire after 1 hour
2. **HTTPS only in production**: Tokens transmitted over secure connection
3. **HttpOnly cookies**: Session cookies not accessible to JavaScript
4. **Server-side verification**: Tokens verified with Firebase Admin SDK

### Session Security

1. **Encrypted sessions**: iron-session encrypts all session data
2. **Secure cookies**: `secure: true` in production forces HTTPS
3. **Session expiry**: Configurable via `SESSION_MAX_AGE`
4. **No token in URL**: Token removed after session creation

### Permission Security

1. **Server-side checks**: Both main app and Pillar apps verify permissions
2. **Firestore rules**: Prevent users from modifying their own permissions
3. **Admin-only writes**: Only admins can modify user permissions

### Best Practices

1. **Never commit secrets**: Use `.env.local` (gitignored) for local dev
2. **Use Secret Manager**: Store production secrets in Google Secret Manager
3. **Rotate secrets**: Periodically rotate `SESSION_SECRET` (invalidates sessions)
4. **Monitor access**: Log pillar access for audit purposes
5. **Least privilege**: Only grant necessary pillar access to users

---

## Maintenance Activities

### Regular Maintenance

#### 1. Session Secret Rotation (Optional - Security Best Practice)

**Required?** ❌ No - Once set, the SESSION_SECRET can remain unchanged indefinitely

**Recommended?** ✅ Yes - As a security best practice, rotate every 3-6 months

**When to rotate:**

- **Optional**: Every 3-6 months (security best practice)
- **Required**: After security incident or if secret is compromised

**Steps**:

```bash
# Generate new secret
NEW_SECRET=$(openssl rand -base64 32)

# Upload to Secret Manager
echo "$NEW_SECRET" | gcloud secrets versions add pillar-1-session-secret --data-file=-

# Redeploy Pillar app (picks up new secret automatically)
# Users will need to re-authenticate
```

**Impact**: All existing user sessions are invalidated. Users must click the Pillar card again to create new sessions.

**Note**: Many applications never rotate session secrets unless there's a security incident. The decision to rotate is based on your organization's security policies and risk tolerance.

#### 2. Firebase Token Monitoring

**When**: Monitor Firebase Auth usage monthly

**Check**:

- Token verification success/failure rates
- Authentication errors in logs
- Unusual access patterns

**Command**:

```bash
# Check Cloud Run logs for authentication errors
gcloud run services logs read aiml-coe-pillar-1 \
  --region=us-central1 \
  --filter="textPayload:\"Token verification failed\"" \
  --limit=50
```

#### 3. User Permission Audits

**When**: Monthly or when users change roles

**Steps**:

1. Go to Firebase Console → Firestore
2. Database: `aiml-coe-web-app`
3. Collection: `userPermissions`
4. Review all user documents
5. Ensure permissions match organizational roles
6. Remove access for departed users

#### 4. Firestore Security Rules Review

**When**: Quarterly or when adding new features

**Check**:

```bash
# View current rules
gcloud firestore databases describe aiml-coe-web-app

# Test rules with Firebase Console Rules Playground
```

#### 5. Dependency Updates

**When**: Monthly or when security advisories are released

**Steps**:

```bash
cd frontend
pnpm update
pnpm audit
pnpm build  # Ensure no breaking changes
```

**Critical packages to monitor**:

- `next` - Framework updates
- `firebase` - Client SDK
- `firebase-admin` - Server SDK
- `iron-session` - Session management

### Incident Response

#### Suspected Session Secret Compromise

1. **Immediately rotate** the `SESSION_SECRET`
2. **Review logs** for suspicious access patterns
3. **Audit user sessions** in the affected Pillar
4. **Notify affected users** if necessary

#### Firestore Permission Breach

1. **Review Firestore audit logs**
2. **Check for unauthorized permission changes**
3. **Restore correct permissions** from backup/known good state
4. **Review and update Firestore security rules**

#### Token Replay Attack Detection

1. **Monitor** for multiple simultaneous sessions from different IPs
2. **Implement rate limiting** on `/auth/verify` endpoint
3. **Add additional logging** for token verification

### Monitoring Setup

#### Cloud Run Metrics

Monitor these metrics in Google Cloud Console:

- **Request count** to `/auth/verify`
- **Error rate** (4xx, 5xx responses)
- **Latency** of authentication flow
- **Active instances** (scaling behavior)

#### Custom Alerts

Set up alerts for:

```bash
# Example: Alert on high error rate
gcloud alpha monitoring policies create \
  --notification-channels=YOUR_CHANNEL_ID \
  --display-name="Pillar Auth Errors" \
  --condition-display-name="High Error Rate" \
  --condition-threshold-value=10 \
  --condition-threshold-duration=60s
```

### Backup and Recovery

#### Firestore Backups

**Schedule**: Daily automated backups

**Setup**:

```bash
# Enable automatic backups
gcloud firestore backups schedules create \
  --database=aiml-coe-web-app \
  --recurrence=daily \
  --retention=7d
```

**Restore** (if needed):

```bash
# List backups
gcloud firestore backups list --database=aiml-coe-web-app

# Restore from backup
gcloud firestore import gs://BACKUP_BUCKET/BACKUP_NAME \
  --database=aiml-coe-web-app
```

### Scaling Considerations

#### Horizontal Scaling

Both main app and Pillar apps scale automatically with Cloud Run. Ensure:

1. **Session persistence**: iron-session uses cookies (stateless, scales well)
2. **Firebase quotas**: Monitor Firebase usage for read/write limits
3. **Secret Manager**: Has adequate quota for secret reads

#### Performance Optimization

1. **Cache user permissions**: Implement short-lived cache (5 minutes) to reduce Firestore reads
2. **Connection pooling**: Firebase Admin SDK handles this automatically
3. **CDN**: Use Cloud CDN for static assets

---

## Environment Variables Reference

### Main App

| Variable                                   | Required   | Description             | Example                    |
| ------------------------------------------ | ---------- | ----------------------- | -------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Yes        | Firebase client API key | `AIzaSy...`                |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Yes        | Firebase auth domain    | `project.firebaseapp.com`  |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Yes        | Firebase project ID     | `search-ahmed`             |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Yes        | Firebase storage        | `project.appspot.com`      |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes        | Firebase messaging ID   | `123456789`                |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Yes        | Firebase app ID         | `1:123:web:abc`            |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Optional   | Legacy: Full JSON for Admin SDK | `{...}`                    |
| `FIREBASE_CLIENT_EMAIL`        | Optional   | Admin SDK Client Email          | `admin@project.iam...`     |
| `FIREBASE_PRIVATE_KEY`         | Optional   | Admin SDK Private Key           | `-----BEGIN PRIVATE...`    |
| `NEXT_PUBLIC_PILLAR_1_URL`     | Yes        | Pillar 1 URL                    | `https://pillar-1.run.app` |
| `NEXT_PUBLIC_PILLAR_2_URL`                 | No         | Pillar 2 URL            | `https://pillar-2.run.app` |

### Pillar App

| Variable                          | Required | Description                | Example                |
| --------------------------------- | -------- | -------------------------- | ---------------------- |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes      | Firebase project ID        | `search-ahmed`         |
| `PILLAR_NUMBER`                   | Yes      | Pillar number (1-6)        | `1`                    |
| `SESSION_SECRET`                  | Yes      | 32+ char encryption key    | (from Secret Manager)  |
| `SESSION_MAX_AGE`                 | No       | Session duration (seconds) | `86400` (24h)          |
| `SESSION_COOKIE_NAME`             | No       | Cookie name                | `pillar_session`       |
| `NEXT_PUBLIC_MAIN_APP_URL`        | Yes      | Main app URL               | `https://main.run.app` |
| `NODE_ENV`                        | Yes      | Environment                | `production`           |

---

## Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
- [iron-session Documentation](https://github.com/vvo/iron-session)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Next.js 16 Documentation](https://nextjs.org/docs)

---

**For questions or issues, contact the AIML COE development team.**
