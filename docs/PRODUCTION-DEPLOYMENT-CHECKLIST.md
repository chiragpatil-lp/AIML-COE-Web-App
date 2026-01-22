# Production Deployment Checklist

**Last Updated**: January 22, 2026
**Status**: ✅ Production Ready

This checklist ensures proper deployment of the AIML COE Web App and Pillar applications to production.

---

## Pre-Deployment Checklist

### ✅ Prerequisites

- [ ] Google Cloud CLI installed and configured
- [ ] GitHub repository access with admin permissions
- [ ] Firebase Console access for project `search-ahmed`
- [ ] Access to Google Cloud Console
- [ ] Production URLs identified for all components

---

## Main App Deployment

### 1. GitHub Secrets Configuration

Go to: https://github.com/[YOUR_ORG]/AIML-COE-Web-App/settings/secrets/actions

Create/verify these secrets:

#### Firebase Configuration

- [ ] `FIREBASE_API_KEY` - Get from Firebase Console → Project Settings → General
- [ ] `FIREBASE_AUTH_DOMAIN` - Should be `search-ahmed.firebaseapp.com`
- [ ] `FIREBASE_PROJECT_ID` - Should be `search-ahmed`
- [ ] `FIREBASE_STORAGE_BUCKET` - Get from Firebase Console
- [ ] `FIREBASE_MESSAGING_SENDER_ID` - Get from Firebase Console
- [ ] `FIREBASE_APP_ID` - Get from Firebase Console

#### Firebase Admin SDK

- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` - Full JSON from Firebase Console → Project Settings → Service Accounts → Generate New Private Key

**Note**: In production on Cloud Run, if this variable is not provided, the service will use Application Default Credentials (the service account attached to the Cloud Run instance). Ensure the Cloud Run service account has the `roles/firebase.admin` role.

**How to get the key:**

```bash
# Go to Firebase Console
# Project Settings → Service Accounts → Generate New Private Key
# Download the JSON file
# Copy the entire JSON content into FIREBASE_SERVICE_ACCOUNT_KEY secret
```

#### Google Cloud Configuration

- [ ] `GCP_WORKLOAD_IDENTITY_PROVIDER` - From Terraform output
- [ ] `GCP_SERVICE_ACCOUNT` - Should be `github-ci-cd@search-ahmed.iam.gserviceaccount.com`
- [ ] `GCP_PROJECT_ID` - Should be `search-ahmed`
- [ ] `DOCKER_IMAGE_NAME` - Docker image name (e.g., `aiml-coe-web-app`)

#### Pillar URLs

- [ ] `PILLAR_1_URL` - Pillar 1 production URL (get after deploying Pillar 1)
- [ ] `PILLAR_2_URL` - Pillar 2 production URL (or leave empty if not deployed)
- [ ] `PILLAR_3_URL` - Pillar 3 production URL (or leave empty if not deployed)
- [ ] `PILLAR_4_URL` - Pillar 4 production URL (or leave empty if not deployed)
- [ ] `PILLAR_5_URL` - Pillar 5 production URL (or leave empty if not deployed)
- [ ] `PILLAR_6_URL` - Pillar 6 production URL (or leave empty if not deployed)

### 2. Verify CI/CD Configuration

- [ ] Check `.github/workflows/cloud-run-deploy.yml` is configured correctly
- [ ] Verify deployment triggers on push to `main` branch
- [ ] Check Cloud Run configuration (memory, CPU, instances)

### 3. Deploy Main App

```bash
cd AIML-COE-Web-App/frontend

# Ensure all changes are committed
git status

# Create a deployment commit
git add .
git commit -m "chore: production deployment"
git push origin main
```

- [ ] GitHub Actions workflow started
- [ ] Build completed successfully
- [ ] Docker image pushed to GCR
- [ ] Cloud Run service deployed
- [ ] Get deployment URL:
  ```bash
  gcloud run services describe aiml-coe-web-app --region=us-central1 --format='value(status.url)'
  ```

### 4. Verify Main App Deployment

- [ ] Visit the deployment URL
- [ ] Sign in with Google OAuth
- [ ] Check dashboard loads
- [ ] Verify pillar cards display correctly
- [ ] Check browser console for errors

---

## Pillar App Deployment (Example: Pillar 1)

Repeat these steps for each Pillar application.

### 1. Generate Session Secret

```bash
# Generate a cryptographically secure random secret
openssl rand -base64 32
```

- [ ] Secret generated (should be 44 characters, base64 encoded)
- [ ] Secret saved securely (you'll need it for the next step)

### 2. Upload Session Secret to Google Secret Manager

```bash
# Upload the secret
echo "YOUR_GENERATED_SECRET_HERE" | \
gcloud secrets versions add pillar-1-session-secret --data-file=-

