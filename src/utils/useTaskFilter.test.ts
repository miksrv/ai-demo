import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TASKS } from '@/components/TaskGrid/__fixtures__/tasks'
import { FilterState, SortState, useTaskFilter } from '@/utils/useTaskFilter'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DEFAULT_FILTERS: FilterState = {
    statusFilter: 'all',
    priorityFilter: 'all',
    searchQuery: '',
}

const DEFAULT_SORT: SortState = {
    sortKey: 'dueDate',
    sortDirection: 'asc',
}

function renderFilter(
    filters: Partial<FilterState> = {},
    sort: Partial<SortState> = {},
) {
    return renderHook(() =>
        useTaskFilter(
            TASKS,
            { ...DEFAULT_FILTERS, ...filters },
            { ...DEFAULT_SORT, ...sort },
        ),
    )
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useTaskFilter', () => {
    // -----------------------------------------------------------------------
    // totalCount / filteredCount invariants
    // -----------------------------------------------------------------------
    describe('counts', () => {
        it('totalCount always equals tasks.length regardless of filters', () => {
            const { result } = renderFilter({ statusFilter: 'todo' })
            expect(result.current.totalCount).toBe(TASKS.length)
        })

        it('filteredCount equals filteredTasks.length', () => {
            const { result } = renderFilter({ statusFilter: 'todo' })
            expect(result.current.filteredCount).toBe(result.current.filteredTasks.length)
        })

        it('returns totalCount of 0 and empty filteredTasks for an empty task list', () => {
            const { result } = renderHook(() =>
                useTaskFilter([], DEFAULT_FILTERS, DEFAULT_SORT),
            )
            expect(result.current.totalCount).toBe(0)
            expect(result.current.filteredCount).toBe(0)
            expect(result.current.filteredTasks).toHaveLength(0)
        })
    })

    // -----------------------------------------------------------------------
    // Status filter
    // -----------------------------------------------------------------------
    describe('statusFilter', () => {
        it('returns all tasks when statusFilter is "all"', () => {
            const { result } = renderFilter({ statusFilter: 'all' })
            expect(result.current.filteredCount).toBe(TASKS.length)
        })

        it('returns only todo tasks when statusFilter is "todo"', () => {
            const { result } = renderFilter({ statusFilter: 'todo' })
            const titles = result.current.filteredTasks.map((t) => t.title)
            expect(result.current.filteredTasks.every((t) => t.status === 'todo')).toBe(true)
            expect(titles).not.toContain('Design new onboarding flow') // in-progress task
        })

        it('returns only in-progress tasks when statusFilter is "in-progress"', () => {
            const { result } = renderFilter({ statusFilter: 'in-progress' })
            expect(result.current.filteredTasks.every((t) => t.status === 'in-progress')).toBe(true)
            expect(result.current.filteredCount).toBe(TASKS.filter((t) => t.status === 'in-progress').length)
        })

        it('returns only done tasks when statusFilter is "done"', () => {
            const { result } = renderFilter({ statusFilter: 'done' })
            expect(result.current.filteredTasks.every((t) => t.status === 'done')).toBe(true)
            expect(result.current.filteredCount).toBe(TASKS.filter((t) => t.status === 'done').length)
        })

        it('produces an empty result when no tasks have the given status', () => {
            const { result } = renderHook(() =>
                useTaskFilter(
                    TASKS.filter((t) => t.status !== 'todo'),
                    { ...DEFAULT_FILTERS, statusFilter: 'todo' },
                    DEFAULT_SORT,
                ),
            )
            expect(result.current.filteredCount).toBe(0)
        })
    })

    // -----------------------------------------------------------------------
    // Priority filter
    // -----------------------------------------------------------------------
    describe('priorityFilter', () => {
        it('returns all tasks when priorityFilter is "all"', () => {
            const { result } = renderFilter({ priorityFilter: 'all' })
            expect(result.current.filteredCount).toBe(TASKS.length)
        })

        it('returns only high priority tasks when priorityFilter is "high"', () => {
            const { result } = renderFilter({ priorityFilter: 'high' })
            expect(result.current.filteredTasks.every((t) => t.priority === 'high')).toBe(true)
            expect(result.current.filteredCount).toBe(TASKS.filter((t) => t.priority === 'high').length)
        })

        it('returns only medium priority tasks when priorityFilter is "medium"', () => {
            const { result } = renderFilter({ priorityFilter: 'medium' })
            expect(result.current.filteredTasks.every((t) => t.priority === 'medium')).toBe(true)
        })

        it('returns only low priority tasks when priorityFilter is "low"', () => {
            const { result } = renderFilter({ priorityFilter: 'low' })
            expect(result.current.filteredTasks.every((t) => t.priority === 'low')).toBe(true)
        })
    })

    // -----------------------------------------------------------------------
    // Search query filter
    // -----------------------------------------------------------------------
    describe('searchQuery', () => {
        it('returns all tasks when searchQuery is empty', () => {
            const { result } = renderFilter({ searchQuery: '' })
            expect(result.current.filteredCount).toBe(TASKS.length)
        })

        it('filters tasks by title substring (exact case)', () => {
            const { result } = renderFilter({ searchQuery: 'Fix' })
            // "Fix the login redirect bug" and "Fix broken image uploads" contain "Fix"
            expect(result.current.filteredTasks.every((t) => t.title.toLowerCase().includes('fix'))).toBe(true)
        })

        it('is case-insensitive — lowercase query matches mixed-case title', () => {
            const { result } = renderFilter({ searchQuery: 'fix' })
            const titles = result.current.filteredTasks.map((t) => t.title)
            expect(titles).toContain('Fix the login redirect bug')
            expect(titles).toContain('Fix broken image uploads')
        })

        it('is case-insensitive — uppercase query matches lowercase title', () => {
            const { result } = renderFilter({ searchQuery: 'ONBOARDING' })
            const titles = result.current.filteredTasks.map((t) => t.title)
            expect(titles).toContain('Design new onboarding flow')
        })

        it('trims leading and trailing whitespace before matching', () => {
            const { result } = renderFilter({ searchQuery: '  fix  ' })
            expect(result.current.filteredTasks.every((t) => t.title.toLowerCase().includes('fix'))).toBe(true)
        })

        it('returns empty result when no titles match the query', () => {
            const { result } = renderFilter({ searchQuery: 'xyzzy-no-match' })
            expect(result.current.filteredCount).toBe(0)
        })

        it('matches a single character', () => {
            // Every task title contains at least one "e" — so this should return all tasks
            const { result } = renderFilter({ searchQuery: 'e' })
            expect(result.current.filteredCount).toBeGreaterThan(0)
        })
    })

    // -----------------------------------------------------------------------
    // Combined filters (AND logic)
    // -----------------------------------------------------------------------
    describe('combined filters', () => {
        it('applies status AND priority filters simultaneously', () => {
            const { result } = renderFilter({
                statusFilter: 'todo',
                priorityFilter: 'high',
            })
            expect(
                result.current.filteredTasks.every(
                    (t) => t.status === 'todo' && t.priority === 'high',
                ),
            ).toBe(true)
        })

        it('applies status AND search filters simultaneously', () => {
            const { result } = renderFilter({
                statusFilter: 'todo',
                searchQuery: 'fix',
            })
            expect(
                result.current.filteredTasks.every(
                    (t) => t.status === 'todo' && t.title.toLowerCase().includes('fix'),
                ),
            ).toBe(true)
            // "Fix broken image uploads" is done — should not appear
            expect(result.current.filteredTasks.map((t) => t.id)).not.toContain('task-5')
        })

        it('applies all three filters simultaneously', () => {
            const { result } = renderFilter({
                statusFilter: 'todo',
                priorityFilter: 'high',
                searchQuery: 'fix',
            })
            expect(
                result.current.filteredTasks.every(
                    (t) =>
                        t.status === 'todo' &&
                        t.priority === 'high' &&
                        t.title.toLowerCase().includes('fix'),
                ),
            ).toBe(true)
        })

        it('returns empty result when combined filters exclude all tasks', () => {
            const { result } = renderFilter({
                statusFilter: 'done',
                searchQuery: 'xyzzy-impossible',
            })
            expect(result.current.filteredCount).toBe(0)
        })
    })

    // -----------------------------------------------------------------------
    // Sort: dueDate
    // -----------------------------------------------------------------------
    describe('sort by dueDate', () => {
        it('sorts by dueDate ascending (earliest first)', () => {
            const { result } = renderFilter({}, { sortKey: 'dueDate', sortDirection: 'asc' })
            const dates = result.current.filteredTasks.map((t) => t.dueDate)
            const sorted = [...dates].sort()
            expect(dates).toEqual(sorted)
        })

        it('sorts by dueDate descending (latest first)', () => {
            const { result } = renderFilter({}, { sortKey: 'dueDate', sortDirection: 'desc' })
            const dates = result.current.filteredTasks.map((t) => t.dueDate)
            const sorted = [...dates].sort().reverse()
            expect(dates).toEqual(sorted)
        })
    })

    // -----------------------------------------------------------------------
    // Sort: priority
    // -----------------------------------------------------------------------
    describe('sort by priority', () => {
        it('sorts by priority ascending (low → medium → high)', () => {
            const { result } = renderFilter({}, { sortKey: 'priority', sortDirection: 'asc' })
            const priorities = result.current.filteredTasks.map((t) => t.priority)
            const weightOf = (p: string) => ({ low: 1, medium: 2, high: 3 }[p] ?? 0)
            for (let i = 1; i < priorities.length; i++) {
                expect(weightOf(priorities[i])).toBeGreaterThanOrEqual(weightOf(priorities[i - 1]))
            }
        })

        it('sorts by priority descending (high → medium → low)', () => {
            const { result } = renderFilter({}, { sortKey: 'priority', sortDirection: 'desc' })
            const priorities = result.current.filteredTasks.map((t) => t.priority)
            const weightOf = (p: string) => ({ low: 1, medium: 2, high: 3 }[p] ?? 0)
            for (let i = 1; i < priorities.length; i++) {
                expect(weightOf(priorities[i])).toBeLessThanOrEqual(weightOf(priorities[i - 1]))
            }
        })

        it('places all high-priority tasks before medium and low when sorting desc', () => {
            const { result } = renderFilter({}, { sortKey: 'priority', sortDirection: 'desc' })
            const tasks = result.current.filteredTasks
            const firstNonHigh = tasks.findIndex((t) => t.priority !== 'high')
            const lastHigh = tasks.map((t) => t.priority).lastIndexOf('high')
            // Every high-priority task must appear before any non-high task
            if (firstNonHigh !== -1 && lastHigh !== -1) {
                expect(lastHigh).toBeLessThan(firstNonHigh)
            }
        })
    })

    // -----------------------------------------------------------------------
    // Sort: title
    // -----------------------------------------------------------------------
    describe('sort by title', () => {
        it('sorts by title ascending (A-Z)', () => {
            const { result } = renderFilter({}, { sortKey: 'title', sortDirection: 'asc' })
            const titles = result.current.filteredTasks.map((t) => t.title)
            const sorted = [...titles].sort((a, b) => a.localeCompare(b))
            expect(titles).toEqual(sorted)
        })

        it('sorts by title descending (Z-A)', () => {
            const { result } = renderFilter({}, { sortKey: 'title', sortDirection: 'desc' })
            const titles = result.current.filteredTasks.map((t) => t.title)
            const sorted = [...titles].sort((a, b) => b.localeCompare(a))
            expect(titles).toEqual(sorted)
        })
    })

    // -----------------------------------------------------------------------
    // Edge cases
    // -----------------------------------------------------------------------
    describe('edge cases', () => {
        it('returns an empty filteredTasks array when no tasks match any filter', () => {
            const { result } = renderFilter({
                statusFilter: 'todo',
                priorityFilter: 'low',
                searchQuery: 'xyzzy',
            })
            expect(result.current.filteredTasks).toHaveLength(0)
            expect(result.current.filteredCount).toBe(0)
        })

        it('does not mutate the original tasks array during sorting', () => {
            const original = [...TASKS]
            renderFilter({}, { sortKey: 'title', sortDirection: 'desc' })
            expect(TASKS).toEqual(original)
        })

        it('handles a searchQuery that is only whitespace by returning all tasks', () => {
            // Whitespace-only query trims to "" so the query branch is skipped
            const { result } = renderFilter({ searchQuery: '   ' })
            expect(result.current.filteredCount).toBe(TASKS.length)
        })

        it('correctly counts totalCount as tasks.length even when filteredCount is 0', () => {
            const { result } = renderFilter({ searchQuery: 'xyzzy-impossible' })
            expect(result.current.totalCount).toBe(TASKS.length)
            expect(result.current.filteredCount).toBe(0)
        })
    })
})
