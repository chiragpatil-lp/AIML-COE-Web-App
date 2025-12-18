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

- Node.js 18.17.0 or higher
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
frontend/
├── .github/
│   └── workflows/        # GitHub Actions CI/CD
├── components/           # React components
├── docs/                # Project documentation
├── public/              # Static assets
├── app/                 # Next.js app directory
├── Dockerfile           # Docker configuration for Cloud Run
└── package.json         # Project dependencies
```

## Documentation

- [Development Guide](./docs/DEVELOPMENT.md) - Local development setup and workflow
- [Deployment Guide](./docs/DEPLOYMENT.md) - CI/CD pipeline and deployment process
- [GCP Setup Guide](./docs/GCP-SETUP.md) - Google Cloud Platform configuration steps

## CI/CD Pipeline

This project uses GitHub Actions to automatically deploy to Google Cloud Run on every push to the `main` branch.

**Status**: ⚠️ Requires GCP Service Account setup (see [GCP Setup Guide](./docs/GCP-SETUP.md))

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
