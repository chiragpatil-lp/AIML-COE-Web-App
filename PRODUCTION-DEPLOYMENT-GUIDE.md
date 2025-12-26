# Production Deployment Guide - Firebase Authentication

**Project**: AIML COE Web App
**GCP Project**: search-ahmed
**Service**: aiml-coe-web-app
**Region**: us-central1

---

## Overview

This guide provides step-by-step instructions to deploy Firebase Authentication to production after merging the `feat/firebase-auth-implementation` branch.

## Prerequisites Checklist

- [x] Branch `feat/firebase-auth-implementation` created and tested
- [x] Local Firebase authentication working
- [x] GitHub Actions workflow updated with Firebase env vars
- [x] Dockerfile updated to accept Firebase build arguments
- [ ] Firebase credentials ready (from Firebase Console)
- [ ] GitHub repository admin access
- [ ] gcloud CLI installed and authenticated

---

## Step 1: Add GitHub Secrets

GitHub Secrets store sensitive Firebase credentials that the CI/CD pipeline uses.

### 1.1 Navigate to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**

**Direct Link**: https://github.com/chiragpatil-lp/AIML-COE-Web-App/settings/secrets/actions

### 1.2 Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/project/search-ahmed)
2. Click the gear icon → **Project Settings**
3. Scroll to **Your apps** section
4. Find "AIML COE Web App" (or your web app)
5. Copy the Firebase SDK config values

### 1.3 Create the Following Secrets

Add each of these secrets one by one:

#### Secret 1: FIREBASE_API_KEY
```
Name: FIREBASE_API_KEY
Value: [Your API Key from Firebase Console]
```

#### Secret 2: FIREBASE_AUTH_DOMAIN
```
Name: FIREBASE_AUTH_DOMAIN
Value: search-ahmed.firebaseapp.com
```

#### Secret 3: FIREBASE_PROJECT_ID
```
Name: FIREBASE_PROJECT_ID
Value: search-ahmed
```

#### Secret 4: FIREBASE_STORAGE_BUCKET
```
Name: FIREBASE_STORAGE_BUCKET
Value: [Your storage bucket from Firebase Console]
```

#### Secret 5: FIREBASE_MESSAGING_SENDER_ID
```
Name: FIREBASE_MESSAGING_SENDER_ID
Value: [Your messaging sender ID from Firebase Console]
```

#### Secret 6: FIREBASE_APP_ID
```
Name: FIREBASE_APP_ID
Value: [Your app ID from Firebase Console]
```

### 1.4 Verify Secrets

After adding all secrets, you should see:
- ✅ FIREBASE_API_KEY
- ✅ FIREBASE_AUTH_DOMAIN
- ✅ FIREBASE_PROJECT_ID
- ✅ FIREBASE_STORAGE_BUCKET
- ✅ FIREBASE_MESSAGING_SENDER_ID
- ✅ FIREBASE_APP_ID
- ✅ GCP_WORKLOAD_IDENTITY_PROVIDER (already exists)
- ✅ GCP_SERVICE_ACCOUNT (already exists)
- ✅ GCP_PROJECT_ID (already exists)
- ✅ DOCKER_IMAGE_NAME (already exists)

---

## Step 2: Add Production Domain to Firebase

The production Cloud Run URL must be authorized in Firebase to allow OAuth popups.

### 2.1 Get Production URL

Your production URL is:
```
aiml-coe-web-app-36231825761.us-central1.run.app
```

### 2.2 Add to Firebase Authorized Domains

