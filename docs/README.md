# AIML COE Web Application - Documentation

Welcome to the documentation for the AIML COE Web Application. This directory contains comprehensive guides for development, deployment, and infrastructure setup.

## Documentation Index

### 🚀 Getting Started

1. **[GCP Setup Guide](./GCP-SETUP.md)** - Infrastructure Setup
   - Required manual steps to enable CI/CD
   - Service Account creation
   - GitHub Secrets configuration
   - **Status**: ✅ **COMPLETED** - Infrastructure configured

### 🔐 Authentication & Pillar Access

2. **[Firebase Authentication](./firebase/)** - **START HERE FOR AUTH**

   - ✅ **Complete implementation**
   - ✅ **Pillar SSO authentication**
   - Google OAuth sign-in with Firestore permissions
   - 6 strategic pillar access control with SSO
   - **Status**: ✅ **IMPLEMENTED AND TESTED**

   **Key Documents**:

   - [Complete Setup Guide](./firebase/FIREBASE-AUTH-COMPLETE-SETUP.md) ⭐ Main reference
   - [Implementation Details](./firebase/FIREBASE-AUTH-IMPLEMENTATION.md)
   - [Firebase Folder README](./firebase/README.md)
   - [Pillar Authentication Guide](./PILLAR-AUTHENTICATION.md) ⭐ Pillar SSO flow
   - [Pillar Quick Reference](./PILLAR-QUICK-REFERENCE.md) - Quick commands and common operations
   - [Production Deployment Checklist](./PRODUCTION-DEPLOYMENT-CHECKLIST.md) ⭐ Step-by-step checklist
   - [Production Deployment Guide](./PRODUCTION-DEPLOYMENT-GUIDE.md) - Detailed deployment guide

### 👥 Admin & User Management

3. **[Admin Dashboard](./ADMIN-DASHBOARD.md)**
   - User permission management UI
   - Add, edit, and remove user permissions
   - Admin role management
   - **Status**: ✅ **IMPLEMENTED**

4. **[Firestore Security Rules](./FIRESTORE-SECURITY-RULES.md)**
   - Database security configuration
   - Admin authorization approach
   - Current deployed rules
   - **Status**: ✅ **ACTIVE**

5. **[Cloud Functions](./CLOUD-FUNCTIONS.md)**
   - Backend function architecture
   - Active vs deprecated functions
   - Migration to Next.js API routes
   - **Status**: ✅ **HYBRID ARCHITECTURE**

### 💻 Development

6. **[Development Guide](./DEVELOPMENT.md)**
   - Local development setup
   - Development workflow
   - Code conventions and best practices
   - Common tasks and troubleshooting

### 🔄 Deployment

7. **[Deployment Guide](./DEPLOYMENT.md)**
   - CI/CD pipeline architecture
   - Automated deployment process
   - Monitoring and logging
   - Rollback procedures
   - Configuration management

## Quick Links

### For Developers

