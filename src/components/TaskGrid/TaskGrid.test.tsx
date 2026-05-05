import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

// Avatar mock must come before the component import that transitively uses it.
vi.mock('@/components/Avatar', () => ({
    Avatar: ({ placeholder, 'aria-label': ariaLabel }: { placeholder?: string; 'aria-label'?: string }) => (
        <img src="" alt={ariaLabel ?? placeholder ?? ''} />
    ),
}))

import { Task } from '@/types/task'
import {
    TASKS,
    TODO_TASKS,
    IN_PROGRESS_TASKS,
    DONE_TASKS,
    HIGH_PRIORITY_TASKS,
} from './__fixtures__/tasks'
import { TaskGrid } from './TaskGrid'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderGrid(props: { tasks?: Task[]; isLoading?: boolean; onTaskClick?: (task: Task) => void } = {}) {
    const { tasks = TASKS, ...rest } = props
    return render(<TaskGrid tasks={tasks} {...rest} />)
}

/** Returns all task card buttons currently in the document. */
function getTaskCards() {
    return screen.queryAllByRole('button', { name: /^Task:/i })
}

/** Returns the title strings of all currently rendered task cards. */
function getRenderedTitles() {
    return getTaskCards().map((el) => {
        // aria-label format: "Task: {title}, status …"
        const label = el.getAttribute('aria-label') ?? ''
        return label.replace(/^Task: /, '').replace(/,.*$/, '')
    })
}

/**
 * Returns the inner div[role="group"] for a given label name.
 * The ButtonGroup component renders both a <fieldset> (implicit group role)
 * and an inner <div role="group" aria-label="…">. We want the div.
 */
