import { useState } from 'react'

import { TaskCard } from '@/components/TaskCard'
import { Task } from '@/types/task'
import { FilterState, SortState, useTaskFilter } from '@/utils/useTaskFilter'
import { TaskGridControls } from './TaskGridControls'

export interface TaskGridProps {
    tasks: Task[]
    isLoading?: boolean
    onTaskClick?: (task: Task) => void
}

const DEFAULT_FILTERS: FilterState = {
    statusFilter: 'all',
    priorityFilter: 'all',
    searchQuery: '',
}

const DEFAULT_SORT: SortState = {
    sortKey: 'dueDate',
    sortDirection: 'asc',
}

function GridSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    aria-hidden="true"
                    className="h-32 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100"
                />
            ))}
        </>
    )
}

export function TaskGrid({ tasks, isLoading = false, onTaskClick }: TaskGridProps) {
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
    const [sort, setSort] = useState<SortState>(DEFAULT_SORT)

    const { filteredTasks, totalCount, filteredCount } = useTaskFilter(tasks, filters, sort)

    const handleReset = () => {
        setFilters(DEFAULT_FILTERS)
        setSort(DEFAULT_SORT)
    }

    const handleTaskClick = (id: string) => {
        if (!onTaskClick) return
        const task = tasks.find((t) => t.id === id)
        if (task) onTaskClick(task)
    }

    const isEmpty = !isLoading && filteredCount === 0

    return (
        <div className="flex flex-col gap-4">
            <TaskGridControls
                filters={filters}
                sort={sort}
                onFiltersChange={setFilters}
                onSortChange={setSort}
                onReset={handleReset}
                disabled={isLoading}
            />

            {!isLoading && (
                <p className="text-sm text-neutral-500" aria-live="polite" aria-atomic="true">
                    Showing{' '}
                    <span className="font-medium text-neutral-700">{filteredCount}</span> of{' '}
                    <span className="font-medium text-neutral-700">{totalCount}</span> tasks
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    <GridSkeleton />
                ) : isEmpty ? (
                    <div className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
                        <p className="text-sm text-neutral-500">No tasks match your filters.</p>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                            Reset filters
                        </button>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            {...task}
                            onClick={handleTaskClick}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
