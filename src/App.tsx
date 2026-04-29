import { RouterProvider } from 'react-router-dom'
import { Provider as JotaiProvider } from 'jotai'

import { SnackbarProvider, SnackbarViewport, ToastProvider, TooltipProvider } from '@servicepattern/ui'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/queryClient'
import { router } from '@/routes'

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <JotaiProvider>
                <ToastProvider viewportClassName={'max-h-0'}>
                    <SnackbarProvider autoHideDuration={15000}>
                        <SnackbarViewport className={'absolute right-0 top-[1px] overflow-hidden z-[999999]'} />
                        <TooltipProvider>
                            <RouterProvider router={router} />
                        </TooltipProvider>
                    </SnackbarProvider>
                </ToastProvider>
            </JotaiProvider>
        </QueryClientProvider>
    )
}