# Verify it was uploaded
gcloud secrets versions list pillar-1-session-secret
```

- [ ] Secret uploaded successfully
- [ ] Latest version is active

### 3. Verify Cloud Run Service Account Permissions

```bash
# Check service account has necessary roles
gcloud projects get-iam-policy search-ahmed \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:*@search-ahmed.iam.gserviceaccount.com"
```

Required roles:

- [ ] `roles/firebase.admin` - For Firebase Admin SDK
- [ ] `roles/datastore.user` - For Firestore access
- [ ] `roles/secretmanager.secretAccessor` - For accessing SESSION_SECRET

### 4. GitHub Secrets for Pillar App

Go to: https://github.com/[YOUR_ORG]/aiml-coe-pillar-strategy-value-dashboard/settings/secrets/actions

- [ ] `GCP_WORKLOAD_IDENTITY_PROVIDER` - Should match Pillar's Terraform output
- [ ] `GCP_SERVICE_ACCOUNT` - `github-ci-cd@search-ahmed.iam.gserviceaccount.com`
- [ ] `GCP_PROJECT_ID` - `search-ahmed`
- [ ] `MAIN_APP_URL` - Main app production URL (from step 3 of Main App Deployment)

### 5. Deploy Pillar App

```bash
cd aiml-coe-pillar-strategy-value-dashboard/frontend

# Ensure all changes are committed
git status

# Create a deployment commit
git add .
git commit -m "chore: production deployment"
git push origin main
```

- [ ] GitHub Actions workflow started
- [ ] Build completed successfully
- [ ] Docker image pushed to Artifact Registry
- [ ] Cloud Run service deployed
- [ ] Get Pillar URL:
  ```bash
  gcloud run services describe aiml-coe-pillar-1 --region=us-central1 --format='value(status.url)'
  ```

### 6. Update Main App with Pillar URL

- [ ] Copy the Pillar URL from step 5
- [ ] Go to Main App GitHub Secrets
- [ ] Update `PILLAR_1_URL` with the Pillar URL
- [ ] Redeploy main app:
  ```bash
  cd AIML-COE-Web-App/frontend
  git commit --allow-empty -m "chore: trigger redeploy with updated Pillar URL"
  git push origin main
  ```

### 7. Verify Pillar App Deployment

- [ ] Main app redeployed successfully
- [ ] Sign in to main app
- [ ] Go to dashboard
- [ ] Click Pillar 1 card
- [ ] Redirected to `/auth/verify` then to Pillar dashboard
- [ ] Pillar app loads correctly
- [ ] Check browser console for errors
- [ ] Verify session persists (refresh page, should stay logged in)

---

## Firestore Configuration

### 1. Verify Database Exists

- [ ] Go to Firebase Console → Firestore Database
- [ ] Database `aiml-coe-web-app` exists
- [ ] Region: `us-central1`
- [ ] Mode: Native mode

### 2. Configure Security Rules

Go to: Firebase Console → Firestore Database → Rules

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

**Important Notes:**
- Users can only read their own permissions
- Admins (users with `isAdmin: true` in their `userPermissions` document) can read and modify all user permissions
- This enables the Admin Dashboard functionality for managing user permissions

- [ ] Rules configured
- [ ] Rules published
- [ ] Test rules with Firebase Console Rules Playground

### 3. Create Initial Admin User

- [ ] Sign in to main app with your account
- [ ] Check Firestore → `aiml-coe-web-app` → `userPermissions`
- [ ] Find your user document (by UID)
- [ ] Manually set `isAdmin: true` in Firebase Console
- [ ] Sign out and sign in again
- [ ] Verify you have access to all pillars
- [ ] Access the Admin Dashboard at `/admin` to manage other users

### 4. Set Up Firestore Backups

```bash
# Enable automatic daily backups
gcloud firestore backups schedules create \
  --database=aiml-coe-web-app \
  --recurrence=daily \
  --retention=7d
```

- [ ] Backup schedule created
- [ ] Verify with: `gcloud firestore backups schedules list --database=aiml-coe-web-app`

---

## Post-Deployment Verification

### Main App Checklist

- [ ] Landing page loads without errors
- [ ] Google OAuth sign-in works
- [ ] Dashboard displays correctly
- [ ] All 6 pillar cards visible
- [ ] Pillar cards show correct access state (enabled/disabled based on permissions)
- [ ] Profile page works
- [ ] Admin Dashboard (`/admin`) accessible for admin users
- [ ] Admin Dashboard can manage user permissions
- [ ] Sign out works
- [ ] Mobile responsive design works
- [ ] No console errors

### Pillar App Checklist (for each Pillar)

- [ ] Main app redirects to Pillar correctly
- [ ] `/auth/verify` endpoint works
- [ ] Session created successfully
- [ ] Redirected to Pillar dashboard with clean URL
- [ ] Pillar dashboard loads correctly
- [ ] Session persists on page refresh
- [ ] Sign out redirects back to main app
- [ ] Unauthorized users see "Access Denied" page
- [ ] No console errors

### Security Checklist

- [ ] All production URLs use HTTPS
- [ ] Session cookies have `secure: true` flag
- [ ] Session cookies have `httpOnly: true` flag
- [ ] Firebase tokens not exposed in URLs after initial redirect
- [ ] Firestore security rules prevent unauthorized access
- [ ] Environment variables not exposed in client-side code
- [ ] No secrets committed to Git

### Performance Checklist

- [ ] Main app loads in < 3 seconds
- [ ] Pillar apps load in < 3 seconds
- [ ] Authentication flow completes in < 2 seconds
- [ ] No memory leaks in browser console
- [ ] Cloud Run instances scale properly under load

---

## Monitoring Setup

### 1. Cloud Run Metrics

- [ ] Go to Cloud Console → Cloud Run → Service
- [ ] Enable metrics:
  - [ ] Request count
  - [ ] Request latency
  - [ ] Error rate (4xx, 5xx)
  - [ ] Instance count
  - [ ] CPU utilization
  - [ ] Memory utilization

### 2. Error Reporting

```bash
# View recent errors
gcloud run services logs read aiml-coe-web-app \
  --region=us-central1 \
  --filter="severity>=ERROR" \
  --limit=50
