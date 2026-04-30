import React, { useState } from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'

import { AppLayout } from '@/components/AppLayout'
import { TaskCard } from '@/components/TaskCard'
import { TaskDetailModal } from '@/components/TaskDetailModal'
import { Task } from '@/types/task'

const INITIAL_TASKS: Task[] = [
    {
        id: 'task-1',
        title: 'Design new onboarding flow for enterprise customers',
        status: 'in-progress',
        assignee: { name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/32?u=jane' },
        priority: 'high',
        dueDate: '2026-04-30T00:00:00.000Z',
    },
    {
        id: 'task-2',
        title: 'Fix login redirect bug',
        status: 'todo',
        assignee: { name: 'Bob Smith', avatarUrl: 'https://i.pravatar.cc/32?u=bob' },
        priority: 'medium',
        dueDate: '2026-05-05T00:00:00.000Z',
    },
    {
        id: 'task-3',
        title: 'Write unit tests for the auth module',
        status: 'done',
        assignee: { name: 'Alice Johnson', avatarUrl: 'https://i.pravatar.cc/32?u=alice' },
        priority: 'low',
        dueDate: '2026-04-20T00:00:00.000Z',
    },
    {
        id: 'task-4',
        title: 'Migrate legacy API endpoints to REST v2 and update all client-side integration points accordingly',
        status: 'todo',
        assignee: { name: 'Carlos Rivera', avatarUrl: 'https://i.pravatar.cc/32?u=carlos' },
        priority: 'high',
        dueDate: '2026-05-15T00:00:00.000Z',
    },
]

const DemoPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    const handleOpen = (id: string) => {
        const task = tasks.find((t) => t.id === id)
        if (task) setSelectedTask(task)
    }

    const handleSave = (updated: Task) => {
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-semibold text-neutral-900">Demo</h2>
            <p className="mt-2 mb-6 text-neutral-500">Claude AI Demo Project</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <TaskCard
                    id=""
                    title=""
                    status="todo"
                    assignee={{ name: '', avatarUrl: '' }}
                    priority="low"
                    dueDate=""
                    onClick={() => {}}
                    isLoading
                />
                {tasks.map((task) => (
                    <TaskCard key={task.id} {...task} onClick={handleOpen} />
                ))}
            </div>

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}

export const router = createHashRouter([
    {
        element: <AppLayout />,
        children: [
            { index: true, element: <Navigate to={'/demo'} replace /> },
            { path: '/demo', element: <DemoPage /> },
        ],
    },
])
