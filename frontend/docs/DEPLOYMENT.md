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

### Workflow File

Location: `.github/workflows/cloud-run-deploy.yml` (repository root, not frontend/.github)

Key configuration:

```yaml
env:
  SERVICE_NAME: aiml-coe-web-app

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
```

### Docker Configuration

Location: `frontend/Dockerfile`

The Dockerfile is optimized for pnpm and includes:

- **Node.js 20 Alpine base image** (required for Next.js 16)
- pnpm package manager
- Multi-stage build for efficiency
- Port 8080 configuration (Cloud Run default)
- Production-optimized build

**Important**: The workflow runs `cd frontend` before building the Docker image since the Dockerfile is in the frontend directory.

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

If you need to deploy manually:

```bash
# Authenticate with GCP
gcloud auth login
gcloud config set project search-ahmed

# Navigate to frontend directory
cd frontend

# Build Docker image
docker build -t gcr.io/search-ahmed/aiml-coe-web-app:latest .

# Push to GCR
docker push gcr.io/search-ahmed/aiml-coe-web-app:latest

# Deploy to Cloud Run
gcloud run deploy aiml-coe-web-app \
  --image gcr.io/search-ahmed/aiml-coe-web-app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### First-Time Deployment

**Important**: For the very first deployment, the service doesn't exist yet. The workflow will automatically create it with the name `aiml-coe-web-app`.

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
Add to `.github/workflows/cloud-run-deploy.yml`:
```yaml
- name: Deploy to Cloud Run
  run: |
    gcloud run deploy $SERVICE_NAME \
      --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/${{ secrets.DOCKER_IMAGE_NAME }}:latest \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated \
      --set-env-vars "NODE_ENV=production,API_URL=https://api.example.com"
```

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
3. Ensure push is to `main` branch
4. Check repository Actions are enabled in Settings → Actions

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
