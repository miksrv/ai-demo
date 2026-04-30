export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
    id: string
    title: string
    description?: string
    status: TaskStatus
    assignee: {
        name: string
        avatarUrl: string
    }
    priority: TaskPriority
    dueDate: string
}