- Setting up local environment → [DEVELOPMENT.md](./DEVELOPMENT.md#initial-setup)
- **Firebase Authentication setup** → [firebase/FIREBASE-AUTH-COMPLETE-SETUP.md](./firebase/FIREBASE-AUTH-COMPLETE-SETUP.md)
- Code style guidelines → [DEVELOPMENT.md](./DEVELOPMENT.md#code-style--conventions)
- Adding new features → [DEVELOPMENT.md](./DEVELOPMENT.md#common-tasks)
- Troubleshooting dev issues → [DEVELOPMENT.md](./DEVELOPMENT.md#troubleshooting)
- **Firebase troubleshooting** → [firebase/FIREBASE-AUTH-COMPLETE-SETUP.md](./firebase/FIREBASE-AUTH-COMPLETE-SETUP.md#troubleshooting)

### For Authentication & Permissions

- **Understanding Firebase Auth** → [firebase/FIREBASE-AUTH-COMPLETE-SETUP.md](./firebase/FIREBASE-AUTH-COMPLETE-SETUP.md#architecture--technical-details)
- Testing sign-in flow → [firebase/FIREBASE-AUTH-COMPLETE-SETUP.md](./firebase/FIREBASE-AUTH-COMPLETE-SETUP.md#testing-the-implementation)
- **Granting user permissions** → [firebase/FIREBASE-AUTH-COMPLETE-SETUP.md](./firebase/FIREBASE-AUTH-COMPLETE-SETUP.md#making-your-first-admin-user)
- Permission system explained → [firebase/FIREBASE-AUTH-COMPLETE-SETUP.md](./firebase/FIREBASE-AUTH-COMPLETE-SETUP.md#permission-system)

### For DevOps/Deployment

- ⚠️ **Complete GCP setup first** → [GCP-SETUP.md](./GCP-SETUP.md)
- **Firebase production deployment** → [firebase/FIREBASE-AUTH-COMPLETE-SETUP.md](./firebase/FIREBASE-AUTH-COMPLETE-SETUP.md#deployment-to-production)
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
- [x] **Firebase Authentication implemented** (Dec 26, 2024)
- [x] **Firestore database created** (`aiml-coe-web-app`)
- [x] **Google OAuth sign-in working**
- [x] **Permission-based pillar access control**
- [x] **Workload Identity Federation Configured**
- [x] **GitHub Secrets Configured**
- [x] **Production Deployment Tested**

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
- **Authentication**: Firebase Authentication (Google OAuth)
- **Database**: Firestore (`aiml-coe-web-app` database)
- **Package Manager**: pnpm
- **Infrastructure**: Google Cloud Run
- **CI/CD**: GitHub Actions
- **Container**: Docker with Node.js 20 Alpine

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
AIML-COE-Web-App/                   # Monorepo root
├── .github/
│   └── workflows/
│       ├── cloud-run-deploy.yml    # CI/CD workflow for main app
│       └── ci-validation.yml       # Linting and validation
├── docs/
│   ├── README.md                   # This file
│   ├── firebase/                   # 🔐 Firebase Auth docs
│   │   ├── README.md              # Firebase docs index
│   │   ├── FIREBASE-AUTH-COMPLETE-SETUP.md  # ⭐ Main guide
│   │   └── FIREBASE-AUTH-IMPLEMENTATION.md  # Reference
│   ├── ADMIN-DASHBOARD.md         # Admin UI documentation
│   ├── CLOUD-FUNCTIONS.md         # Backend functions architecture
│   ├── FIRESTORE-SECURITY-RULES.md # Database security
│   ├── PILLAR-AUTHENTICATION.md   # ⭐ Pillar SSO guide
│   ├── PILLAR-QUICK-REFERENCE.md  # Quick reference
│   ├── GCP-SETUP.md              # ⚠️ Required setup
│   ├── DEVELOPMENT.md            # Dev guide
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── PRODUCTION-DEPLOYMENT-CHECKLIST.md
│   └── PRODUCTION-DEPLOYMENT-GUIDE.md
├── frontend/                      # Main web application
│   ├── app/                      # Next.js app directory
│   ├── components/               # React components
│   ├── contexts/                 # React contexts
│   ├── lib/                      # Utilities and helpers
│   ├── public/                   # Static assets
│   ├── terraform/                # Infrastructure as code
│   ├── Dockerfile               # Container configuration
│   ├── package.json             # Dependencies
│   └── pnpm-lock.yaml          # Lock file
├── functions/                    # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts            # Functions entry point
│   │   └── index.clean.ts      # Clean version
│   ├── package.json
│   └── deploy.sh               # Deployment script
├── scripts/                      # Utility scripts
│   ├── check-admin.js
│   ├── check-user-by-uid.js
│   └── ...
├── package.json                  # Root package.json
├── pnpm-workspace.yaml          # pnpm workspace config
└── README.md                     # Project README
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

_Last Updated: January 22, 2026_
