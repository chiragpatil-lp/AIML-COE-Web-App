# Google Cloud Platform Setup Guide

This guide walks you through the **required manual steps** to configure Google Cloud Platform for the CI/CD pipeline.

## Overview

Before the automated CI/CD pipeline can deploy your application, you need to:

1. ✅ GCP Project (`search-ahmed`) - Already configured
2. ✅ Required APIs - Already enabled
3. ⚠️ **Service Account** - YOU NEED TO DO THIS
4. ⚠️ **GitHub Secrets** - YOU NEED TO DO THIS

## Status Check

### ✅ Already Completed

The following are already set up:

- **GCP Project**: `search-ahmed`
- **APIs Enabled**:
  - ✅ Cloud Run API
  - ✅ Cloud Build API
  - ✅ Container Registry API
  - ✅ Cloud Storage API

### ⚠️ Required Actions

You **MUST** complete these steps before the CI/CD pipeline will work:

1. [Create Service Account](#step-1-create-service-account)
2. [Download Service Account Key](#step-2-download-service-account-key)
3. [Configure GitHub Secrets](#step-3-configure-github-secrets)

---

## Step 1: Create Service Account

A Service Account allows GitHub Actions to authenticate with Google Cloud and deploy your application.

### 1.1 Navigate to Service Accounts

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure project `search-ahmed` is selected (top navigation bar)
3. Navigate to: **IAM & Admin → Service Accounts**

   **Direct Link**: [Service Accounts for search-ahmed](https://console.cloud.google.com/iam-admin/serviceaccounts?project=search-ahmed)

### 1.2 Create New Service Account

1. Click the **"+ CREATE SERVICE ACCOUNT"** button (top of page)

2. **Service account details** (Step 1 of 3):
   - **Service account name**: `github-ci-cd`
   - **Service account ID**: `github-ci-cd` (auto-filled)
   - **Description**: `Service account for GitHub Actions CI/CD pipeline`
   - Click **"CREATE AND CONTINUE"**

### 1.3 Grant Permissions

3. **Grant this service account access to project** (Step 2 of 3):

   Click **"Select a role"** and add ALL of the following roles:

   | Role Name | What it does |
   |-----------|-------------|
   | **Cloud Run Admin** | Deploy and manage Cloud Run services |
   | **Cloud Build Service Account** | Build Docker images |
   | **Cloud Run Service Agent** | Manage Cloud Run resources |
   | **Service Account User** | Act as service accounts |
   | **Storage Object Admin** | Push Docker images to Container Registry |

   **How to add multiple roles:**
   - Click "+ ADD ANOTHER ROLE" after adding each role
   - Search for the role name in the dropdown
   - Select it and repeat for all 5 roles

   Click **"CONTINUE"**

4. **Grant users access to this service account** (Step 3 of 3):
   - Leave blank (optional step)
   - Click **"DONE"**

### 1.4 Verify Creation

You should now see `github-ci-cd@search-ahmed.iam.gserviceaccount.com` in the service accounts list.

---

## Step 2: Download Service Account Key

You need to download a JSON key file that GitHub Actions will use to authenticate.

### 2.1 Open Service Account

1. In the Service Accounts list, find `github-ci-cd`
2. Click on the **email address** (github-ci-cd@search-ahmed.iam.gserviceaccount.com)

### 2.2 Create Key

1. Click the **"KEYS"** tab (at the top)
2. Click **"ADD KEY"** dropdown
3. Select **"Create new key"**

### 2.3 Download JSON Key

1. In the dialog, select **"JSON"** as the key type
2. Click **"CREATE"**

**Important:**
- A JSON file will download to your computer
- This file contains sensitive credentials - **KEEP IT SECURE**
- The filename will be like: `search-ahmed-xxxxx.json`
- **Do NOT commit this file to Git**
- You'll need the contents for the next step

---

## Step 3: Configure GitHub Secrets

GitHub Secrets securely store sensitive information that the CI/CD workflow needs.

### 3.1 Navigate to Repository Secrets

1. Go to your GitHub repository
2. Click **Settings** (top navigation)
3. In the left sidebar, navigate to:
   **Security → Secrets and variables → Actions**
4. You should see the **"Secrets"** tab selected

### 3.2 Create Required Secrets

You need to create **3 secrets**. For each one:

1. Click **"New repository secret"** button
2. Enter the **Name** and **Secret** value
3. Click **"Add secret"**

---

#### Secret 1: GCP_SA_KEY

**Name:**
```
GCP_SA_KEY
```

**Secret Value:**
- Open the JSON file you downloaded in Step 2 with a text editor
- Copy the **ENTIRE contents** of the file
- Paste into the secret value field

**Example of what the JSON looks like:**
```json
{
  "type": "service_account",
  "project_id": "search-ahmed",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "github-ci-cd@search-ahmed.iam.gserviceaccount.com",
  ...
}
```

⚠️ **Important**: Copy the ENTIRE file including curly braces `{ }`

---

#### Secret 2: GCP_PROJECT_ID

**Name:**
```
GCP_PROJECT_ID
```

**Secret Value:**
```
search-ahmed
```

---

#### Secret 3: DOCKER_IMAGE_NAME

**Name:**
```
DOCKER_IMAGE_NAME
```

**Secret Value:**
```
aiml-coe-web-app
```

(You can choose a different name if you prefer)

---

### 3.3 Verify Secrets

After creating all three secrets, you should see:

- ✅ `GCP_SA_KEY`
- ✅ `GCP_PROJECT_ID`
- ✅ `DOCKER_IMAGE_NAME`

in your repository secrets list.

**Note**: GitHub will show when each secret was created/updated, but won't show the values (for security).

---

## Step 4: Test the Setup

### 4.1 Trigger First Deployment

1. Make a small change to your code
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "test: trigger first deployment"
   git push origin main
   ```

### 4.2 Monitor Deployment

1. Go to your GitHub repository
2. Click the **"Actions"** tab
3. You should see a workflow run for "Deploy to Cloud Run"
4. Click on it to view progress

### 4.3 Expected Result

If everything is set up correctly:

1. ✅ All workflow steps should complete successfully (green checkmarks)
2. ✅ The final step will output a Cloud Run URL
3. ✅ Your application will be live!

### 4.4 Access Your Application

**Option 1: From GitHub Actions logs**
- In the workflow run, expand the "Deploy to Cloud Run" step
- Look for a URL like: `https://aiml-coe-web-app-xxxxx-uc.a.run.app`
- The actual project ID might be masked as `***` - replace with `search-ahmed`

**Option 2: From Cloud Console**
1. Go to [Cloud Run Console](https://console.cloud.google.com/run?project=search-ahmed)
2. Click on the `aiml-coe-web-app` service
3. The URL will be displayed at the top

---

## Troubleshooting

### Issue: "Permission denied" error in workflow

**Cause**: Service Account doesn't have proper roles

**Solution**:
1. Go to Service Accounts
2. Click on `github-ci-cd`
3. Click "PERMISSIONS" tab
4. Verify all 5 roles are listed
5. If missing, add them via "GRANT ACCESS"

### Issue: "Invalid credentials" error

**Cause**: `GCP_SA_KEY` secret is incorrect

**Solution**:
1. Re-download the JSON key (Steps 2.1-2.3)
2. Update the `GCP_SA_KEY` secret in GitHub
3. Make sure you copied the ENTIRE JSON file

### Issue: Workflow doesn't trigger

**Cause**: Workflow file not in correct location

**Solution**:
1. Verify file exists at: `.github/workflows/cloud-run-deploy.yml`
2. Check the file is on the `main` branch
3. Ensure GitHub Actions are enabled for your repository

### Issue: "Service not found" error

**Cause**: First deployment - service doesn't exist yet

**Solution**:
- This is expected on first deployment
- The workflow will create the service automatically
- Subsequent deployments will update the existing service

---

## Security Best Practices

### Protect Your Service Account Key

- ❌ **Never** commit the JSON key file to Git
- ❌ **Never** share the key publicly
- ❌ **Never** store it in unencrypted form
- ✅ **Only** use it in GitHub Secrets
- ✅ **Delete** the downloaded file after adding to GitHub Secrets
- ✅ **Rotate** keys periodically (every 90 days recommended)

### Add to .gitignore

Make sure your `.gitignore` includes:

```
# Google Cloud credentials
*.json
*-key.json
service-account*.json
search-ahmed-*.json
```

### Least Privilege

The roles assigned provide the minimum permissions needed for deployment. Don't add extra roles unless specifically required.

---

## Next Steps

After completing this setup:

1. ✅ Your CI/CD pipeline is ready
2. ✅ Every push to `main` will auto-deploy
3. ✅ You can focus on development

**See also:**
- [Development Guide](./DEVELOPMENT.md) - Local development workflow
- [Deployment Guide](./DEPLOYMENT.md) - CI/CD pipeline details

---

## Quick Reference

### Service Account Details
- **Email**: `github-ci-cd@search-ahmed.iam.gserviceaccount.com`
- **Project**: `search-ahmed`
- **Purpose**: GitHub Actions CI/CD

### Required Roles
1. Cloud Run Admin
2. Cloud Build Service Account
3. Cloud Run Service Agent
4. Service Account User
5. Storage Object Admin

### GitHub Secrets
1. `GCP_SA_KEY` - JSON key file contents
2. `GCP_PROJECT_ID` - `search-ahmed`
3. `DOCKER_IMAGE_NAME` - `aiml-coe-web-app`

### Cloud Run Details
- **Service Name**: `aiml-coe-web-app`
- **Region**: `us-central1`
- **Platform**: Managed
- **Authentication**: Public (unauthenticated)

---

## Need Help?

If you encounter issues:

1. Double-check each step in this guide
2. Review error messages in GitHub Actions logs
3. Check [Troubleshooting](#troubleshooting) section
4. Consult [Deployment Guide](./DEPLOYMENT.md)
5. Contact the DevOps team

---

**Last Updated**: 2025-12-18
**Project**: AIML COE Web Application
**Environment**: Production (`search-ahmed`)
