# Google Cloud Platform Setup Guide

**Last Updated**: January 22, 2026
**Status**: ✅ Completed

This guide shows you how to configure Google Cloud Platform for the CI/CD pipeline using **Workload Identity Federation** (WIF) - Google's recommended secure authentication method.

## Choose Your Setup Method

You have two options to set up GCP infrastructure:

### Option 1: Terraform (Recommended) ⚡

**Best for**: Fast, automated, repeatable setup

- ✅ Single command to create everything
- ✅ Infrastructure as code (version controlled)
- ✅ Easy to review and audit
- ✅ Takes 2-3 minutes

👉 **[Jump to Terraform Setup](#terraform-setup-recommended)**

### Option 2: Manual Setup via Console 🖱️

**Best for**: Step-by-step learning, no Terraform experience needed

- ✅ Visual walkthrough with screenshots
- ✅ No additional tools required
- ⚠️ Takes 15-20 minutes
- ⚠️ Manual steps prone to typos

👉 **[Jump to Manual Setup](#manual-setup)**

---

## Overview

The automated CI/CD pipeline is fully configured and operational. This guide documents the setup that has been completed:

1. ✅ GCP Project (`search-ahmed`) - Configured
2. ✅ Required APIs - Enabled
3. ✅ **Service Account & Workload Identity** - Configured via Terraform
4. ✅ **GitHub Secrets** - Configured
5. ✅ **Application** - Live and deployed

## Status Check

### ✅ Setup COMPLETED - Application LIVE

**All infrastructure and CI/CD is fully configured and working!**

- ✅ **GCP Project**: `search-ahmed`
- ✅ **APIs Enabled**:
  - Cloud Run API
  - Cloud Build API
  - Container Registry API
  - IAM Credentials API
- ✅ **Infrastructure (via Terraform)**:
  - Service Account: `github-ci-cd@search-ahmed.iam.gserviceaccount.com`
  - Workload Identity Pool: `github-pool`
  - Workload Identity Provider: `github-provider`
  - All IAM roles configured
- ✅ **GitHub Secrets Configured**:
  - `GCP_WORKLOAD_IDENTITY_PROVIDER`
  - `GCP_SERVICE_ACCOUNT`
  - `GCP_PROJECT_ID`
  - `DOCKER_IMAGE_NAME`
  - `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`
  - `PILLAR_1_URL` through `PILLAR_6_URL`
- ✅ **Application Deployed**: https://aiml-coe-web-app-36231825761.us-central1.run.app

### For Reference Only

The sections below document the setup process that has already been completed. You can use them:

- To understand how the infrastructure was set up
- To recreate the setup in a different environment
- For troubleshooting or auditing purposes

---

## Terraform Setup (Recommended)

### Prerequisites

Before running Terraform, ensure you have:

1. **Terraform installed** (version >= 1.0)

   ```bash
   terraform version
   ```

   If not installed, [download here](https://developer.hashicorp.com/terraform/downloads)

2. **Google Cloud SDK authenticated**

   ```bash
   gcloud auth application-default login
   ```

3. **Required GCP permissions**
   - Ask your IAM admin to grant you (or run Terraform for you) with these roles:
     - Workload Identity Pool Admin
     - Service Account Admin
     - Project IAM Admin
     - Service Usage Admin

### Step 1: Navigate to Terraform Directory

```bash
cd frontend/terraform
```

All Terraform configuration files are in the `frontend/terraform/` directory.

### Step 2: Review the Configuration

The Terraform configuration will create:

- ✅ Service Account: `github-ci-cd@search-ahmed.iam.gserviceaccount.com`
- ✅ Workload Identity Pool: `github-pool`
- ✅ Workload Identity Provider: `github-provider`
- ✅ IAM Role Bindings (Cloud Run Admin, Cloud Build, Storage Admin, etc.)
- ✅ API Enablements (IAM Credentials, Cloud Run, Cloud Build, Container Registry)

**Review the files:**

- `variables.tf` - Input variables (project ID, GitHub repo, etc.)
- `main.tf` - Main infrastructure configuration
- `outputs.tf` - Outputs for GitHub Secrets

### Step 3: Initialize Terraform

```bash
terraform init
```

This downloads the Google Cloud provider plugin.

### Step 4: Preview Changes

```bash
terraform plan
```

Review what will be created. You should see approximately 12 resources to be created.

### Step 5: Apply Configuration

```bash
terraform apply
```

Type `yes` when prompted.

This takes 2-3 minutes. Terraform will:

1. Enable required GCP APIs
2. Create the service account with proper roles
3. Set up Workload Identity Federation
4. Bind your GitHub repository to the service account

### Step 6: Copy the Outputs

After successful completion, Terraform displays the values you need:

```
Outputs:

github_secrets_summary = {
  "GCP_WORKLOAD_IDENTITY_PROVIDER" = "projects/36231825761/locations/global/workloadIdentityPools/github-pool/providers/github-provider"
  "GCP_SERVICE_ACCOUNT" = "github-ci-cd@search-ahmed.iam.gserviceaccount.com"
  "GCP_PROJECT_ID" = "search-ahmed"
  "DOCKER_IMAGE_NAME" = "aiml-coe-web-app"
}
```

**Save these values** - you'll need them for GitHub Secrets in the next step.

You can retrieve outputs anytime:

```bash
terraform output
terraform output -json
```

### Step 7: Configure GitHub Secrets (Terraform) ✅ COMPLETED

GitHub secrets have been configured with the following values:

1. GitHub repository secrets location:

   ```
   https://github.com/chiragpatil-lp/AIML-COE-Web-App/settings/secrets/actions
   ```

2. **Configured Secrets**:

   **GCP-Related Secrets:**

   **Secret 1: GCP_WORKLOAD_IDENTITY_PROVIDER** ✅
   - Value: `projects/36231825761/locations/global/workloadIdentityPools/github-pool/providers/github-provider`

   **Secret 2: GCP_SERVICE_ACCOUNT** ✅
   - Value: `github-ci-cd@search-ahmed.iam.gserviceaccount.com`

   **Secret 3: GCP_PROJECT_ID** ✅
   - Value: `search-ahmed`

   **Secret 4: DOCKER_IMAGE_NAME** ✅
   - Value: `aiml-coe-web-app`

   **Firebase Configuration Secrets:**
   - `FIREBASE_API_KEY` ✅
   - `FIREBASE_AUTH_DOMAIN` ✅
   - `FIREBASE_PROJECT_ID` ✅
   - `FIREBASE_STORAGE_BUCKET` ✅
   - `FIREBASE_MESSAGING_SENDER_ID` ✅
   - `FIREBASE_APP_ID` ✅

   **Pillar Application URLs:**
   - `PILLAR_1_URL` through `PILLAR_6_URL` ✅

   **Note**: Firebase and Pillar URL secrets are used by the application during Docker build and runtime. For Firebase setup, see [Firebase Auth Documentation](./firebase/FIREBASE-AUTH-COMPLETE-SETUP.md).

All secrets are properly configured and working.

### Step 8: Test the Setup ✅ VERIFIED

The setup has been tested and verified working:

**Test Results**:

- ✅ GitHub Actions workflow triggered successfully
- ✅ Docker image built with Node.js 20
- ✅ Image pushed to Google Container Registry
- ✅ Application deployed to Cloud Run
- ✅ **Live URL**: https://aiml-coe-web-app-36231825761.us-central1.run.app

**Deployment Time**: ~3-4 minutes per push to `main`

View workflow runs: https://github.com/chiragpatil-lp/AIML-COE-Web-App/actions

### Terraform Management

**View current state:**

```bash
cd frontend/terraform
terraform show
```

**Destroy all resources** (if needed):

```bash
terraform destroy
```

**Update configuration:**

1. Edit `.tf` files in `frontend/terraform/`
2. Run `terraform plan` to preview
3. Run `terraform apply` to update

For detailed Terraform documentation, see [`frontend/terraform/README.md`](../frontend/terraform/README.md)

---

## Manual Setup

If you prefer not to use Terraform, follow these manual steps in the Google Cloud Console.

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

   | Role Name                       | What it does                             |
   | ------------------------------- | ---------------------------------------- |
   | **Cloud Run Admin**             | Deploy and manage Cloud Run services     |
   | **Cloud Build Service Account** | Build Docker images                      |
   | **Cloud Run Service Agent**     | Manage Cloud Run resources               |
   | **Service Account User**        | Act as service accounts                  |
   | **Storage Object Admin**        | Push Docker images to Container Registry |

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

## Step 2: Set Up Workload Identity Federation

Workload Identity Federation (WIF) allows GitHub Actions to authenticate with GCP **without using downloadable keys**. This is Google's recommended security best practice.

### 2.1 Enable Required API

1. Go to [IAM Service Account Credentials API](https://console.cloud.google.com/apis/library/iamcredentials.googleapis.com?project=search-ahmed)
2. Click **"ENABLE"** if not already enabled

**Direct command** (if you have gcloud CLI access):

```bash
gcloud services enable iamcredentials.googleapis.com --project=search-ahmed
```

### 2.2 Create Workload Identity Pool

1. Navigate to **IAM & Admin → Workload Identity Federation**

   **Direct Link**: [Workload Identity Federation](https://console.cloud.google.com/iam-admin/workload-identity-pools?project=search-ahmed)

2. Click **"CREATE POOL"**

3. **Pool details**:

   - **Name**: `github-pool`
   - **Pool ID**: `github-pool` (auto-filled)
   - **Description**: `Identity pool for GitHub Actions`
   - Click **"CONTINUE"**

4. **Add a provider to pool**:

   - **Select provider**: Choose **"OpenID Connect (OIDC)"**
   - Click **"CONTINUE"**

5. **Configure provider**:

   - **Provider name**: `github-provider`
   - **Provider ID**: `github-provider` (auto-filled)
   - **Issuer (URL)**: `https://token.actions.githubusercontent.com`
   - **Audiences**: Select **"Default audience"**
   - Click **"CONTINUE"**

6. **Configure provider attributes**:

   - **Attribute mapping**: Add these mappings:

   | Google attribute             | OIDC token attribute         |
   | ---------------------------- | ---------------------------- |
   | `google.subject`             | `assertion.sub`              |
   | `attribute.actor`            | `assertion.actor`            |
   | `attribute.repository`       | `assertion.repository`       |
   | `attribute.repository_owner` | `assertion.repository_owner` |

   - Click **"SAVE"**

### 2.3 Grant Service Account Access to Workload Identity

Now you need to allow GitHub Actions to use the service account via the Workload Identity Pool.

1. Go back to **IAM & Admin → Service Accounts**

   **Direct Link**: [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=search-ahmed)

2. Click on `github-ci-cd@search-ahmed.iam.gserviceaccount.com`

3. Click the **"PERMISSIONS"** tab

4. Click **"GRANT ACCESS"**

5. **Add principals**:

   - **New principals**: Enter the following (replace `YOUR-GITHUB-USERNAME` and `YOUR-REPO-NAME`):

   ```
   principalSet://iam.googleapis.com/projects/PROJECT-NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/YOUR-GITHUB-USERNAME/YOUR-REPO-NAME
   ```

   **How to find PROJECT-NUMBER**:

   - Go to [GCP Dashboard](https://console.cloud.google.com/home/dashboard?project=search-ahmed)
   - Look for "Project number" under the project name
   - Or run: `gcloud projects describe search-ahmed --format="value(projectNumber)"`

6. **Assign role**:
   - Select role: **"Workload Identity User"**
   - Click **"SAVE"**

### 2.4 Get Workload Identity Provider Resource Name

You'll need this for GitHub Secrets in the next step.

**Format**:

```
projects/PROJECT-NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider
```

**Example**:

```
projects/123456789012/locations/global/workloadIdentityPools/github-pool/providers/github-provider
```

**How to get it**:

1. Go to [Workload Identity Pools](https://console.cloud.google.com/iam-admin/workload-identity-pools?project=search-ahmed)
2. Click on `github-pool`
3. Click on `github-provider`
4. Look for **"Default audience"** or **"Provider resource name"**
5. Copy the full resource path

**Or use this command** (if you have gcloud access):

```bash
gcloud iam workload-identity-pools providers describe github-provider \
  --location=global \
  --workload-identity-pool=github-pool \
  --project=search-ahmed \
  --format="value(name)"
```

---

## Step 3: Configure GitHub Secrets

GitHub Secrets securely store information that the CI/CD workflow needs.

### 3.1 Navigate to Repository Secrets

1. Go to your GitHub repository
2. Click **Settings** (top navigation)
3. In the left sidebar, navigate to:
   **Security → Secrets and variables → Actions**
4. You should see the **"Secrets"** tab selected

### 3.2 Create Required Secrets

You need to create **16 secrets** for full deployment functionality. For each one:

1. Click **"New repository secret"** button
2. Enter the **Name** and **Secret** value
3. Click **"Add secret"**

#### GCP Authentication Secrets (Required for Deployment)

---

#### Secret 1: GCP_WORKLOAD_IDENTITY_PROVIDER

**Name:**

```
GCP_WORKLOAD_IDENTITY_PROVIDER
```

**Secret Value:**

The Workload Identity Provider resource name from Step 2.4:

```
projects/PROJECT-NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider
```

⚠️ **Important**: Replace `PROJECT-NUMBER` with your actual GCP project number

**Example**:

```
projects/123456789012/locations/global/workloadIdentityPools/github-pool/providers/github-provider
```

---

#### Secret 2: GCP_SERVICE_ACCOUNT

**Name:**

```
GCP_SERVICE_ACCOUNT
```

**Secret Value:**

```
github-ci-cd@search-ahmed.iam.gserviceaccount.com
```

---

#### Secret 3: GCP_PROJECT_ID

**Name:**

```
GCP_PROJECT_ID
```

**Secret Value:**

```
search-ahmed
```

---

#### Secret 4: DOCKER_IMAGE_NAME

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

#### Firebase Configuration Secrets (Required for Application)

The application requires Firebase for authentication and database. You need these 6 secrets:

**Secret 5-10: Firebase Configuration**

1. `FIREBASE_API_KEY` - Your Firebase API key
2. `FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
3. `FIREBASE_PROJECT_ID` - Your Firebase project ID
4. `FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
5. `FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
6. `FIREBASE_APP_ID` - Your Firebase app ID

**How to get these values:**
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project (`search-ahmed`)
- Go to Project Settings → General
- Scroll to "Your apps" → Web app
- Copy each value

For detailed Firebase setup, see [Firebase Auth Complete Setup](./firebase/FIREBASE-AUTH-COMPLETE-SETUP.md).

---

#### Pillar Application URLs (Required for Application)

The application integrates with 6 pillar applications. You need these secrets:

**Secret 11-16: Pillar URLs**

1. `PILLAR_1_URL` - URL for Pillar 1 application
2. `PILLAR_2_URL` - URL for Pillar 2 application
3. `PILLAR_3_URL` - URL for Pillar 3 application
4. `PILLAR_4_URL` - URL for Pillar 4 application
5. `PILLAR_5_URL` - URL for Pillar 5 application
6. `PILLAR_6_URL` - URL for Pillar 6 application

**Example format:**
```
https://aiml-coe-pillar-1-xxxxx-uc.a.run.app
```

**Note**: These should be the full URLs to your deployed pillar applications on Cloud Run or other hosting platforms.

---

### 3.3 Verify Secrets

After creating all secrets, you should see these in your repository secrets list:

**GCP Secrets (4):**
- ✅ `GCP_WORKLOAD_IDENTITY_PROVIDER`
- ✅ `GCP_SERVICE_ACCOUNT`
- ✅ `GCP_PROJECT_ID`
- ✅ `DOCKER_IMAGE_NAME`

**Firebase Secrets (6):**
- ✅ `FIREBASE_API_KEY`
- ✅ `FIREBASE_AUTH_DOMAIN`
- ✅ `FIREBASE_PROJECT_ID`
- ✅ `FIREBASE_STORAGE_BUCKET`
- ✅ `FIREBASE_MESSAGING_SENDER_ID`
- ✅ `FIREBASE_APP_ID`

**Pillar URL Secrets (6):**
- ✅ `PILLAR_1_URL`
- ✅ `PILLAR_2_URL`
- ✅ `PILLAR_3_URL`
- ✅ `PILLAR_4_URL`
- ✅ `PILLAR_5_URL`
- ✅ `PILLAR_6_URL`

**Total: 16 secrets**

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

### Issue: "Invalid credentials" or "authentication failed" error

**Cause**: Workload Identity configuration is incorrect

**Solution**:

1. Verify `GCP_WORKLOAD_IDENTITY_PROVIDER` secret matches the provider resource name
2. Verify `GCP_SERVICE_ACCOUNT` secret is `github-ci-cd@search-ahmed.iam.gserviceaccount.com`
3. Ensure the Workload Identity binding includes the correct repository path
4. Check that the service account has "Workload Identity User" role

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

### Workload Identity Federation Benefits

✅ **No downloadable keys** - No risk of leaked credentials
✅ **Automatic rotation** - GitHub's OIDC tokens are short-lived
✅ **Audit trail** - Better visibility into authentication events
✅ **Google recommended** - Follows cloud security best practices

### Least Privilege

The roles assigned provide the minimum permissions needed for deployment. Don't add extra roles unless specifically required.

### Repository Access Control

The Workload Identity binding is scoped to your specific GitHub repository. Only workflows from that repository can authenticate as the service account.

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

**GCP Authentication (4 secrets):**
1. `GCP_WORKLOAD_IDENTITY_PROVIDER` - Workload Identity Provider resource name
2. `GCP_SERVICE_ACCOUNT` - `github-ci-cd@search-ahmed.iam.gserviceaccount.com`
3. `GCP_PROJECT_ID` - `search-ahmed`
4. `DOCKER_IMAGE_NAME` - `aiml-coe-web-app`

**Firebase Configuration (6 secrets):**
5. `FIREBASE_API_KEY`
6. `FIREBASE_AUTH_DOMAIN`
7. `FIREBASE_PROJECT_ID`
8. `FIREBASE_STORAGE_BUCKET`
9. `FIREBASE_MESSAGING_SENDER_ID`
10. `FIREBASE_APP_ID`

**Pillar URLs (6 secrets):**
11. `PILLAR_1_URL` through `PILLAR_6_URL`

**Total: 16 secrets required**

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

**Last Updated**: 2026-01-21
**Project**: AIML COE Web Application
**Environment**: Production (`search-ahmed`)