1. Go to [Firebase Console - Authentication](https://console.firebase.google.com/project/search-ahmed/authentication/settings)
2. Click the **Settings** tab
3. Scroll to **Authorized domains**
4. Click **Add domain**
5. Enter: `aiml-coe-web-app-36231825761.us-central1.run.app`
6. Click **Add**

✅ Firebase will now accept OAuth requests from production

---

## Step 3: Create Pull Request and Merge

### 3.1 Create Pull Request

```bash
# Make sure you're on the feature branch
git checkout feat/firebase-auth-implementation

# Push to remote (if not already pushed)
git push origin feat/firebase-auth-implementation
```

Then on GitHub:
1. Go to your repository
2. Click **"Pull requests"** → **"New pull request"**
3. Base: `main` ← Compare: `feat/firebase-auth-implementation`
4. Click **"Create pull request"**
5. Add title: `feat: Firebase Authentication Implementation`
6. Add description with key changes
7. Click **"Create pull request"**

### 3.2 Verify CI Checks Pass

Wait for the CI validation workflow to complete:
- ✅ Code formatting check
- ✅ Linter check
- ✅ Docker build validation

### 3.3 Merge Pull Request

Once all checks pass:
1. Click **"Merge pull request"**
2. Click **"Confirm merge"**
3. Optionally delete the feature branch

---

## Step 4: Monitor Deployment

### 4.1 Watch GitHub Actions

1. Go to **Actions** tab in GitHub
2. You'll see "Deploy to Cloud Run" workflow triggered automatically
3. Click on the workflow run to see progress
4. Wait for all steps to complete (~3-4 minutes)

### 4.2 Expected Workflow Steps

1. ✅ Checkout repository
2. ✅ Google Cloud Auth
3. ✅ Build Docker image (with Firebase env vars)
4. ✅ Push to Google Container Registry
5. ✅ Deploy to Cloud Run (with Firebase env vars)
6. ✅ Tag latest revision
7. ✅ Clean up old revisions
8. ✅ Output deployment info

---

## Step 5: Verify Production Deployment

### 5.1 Access Production App

**URL**: https://aiml-coe-web-app-36231825761.us-central1.run.app

### 5.2 Test Sign-In Flow

1. Navigate to: https://aiml-coe-web-app-36231825761.us-central1.run.app/auth/signin
2. Click **"Sign in with Google"**
3. Verify OAuth popup opens (no popup blocked errors)
4. Sign in with your Google account
5. Verify popup closes successfully

### 5.3 Test Dashboard

1. Navigate to: https://aiml-coe-web-app-36231825761.us-central1.run.app/dashboard
2. Verify you see:
   - Your name and email
   - Sign Out button
   - 6 Strategic Pillars grid
   - All pillars show "Access not granted" (expected for new users)

### 5.4 Verify Firestore Document Creation

1. Go to [Firebase Console - Firestore](https://console.firebase.google.com/project/search-ahmed/firestore)
2. Select database: `aiml-coe-web-app`
3. Navigate to `userPermissions` collection
4. Verify your document was created with your user ID

✅ Production deployment successful!

---

## Step 6: Create First Admin User (Optional)

To make yourself an admin in production:

### 6.1 Update Firestore Document

1. Go to Firebase Console → Firestore → `aiml-coe-web-app` database
2. Click `userPermissions` collection
3. Find your document (by email or UID)
4. Edit the `isAdmin` field:
   - Change from: `false`
   - Change to: `true`
5. Save

### 6.2 Refresh Authentication

1. In production app, click **Sign Out**
2. Navigate to `/auth/signin`
3. Sign in again
4. Go to dashboard
5. Verify you see **"Administrator"** badge
6. All pillars should show **"Admin Access"**

---

## Alternative: Manual gcloud Configuration

If you prefer to configure environment variables manually instead of through GitHub Actions:

### Update Cloud Run Service Directly

```bash
# Authenticate with GCP
gcloud auth login
gcloud config set project search-ahmed

# Update service with Firebase environment variables
gcloud run services update aiml-coe-web-app \
  --region us-central1 \
  --set-env-vars "\
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here,\
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=search-ahmed.firebaseapp.com,\
NEXT_PUBLIC_FIREBASE_PROJECT_ID=search-ahmed,\
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here,\
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here,\
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here"
```

**Note**: This is only needed if GitHub Actions deployment fails or you want to update env vars without a new deployment.

---

## Troubleshooting

### Issue: "Popup blocked" in production

**Solution**:
- Verify domain is in Firebase Authorized Domains
- Check browser is not blocking popups
- Try different browser

### Issue: Firebase authentication not working

**Possible Causes**:
1. GitHub Secrets not configured correctly
2. Docker build args not passed properly
3. Cloud Run env vars not set
4. Domain not authorized in Firebase

**Debug Steps**:
1. Check GitHub Actions logs for build/deploy errors
2. Verify all 6 Firebase secrets exist in GitHub
3. Check Cloud Run service environment variables in GCP Console
4. Verify authorized domains in Firebase Console

### Issue: "Missing or insufficient permissions" (Firestore)

**Solution**:
- Verify Firestore security rules are published
- Check that you're using `aiml-coe-web-app` database (not default)
- Ensure security rules include the `allow create:` block for new users

### Issue: Deployment succeeds but Firebase not initialized

**Debug**:
1. Check browser console for Firebase errors
2. Verify env vars in Cloud Run Console:
   ```bash
   gcloud run services describe aiml-coe-web-app \
     --region us-central1 \
     --format="value(spec.template.spec.containers[0].env)"
   ```

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Production sign-in works
- [ ] OAuth popup not blocked
- [ ] Dashboard loads correctly
- [ ] Firestore documents created for new users
- [ ] Admin user configured (if needed)
- [ ] Team members can sign in
- [ ] All 6 pillars display correctly
- [ ] Sign out works
- [ ] Monitor Cloud Run logs for errors

---

## Monitoring and Maintenance

### View Application Logs

**Cloud Console**:
https://console.cloud.google.com/run/detail/us-central1/aiml-coe-web-app/logs?project=search-ahmed

**Or via gcloud**:
```bash
gcloud logging read "resource.type=cloud_run_revision \
  AND resource.labels.service_name=aiml-coe-web-app" \
  --limit 50 \
  --format json
```

### View Firestore Data

**Direct Link**:
https://console.firebase.google.com/project/search-ahmed/firestore/databases/aiml-coe-web-app/data

### View Cloud Run Service

**Direct Link**:
https://console.cloud.google.com/run/detail/us-central1/aiml-coe-web-app?project=search-ahmed

---

## Security Best Practices

✅ **Environment Variables**: Never commit Firebase credentials to git
✅ **GitHub Secrets**: Credentials stored securely in GitHub
✅ **Firestore Rules**: Security rules enforce permission-based access
✅ **HTTPS Only**: Cloud Run enforces HTTPS
✅ **OAuth Scopes**: Limited to profile and email only
✅ **Admin Protection**: Only admins can modify user permissions
✅ **Domain Whitelist**: Only authorized domains can use OAuth

---

## Next Steps

After production deployment:

1. **Grant Access to Team Members**:
   - Team members sign in once
   - Admin edits their Firestore document
   - Set `isAdmin: true` or individual pillar permissions

2. **Configure Pillar URLs** (if not already done):
   - Add env vars for each pillar URL
   - Redeploy to enable pillar navigation

3. **Monitor Usage**:
   - Check Cloud Run logs for errors
   - Monitor Firestore usage
   - Review authentication metrics

4. **Plan Phase 2 Features**:
   - Admin panel for user management
   - Auto-redirect after sign-in
   - Cloud Functions for admin claims
   - Email notifications

---

## Support

If you encounter issues:

1. Check this deployment guide
2. Review Firebase documentation in `frontend/docs/firebase/`
3. Check Cloud Run logs
4. Check GitHub Actions workflow logs
5. Contact AIML COE team

---

**Last Updated**: December 26, 2024
**Author**: Claude Code
**Status**: Ready for Production Deployment
