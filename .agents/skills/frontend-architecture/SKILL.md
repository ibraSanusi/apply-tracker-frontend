---
name: frontend-architecture
description: Enforce clean file structure, maintainable code organization, and React best practices. Use this skill whenever generating, scaffolding, or refactoring any React codebase — even when the user only asks for a component, page, or feature. If the output involves more than one file, or if an existing project structure is visible, always apply this skill to ensure traceable, scalable, and well-organized code.
---

# Frontend Architecture & React Best Practices

This skill ensures that all React code produced is clean, traceable, maintainable, and well-structured. Apply it alongside any frontend generation task.

## File Structure

Use feature-based organization for anything beyond trivial size:

```
src/
├── components/        # Shared, reusable UI components
│   └── Button/
│       ├── Button.tsx
│       ├── Button.styles.ts   # or Button.module.css
│       └── index.ts
├── features/          # Feature-specific logic + UI grouped together
│   └── auth/
│       ├── components/
│       ├── hooks/
│       ├── utils/
│       └── index.ts
├── hooks/             # Shared custom hooks
├── lib/               # Third-party wrappers, clients (e.g. axios instance)
├── pages/ or routes/  # Route-level components only, minimal logic
├── services/          # API calls and external service logic
├── store/             # Global state (Zustand, Redux, Context)
├── types/             # Shared TypeScript interfaces and types
├── utils/             # Pure helper functions
└── constants/         # App-wide constants and enums
```

Co-locate files that only belong to one feature inside that feature's folder. Shared code lives at the top level.

## File Size Rules

- **Components**: max ~150 lines. If longer, extract sub-components or move logic to a hook.
- **Hooks**: max ~100 lines. Split into smaller hooks if growing.
- **Utils/services**: max ~80 lines per file. Group by domain, not by dumping everything in one file.
- **Pages**: max ~80 lines. Pages should compose features, not contain logic.

If a file is approaching its limit, that is a signal to refactor — not to keep adding.

## Component Rules

- One component per file.
- Component file name matches the exported component name (PascalCase).
- No business logic inside components — extract to custom hooks.
- Props interfaces defined at the top of the file or in a colocated `types.ts`.
- Avoid prop drilling beyond 2 levels — use Context, Zustand, or composition instead.

```tsx
// ✅ Good
function UserCard({ userId }: UserCardProps) {
  const { user, isLoading } = useUser(userId)
  return <Card>...</Card>
}

// ❌ Bad - logic inside component
function UserCard({ userId }: UserCardProps) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch(`/api/users/${userId}`).then(...)
  }, [userId])
  return <Card>...</Card>
}
```

## Custom Hooks

- All data fetching, side effects, and derived state go into custom hooks.
- Hook names always start with `use`.
- One concern per hook. Don't build mega-hooks.
- Return only what the consumer needs — avoid exposing internals.

```tsx
// ✅ Good - single responsibility
function useUser(id: string) {
  // fetching + loading + error handling
  return { user, isLoading, error };
}
```

## Naming Conventions

| Element            | Convention                  | Example                      |
| ------------------ | --------------------------- | ---------------------------- |
| Components         | PascalCase                  | `UserProfile.tsx`            |
| Hooks              | camelCase with `use` prefix | `useAuthSession.ts`          |
| Utils / helpers    | camelCase                   | `formatCurrency.ts`          |
| Types / interfaces | PascalCase                  | `UserProfile`, `ApiResponse` |
| Constants          | UPPER_SNAKE_CASE            | `MAX_RETRIES`                |
| CSS modules        | camelCase                   | `styles.cardWrapper`         |
| Folders            | kebab-case                  | `user-profile/`              |

## Imports & Barrel Exports

Use `index.ts` barrel files for public APIs of a feature or component folder:

```ts
// components/Button/index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button";
```

Avoid deep relative imports like `../../../components/Button` — use path aliases:

```ts
// tsconfig.json
"paths": { "@/*": ["./src/*"] }

// Usage
import { Button } from '@/components/Button'
```

Do NOT re-export everything blindly in a global barrel — it hurts tree-shaking and makes tracing harder.

## State Management Rules

- **Local UI state** → `useState` / `useReducer`
- **Server/async state** → React Query or SWR
- **Shared client state** → Zustand or Context (keep Context for low-frequency updates only)
- **URL state** → search params for filters, pagination, tabs

Avoid putting server data into global state — React Query handles caching already.

## Anti-patterns to Avoid

- ❌ Logic in page-level components
- ❌ `useEffect` for derived state (use `useMemo` instead)
- ❌ Passing `setState` down as props (use callbacks or context)
- ❌ Giant switch statements inside components (move to reducers or maps)
- ❌ Hardcoded strings and magic numbers (use constants)
- ❌ Default exports for everything (named exports are more traceable)
- ❌ Mixing concerns: a component that fetches, transforms, and renders data

## When Generating Code

1. **Always declare the file path** as a comment at the top: `// src/features/auth/hooks/useLogin.ts`
2. **If creating multiple files**, list the full structure first before writing code.
3. **If a file would exceed size limits**, split proactively and explain the split.
4. **Prefer named exports** over default exports for traceability.
5. **Add brief JSDoc comments** on non-obvious hooks and utils — not on every function.

```

---

```
