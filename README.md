# AIML COE Web Application

A modern Next.js web application for the AIML Center of Excellence, built with React 19, Next.js 16, and Tailwind CSS.

## Overview

This is the frontend application for the AIML COE platform, featuring a responsive UI with modern components, animations, and interactive elements.

## Tech Stack

- **Framework**: Next.js 16.0.10
- **React**: 19.0.0
- **Styling**: Tailwind CSS 4.1.9, DaisyUI 5.5.14
- **Animations**: Framer Motion 12.4.10
- **3D Graphics**: Three.js, React Three Fiber
- **Package Manager**: pnpm
- **Deployment**: Google Cloud Run with GitHub Actions CI/CD

## Quick Start

### Prerequisites

- Node.js 20.9.0 or higher (required for Next.js 16)
- pnpm (install globally: `npm install -g pnpm`)
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
```

## Project Structure

```
AIML-COE-Web-App/
├── .github/
│   └── workflows/        # GitHub Actions CI/CD (repository root)
├── frontend/
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   ├── docs/           # Detailed documentation
│   ├── public/         # Static assets
│   ├── terraform/      # Infrastructure as Code
│   ├── Dockerfile      # Docker configuration for Cloud Run
│   └── package.json    # Project dependencies
└── README.md           # This file
```

## Documentation

- [Development Guide](./frontend/docs/DEVELOPMENT.md) - Local development setup and workflow
- [Deployment Guide](./frontend/docs/DEPLOYMENT.md) - CI/CD pipeline and deployment process
- [GCP Setup Guide](./frontend/docs/GCP-SETUP.md) - Google Cloud Platform configuration steps
- [Terraform README](./frontend/terraform/README.md) - Infrastructure provisioning guide

## CI/CD Pipeline

This project uses GitHub Actions to automatically deploy to Google Cloud Run on every push to the `main` branch.

**Status**: ✅ **LIVE AND DEPLOYED**

- **Production URL**: https://aiml-coe-web-app-36231825761.us-central1.run.app
- **GCP Project**: search-ahmed
- **Region**: us-central1
- **Service**: aiml-coe-web-app

Every push to `main` automatically triggers:
1. Lint and format validation checks
2. Docker image build with Node.js 20
3. Push to Google Container Registry
4. Deploy to Cloud Run
5. Live in ~3-4 minutes

### CI Validation Checks

Before pushing changes or creating a pull request, run these commands in the `frontend` directory:

```bash
cd frontend

# Lint check - identifies code quality issues (must pass)
pnpm lint

# Format check - ensures consistent code formatting (must pass)
pnpm format:check

# Build check - ensures production build succeeds (must pass)
pnpm build
```

**Fix formatting issues:**
```bash
pnpm format
```

All checks must pass for the CI/CD pipeline to succeed.

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run linting and formatting: `pnpm lint && pnpm format`
4. Push your changes and create a Pull Request

## Environment Variables

Create a `.env.local` file for local development:

```bash
# Add environment variables here
```

## License

Private - All Rights Reserved

## Support

For issues or questions, please contact the AIML COE team.
