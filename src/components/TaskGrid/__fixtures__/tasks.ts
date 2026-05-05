import { Task } from '@/types/task'

/**
 * Shared task fixtures for TaskGrid tests.
 * Covers every status (todo, in-progress, done) and priority (low, medium, high)
 * combination, with deliberately varied titles and due dates so sort tests are
 * unambiguous.
 */
export const TASKS: Task[] = [
    {
        id: 'task-1',
        title: 'Fix the login redirect bug',
        status: 'todo',
        assignee: { name: 'Alice Martin', avatarUrl: 'https://example.com/alice.jpg' },
        priority: 'high',
        dueDate: '2026-05-01T00:00:00.000Z',
    },
    {
        id: 'task-2',
        title: 'Add unit tests for auth module',
        status: 'todo',
        assignee: { name: 'Bob Smith', avatarUrl: 'https://example.com/bob.jpg' },
        priority: 'medium',
        dueDate: '2026-05-10T00:00:00.000Z',
    },
    {
        id: 'task-3',
        title: 'Design new onboarding flow',
        status: 'in-progress',
        assignee: { name: 'Carol Jones', avatarUrl: 'https://example.com/carol.jpg' },
        priority: 'high',
        dueDate: '2026-04-20T00:00:00.000Z',
    },
    {
        id: 'task-4',
        title: 'Migrate database to Postgres',
        status: 'in-progress',
        assignee: { name: 'David Lee', avatarUrl: 'https://example.com/david.jpg' },
        priority: 'low',
        dueDate: '2026-06-15T00:00:00.000Z',
    },
    {
        id: 'task-5',
        title: 'Fix broken image uploads',
        status: 'done',
        assignee: { name: 'Eve Chen', avatarUrl: 'https://example.com/eve.jpg' },
        priority: 'medium',
        dueDate: '2026-04-10T00:00:00.000Z',
    },
    {
        id: 'task-6',
        title: 'Write API documentation',
        status: 'done',
        assignee: { name: 'Frank Wu', avatarUrl: 'https://example.com/frank.jpg' },
        priority: 'low',
        dueDate: '2026-04-05T00:00:00.000Z',
    },
    {
        id: 'task-7',
        title: 'Audit accessibility across all pages',
        status: 'todo',
        assignee: { name: 'Grace Park', avatarUrl: 'https://example.com/grace.jpg' },
        priority: 'high',
        dueDate: '2026-05-25T00:00:00.000Z',
    },
    {
        id: 'task-8',
        title: 'Refactor billing service',
        status: 'in-progress',
        assignee: { name: 'Hank Torres', avatarUrl: 'https://example.com/hank.jpg' },
        priority: 'medium',
        dueDate: '2026-05-18T00:00:00.000Z',
    },
    {
        id: 'task-9',
        title: 'Update third-party dependencies',
        status: 'done',
        assignee: { name: 'Iris Novak', avatarUrl: 'https://example.com/iris.jpg' },
        priority: 'low',
        dueDate: '2026-03-30T00:00:00.000Z',
    },
]

/** Convenience subsets */
export const TODO_TASKS = TASKS.filter((t) => t.status === 'todo')
export const IN_PROGRESS_TASKS = TASKS.filter((t) => t.status === 'in-progress')
export const DONE_TASKS = TASKS.filter((t) => t.status === 'done')
export const HIGH_PRIORITY_TASKS = TASKS.filter((t) => t.priority === 'high')
export const MEDIUM_PRIORITY_TASKS = TASKS.filter((t) => t.priority === 'medium')
export const LOW_PRIORITY_TASKS = TASKS.filter((t) => t.priority === 'low')
