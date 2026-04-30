import { Avatar } from '@/components/Avatar'
import { Task } from '@/types/task'

export interface TaskCardProps extends Task {
    onClick: (id: string) => void
    isLoading?: boolean
}

const STATUS_CONFIG = {
    todo: { label: 'To Do', classes: 'bg-neutral-100 text-neutral-600' },
    'in-progress': { label: 'In Progress', classes: 'bg-blue-100 text-blue-700' },
    done: { label: 'Done', classes: 'bg-green-100 text-green-700' },
} as const

const PRIORITY_DOT = {
    low: 'bg-neutral-400',
    medium: 'bg-amber-400',
    high: 'bg-red-500',
} as const

const Bone = ({ className }: { className: string }) => (
    <div aria-hidden="true" className={`animate-pulse rounded bg-neutral-200 ${className}`} />
)

/**
 * TaskCard displays a single task with its status, priority, assignee, and due date.
 * Pass `isLoading={true}` to render an animated skeleton placeholder instead of content.
 *
 * @example
 * <TaskCard
 *   id="task-1"
 *   title="Design new onboarding flow"
 *   status="in-progress"
 *   assignee={{ name: 'Jane Doe', avatarUrl: 'https://example.com/jane.jpg' }}
 *   priority="high"
 *   dueDate="2026-04-30T00:00:00.000Z"
 *   onClick={(id) => console.log('clicked', id)}
 * />
 */
export function TaskCard({ id, title, status, assignee, priority, dueDate, onClick, isLoading }: TaskCardProps) {
    if (isLoading) {
        return (
            <article
                aria-label="Loading task"
                aria-busy="true"
                className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <Bone className="h-3.5 w-full" />
                        <Bone className="h-3.5 w-3/4" />
                    </div>
                    <Bone className="h-5 w-16 shrink-0 rounded-full" />
                </div>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Bone className="h-6 w-6 rounded-full shrink-0" />
                        <Bone className="h-3 w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Bone className="h-2 w-2 rounded-full" />
                        <Bone className="h-3 w-10" />
                    </div>
                </div>
            </article>
        )
    }

    const statusCfg = STATUS_CONFIG[status]
    const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
    })

    return (
        <article
            role="button"
            tabIndex={0}
            aria-label={`Task: ${title}, status ${statusCfg.label}, priority ${priority}, due ${formattedDate}`}
            className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={() => onClick(id)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onClick(id)
                }
            }}
        >
            <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-2 text-sm font-medium text-neutral-900 leading-snug flex-1">{title}</p>
                <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg.classes}`}
                    aria-label={`Status: ${statusCfg.label}`}
                >
                    {statusCfg.label}
                </span>
            </div>

            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <Avatar
                        src={assignee.avatarUrl}
                        placeholder={assignee.name}
                        size="24"
                        aria-label={`Assignee: ${assignee.name}`}
                    />
                    <span className="truncate text-xs text-neutral-500">{assignee.name}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span
                        className={`h-2 w-2 rounded-full ${PRIORITY_DOT[priority]}`}
                        aria-label={`Priority: ${priority}`}
                        role="img"
                    />
                    <time
                        dateTime={dueDate}
                        className="text-xs text-neutral-500"
                    >
                        {formattedDate}
                    </time>
                </div>
            </div>
        </article>
    )
}

/*
 * Usage example:
 *
 * import { TaskCard } from '@/components/TaskCard'
 *
 * function TaskBoard() {
 *   const tasks = [
 *     {
 *       id: 'task-1',
 *       title: 'Design new onboarding flow for enterprise customers',
 *       status: 'in-progress' as const,
 *       assignee: { name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/32?u=jane' },
 *       priority: 'high' as const,
 *       dueDate: '2026-04-30T00:00:00.000Z',
 *     },
 *     {
 *       id: 'task-2',
 *       title: 'Fix login redirect bug',
 *       status: 'todo' as const,
 *       assignee: { name: 'Bob Smith', avatarUrl: 'https://i.pravatar.cc/32?u=bob' },
 *       priority: 'medium' as const,
 *       dueDate: '2026-05-05T00:00:00.000Z',
 *     },
 *   ]
 *
 *   return (
 *     <div className="grid grid-cols-3 gap-4 p-8">
 *       {tasks.map((task) => (
 *         <TaskCard key={task.id} {...task} onClick={(id) => console.log('Open task', id)} />
 *       ))}
 *     </div>
 *   )
 * }
 */
