---
name: Project testing conventions
description: Vitest + RTL setup, patterns, and gotchas specific to this ai-demo codebase
type: project
---

## Test toolchain
- **Runner**: Vitest 3.x configured inside `vite.config.ts` (no separate `vitest.config.ts`)
- **Environment**: `jsdom`, globals enabled
- **Setup file**: `src/test/setup.ts` — only imports `@testing-library/jest-dom`
- **RTL packages installed**: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/dom`
- **`@testing-library/user-event` is NOT installed** — use `fireEvent` from RTL for all interactions
- **Path alias**: `@/` → `src/` (configured in vite resolve.aliases)

## Mock pattern for `@/components/Avatar`
All tests that render components which transitively import Avatar must mock it before importing the component:
```typescript
vi.mock('@/components/Avatar', () => ({
    Avatar: ({ placeholder, 'aria-label': ariaLabel }: { placeholder?: string; 'aria-label'?: string }) => (
        <img src="" alt={ariaLabel ?? placeholder ?? ''} />
    ),
}))
// component import comes AFTER the mock
import { MyComponent } from './MyComponent'
```

## ButtonGroup double-role gotcha
`TaskGridControls` renders a `<fieldset>` (implicit `group` role, named by `<legend>`) wrapping a `<div role="group" aria-label="…">`. RTL `getByRole('group', { name: '…' })` matches **both**, causing "Found multiple elements" errors. Use `getAllByRole` and filter to the `DIV` element:
```typescript
function getButtonGroup(name: string) {
    const groups = screen.getAllByRole('group', { name })
    return groups.find((el) => el.tagName === 'DIV') ?? groups[0]
}
```

## Shared test fixtures location
`src/components/TaskGrid/__fixtures__/tasks.ts` — exports `TASKS` (9 tasks), plus filtered subsets: `TODO_TASKS`, `IN_PROGRESS_TASKS`, `DONE_TASKS`, `HIGH_PRIORITY_TASKS`, `MEDIUM_PRIORITY_TASKS`, `LOW_PRIORITY_TASKS`.

## Vitest server.deps.inline
The vite config inlines `@servicepattern/ui`, `@servicepattern/gn-lib`, and `lodash-es` for test transforms. Do not try to mock these as ES module boundary issues may arise.

**Why:** jsdom does not process raw ESM from those packages without inlining.
**How to apply:** If a test fails with "unexpected token" on an import from those packages, check this config before adding mocks.
