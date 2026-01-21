# Deployment Guide

This guide covers the CI/CD pipeline and deployment process for the AIML COE Web Application to Google Cloud Run.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment Process](#deployment-process)
- [Monitoring](#monitoring)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)

## Overview

The application uses a fully automated CI/CD pipeline that:

1. Triggers on every push to `main` branch
2. Builds a Docker image using pnpm
3. Pushes image to Google Container Registry (GCR)
4. Deploys to Google Cloud Run
5. Makes the app publicly accessible

**Infrastructure:**

- **Platform**: Google Cloud Run (serverless container platform)
- **Region**: us-central1
- **Container Registry**: Google Container Registry (gcr.io)
- **CI/CD**: GitHub Actions with Workload Identity Federation
- **Node.js**: v20 (Alpine Linux)
- **Authentication**: Workload Identity Federation (no service account keys)

## Prerequisites

Before deployment works, you must complete the GCP setup. See [GCP Setup Guide](./GCP-SETUP.md) for detailed instructions.

### ✅ Setup Status - COMPLETED

- [x] GCP Project created (`search-ahmed`)
- [x] Required APIs enabled (Cloud Run, Cloud Build, Container Registry, IAM Credentials)
- [x] Service Account created with proper permissions (`github-ci-cd@search-ahmed.iam.gserviceaccount.com`)
- [x] Workload Identity Federation configured (GitHub OIDC)
- [x] GitHub Secrets configured:
  - [x] `GCP_WORKLOAD_IDENTITY_PROVIDER`
  - [x] `GCP_SERVICE_ACCOUNT`
  - [x] `GCP_PROJECT_ID`
  - [x] `DOCKER_IMAGE_NAME`
  - [x] `FIREBASE_API_KEY`
  - [x] `FIREBASE_AUTH_DOMAIN`
  - [x] `FIREBASE_PROJECT_ID`
  - [x] `FIREBASE_STORAGE_BUCKET`
  - [x] `FIREBASE_MESSAGING_SENDER_ID`
  - [x] `FIREBASE_APP_ID`
  - [x] `PILLAR_1_URL` through `PILLAR_6_URL`
- [x] **Application LIVE**: https://aiml-coe-web-app-36231825761.us-central1.run.app

## CI/CD Pipeline

### Pipeline Architecture

```
┌─────────────────┐
│  Push to main   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  GitHub Actions         │
│  ┌──────────────────┐   │
│  │ Checkout Code    │   │
│  └────────┬─────────┘   │
│           │             │
│           ▼             │
│  ┌──────────────────┐   │
│  │ Authenticate GCP │   │
│  └────────┬─────────┘   │
│           │             │
│           ▼             │
│  ┌──────────────────┐   │
│  │ Build Docker     │   │
│  │ Image (pnpm)     │   │
│  └────────┬─────────┘   │
│           │             │
│           ▼             │
│  ┌──────────────────┐   │
│  │ Push to GCR      │   │
│  └────────┬─────────┘   │
│           │             │
│           ▼             │
│  ┌──────────────────┐   │
│  │ Deploy to        │   │
│  │ Cloud Run        │   │
│  └──────────────────┘   │
└─────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Live on Cloud  │
│  Run URL        │
└─────────────────┘
```

### Workflow Files

**Cloud Run Deployment**: `.github/workflows/cloud-run-deploy.yml`
- Triggers on push to `main` branch
- Builds and deploys to Cloud Run
- Uses Workload Identity Federation for authentication

**CI Validation**: `.github/workflows/ci-validation.yml`
- Triggers on pull requests to `main` branch
- Runs formatting checks, linting, and builds
- Does not deploy

Key deployment configuration:

```yaml
env:
  SERVICE_NAME: aiml-coe-web-app
  REGION: us-central1

on:
  push:
    branches:
      - main
```

### Docker Configuration

Location: `frontend/Dockerfile`

The Dockerfile is optimized for pnpm and includes:

- **Node.js 20 Alpine base image** (required for Next.js 16)
- pnpm package manager
- Port 8080 configuration (Cloud Run default)
- Production-optimized build with `pnpm build`
- Build arguments for Firebase configuration (NEXT_PUBLIC_FIREBASE_*)
- Build arguments for Pillar URLs (NEXT_PUBLIC_PILLAR_1_URL through NEXT_PUBLIC_PILLAR_6_URL)
- Environment variables set at build time for Next.js static optimization

**Important**: The workflow uses Docker Buildx with `context: ./frontend` to build from the frontend directory. Build arguments are passed from GitHub Secrets during the build process.

## Deployment Process

### Automatic Deployment

Every push to `main` automatically triggers deployment:

1. **Commit and Push**

   ```bash
   git add .
   git commit -m "feat: new feature"
   git push origin main
   ```

2. **Monitor Deployment**

   - Go to GitHub repository
   - Click "Actions" tab
   - Watch the "Deploy to Cloud Run" workflow

3. **Access Application**
   - Once workflow completes successfully (~3-4 minutes)
   - **Live URL**: https://aiml-coe-web-app-36231825761.us-central1.run.app
   - Or visit: [Google Cloud Console → Cloud Run](https://console.cloud.google.com/run?project=search-ahmed)

### Manual Deployment (if needed)

**Option 1: Manual Docker Build and Deploy**

```bash
# Authenticate with GCP
gcloud auth login
gcloud config set project search-ahmed

# Navigate to frontend directory
cd frontend

# Build Docker image with build args
docker build \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="your-key" \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-domain" \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="search-ahmed" \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-bucket" \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-id" \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id" \
  --build-arg NEXT_PUBLIC_PILLAR_1_URL="pillar1-url" \
  --build-arg NEXT_PUBLIC_PILLAR_2_URL="pillar2-url" \
  --build-arg NEXT_PUBLIC_PILLAR_3_URL="pillar3-url" \
  --build-arg NEXT_PUBLIC_PILLAR_4_URL="pillar4-url" \
  --build-arg NEXT_PUBLIC_PILLAR_5_URL="pillar5-url" \
  --build-arg NEXT_PUBLIC_PILLAR_6_URL="pillar6-url" \
  -t gcr.io/search-ahmed/aiml-coe-web-app:latest .

# Push to GCR
docker push gcr.io/search-ahmed/aiml-coe-web-app:latest

# Deploy to Cloud Run
gcloud run deploy aiml-coe-web-app \
  --image gcr.io/search-ahmed/aiml-coe-web-app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --max-instances=10
```

**Option 2: Infrastructure Setup with Terraform**

The project includes Terraform configuration for initial GCP infrastructure setup:

```bash
cd frontend/terraform
terraform init
terraform plan
terraform apply
```

This sets up:
- Service accounts
- Workload Identity Pool and Provider
- Required GCP APIs
- IAM permissions

**Note**: Terraform is for infrastructure setup only, not for application deployment.

### First-Time Deployment

**Important**: For the very first deployment, the service doesn't exist yet. The workflow will automatically create it with the name `aiml-coe-web-app`.

### Revision Management

The workflow automatically:
- Creates a revision suffix based on git commit SHA
- Tags each revision with `commit-<SHA>` for easy identification
- Tags the latest successful deployment with `latest` tag
- Cleans up old revisions (keeps only the last 10 to manage storage)

## Monitoring

### View Deployment Logs

**GitHub Actions:**

- Repository → Actions → Select workflow run
- Click on job steps to see detailed logs

**Google Cloud Console:**

- [Cloud Run Services](https://console.cloud.google.com/run?project=search-ahmed)
- Click on service → Logs tab

### Application Logs

View runtime logs in Cloud Console:

- Cloud Run → Select service → Logs
- Filter by severity, time range, etc.

### Metrics & Performance

Monitor in Cloud Console:

- Cloud Run → Select service → Metrics tab
- View request count, latency, memory usage, etc.

## Rollback Procedures

### Rollback to Previous Version

If a deployment causes issues:

**Option 1: Via Cloud Console**

1. Go to Cloud Run → Select service
2. Click "Revisions" tab
3. Select previous stable revision
4. Click "Manage Traffic"
5. Route 100% traffic to that revision

**Option 2: Via CLI**

```bash
# List revisions
gcloud run revisions list --service=aiml-coe-web-app --region=us-central1

# Route traffic to specific revision
gcloud run services update-traffic aiml-coe-web-app \
  --to-revisions=<revision-name>=100 \
  --region=us-central1
```

**Option 3: Git Revert**

```bash
# Revert the problematic commit
git revert <commit-hash>
git push origin main

# This will trigger a new deployment with the reverted code
```

## Cloud Functions Deployment

### Overview

The project uses a **Hybrid Architecture** for backend operations:

**Active Function (Identity Trigger)**:
- `onUserCreate` - Automatically creates user permissions when new user signs up (beforeUserCreated trigger)
  - **Status**: ✅ ACTIVE - This is the only function actively used in production
  - **Purpose**: Handles "Pending Permissions" workflow and initializes default user permissions

**Deprecated Callable Functions** (kept for backup/compatibility):
- `setAdminClaim` - ❌ Replaced by `/api/admin/set-admin-claim`
- `updateUserPermissions` - ❌ Replaced by `/api/admin/update-permissions`
- `getUserPermissions` - ❌ Replaced by direct Firestore reads
- `initializeUser` - ❌ Replaced by `/api/auth/initialize-user`

**Note**: Admin operations now use Next.js API routes instead of callable Cloud Functions for better performance and to avoid CORS issues. See [CLOUD-FUNCTIONS.md](./CLOUD-FUNCTIONS.md) for details.

**Configuration**:
- Runtime: Node.js 20
- Region: us-central1
- Project: search-ahmed
- Database: aiml-coe-web-app (named Firestore database)

### Deployment Process

Only the `onUserCreate` trigger needs to be deployed:

```bash
cd functions
npm run build
firebase deploy --only functions:onUserCreate
```

The deployment script (`deploy.sh`) can deploy all functions if needed:

```bash
cd functions
./deploy.sh
```

The deployment script:
1. Builds TypeScript source with `npm run build` (compiles to `lib/` directory)
2. Deploys each function individually to GCP Cloud Functions Gen 2
3. Configures HTTP triggers for callable functions
4. Sets resource limits (256MB memory, 60s timeout, 10 max instances)

**Note**: 
- Functions must be built locally with `npm run build` (in functions/ directory) before deploying
- Cloud Functions deployment is NOT automated in CI/CD and must be done manually when function code changes
- For most admin operations, use Next.js API routes which deploy automatically with the frontend

## Configuration

### Environment Variables

To add environment variables to Cloud Run:

**Via Cloud Console:**

1. Cloud Run → Select service → Edit & Deploy New Revision
2. Variables & Secrets tab
3. Add environment variables
4. Deploy

**Via CLI:**

```bash
gcloud run services update aiml-coe-web-app \
  --update-env-vars KEY1=value1,KEY2=value2 \
  --region=us-central1
```

**Via Workflow:**
The current workflow deploys with these settings:

```yaml
- name: Deploy to Cloud Run
  run: |
    gcloud run deploy $SERVICE_NAME \
      --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/${{ secrets.DOCKER_IMAGE_NAME }}:latest \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated \
      --memory=512Mi \
      --cpu=1 \
      --max-instances=10 \
      --min-instances=0 \
      --concurrency=80 \
      --timeout=300s \
      --revision-suffix=$COMMIT_SHA \
      --tag=commit-$COMMIT_SHA \
      --set-env-vars "NEXT_PUBLIC_FIREBASE_API_KEY=...,NEXT_PUBLIC_PILLAR_1_URL=..."
```

**Note**: Environment variables include all Firebase configuration and Pillar URLs. Both `NEXT_PUBLIC_*` and non-prefixed versions are set for runtime access.

### Resource Limits

Adjust CPU and memory:

```bash
gcloud run services update aiml-coe-web-app \
  --memory=512Mi \
  --cpu=1 \
  --region=us-central1
```

### Scaling Configuration

Configure autoscaling:

```bash
gcloud run services update aiml-coe-web-app \
  --min-instances=0 \
  --max-instances=10 \
  --region=us-central1
```

## Troubleshooting

### Deployment Fails at Authentication

**Error**: `Permission denied` or `Invalid credentials`

**Solution**:

1. Verify GitHub Secrets are set correctly
2. Check Service Account has required roles
3. Ensure JSON key is valid and complete

### Build Fails

**Error**: Docker build fails

**Common Causes**:

1. **Node.js version mismatch**

   - Error: `You are using Node.js X.X.X. For Next.js, Node.js version ">=20.9.0" is required.`
   - Solution: Update Dockerfile to use `FROM node:20-alpine`

2. **Dockerfile in wrong location**

   - Ensure Dockerfile is in `frontend/` directory
   - Workflow should run `cd frontend` before `docker build`

3. **Other build issues**
   - Test build locally: `cd frontend && docker build -t test .`
   - Check Dockerfile syntax
   - Verify all dependencies in package.json
   - Check for TypeScript errors: `pnpm lint`

### Deployment Succeeds but App Doesn't Work

**Solutions**:

1. Check Cloud Run logs for runtime errors
2. Verify PORT environment variable (should be 8080)
3. Check that `pnpm start` works locally after `pnpm build`
4. Verify environment variables are set correctly

### Workflow Doesn't Trigger

**Solutions**:

1. **Check workflow location**: Must be in repository root `.github/workflows/`, NOT `frontend/.github/workflows/`
2. Verify YAML syntax is correct
3. Ensure push is to `main` branch for deployment (Cloud Run deploy)
4. Ensure PR is to `main` branch for validation (CI validation workflow)
5. Check repository Actions are enabled in Settings → Actions

**Note**: The project has two workflows:
- `cloud-run-deploy.yml` - Deploys on push to main
- `ci-validation.yml` - Validates on pull requests to main

### Image Push Fails

**Error**: `Permission denied` when pushing to GCR

**Solution**:

1. Verify Service Account has Storage Object Admin role
2. Check Container Registry API is enabled
3. Authenticate Docker: `gcloud auth configure-docker`

### Service URL Returns 404

**Solutions**:

1. Wait a few minutes for deployment to complete
2. Check revision is receiving traffic
3. Verify app is listening on PORT 8080
4. Check app logs for startup errors

## Best Practices

### Before Pushing to Main

1. **Test locally**

   ```bash
   pnpm build
   pnpm start
   ```

2. **Run linting**

   ```bash
   pnpm lint
   pnpm format:check
   ```

3. **Test Docker build locally**
   ```bash
   docker build -t test .
   docker run -p 8080:8080 -e PORT=8080 test
   ```

### Production Checklist

- [ ] All environment variables configured
- [ ] Error monitoring set up
- [ ] Resource limits appropriate for traffic
- [ ] Auto-scaling configured
- [ ] Secrets properly managed (not in code)
- [ ] HTTPS enforced
- [ ] Health checks configured

## Cost Optimization

Cloud Run charges based on:

- Request count
- Compute time
- Memory allocation

**Tips to reduce costs**:

1. Set appropriate resource limits
2. Configure `--min-instances=0` for dev environments
3. Use `--cpu-throttling` for non-latency-sensitive apps
4. Monitor and adjust based on actual usage

## Additional Resources

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## Need Help?

1. Check GitHub Actions logs
2. Check Cloud Run logs
3. Review this documentation
4. Contact DevOps team
5. Create GitHub issue with:
   - Workflow run URL
   - Error messages
   - Steps to reproduce
