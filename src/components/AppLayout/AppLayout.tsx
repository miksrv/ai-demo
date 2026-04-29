import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { cn } from '@servicepattern/ui'

import { MICROFRONTEND_MODE } from '@/utils/mode'

import { Header } from './Header'
import { Menu } from './Menu'

declare global {
    interface Window {
        microfrontNavigate?: (to: string) => void
    }
}

/**
 * Application shell rendered for all protected routes.
 * In standalone mode it provides the sidebar Menu and top Header.
 * In MFE mode it renders only the Outlet — GN owns the chrome.
 */
export const AppLayout: React.FC = () => {
    const navigate = useNavigate()

    useEffect(() => {
        window.microfrontNavigate = navigate
    }, [navigate])

    return (
        <div className={cn('h-full w-full', !MICROFRONTEND_MODE && 'flex flex-row')}>
            {!MICROFRONTEND_MODE ? (
                <>
                    <Menu />
                    <div className={'flex-grow w-full h-full overflow-hidden'}>
                        <Header />
                        <Outlet />
                    </div>
                </>
            ) : (
                <Outlet />
            )}
        </div>
    )
}