```

- [ ] Error Reporting enabled in Cloud Console
- [ ] Alert policies configured for high error rates

### 3. Uptime Checks

- [ ] Create uptime check for main app
- [ ] Create uptime checks for each Pillar app
- [ ] Configure email alerts for downtime

---

## Rollback Procedure

If deployment fails or issues are discovered:

### Quick Rollback

```bash
# Rollback main app to previous revision
gcloud run services update-traffic aiml-coe-web-app \
  --region=us-central1 \
  --to-revisions=PREVIOUS_REVISION=100

# Rollback Pillar app
gcloud run services update-traffic aiml-coe-pillar-1 \
  --region=us-central1 \
  --to-revisions=PREVIOUS_REVISION=100
```

### Rollback Steps

- [ ] Identify issue (check logs, error reporting)
- [ ] Find previous working revision:
  ```bash
  gcloud run revisions list --service=aiml-coe-web-app --region=us-central1
  ```
- [ ] Execute rollback command
- [ ] Verify app works with previous revision
- [ ] Fix issues in code
- [ ] Redeploy when ready

---

## Troubleshooting Common Issues

### Issue: Deployment fails with "Permission denied"

**Solution:**

```bash
# Verify service account has necessary roles
gcloud projects get-iam-policy search-ahmed

# Add missing roles if needed
gcloud projects add-iam-policy-binding search-ahmed \
  --member="serviceAccount:github-ci-cd@search-ahmed.iam.gserviceaccount.com" \
  --role="roles/run.admin"
```

### Issue: Pillar redirect shows 500 error

**Possible causes:**

- SESSION_SECRET not uploaded to Secret Manager
- Cloud Run service account missing Firebase roles
- Wrong Pillar URL in main app secrets

**Debug:**

```bash
# Check logs
gcloud run services logs read aiml-coe-pillar-1 --region=us-central1 --limit=50

# Verify secret exists
gcloud secrets versions list pillar-1-session-secret

# Check service account roles
gcloud projects get-iam-policy search-ahmed
```

### Issue: Users can't authenticate

**Possible causes:**

- Firestore permissions not set up
- Wrong Firebase project ID
- Service account missing Firebase Admin role

**Debug:**

```bash
# Check Firestore
# Firebase Console → Firestore → aiml-coe-web-app → userPermissions

# Verify Firebase Admin SDK
# Cloud Run logs should show "Firebase Admin SDK initialized"

# Check user permissions document exists
```

---

## Next Steps After Deployment

1. **User Onboarding**

   - [ ] Create documentation for end users
   - [ ] Set up user permissions in Firestore
   - [ ] Communicate production URL to users

2. **Monitoring**

   - [ ] Set up daily checks of error logs
   - [ ] Monitor Cloud Run costs
   - [ ] Track user authentication metrics

3. **Maintenance Schedule**

   - [ ] Weekly: Review error logs
   - [ ] Monthly: User permission audit
   - [ ] Quarterly: Dependency updates
   - [ ] Quarterly: Session secret rotation

4. **Documentation**
   - [ ] Update user-facing documentation
   - [ ] Document any custom configurations
   - [ ] Create runbook for common operations

---

## Contact Information

- **Development Team**: [Your contact info]
- **Firebase Support**: https://firebase.google.com/support
- **Google Cloud Support**: https://cloud.google.com/support

---

**Deployment Date**: **\*\***\_**\*\***
**Deployed By**: **\*\***\_**\*\***
**Production URLs**:

- Main App: **\*\***\_**\*\***
- Pillar 1: **\*\***\_**\*\***
- Pillar 2: **\*\***\_**\*\***
- Pillar 3: **\*\***\_**\*\***
- Pillar 4: **\*\***\_**\*\***
- Pillar 5: **\*\***\_**\*\***
- Pillar 6: **\*\***\_**\*\***
