import { useMemo } from 'react'
import { Task, TaskPriority, TaskStatus } from '@/types/task'

export interface FilterState {
    statusFilter: 'all' | TaskStatus
    priorityFilter: 'all' | TaskPriority
    searchQuery: string
}

export interface SortState {
    sortKey: 'dueDate' | 'priority' | 'title'
    sortDirection: 'asc' | 'desc'
}

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
    high: 3,
    medium: 2,
    low: 1,
}

interface UseTaskFilterResult {
    filteredTasks: Task[]
    totalCount: number
    filteredCount: number
}

export function useTaskFilter(
    tasks: Task[],
    filters: FilterState,
    sort: SortState,
): UseTaskFilterResult {
    const totalCount = tasks.length

    const filteredTasks = useMemo(() => {
        const { statusFilter, priorityFilter, searchQuery } = filters
        const { sortKey, sortDirection } = sort
        const query = searchQuery.trim().toLowerCase()

        const filtered = tasks.filter((task) => {
            if (statusFilter !== 'all' && task.status !== statusFilter) return false
            if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false
            if (query && !task.title.toLowerCase().includes(query)) return false
            return true
        })

        const dir = sortDirection === 'asc' ? 1 : -1

        return [...filtered].sort((a, b) => {
            if (sortKey === 'dueDate') {
                return a.dueDate < b.dueDate ? -dir : a.dueDate > b.dueDate ? dir : 0
            }
            if (sortKey === 'priority') {
                const diff = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
                return diff * dir
            }
            // title
            return a.title.localeCompare(b.title) * dir
        })
    }, [tasks, filters, sort])

    return {
        filteredTasks,
        totalCount,
        filteredCount: filteredTasks.length,
    }
}
