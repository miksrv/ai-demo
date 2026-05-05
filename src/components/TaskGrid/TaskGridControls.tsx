import { FilterState, SortState } from '@/utils/useTaskFilter'

export interface TaskGridControlsProps {
    filters: FilterState
    sort: SortState
    onFiltersChange: (filters: FilterState) => void
    onSortChange: (sort: SortState) => void
    onReset: () => void
    disabled?: boolean
}

type SortOptionValue =
    | 'dueDate-asc'
    | 'dueDate-desc'
    | 'priority-desc'
    | 'priority-asc'
    | 'title-asc'
    | 'title-desc'

const SORT_OPTIONS: { value: SortOptionValue; label: string }[] = [
    { value: 'dueDate-asc', label: 'Due Date (Asc)' },
    { value: 'dueDate-desc', label: 'Due Date (Desc)' },
    { value: 'priority-desc', label: 'Priority (High First)' },
    { value: 'priority-asc', label: 'Priority (Low First)' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
]

const STATUS_OPTIONS: { value: FilterState['statusFilter']; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'todo', label: 'Todo' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
]

const PRIORITY_OPTIONS: { value: FilterState['priorityFilter']; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
]

function ButtonGroup<T extends string>({
    options,
    value,
    onChange,
    label,
    disabled,
}: {
    options: { value: T; label: string }[]
    value: T
    onChange: (v: T) => void
    label: string
    disabled?: boolean
}) {
    return (
        <fieldset disabled={disabled} className="flex flex-col gap-1">
            <legend className="text-xs font-medium text-neutral-500 mb-1">{label}</legend>
            <div className="flex flex-wrap gap-1" role="group" aria-label={label}>
                {options.map((opt) => {
                    const isActive = opt.value === value
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => onChange(opt.value)}
                            className={[
                                'rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
                                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                            ].join(' ')}
                        >
                            {opt.label}
                        </button>
                    )
                })}
            </div>
        </fieldset>
    )
}

function sortStateToValue(sort: SortState): SortOptionValue {
    return `${sort.sortKey}-${sort.sortDirection}` as SortOptionValue
}

function valueToSortState(value: SortOptionValue): SortState {
    const [sortKey, sortDirection] = value.split('-') as [SortState['sortKey'], SortState['sortDirection']]
    return { sortKey, sortDirection }
}

export function TaskGridControls({
    filters,
    sort,
    onFiltersChange,
    onSortChange,
    onReset,
    disabled = false,
}: TaskGridControlsProps) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-6">
                <ButtonGroup
                    options={STATUS_OPTIONS}
                    value={filters.statusFilter}
                    onChange={(v) => onFiltersChange({ ...filters, statusFilter: v })}
                    label="Status"
                    disabled={disabled}
                />
                <ButtonGroup
                    options={PRIORITY_OPTIONS}
                    value={filters.priorityFilter}
                    onChange={(v) => onFiltersChange({ ...filters, priorityFilter: v })}
                    label="Priority"
                    disabled={disabled}
                />
            </div>

            <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
                    <label
                        htmlFor="task-grid-search"
                        className="text-xs font-medium text-neutral-500"
                    >
                        Search
                    </label>
                    <input
                        id="task-grid-search"
                        type="search"
                        placeholder="Search tasks..."
                        value={filters.searchQuery}
                        disabled={disabled}
                        onChange={(e) =>
                            onFiltersChange({ ...filters, searchQuery: e.target.value })
                        }
                        aria-label="Search tasks by title"
                        className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="flex flex-col gap-1 min-w-[180px]">
                    <label
                        htmlFor="task-grid-sort"
                        className="text-xs font-medium text-neutral-500"
                    >
                        Sort by
                    </label>
                    <select
                        id="task-grid-sort"
                        value={sortStateToValue(sort)}
                        disabled={disabled}
                        onChange={(e) =>
                            onSortChange(valueToSortState(e.target.value as SortOptionValue))
                        }
                        aria-label="Sort tasks"
                        className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={onReset}
                    disabled={disabled}
                    aria-label="Reset all filters and sort"
                    className="rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Reset
                </button>
            </div>
        </div>
    )
}
