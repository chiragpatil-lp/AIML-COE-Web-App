# Claude Code Guidelines for AIML COE Web Application

## Project Overview
This is the AIML Center of Excellence web application - a modern Next.js 16 application with React 19, TypeScript, and Tailwind CSS. It features responsive UI components, animations, 3D graphics, and is deployed on Google Cloud Run.

## Tech Stack
- **Framework**: Next.js 16.0.10 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.7.2
- **Styling**: Tailwind CSS 4.1.9, DaisyUI 5.5.14
- **Animations**: Framer Motion 12.4.10
- **Package Manager**: pnpm (required)
- **Deployment**: Google Cloud Run with GitHub Actions CI/CD

## Common Commands
### Development
```bash
cd frontend
pnpm install
pnpm dev
```

### Build and Lint
```bash
cd frontend
pnpm lint
pnpm build
```

## Authentication Flow
The application uses Firebase Auth for SSO.
1. User signs in to Main App.
2. User clicks Pillar card.
3. Main App API (`/api/pillar/[id]`) verifies permissions and redirects to Pillar App's `/auth/verify` with a token.
4. Pillar App creates a session and redirects to its dashboard.

## Code Standards
- Use functional components with React hooks.
- Strict TypeScript typing (avoid `any`).
- Mobile-first responsive design with Tailwind.
- Server-side logic for sensitive operations.
- Environment variables: `PILLAR_X_URL` for runtime, `NEXT_PUBLIC_PILLAR_X_URL` for build-time.