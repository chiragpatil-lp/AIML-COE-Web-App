# Nexus - Project Context

## Project Overview

**Nexus** is a modern platform built to showcase and manage the AI Center of Excellence's resources, pillars, and case studies. It utilizes a **Next.js 16** frontend with **React 19**, styled with **Tailwind CSS 4** and **DaisyUI**. The backend logic is supported by **Firebase Cloud Functions**, and the infrastructure is managed via **Terraform** and deployed to **Google Cloud Run**.

## Tech Stack

| Category | Technology | Version |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | 16.0.10 |
| **UI Library** | React | 19.0.0 |
| **Language** | TypeScript | 5.7.x |
| **Styling** | Tailwind CSS | 4.1.9 |
| **Components** | DaisyUI, Radix UI | 5.5.14 |
| **Animation** | Framer Motion | 12.4.10 |
| **3D Graphics** | Three.js, React Three Fiber | Latest |
| **Backend** | Firebase Cloud Functions | Node 18 |
| **Infra** | Terraform | - |
| **Package Manager** | pnpm | - |

## Project Structure

```text
/home/lordpatil/AIML-COE-Web-App/
├── frontend/                  # Main Next.js Application
│   ├── app/                   # App Router pages & layouts
│   ├── components/            # React components (ui, dashboard, etc.)
│   ├── contexts/              # React Context providers (AuthContext)
│   ├── docs/                  # Detailed documentation (Development, Deployment)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities, Firebase config, Types
│   ├── public/                # Static assets
│   └── terraform/             # Infrastructure as Code (Terraform)
├── functions/                 # Firebase Cloud Functions (Backend)
│   └── src/                   # TypeScript source for functions
└── .github/workflows/         # CI/CD Pipelines (Cloud Run deploy)
```

## Getting Started

### Prerequisites
*   **Node.js**: >= 20.9.0
*   **pnpm**: Installed globally (`npm install -g pnpm`)

### Installation & Running (Frontend)

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Set up environment variables:
    *   Create `.env.local` based on required variables (e.g., `NEXT_PUBLIC_API_URL`).
4.  Start the development server:
    ```bash
    pnpm dev
    ```
    Access at `http://localhost:3000`.

### Cloud Functions
1.  Navigate to the functions directory:
    ```bash
    cd functions
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build and emulate:
    ```bash
    npm run serve
    ```

## Development Workflow

### Key Commands (Frontend)

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |

### Branching & Commits
*   **Branches:**
    *   `main`: Production (Auto-deploys to Cloud Run).
    *   `feature/<name>`: New features.
    *   `bugfix/<name>`: Bug fixes.
*   **Commits:** Follow **Conventional Commits**:
    *   `feat(...)`: New feature
    *   `fix(...)`: Bug fix
    *   `style(...)`: Formatting/styles
    *   `refactor(...)`: Code restructuring
    *   `docs(...)`: Documentation

## Code Conventions

*   **TypeScript:** Strict typing is enforced. Avoid `any`. Use interfaces for Props and Data models.
*   **Components:**
    *   Functional components with Hooks.
    *   Naming: `PascalCase.tsx` (e.g., `UserProfile.tsx`).
    *   Colocate related components if specific to a feature.
*   **Styling:**
    *   **Mobile-First:** Use Tailwind responsive prefixes (e.g., `md:px-6`).
    *   Use `clsx` or `tailwind-merge` for conditional class names.
*   **State Management:** Use Context API for global state (Auth) and local state for components.

## Deployment & Infrastructure
*   **CI/CD:** GitHub Actions pipelines in `.github/workflows`.
*   **Target:** Google Cloud Run.
*   **Process:** Push to `main` -> Lint/Test -> Build Docker Image -> Push to GCR -> Deploy to Cloud Run.
