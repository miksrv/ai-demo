import React from 'react'

import { cn } from '@servicepattern/ui'

interface LineIconProps {
    className?: string
}

export const LineIcon: React.FC<LineIconProps> = ({ className }) => (
    <svg
        width='2'
        height='18'
        viewBox='0 0 2 18'
        fill={'none'}
        xmlns={'http://www.w3.org/2000/svg'}
        className={cn('shrink-0', className)}
    >
        <path
            id='Divider'
            d='M1 1L0.999999 17'
            stroke='#E3E4E8'
            strokeLinecap={'round'}
        />
    </svg>
)
