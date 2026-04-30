import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/components/Avatar', () => ({
    Avatar: ({ placeholder, 'aria-label': ariaLabel }: { placeholder?: string; 'aria-label'?: string }) => (
        <img src="" alt={ariaLabel ?? placeholder ?? ''} />
    ),
}))

import { TaskCard, TaskCardProps } from './TaskCard'

const baseProps: TaskCardProps = {
    id: 'task-1',
    title: 'Fix the login redirect bug',
    status: 'todo',
    assignee: { name: 'Jane Doe', avatarUrl: 'https://example.com/jane.jpg' },
    priority: 'medium',
    dueDate: '2026-04-30T00:00:00.000Z',
    onClick: vi.fn(),
}

function renderCard(props: Partial<TaskCardProps> = {}) {
    return render(<TaskCard {...baseProps} {...props} />)
}

describe('TaskCard', () => {
    describe('rendering', () => {
        it('renders the task title', () => {
            renderCard()
            expect(screen.getByText('Fix the login redirect bug')).toBeInTheDocument()
        })

        it('renders the assignee name', () => {
            renderCard()
            expect(screen.getByText('Jane Doe')).toBeInTheDocument()
        })

        it('formats the due date as "Apr 30"', () => {
            renderCard()
            expect(screen.getByText('Apr 30')).toBeInTheDocument()
        })

        it('sets the dateTime attribute on the time element', () => {
            renderCard()
            const time = screen.getByRole('time') as HTMLTimeElement
            expect(time.dateTime).toBe('2026-04-30T00:00:00.000Z')
        })
    })

    describe('status badge', () => {
        it('renders "To Do" badge for todo status', () => {
            renderCard({ status: 'todo' })
            expect(screen.getByText('To Do')).toBeInTheDocument()
        })

        it('renders "In Progress" badge for in-progress status', () => {
            renderCard({ status: 'in-progress' })
            expect(screen.getByText('In Progress')).toBeInTheDocument()
        })

        it('renders "Done" badge for done status', () => {
            renderCard({ status: 'done' })
            expect(screen.getByText('Done')).toBeInTheDocument()
        })

        it('applies gray classes for todo status', () => {
            renderCard({ status: 'todo' })
            const badge = screen.getByText('To Do')
            expect(badge).toHaveClass('bg-neutral-100', 'text-neutral-600')
        })

        it('applies blue classes for in-progress status', () => {
            renderCard({ status: 'in-progress' })
            const badge = screen.getByText('In Progress')
            expect(badge).toHaveClass('bg-blue-100', 'text-blue-700')
        })

        it('applies green classes for done status', () => {
            renderCard({ status: 'done' })
            const badge = screen.getByText('Done')
            expect(badge).toHaveClass('bg-green-100', 'text-green-700')
        })
    })

    describe('priority indicator', () => {
        it('renders a priority dot with correct aria-label for low', () => {
            renderCard({ priority: 'low' })
            expect(screen.getByRole('img', { name: 'Priority: low' })).toBeInTheDocument()
        })

        it('renders a priority dot with correct aria-label for medium', () => {
            renderCard({ priority: 'medium' })
            expect(screen.getByRole('img', { name: 'Priority: medium' })).toBeInTheDocument()
        })

        it('renders a priority dot with correct aria-label for high', () => {
            renderCard({ priority: 'high' })
            expect(screen.getByRole('img', { name: 'Priority: high' })).toBeInTheDocument()
        })

        it('applies correct color class for low priority', () => {
            renderCard({ priority: 'low' })
            expect(screen.getByRole('img', { name: 'Priority: low' })).toHaveClass('bg-neutral-400')
        })

        it('applies correct color class for medium priority', () => {
            renderCard({ priority: 'medium' })
            expect(screen.getByRole('img', { name: 'Priority: medium' })).toHaveClass('bg-amber-400')
        })

        it('applies correct color class for high priority', () => {
            renderCard({ priority: 'high' })
            expect(screen.getByRole('img', { name: 'Priority: high' })).toHaveClass('bg-red-500')
        })
    })

    describe('accessibility', () => {
        it('renders as a button role', () => {
            renderCard()
            expect(screen.getByRole('button')).toBeInTheDocument()
        })

        it('has a descriptive aria-label including title, status, priority, and due date', () => {
            renderCard({ status: 'in-progress', priority: 'high' })
            expect(
                screen.getByRole('button', {
                    name: /Task: Fix the login redirect bug, status In Progress, priority high, due Apr 30/i,
                })
            ).toBeInTheDocument()
        })

        it('is keyboard focusable via tabIndex', () => {
            renderCard()
            expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0')
        })
    })

    describe('interactions', () => {
        it('calls onClick with the task id when clicked', () => {
            const onClick = vi.fn()
            renderCard({ onClick })
            fireEvent.click(screen.getByRole('button'))
            expect(onClick).toHaveBeenCalledOnce()
            expect(onClick).toHaveBeenCalledWith('task-1')
        })

        it('calls onClick when Enter key is pressed', () => {
            const onClick = vi.fn()
            renderCard({ onClick })
            fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
            expect(onClick).toHaveBeenCalledOnce()
            expect(onClick).toHaveBeenCalledWith('task-1')
        })

        it('calls onClick when Space key is pressed', () => {
            const onClick = vi.fn()
            renderCard({ onClick })
            fireEvent.keyDown(screen.getByRole('button'), { key: ' ' })
            expect(onClick).toHaveBeenCalledOnce()
            expect(onClick).toHaveBeenCalledWith('task-1')
        })

        it('does not call onClick for other key presses', () => {
            const onClick = vi.fn()
            renderCard({ onClick })
            fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' })
            expect(onClick).not.toHaveBeenCalled()
        })
    })

    describe('edge cases', () => {
        it('renders a long title without overflow errors', () => {
            const longTitle = 'A'.repeat(300)
            renderCard({ title: longTitle })
            expect(screen.getByText(longTitle)).toBeInTheDocument()
        })

        it('applies line-clamp-2 to the title element', () => {
            renderCard()
            expect(screen.getByText('Fix the login redirect bug')).toHaveClass('line-clamp-2')
        })
    })

    describe('skeleton loading state', () => {
        it('renders an article with aria-label "Loading task" when isLoading is true', () => {
            renderCard({ isLoading: true })
            expect(screen.getByRole('article', { name: 'Loading task' })).toBeInTheDocument()
        })

        it('sets aria-busy="true" on the skeleton article', () => {
            renderCard({ isLoading: true })
            expect(screen.getByRole('article')).toHaveAttribute('aria-busy', 'true')
        })

        it('hides skeleton bones from the accessibility tree', () => {
            renderCard({ isLoading: true })
            const bones = document.querySelectorAll('[aria-hidden="true"]')
            expect(bones.length).toBeGreaterThan(0)
        })

        it('does not render task title when isLoading is true', () => {
            renderCard({ isLoading: true })
            expect(screen.queryByText('Fix the login redirect bug')).not.toBeInTheDocument()
        })

        it('does not render assignee name when isLoading is true', () => {
            renderCard({ isLoading: true })
            expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()
        })

        it('does not render a button role when isLoading is true', () => {
            renderCard({ isLoading: true })
            expect(screen.queryByRole('button')).not.toBeInTheDocument()
        })

        it('applies animate-pulse to skeleton bones', () => {
            renderCard({ isLoading: true })
            const bones = document.querySelectorAll('[aria-hidden="true"]')
            bones.forEach((bone) => expect(bone).toHaveClass('animate-pulse'))
        })

        it('renders normal content when isLoading is false', () => {
            renderCard({ isLoading: false })
            expect(screen.getByText('Fix the login redirect bug')).toBeInTheDocument()
        })

        it('renders normal content when isLoading is omitted', () => {
            renderCard()
            expect(screen.getByText('Fix the login redirect bug')).toBeInTheDocument()
        })
    })
})
