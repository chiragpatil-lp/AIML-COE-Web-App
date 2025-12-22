# Claude Code Guidelines for AIML COE Web Application

## Project Overview

This is the AIML Center of Excellence web application - a modern Next.js 16 application with React 19, TypeScript, and Tailwind CSS. It features responsive UI components, animations, 3D graphics, and is deployed on Google Cloud Run.

## Tech Stack

- **Framework**: Next.js 16.0.10 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.7.2
- **Styling**: Tailwind CSS 4.1.9, DaisyUI 5.5.14
- **Animations**: Framer Motion 12.4.10
- **3D Graphics**: Three.js, React Three Fiber
- **Package Manager**: pnpm (required)
- **Deployment**: Google Cloud Run with GitHub Actions CI/CD

## Code Style and Standards

### General Principles

1. **Keep it Simple**: Avoid over-engineering. Only make changes that are directly requested or clearly necessary.
2. **TypeScript First**: All code should be properly typed. No `any` types unless absolutely necessary with justification.
3. **Modern React**: Use React 19 features, hooks, and functional components exclusively. No class components.
4. **Accessibility**: All components should follow WCAG 2.1 AA standards.

### File Organization

```
frontend/
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable React components
├── public/          # Static assets
└── docs/            # Documentation
```

### Component Guidelines

1. **Component Structure**:
   - Use functional components with TypeScript
   - Export components as named exports
   - Props should be defined with TypeScript interfaces
   - Use compound components for complex UI patterns

2. **Naming Conventions**:
   - Components: PascalCase (e.g., `UserProfile.tsx`)
   - Utilities: camelCase (e.g., `formatDate.ts`)
   - Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
   - Files: Match component name

3. **Component Example**:
   ```tsx
   interface ButtonProps {
     variant?: 'primary' | 'secondary';
     onClick: () => void;
     children: React.ReactNode;
   }

   export function Button({ variant = 'primary', onClick, children }: ButtonProps) {
     return (
       <button
         onClick={onClick}
         className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
       >
         {children}
       </button>
     );
   }
   ```

### Styling

1. **Tailwind CSS**: Use Tailwind utility classes for all styling
2. **DaisyUI**: Leverage DaisyUI components where appropriate
3. **Responsive Design**: Mobile-first approach using Tailwind breakpoints (sm, md, lg, xl, 2xl)
4. **Animations**: Use Framer Motion for complex animations, Tailwind for simple transitions
5. **Class Organization**: Use `clsx` or `tailwind-merge` for conditional classes

### State Management

1. **Local State**: Use `useState` and `useReducer` for component-level state
2. **Server State**: Use Next.js App Router features (Server Components, Server Actions)
3. **Form State**: Use `react-hook-form` with `zod` for validation
4. **Global State**: Context API for theme, user preferences, etc.

### Performance

1. **Code Splitting**: Leverage Next.js automatic code splitting
2. **Image Optimization**: Use Next.js `Image` component for all images
3. **Lazy Loading**: Use dynamic imports for heavy components
4. **Memoization**: Use `useMemo` and `useCallback` judiciously (only when needed)

### Error Handling

1. **User-Facing Errors**: Use `sonner` for toast notifications
2. **Error Boundaries**: Implement for critical sections
3. **API Errors**: Provide clear, actionable error messages
4. **Validation**: Client-side validation with Zod schemas

### Testing

1. **Write tests for**:
   - Critical business logic
   - Complex components
   - Utility functions
2. **Test Coverage**: Aim for meaningful coverage, not just percentages
3. **Testing Library**: Follow React Testing Library best practices

### Git and Version Control

1. **Branch Strategy**: Feature branches from `main`, merge via Pull Requests only
2. **Commit Messages**:
   - Use conventional commits format: `type(scope): description`
   - Types: feat, fix, docs, style, refactor, test, chore
   - Example: `feat(auth): add OAuth login support`
3. **PR Requirements**:
   - Code must pass linting and formatting checks
   - Must be reviewed before merging
   - Should include description of changes and testing done

### Code Review Criteria

When reviewing code, focus on:

1. **Functionality**: Does the code work as intended?
2. **Security**: Are there any security vulnerabilities (XSS, injection, etc.)?
3. **Performance**: Any performance concerns or unnecessary re-renders?
4. **Accessibility**: Does it meet WCAG standards?
5. **Type Safety**: Proper TypeScript usage?
6. **Code Quality**: Readable, maintainable, follows conventions?
7. **Testing**: Are there appropriate tests?

### Security

1. **Input Validation**: Validate and sanitize all user inputs
2. **Authentication**: Secure handling of credentials and tokens
3. **Environment Variables**: Never commit sensitive data
4. **Dependencies**: Keep dependencies up to date
5. **OWASP Top 10**: Be aware of common vulnerabilities

### Package Management

1. **Always use pnpm**: `pnpm install`, `pnpm add`, `pnpm remove`
2. **Lock Files**: Commit `pnpm-lock.yaml`
3. **Updates**: Review breaking changes before updating major versions

### Documentation

1. **Code Comments**: Use JSDoc for complex functions
2. **README Updates**: Keep documentation in sync with code
3. **API Documentation**: Document public APIs and component props
4. **Inline Comments**: Explain "why", not "what"

### CI/CD

1. **Automated Checks**: All PRs must pass lint, format, and build checks
2. **Deployment**: Only `main` branch deploys to production
3. **Environment**: Use GitHub Secrets for sensitive configuration
4. **Rollback**: Be prepared to revert breaking changes

## Common Patterns

### API Routes (Next.js App Router)

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await fetchUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
```

### Server Components

```typescript
// app/dashboard/page.tsx
async function DashboardPage() {
  const data = await fetchDashboardData();

  return (
    <main className="container mx-auto px-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardContent data={data} />
    </main>
  );
}

export default DashboardPage;
```

### Form Handling

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## Review Severity Guidelines

When creating PR reviews:

- **Critical**: Security vulnerabilities, data loss risks, breaking changes
- **High**: Performance issues, accessibility violations, type safety issues
- **Medium**: Code quality, maintainability, missing documentation
- **Low**: Style inconsistencies, minor optimizations, suggestions

## Questions to Ask During Review

1. Does this change align with the project's architecture?
2. Are there any edge cases not handled?
3. Is the error handling appropriate?
4. Will this scale with increased usage?
5. Is there adequate test coverage?
6. Are there any breaking changes for existing features?

## Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
