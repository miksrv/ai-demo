---
name: Project tech stack and conventions
description: Core tech stack, test setup, and component conventions for this React project
type: project
---

React 18, TypeScript 5, Tailwind CSS 3, Vite 6, Vitest 3 + React Testing Library, TanStack Query, Jotai, react-router-dom v7.

**Why:** Established project scaffold — all new components must align with these choices.
**How to apply:** Never plan for external filtering/sorting/state libraries. Use useMemo for derived data, Tailwind for styling, Vitest for tests.

Test setup: `src/test/setup.ts` imports `@testing-library/jest-dom`. Tests live co-located next to components (e.g. `TaskCard/TaskCard.test.tsx`).

Component barrel pattern: every component directory exports via an `index.ts` barrel file.

Types live in `src/types/`. The canonical task type is `Task` (not `TaskCard`) in `src/types/task.ts`. It includes an optional `description` field not present in the feature-request's interface — assignee is non-nullable in the existing type.

`useLocalStorage` hook exists at `src/utils/useLocalStorage.ts` — available for persisting filter/sort state if needed.
