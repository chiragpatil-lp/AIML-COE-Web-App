# Specification: Frontend Comprehensive Testing

## Overview
This track focuses on establishing a robust testing suite for the AIML COE Web Application frontend using Vitest and React Testing Library. The goal is to ensure the reliability of core features including Authentication, Admin Management, Newsletters, and Navigation logic through Unit and Integration tests with full service mocking.

## Functional Requirements

### 1. Authentication Testing
- **AuthContext:** Verify user state transitions (logged out -> logging in -> logged in).
- **SignIn/SignOut:** Mock Firebase Auth to verify successful login and logout flows.
- **Protected Routes:** Ensure unauthorized users are redirected from `/admin` and `/dashboard` to the sign-in page.

### 2. Admin Panel Testing
- **Dashboard Access:** Verify that only users with the `admin` role can access the Admin Dashboard.
- **User Management:** Mock Firestore operations for adding, editing permissions, and deleting users.
- **RBAC:** Verify UI elements (like "Edit" buttons) are conditionally rendered based on permissions.

### 3. Newsletter & Content Testing
- **Content Loading:** Verify that Markdown files in `frontend/content/posts/` are correctly parsed and rendered.
- **Dynamic Routing:** Test that adding a new `.md` file results in a valid route/post view.
- **Filtering & Subscription:** Test category filtering logic and the subscription form submission (mocked API).

### 4. Navigation & Redirects
- **Pillar URI Redirects:** Verify that specific Pillar URIs or legacy routes correctly redirect to their intended destinations.

## Non-Functional Requirements
- **Test Execution Speed:** Use full mocking for Firebase (Auth/Firestore) and File System to ensure tests run quickly without external dependencies.
- **Coverage:** Aim for high coverage of business logic in `AuthContext` and utility functions.
- **Maintainability:** Use shared mocks for Firebase services to avoid duplication.

## Acceptance Criteria
- [ ] Vitest environment is correctly configured for Next.js 16/React 19.
- [ ] Mock suite for Firebase Auth and Firestore is implemented.
- [ ] Tests pass for login/logout and protected route redirection.
- [ ] Tests pass for Admin Dashboard RBAC and User Management actions.
- [ ] Tests verify that new Markdown files in `frontend/content/posts` are detected and rendered.
- [ ] Tests verify Pillar URI redirect logic.
- [ ] `pnpm test` command executes all tests successfully.

## Out of Scope
- E2E testing with Playwright or Cypress.
- Testing of Firebase Cloud Functions (backend logic).
- UI/Snapshot testing (focus is on logic and integration).
