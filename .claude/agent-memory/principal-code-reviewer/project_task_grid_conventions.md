---
name: TaskGrid feature conventions
description: Established patterns, conventions, and quality signals from the TaskGrid feature code review (April 2026)
type: project
---

Reviewed TaskGrid feature (src/types/task.ts, src/utils/useTaskFilter.ts, src/components/TaskGrid/, src/components/TaskCard/). All 133 tests pass.

**Why:** Documents patterns to apply consistently across future features.
**How to apply:** Use as a baseline when reviewing or writing new component features in this repo.

## Established patterns
- Hooks return a typed result interface (`UseTaskFilterResult`) — always define a named return type interface for custom hooks
- Filter/sort state is lifted into separate `FilterState` / `SortState` interfaces exported from the hook file — consumers import these types directly
- Module-level `DEFAULT_FILTERS` / `DEFAULT_SORT` constants are defined outside the component so they're stable references (not recreated on each render)
- Fixture files live in `__fixtures__/tasks.ts` co-located with the component under test
- Tests use RTL `renderHook` for hook tests and `fireEvent` (not `userEvent`) for component tests — this is the established testing pattern
- `TaskCard` takes `onClick: (id: string) => void` — the card does not receive the full Task object; the parent (TaskGrid) is responsible for the id→Task lookup
- `aria-pressed` is used on toggle buttons inside `<fieldset disabled>` groups — consistent pattern for filter pill buttons
- Both `htmlFor`+`id` AND redundant `aria-label` are present on the search input — the aria-label is technically redundant but harmless and is an established pattern in this codebase
- `role="group" aria-label` on the inner `<div>` inside `<fieldset>` — this is intentional to allow querying both by fieldset (implicit group) and the explicit group; tests rely on finding the `<div>` group

## Known gaps identified in review (not yet fixed)
- `valueToSortState` uses a fragile `split('-')` that would silently break if a future sort key contained a hyphen (e.g., `due-date`)
- `totalCount` in `useTaskFilter` is derived outside `useMemo` — could cause unnecessary re-renders if tasks reference changes but values are the same (minor)
- `dueDate` is a raw ISO string with no runtime validation — invalid dates silently produce `NaN` in sort comparisons
- No `description` field search — search is title-only; this is by design for now
- `@typescript-eslint/explicit-function-return-type` is disabled project-wide — explicit return types on exported functions are therefore not enforced by the linter
- `react-hooks/exhaustive-deps` is disabled project-wide — dependency arrays are not linter-verified
- `@vitest/eslint-plugin` package is referenced in eslint.config.mjs but not installed — ESLint cannot run (dev tooling gap)
