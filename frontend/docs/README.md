# AIML COE Web Application - Documentation

Welcome to the documentation for the AIML COE Web Application. This directory contains comprehensive guides for development, deployment, and infrastructure setup.

## Documentation Index

### 🚀 Getting Started

1. **[GCP Setup Guide](./GCP-SETUP.md)** - **START HERE**
   - Required manual steps to enable CI/CD
   - Service Account creation
   - GitHub Secrets configuration
   - **Status**: ⚠️ **ACTION REQUIRED** - Complete this before deployment will work

### 💻 Development

2. **[Development Guide](./DEVELOPMENT.md)**
   - Local development setup
   - Development workflow
   - Code conventions and best practices
   - Common tasks and troubleshooting

### 🔄 Deployment

3. **[Deployment Guide](./DEPLOYMENT.md)**
   - CI/CD pipeline architecture
   - Automated deployment process
   - Monitoring and logging
   - Rollback procedures
   - Configuration management

## Quick Links

### For Developers

- Setting up local environment → [DEVELOPMENT.md](./DEVELOPMENT.md#initial-setup)
- Code style guidelines → [DEVELOPMENT.md](./DEVELOPMENT.md#code-style--conventions)
- Adding new features → [DEVELOPMENT.md](./DEVELOPMENT.md#common-tasks)
- Troubleshooting dev issues → [DEVELOPMENT.md](./DEVELOPMENT.md#troubleshooting)

### For DevOps/Deployment

- ⚠️ **Complete GCP setup first** → [GCP-SETUP.md](./GCP-SETUP.md)
- Understanding CI/CD pipeline → [DEPLOYMENT.md](./DEPLOYMENT.md#cicd-pipeline)
- Deployment process → [DEPLOYMENT.md](./DEPLOYMENT.md#deployment-process)
- Monitoring deployments → [DEPLOYMENT.md](./DEPLOYMENT.md#monitoring)
- Rollback procedures → [DEPLOYMENT.md](./DEPLOYMENT.md#rollback-procedures)

## Current Status

### ✅ Completed Setup

- [x] Next.js project configured
- [x] Dockerfile created (pnpm-optimized)
- [x] GitHub Actions workflow created
- [x] GCP project (`search-ahmed`) set up
- [x] Required GCP APIs enabled

### ⚠️ Pending Actions

- [ ] **Create GCP Service Account** → [Instructions](./GCP-SETUP.md#step-1-create-service-account)
- [ ] **Download Service Account JSON key** → [Instructions](./GCP-SETUP.md#step-2-download-service-account-key)
- [ ] **Configure GitHub Secrets** → [Instructions](./GCP-SETUP.md#step-3-configure-github-secrets)
  - [ ] `GCP_SA_KEY`
  - [ ] `GCP_PROJECT_ID`
  - [ ] `DOCKER_IMAGE_NAME`
- [ ] **Test first deployment** → [Instructions](./GCP-SETUP.md#step-4-test-the-setup)

## Project Information

- **Project Name**: AIML COE Web Application
- **GCP Project**: `search-ahmed`
- **Framework**: Next.js 16 with React 19
- **Package Manager**: pnpm
- **Deployment Platform**: Google Cloud Run
- **Region**: us-central1
- **CI/CD**: GitHub Actions

## Technology Stack

- **Frontend**: Next.js 16.0.10, React 19.0.0
- **Styling**: Tailwind CSS 4.1.9, DaisyUI 5.5.14
- **Animations**: Framer Motion 12.4.10
- **3D Graphics**: Three.js, React Three Fiber
- **Type Safety**: TypeScript 5.7.2
- **Package Manager**: pnpm
- **Infrastructure**: Google Cloud Run
- **CI/CD**: GitHub Actions
- **Container**: Docker with Node.js 18.17.0

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   GitHub Repository                      │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   Source   │  │   GitHub     │  │   Workflow     │  │
│  │    Code    │  │   Actions    │  │  cloud-run-    │  │
│  │            │  │              │  │   deploy.yml   │  │
│  └────────────┘  └──────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Push to main
                          ▼
┌─────────────────────────────────────────────────────────┐
│              GitHub Actions Workflow                     │
│  1. Checkout code                                        │
│  2. Authenticate with GCP                                │
│  3. Build Docker image (pnpm)                            │
│  4. Push to Container Registry                           │
│  5. Deploy to Cloud Run                                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Google Cloud Platform                       │
│  ┌──────────────────┐        ┌──────────────────┐       │
│  │  Container       │        │   Cloud Run      │       │
│  │  Registry (GCR)  │───────>│   Service        │       │
│  │                  │        │  (us-central1)   │       │
│  └──────────────────┘        └──────────────────┘       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
                    Live Application
         https://aiml-coe-web-app-xxxxx.run.app
```

## File Structure

```
frontend/
├── .github/
│   └── workflows/
│       └── cloud-run-deploy.yml    # CI/CD workflow
├── docs/
│   ├── README.md                   # This file
│   ├── GCP-SETUP.md               # ⚠️ Required setup
│   ├── DEVELOPMENT.md             # Dev guide
│   └── DEPLOYMENT.md              # Deployment guide
├── components/                     # React components
├── app/                           # Next.js app directory
├── public/                        # Static assets
├── Dockerfile                     # Container configuration
├── package.json                   # Dependencies
├── pnpm-lock.yaml                # Lock file
└── README.md                      # Project README
```

## Common Tasks

### First Time Setup

1. Read [GCP Setup Guide](./GCP-SETUP.md) - **COMPLETE ALL STEPS**
2. Read [Development Guide](./DEVELOPMENT.md#initial-setup)
3. Clone repository and install dependencies
4. Start development server
5. Test deployment pipeline

### Daily Development

1. Pull latest changes: `git pull`
2. Install any new dependencies: `pnpm install`
3. Start dev server: `pnpm dev`
4. Make changes and test
5. Commit and push to feature branch
6. Create Pull Request

### Deploying Changes

1. Merge PR to `main` branch
2. GitHub Actions automatically deploys
3. Monitor deployment in Actions tab
4. Verify deployment in Cloud Run Console

## Resources

### External Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Google Cloud Run Docs](https://cloud.google.com/run/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [pnpm Documentation](https://pnpm.io)

### GCP Console Links

- [Cloud Run Services](https://console.cloud.google.com/run?project=search-ahmed)
- [Container Registry](https://console.cloud.google.com/gcr/images/search-ahmed)
- [Cloud Build History](https://console.cloud.google.com/cloud-build/builds?project=search-ahmed)
- [IAM Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=search-ahmed)
- [Project Dashboard](https://console.cloud.google.com/home/dashboard?project=search-ahmed)

## Support

### Getting Help

1. Check the relevant documentation guide
2. Search existing GitHub issues
3. Check GitHub Actions logs for deployment issues
4. Check Cloud Run logs for runtime issues
5. Contact the development team

### Reporting Issues

When reporting issues, include:
- What you were trying to do
- What happened instead
- Error messages (full text)
- Steps to reproduce
- Screenshots if relevant
- Links to workflow runs or logs

## Contributing

1. Follow code style guidelines in [DEVELOPMENT.md](./DEVELOPMENT.md#code-style--conventions)
2. Test changes locally before pushing
3. Write clear commit messages
4. Update documentation if needed
5. Request code review before merging

## Maintenance

### Regular Tasks

- Update dependencies monthly: `pnpm update`
- Review and rotate GCP service account keys (every 90 days)
- Monitor Cloud Run costs and optimize as needed
- Review and update documentation
- Check for security updates

### Documentation Updates

When updating these docs:
- Keep information current and accurate
- Update "Last Updated" dates
- Add examples where helpful
- Keep formatting consistent

---

**Need to get started?** → [GCP Setup Guide](./GCP-SETUP.md) ⚠️ **Required**

**Ready to develop?** → [Development Guide](./DEVELOPMENT.md)

**Want to understand deployment?** → [Deployment Guide](./DEPLOYMENT.md)

---

*Last Updated: 2025-12-18*