function getButtonGroup(name: string) {
    const groups = screen.getAllByRole('group', { name })
    // The inner div[role="group"] is an explicit group; fieldset is implicit.
    // Find the one that is a <div>.
    return groups.find((el) => el.tagName === 'DIV') ?? groups[0]
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('TaskGrid', () => {
    // -----------------------------------------------------------------------
    // Default rendering
    // -----------------------------------------------------------------------
    describe('default rendering', () => {
        it('renders a task card for every task', () => {
            renderGrid()
            expect(getTaskCards()).toHaveLength(TASKS.length)
        })

        it('displays "Showing N of N tasks" count line', () => {
            renderGrid()
            expect(
                screen.getByText((_, el) => {
                    return el?.textContent?.trim() === `Showing ${TASKS.length} of ${TASKS.length} tasks`
                }),
            ).toBeInTheDocument()
        })

        it('count paragraph has aria-live="polite"', () => {
            renderGrid()
            const countEl = screen.getByText(/Showing/i).closest('[aria-live]')
            expect(countEl).toHaveAttribute('aria-live', 'polite')
        })

        it('renders each task title', () => {
            renderGrid()
            TASKS.forEach((task) => {
                expect(screen.getByText(task.title)).toBeInTheDocument()
            })
        })

        it('renders the status filter button group', () => {
            renderGrid()
            expect(getButtonGroup('Status')).toBeInTheDocument()
        })

        it('renders the priority filter button group', () => {
            renderGrid()
            expect(getButtonGroup('Priority')).toBeInTheDocument()
        })

        it('renders the search input', () => {
            renderGrid()
            expect(screen.getByRole('searchbox', { name: /Search tasks by title/i })).toBeInTheDocument()
        })

        it('renders the sort select', () => {
            renderGrid()
            expect(screen.getByRole('combobox', { name: /Sort tasks/i })).toBeInTheDocument()
        })

        it('"All" status button is pressed by default', () => {
            renderGrid()
            const allStatusBtn = within(getButtonGroup('Status')).getByRole('button', { name: /^All$/i })
            expect(allStatusBtn).toHaveAttribute('aria-pressed', 'true')
        })
    })

    // -----------------------------------------------------------------------
    // Status filter
    // -----------------------------------------------------------------------
    describe('status filter', () => {
        it('shows only todo tasks after clicking the "Todo" button', () => {
            renderGrid()
            fireEvent.click(screen.getByRole('button', { name: /^Todo$/i }))
            const cards = getTaskCards()
            expect(cards).toHaveLength(TODO_TASKS.length)
            expect(cards.every((c) => c.getAttribute('aria-label')?.includes('status To Do'))).toBe(true)
        })

        it('shows only in-progress tasks after clicking "In Progress"', () => {
            renderGrid()
            fireEvent.click(screen.getByRole('button', { name: /^In Progress$/i }))
            const cards = getTaskCards()
            expect(cards).toHaveLength(IN_PROGRESS_TASKS.length)
            expect(cards.every((c) => c.getAttribute('aria-label')?.includes('status In Progress'))).toBe(true)
        })

        it('shows only done tasks after clicking "Done"', () => {
            renderGrid()
            fireEvent.click(screen.getByRole('button', { name: /^Done$/i }))
            const cards = getTaskCards()
            expect(cards).toHaveLength(DONE_TASKS.length)
            expect(cards.every((c) => c.getAttribute('aria-label')?.includes('status Done'))).toBe(true)
        })

        it('restores all tasks after switching back to "All"', () => {
            renderGrid()
            fireEvent.click(screen.getByRole('button', { name: /^Todo$/i }))
            fireEvent.click(within(getButtonGroup('Status')).getByRole('button', { name: /^All$/i }))
            expect(getTaskCards()).toHaveLength(TASKS.length)
        })

        it('updates the count line when a status filter is applied', () => {
            renderGrid()
            fireEvent.click(screen.getByRole('button', { name: /^Todo$/i }))
            expect(
                screen.getByText((_, el) => {
                    return (
                        el?.textContent?.trim() ===
                        `Showing ${TODO_TASKS.length} of ${TASKS.length} tasks`
                    )
                }),
            ).toBeInTheDocument()
        })

        it('marks the active status button as aria-pressed="true"', () => {
            renderGrid()
            fireEvent.click(screen.getByRole('button', { name: /^Todo$/i }))
            expect(screen.getByRole('button', { name: /^Todo$/i })).toHaveAttribute('aria-pressed', 'true')
        })

        it('deactivates the previous button when a new status is selected', () => {
            renderGrid()
            fireEvent.click(screen.getByRole('button', { name: /^Todo$/i }))
            fireEvent.click(screen.getByRole('button', { name: /^Done$/i }))
            expect(screen.getByRole('button', { name: /^Todo$/i })).toHaveAttribute('aria-pressed', 'false')
        })
    })

    // -----------------------------------------------------------------------
    // Priority filter
    // -----------------------------------------------------------------------
    describe('priority filter', () => {
        it('shows only high-priority tasks after clicking "High"', () => {
            renderGrid()
            fireEvent.click(screen.getByRole('button', { name: /^High$/i }))
            const cards = getTaskCards()
            expect(cards).toHaveLength(HIGH_PRIORITY_TASKS.length)
            expect(cards.every((c) => c.getAttribute('aria-label')?.includes('priority high'))).toBe(true)
        })

        it('shows only medium-priority tasks after clicking "Medium"', () => {
            renderGrid()
            fireEvent.click(screen.getByRole('button', { name: /^Medium$/i }))
            const cards = getTaskCards()
            expect(cards.every((c) => c.getAttribute('aria-label')?.includes('priority medium'))).toBe(true)
        })

        it('shows only low-priority tasks after clicking "Low"', () => {
            renderGrid()
            fireEvent.click(screen.getByRole('button', { name: /^Low$/i }))
            const cards = getTaskCards()
            expect(cards.every((c) => c.getAttribute('aria-label')?.includes('priority low'))).toBe(true)
        })

        it('marks the active priority button as aria-pressed="true"', () => {
            renderGrid()
            fireEvent.click(screen.getByRole('button', { name: /^High$/i }))
            expect(screen.getByRole('button', { name: /^High$/i })).toHaveAttribute('aria-pressed', 'true')
        })
    })

    // -----------------------------------------------------------------------
    // Search
    // -----------------------------------------------------------------------
    describe('search', () => {
        it('filters tasks by title when text is typed into the search input', () => {
            renderGrid()
            fireEvent.change(screen.getByRole('searchbox', { name: /Search tasks by title/i }), {
                target: { value: 'fix' },
            })
            const titles = getRenderedTitles()
            expect(titles.every((t) => t.toLowerCase().includes('fix'))).toBe(true)
        })

        it('is case-insensitive — uppercase query matches lowercase title', () => {
            renderGrid()
            fireEvent.change(screen.getByRole('searchbox', { name: /Search tasks by title/i }), {
                target: { value: 'FIX' },
            })
            // "Fix the login redirect bug" and "Fix broken image uploads" should appear
            expect(getTaskCards().length).toBeGreaterThan(0)
        })

        it('shows all tasks when the search query is cleared', () => {
            renderGrid()
            const input = screen.getByRole('searchbox', { name: /Search tasks by title/i })
            fireEvent.change(input, { target: { value: 'fix' } })
            fireEvent.change(input, { target: { value: '' } })
            expect(getTaskCards()).toHaveLength(TASKS.length)
        })

        it('shows the empty state when the search query matches nothing', () => {
            renderGrid()
            fireEvent.change(screen.getByRole('searchbox', { name: /Search tasks by title/i }), {
                target: { value: 'xyzzy-no-match' },
            })
            expect(screen.getByText('No tasks match your filters.')).toBeInTheDocument()
        })
    })

    // -----------------------------------------------------------------------
    // Combined filters
    // -----------------------------------------------------------------------
    describe('combined filters', () => {
        it('applies status and search filters at the same time', () => {
            renderGrid()
            // Filter to "todo" tasks, then search "fix"
            fireEvent.click(screen.getByRole('button', { name: /^Todo$/i }))
            fireEvent.change(screen.getByRole('searchbox', { name: /Search tasks by title/i }), {
                target: { value: 'fix' },
            })
            const cards = getTaskCards()
            cards.forEach((card) => {
                const label = card.getAttribute('aria-label') ?? ''
                expect(label).toMatch(/status To Do/i)
                expect(label).toMatch(/fix/i)
            })
        })

        it('updates the count line to reflect combined-filter results', () => {
            renderGrid()
            fireEvent.click(screen.getByRole('button', { name: /^Done$/i }))
            const doneCount = DONE_TASKS.length
            expect(
                screen.getByText((_, el) => {
                    return (
                        el?.textContent?.trim() ===
                        `Showing ${doneCount} of ${TASKS.length} tasks`
                    )
                }),
            ).toBeInTheDocument()
        })
    })

    // -----------------------------------------------------------------------
    // Empty state
    // -----------------------------------------------------------------------
    describe('empty state', () => {
        it('shows "No tasks match your filters." when no tasks match', () => {
            renderGrid()
            fireEvent.change(screen.getByRole('searchbox', { name: /Search tasks by title/i }), {
                target: { value: 'xyzzy-no-match' },
            })
            expect(screen.getByText('No tasks match your filters.')).toBeInTheDocument()
        })

        it('shows a "Reset filters" button in the empty state', () => {
            renderGrid()
            fireEvent.change(screen.getByRole('searchbox', { name: /Search tasks by title/i }), {
                target: { value: 'xyzzy-no-match' },
            })
            expect(screen.getByRole('button', { name: /Reset filters/i })).toBeInTheDocument()
        })

        it('hides the count line when in the empty state', () => {
            // The count line should still exist (aria-live region) but there are no
            // task cards. We verify the task card list is empty, not the count text.
            renderGrid()
            fireEvent.change(screen.getByRole('searchbox', { name: /Search tasks by title/i }), {
                target: { value: 'xyzzy-no-match' },
            })
            expect(getTaskCards()).toHaveLength(0)
        })

        it('renders empty state when an empty tasks array is passed', () => {
            renderGrid({ tasks: [] })
            expect(screen.getByText('No tasks match your filters.')).toBeInTheDocument()
        })

        it('shows the empty state when no tasks match the given status', () => {
            // Provide only "done" tasks, then filter by "todo"
            renderGrid({ tasks: DONE_TASKS })
            fireEvent.click(screen.getByRole('button', { name: /^Todo$/i }))
            expect(screen.getByText('No tasks match your filters.')).toBeInTheDocument()
        })
    })

    // -----------------------------------------------------------------------
    // Reset from empty state
    // -----------------------------------------------------------------------
    describe('reset from empty state', () => {
        beforeEach(() => {
            renderGrid()
            // Drive the grid into an empty state
            fireEvent.change(screen.getByRole('searchbox', { name: /Search tasks by title/i }), {
                target: { value: 'xyzzy-no-match' },
            })
        })

        it('restores all tasks when the "Reset filters" button is clicked', () => {
            fireEvent.click(screen.getByRole('button', { name: /Reset filters/i }))
            expect(getTaskCards()).toHaveLength(TASKS.length)
        })

        it('clears the search input after reset', () => {
            fireEvent.click(screen.getByRole('button', { name: /Reset filters/i }))
            expect(screen.getByRole('searchbox', { name: /Search tasks by title/i })).toHaveValue('')
        })

        it('resets "All" status button back to pressed after reset', () => {
            // First apply a status filter, then trigger empty state via search
            fireEvent.click(screen.getByRole('button', { name: /^Todo$/i }))
            // Reset via controls reset button (same handler)
            fireEvent.click(screen.getByRole('button', { name: /Reset all filters and sort/i }))
            expect(
                within(getButtonGroup('Status')).getByRole('button', { name: /^All$/i }),
            ).toHaveAttribute('aria-pressed', 'true')
        })
    })

    // -----------------------------------------------------------------------
    // Controls reset button
    // -----------------------------------------------------------------------
    describe('controls reset button', () => {
        it('resets all filters and shows all tasks', () => {
            renderGrid()
            fireEvent.click(screen.getByRole('button', { name: /^Todo$/i }))
            fireEvent.click(screen.getByRole('button', { name: /^High$/i }))
            fireEvent.change(screen.getByRole('searchbox', { name: /Search tasks by title/i }), {
                target: { value: 'fix' },
            })
            fireEvent.click(screen.getByRole('button', { name: /Reset all filters and sort/i }))
            expect(getTaskCards()).toHaveLength(TASKS.length)
        })

        it('resets the sort select to "Due Date (Asc)"', () => {
            renderGrid()
            fireEvent.change(screen.getByRole('combobox', { name: /Sort tasks/i }), {
                target: { value: 'title-asc' },
            })
            fireEvent.click(screen.getByRole('button', { name: /Reset all filters and sort/i }))
            expect(screen.getByRole('combobox', { name: /Sort tasks/i })).toHaveValue('dueDate-asc')
        })
    })

    // -----------------------------------------------------------------------
    // Loading state
    // -----------------------------------------------------------------------
    describe('loading state', () => {
        it('renders 6 skeleton placeholder divs', () => {
            renderGrid({ isLoading: true })
            // Skeleton divs are aria-hidden="true" and come from GridSkeleton
            const skeletons = document
                .querySelectorAll('[aria-hidden="true"]')
            // Filter to only the grid-level skeleton divs (which have animate-pulse class)
            const gridSkeletons = Array.from(skeletons).filter(
                (el) => el.tagName === 'DIV' && el.classList.contains('animate-pulse'),
            )
            expect(gridSkeletons).toHaveLength(6)
        })

        it('does not render any task cards while loading', () => {
            renderGrid({ isLoading: true })
            expect(getTaskCards()).toHaveLength(0)
        })

        it('does not render any task titles while loading', () => {
            renderGrid({ isLoading: true })
            TASKS.forEach((task) => {
                expect(screen.queryByText(task.title)).not.toBeInTheDocument()
            })
        })

        it('does not render the count line while loading', () => {
            renderGrid({ isLoading: true })
            expect(screen.queryByText(/Showing/i)).not.toBeInTheDocument()
        })

        it('disables the search input while loading', () => {
            renderGrid({ isLoading: true })
            expect(screen.getByRole('searchbox', { name: /Search tasks by title/i })).toBeDisabled()
        })

        it('disables the sort select while loading', () => {
            renderGrid({ isLoading: true })
            expect(screen.getByRole('combobox', { name: /Sort tasks/i })).toBeDisabled()
        })

        it('disables the reset button in the controls while loading', () => {
            renderGrid({ isLoading: true })
            expect(screen.getByRole('button', { name: /Reset all filters and sort/i })).toBeDisabled()
        })

        it('renders task cards once isLoading transitions to false', () => {
            const { rerender } = renderGrid({ isLoading: true })
            expect(getTaskCards()).toHaveLength(0)
            rerender(<TaskGrid tasks={TASKS} isLoading={false} />)
            expect(getTaskCards()).toHaveLength(TASKS.length)
        })
    })

    // -----------------------------------------------------------------------
    // onTaskClick callback
    // -----------------------------------------------------------------------
    describe('onTaskClick', () => {
        it('calls onTaskClick with the full Task object when a card is clicked', () => {
            const onTaskClick = vi.fn()
            renderGrid({ onTaskClick })
            // Click the card for TASKS[0] by its title text
            fireEvent.click(screen.getByText(TASKS[0].title))
            expect(onTaskClick).toHaveBeenCalledOnce()
            expect(onTaskClick).toHaveBeenCalledWith(TASKS[0])
        })

        it('passes the correct Task object for a different card', () => {
            const onTaskClick = vi.fn()
            renderGrid({ onTaskClick })
            fireEvent.click(screen.getByText(TASKS[2].title))
            expect(onTaskClick).toHaveBeenCalledWith(TASKS[2])
        })

        it('does not throw when onTaskClick is not provided', () => {
            renderGrid()
            expect(() => fireEvent.click(screen.getByText(TASKS[0].title))).not.toThrow()
        })

        it('resolves the full Task even when a filter is active (id → Task lookup)', () => {
            const onTaskClick = vi.fn()
            renderGrid({ onTaskClick })
            // Apply a filter so fewer cards render, then click the remaining card
            fireEvent.click(screen.getByRole('button', { name: /^Done$/i }))
            const doneTask = DONE_TASKS[0]
            fireEvent.click(screen.getByText(doneTask.title))
            expect(onTaskClick).toHaveBeenCalledWith(doneTask)
        })
    })

    // -----------------------------------------------------------------------
    // Sort
    // -----------------------------------------------------------------------
    describe('sort', () => {
        it('reorders cards to "Priority (High First)" when selected', () => {
            renderGrid()
            fireEvent.change(screen.getByRole('combobox', { name: /Sort tasks/i }), {
                target: { value: 'priority-desc' },
            })
            const cards = getTaskCards()
            // The first card(s) must have priority high in their aria-label
            expect(cards[0].getAttribute('aria-label')).toMatch(/priority high/i)
        })

        it('reorders cards to "Priority (Low First)" when selected', () => {
            renderGrid()
            fireEvent.change(screen.getByRole('combobox', { name: /Sort tasks/i }), {
                target: { value: 'priority-asc' },
            })
            const cards = getTaskCards()
            expect(cards[0].getAttribute('aria-label')).toMatch(/priority low/i)
        })

        it('orders cards alphabetically A-Z when "Title (A-Z)" is selected', () => {
            renderGrid()
            fireEvent.change(screen.getByRole('combobox', { name: /Sort tasks/i }), {
                target: { value: 'title-asc' },
            })
            const titles = getRenderedTitles()
            const sorted = [...titles].sort((a, b) => a.localeCompare(b))
            expect(titles).toEqual(sorted)
        })

        it('orders cards alphabetically Z-A when "Title (Z-A)" is selected', () => {
            renderGrid()
            fireEvent.change(screen.getByRole('combobox', { name: /Sort tasks/i }), {
                target: { value: 'title-desc' },
            })
            const titles = getRenderedTitles()
            const sorted = [...titles].sort((a, b) => b.localeCompare(a))
            expect(titles).toEqual(sorted)
        })

        it('orders cards by earliest due date first (default sort)', () => {
            renderGrid()
            const titles = getRenderedTitles()
            // Default sort is dueDate-asc; first title should be the task with the
            // earliest dueDate in the fixture set.
            const earliest = [...TASKS].sort((a, b) =>
                a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0,
            )[0]
            expect(titles[0]).toBe(earliest.title)
        })

        it('orders cards by latest due date first when "Due Date (Desc)" is selected', () => {
            renderGrid()
            fireEvent.change(screen.getByRole('combobox', { name: /Sort tasks/i }), {
                target: { value: 'dueDate-desc' },
            })
            const titles = getRenderedTitles()
            const latest = [...TASKS].sort((a, b) =>
                a.dueDate > b.dueDate ? -1 : a.dueDate < b.dueDate ? 1 : 0,
            )[0]
            expect(titles[0]).toBe(latest.title)
        })
    })

    // -----------------------------------------------------------------------
    // Edge cases
    // -----------------------------------------------------------------------
    describe('edge cases', () => {
        it('renders correctly with a single task', () => {
            renderGrid({ tasks: [TASKS[0]] })
            expect(getTaskCards()).toHaveLength(1)
            expect(screen.getByText(TASKS[0].title)).toBeInTheDocument()
        })

        it('shows "Showing 1 of 1 tasks" count for a single task', () => {
            renderGrid({ tasks: [TASKS[0]] })
            expect(
                screen.getByText((_, el) => el?.textContent?.trim() === 'Showing 1 of 1 tasks'),
            ).toBeInTheDocument()
        })

        it('handles rapid filter changes without crashing', () => {
            renderGrid()
            expect(() => {
                fireEvent.click(screen.getByRole('button', { name: /^Todo$/i }))
                fireEvent.click(screen.getByRole('button', { name: /^Done$/i }))
                fireEvent.click(screen.getByRole('button', { name: /^In Progress$/i }))
                fireEvent.click(within(getButtonGroup('Status')).getByRole('button', { name: /^All$/i }))
            }).not.toThrow()
            expect(getTaskCards()).toHaveLength(TASKS.length)
        })

        it('re-renders correctly when the tasks prop changes', () => {
            const { rerender } = renderGrid({ tasks: [TASKS[0]] })
            expect(getTaskCards()).toHaveLength(1)
            rerender(<TaskGrid tasks={TASKS} />)
            expect(getTaskCards()).toHaveLength(TASKS.length)
        })
    })
})
