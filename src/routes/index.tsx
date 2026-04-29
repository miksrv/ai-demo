import React from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'

import { AppLayout } from '@/components/AppLayout'

const DemoPage: React.FC = () => (
    <div className={'p-8'}>
        <h2 className={'text-2xl font-semibold text-neutral-900'}>Demo</h2>
        <p className={'mt-2 text-neutral-500'}>Claude AI Demo Project</p>
    </div>
)

export const router = createHashRouter([
    {
        element: <AppLayout />,
        children: [
            { index: true, element: <Navigate to={'/demo'} replace /> },
            { path: '/demo', element: <DemoPage /> },
        ]
    }
])
