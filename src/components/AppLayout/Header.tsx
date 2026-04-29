import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAtom } from 'jotai'

import { Button, Dropdown, DropdownContent, DropdownItem, IconHelp, Tooltip, useToggle } from '@servicepattern/ui'
import { useMutation } from '@tanstack/react-query'

import { Api, ApiQuery } from '@/codegen/api'
import { Avatar } from '@/components/Avatar'
import { APP_AUTH_TOKEN, APP_ID } from '@/constants'
import { BASE_ROUTE } from '@/constants/routes'
import { MenuConfig } from '@/MenuConfig'
import { isAuthAtom } from '@/store'

import { AboutModal } from './AboutModal'
import { BpLogoIcon } from './BpLogoIcon'
import { HelpModal } from './HelpModal'
import { LineIcon } from './LineIcon'
import { LogoutModal } from './LogoutModal'
import { TimezoneLanguageModal } from './TimezoneLanguageModal'
import { isActiveMenuItem } from './utils'

const formatDisplayName = (firstName?: string, lastName?: string): string => {
    return [firstName, lastName].filter(Boolean).join(' ') || ''
}

export const Header: React.FC = () => {
    const location = useLocation()

    const [menu, setMenu] = useState<Awaited<ReturnType<typeof MenuConfig>> | null>(null)
    const [logoutFromAllDevices, setLogoutFromAllDevices] = useState(false)

    const [isAuth, setIsAuth] = useAtom(isAuthAtom)

    const { data: userData } = ApiQuery.useGetCurrentUserQuery({ enabled: isAuth })

    const [settingsModalOpen, openSettingsModal, closeSettingsModal] = useToggle(false)
    const [aboutModalOpen, openAboutModal, closeAboutModal] = useToggle(false)
    const [helpModalOpen, openHelpModal, closeHelpModal] = useToggle(false)
    const [logoutModalOpen, openLogoutModal, closeLogoutModal] = useToggle(false)

    const logoutMutation = useMutation({
        mutationFn: (fromAllDevices: boolean) =>
            Api.v2LogoutPost({
                authorization: `Bearer ${localStorage.getItem(APP_AUTH_TOKEN) ?? ''}`,
                fromAllDevices
            }),
        onSuccess: () => {
            setIsAuth(false)
            localStorage.removeItem(APP_AUTH_TOKEN)
            window.location.href = BASE_ROUTE
        }
    })

    const activeMenuTitle = useMemo(() => {
        const activeItem = menu?.menu?.find((item) => isActiveMenuItem(location.pathname, item?.onClick?.route))
        return activeItem?.title ? `${String(activeItem.title)} | ` : ''
    }, [location.pathname, menu])

    const handleOpenLogoutModal = () => {
        setLogoutFromAllDevices(false)
        openLogoutModal()
    }

    const handleCloseLogoutModal = () => {
        if (logoutMutation.isPending) {
            return
        }

        setLogoutFromAllDevices(false)
        closeLogoutModal()
    }

    const handleLogout = () => {
        logoutMutation.mutate(logoutFromAllDevices)
    }

    useEffect(() => {
        void MenuConfig().then(setMenu)
        document.title = 'Demo Project'
    }, [])

    return (
        <header
            className={
                'inline-flex h-16 w-full items-center justify-end gap-4 border-neutral-100 border-b bg-neutral-0 px-4 py-3.5 relative'
            }
        >
            <h1
                className={
                    'mr-auto truncate font-semibold text-base text-neutral-fade leading-normal tracking-widest-[.02em]'
                }
            >
                {activeMenuTitle}
                {'Demo Project'}
            </h1>

            <div className={'flex items-center justify-end gap-4 min-w-2/5'}>
                <div className={'flex items-center gap-2'}>
                    <Button
                        variant={'ghost'}
                        size={'sm'}
                        aria-label={'Help Screen'}
                        onClick={openHelpModal}
                        icon={<IconHelp className={'icon-default'} />}
                    />

                    <Tooltip
                        trigger={
                            <Dropdown
                                trigger={
                                    <Avatar
                                        type={'user'}
                                        size={'32'}
                                        className={'cursor-pointer'}
                                        placeholder={[userData?.firstName, userData?.lastName]
                                            .filter(Boolean)
                                            .join(' ')}
                                    />
                                }
                                content={
                                    <DropdownContent className={'text-primary-900 z-[9999]'}>
                                        <DropdownItem onClick={() => setTimeout(openSettingsModal, 0)}>
                                            {'Timezone'}
                                        </DropdownItem>

                                        <DropdownItem>
                                            <a
                                                className={
                                                    'flex w-full items-center justify-between hover:text-inherit hover:no-underline'
                                                }
                                                href={`/auth/change-password?client_id=${APP_ID}&user_id=${userData?.id}`}
                                                target={'_blank'}
                                            >
                                                {'Change Password'}
                                            </a>
                                        </DropdownItem>

                                        <DropdownItem onClick={() => setTimeout(openAboutModal, 0)}>
                                            {'About'}
                                        </DropdownItem>

                                        <DropdownItem onClick={() => setTimeout(handleOpenLogoutModal, 0)}>
                                            {'Logout'}
                                        </DropdownItem>
                                    </DropdownContent>
                                }
                            />
                        }
                        tooltip={
                            <div className='p-2'>
                                <div className='font-bold mb-1'>
                                    {formatDisplayName(userData?.firstName, userData?.lastName)}
                                </div>
                            </div>
                        }
                        side={'bottom'}
                        withArrow={true}
                        size={'md'}
                        tooltipClassName={'caption-s whitespace-pre-line break-words'}
                    />
                </div>

                <LineIcon />
                <BpLogoIcon />
            </div>

            <TimezoneLanguageModal
                isOpen={settingsModalOpen}
                onClose={closeSettingsModal}
            />

            <AboutModal
                isOpen={aboutModalOpen}
                onClose={closeAboutModal}
            />

            <HelpModal
                isOpen={helpModalOpen}
                onClose={closeHelpModal}
            />

            <LogoutModal
                isOpen={logoutModalOpen}
                onClose={handleCloseLogoutModal}
                loading={logoutMutation.isPending}
                logoutFromAllDevices={logoutFromAllDevices}
                onLogoutFromAllDevicesChange={setLogoutFromAllDevices}
                onConfirm={handleLogout}
            />
        </header>
    )
}
