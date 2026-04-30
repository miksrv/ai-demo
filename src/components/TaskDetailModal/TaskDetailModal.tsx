import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { Task, TaskPriority, TaskStatus } from '@/types/task'

interface TaskDetailModalProps {
    task: Task
    onClose: () => void
    onSave: (updated: Task) => void
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
]

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
]

function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
    disabled,
}: {
    options: { value: T; label: string }[]
    value: T
    onChange: (value: T) => void
    disabled?: boolean
}) {
    return (
        <div className="flex rounded-lg border border-neutral-200 overflow-hidden" role="radiogroup">
            {options.map((opt, i) => (
                <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={opt.value === value}
                    disabled={disabled}
                    onClick={() => onChange(opt.value)}
                    className={`flex-1 px-2 py-1.5 text-xs font-medium text-center transition-colors ${i < options.length - 1 ? 'border-r border-neutral-200' : ''} ${
                        opt.value === value
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-neutral-600 hover:bg-neutral-50 disabled:hover:bg-white'
                    } disabled:cursor-not-allowed`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    )
}

const toDateInput = (iso: string) => iso.split('T')[0]
const fromDateInput = (val: string) => `${val}T00:00:00.000Z`

export function TaskDetailModal({ task, onClose, onSave }: TaskDetailModalProps) {
    const [draft, setDraft] = useState<Task>({ ...task, assignee: { ...task.assignee } })
    const [isSaving, setIsSaving] = useState(false)
    const [showDiscard, setShowDiscard] = useState(false)
    const [titleError, setTitleError] = useState('')
    const titleRef = useRef<HTMLInputElement>(null)

    const hasChanges =
        draft.title !== task.title ||
        draft.status !== task.status ||
        draft.priority !== task.priority ||
        draft.assignee.name !== task.assignee.name ||
        draft.dueDate !== task.dueDate ||
        (draft.description ?? '') !== (task.description ?? '')

    useEffect(() => {
        titleRef.current?.focus()
    }, [])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return
            if (showDiscard) {
                setShowDiscard(false)
            } else if (hasChanges) {
                setShowDiscard(true)
            } else {
                onClose()
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [showDiscard, hasChanges, onClose])

    const update = <K extends keyof Task>(key: K, value: Task[K]) => {
        setDraft((prev) => ({ ...prev, [key]: value } as Task))
        if (key === 'title') setTitleError('')
    }

    const handleClose = () => {
        if (hasChanges) {
            setShowDiscard(true)
        } else {
            onClose()
        }
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) handleClose()
    }

    const handleSave = async () => {
        if (!draft.title.trim()) {
            setTitleError('Title is required')
            titleRef.current?.focus()
            return
        }
        setIsSaving(true)
        await new Promise((r) => setTimeout(r, 800))
        onSave({ ...draft, title: draft.title.trim() })
        onClose()
    }

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={handleBackdropClick}
        >
            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                    <div>
                        <h2 id="modal-title" className="text-base font-semibold text-neutral-900">
                            Task Details
                        </h2>
                        <p className="text-xs text-neutral-400 mt-0.5">{task.id}</p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close modal"
                        onClick={handleClose}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[60vh]">
                    {/* Title */}
                    <div>
                        <label htmlFor="task-title" className="block text-xs font-medium text-neutral-500 mb-1.5">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="task-title"
                            ref={titleRef}
                            type="text"
                            value={draft.title}
                            disabled={isSaving}
                            onChange={(e) => update('title', e.target.value)}
                            className={`w-full rounded-lg border px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-neutral-50 disabled:cursor-not-allowed transition-colors ${titleError ? 'border-red-400' : 'border-neutral-200'}`}
                        />
                        {titleError && <p className="mt-1 text-xs text-red-500">{titleError}</p>}
                    </div>

                    {/* Status + Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="block text-xs font-medium text-neutral-500 mb-1.5">Status</span>
                            <SegmentedControl
                                options={STATUS_OPTIONS}
                                value={draft.status}
                                onChange={(v) => update('status', v)}
                                disabled={isSaving}
                            />
                        </div>
                        <div>
                            <span className="block text-xs font-medium text-neutral-500 mb-1.5">Priority</span>
                            <SegmentedControl
                                options={PRIORITY_OPTIONS}
                                value={draft.priority}
                                onChange={(v) => update('priority', v)}
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    {/* Assignee */}
                    <div>
                        <label htmlFor="task-assignee" className="block text-xs font-medium text-neutral-500 mb-1.5">
                            Assignee
                        </label>
                        <input
                            id="task-assignee"
                            type="text"
                            value={draft.assignee.name}
                            disabled={isSaving}
                            onChange={(e) => update('assignee', { ...draft.assignee, name: e.target.value })}
                            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-neutral-50 disabled:cursor-not-allowed transition-colors"
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label htmlFor="task-due-date" className="block text-xs font-medium text-neutral-500 mb-1.5">
                            Due Date
                        </label>
                        <input
                            id="task-due-date"
                            type="date"
                            value={toDateInput(draft.dueDate)}
                            disabled={isSaving}
                            onChange={(e) => update('dueDate', fromDateInput(e.target.value))}
                            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-neutral-50 disabled:cursor-not-allowed transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="task-description" className="block text-xs font-medium text-neutral-500 mb-1.5">
                            Description
                        </label>
                        <textarea
                            id="task-description"
                            rows={3}
                            value={draft.description ?? ''}
                            disabled={isSaving}
                            placeholder="Add a description…"
                            onChange={(e) => update('description', e.target.value || undefined)}
                            className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-neutral-50 disabled:cursor-not-allowed transition-colors"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-neutral-100 px-6 py-4">
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={handleClose}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={handleSave}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSaving && (
                            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {isSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>

                {/* Discard confirmation overlay */}
                {showDiscard && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur-sm">
                        <div className="mx-6 rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-lg">
                            <p className="text-sm font-semibold text-neutral-900 mb-1">Discard changes?</p>
                            <p className="text-xs text-neutral-500 mb-5">Your unsaved edits will be lost.</p>
                            <div className="flex justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDiscard(false)}
                                    className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                                >
                                    Keep editing
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
                                >
                                    Discard
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
}
