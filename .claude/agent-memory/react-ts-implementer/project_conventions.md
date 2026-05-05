---
name: Project conventions and stack
description: Core conventions for this React/TS/Tailwind project — types, imports, component patterns
type: project
---

**Stack:** React 18, TypeScript 5 strict, Tailwind CSS, Vite, Vitest, React Router (hash router).

**Import alias:** `@/` maps to `src/`.

**Type location:** `src/types/task.ts` — `Task`, `TaskStatus`, `TaskPriority`. `Task.assignee` is non-nullable `{ name: string, avatarUrl: string }`.

**Component pattern:** Functional components with named exports. Props interface defined in same file and re-exported via barrel `index.ts`. No default exports for components.

**Tailwind:** `neutral-*` palette for grays, `blue-*` for interactive/primary, `amber-*`/`red-*`/`green-*` for priority/status badges. Rounded: `rounded-xl` for cards, `rounded-lg` for controls, `rounded-full` for pills/dots. `shadow-sm` on cards.

**Hooks:** Custom hooks in `src/utils/`. Named exports. Generic utilities (`useLocalStorage`) use generics. Feature hooks (`useTaskFilter`) export their return/param interfaces alongside the hook.

**TaskCard:** Spreads `Task` fields as props plus `onClick: (id: string) => void` and optional `isLoading?: boolean`. No `description` prop rendered currently.

**Why:** Observed from reading all existing source files before implementing TaskGrid.
**How to apply:** Match these patterns exactly when adding new components or hooks — do not introduce inline styles, default exports for components, or deviate from the neutral/blue palette convention.
