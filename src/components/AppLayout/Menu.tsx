import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { cn, IconArrowDown16, IconArrowRight16 } from '@servicepattern/ui'

import { ROUTES } from '@/constants/routes'
import { MenuConfig } from '@/MenuConfig'

import { isActiveMenuItem } from './utils'

type MenuItem = {
    title?: string
    onClick?: { route?: string }
    children?: MenuItem[]
}

const isDescendantActive = (pathname: string, item: MenuItem): boolean => {
    if (isActiveMenuItem(pathname, item.onClick?.route)) {
        return true
    }
    return (item.children ?? []).some((child) => isDescendantActive(pathname, child))
}

export const Menu: React.FC = () => {
    const [menu, setMenu] = useState<Awaited<ReturnType<typeof MenuConfig>> | null>(null)
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        void MenuConfig().then((config) => {
            setMenu(config)
            const initial: Record<string, boolean> = {}
            for (const item of config.menu ?? []) {
                if (item.children?.length) {
                    initial[item.title ?? ''] = isDescendantActive(location.pathname, item as MenuItem)
                }
            }
            setExpanded((prev) => ({ ...initial, ...prev }))
        })
    }, [])

    useEffect(() => {
        if (!menu?.menu) {
            return
        }
        setExpanded((prev) => {
            const next = { ...prev }
            for (const item of menu.menu ?? []) {
                if (item.children?.length && isDescendantActive(location.pathname, item as MenuItem)) {
                    next[item.title ?? ''] = true
                }
            }
            return next
        })
    }, [location.pathname, menu])

    const items = useMemo(() => menu?.menu ?? [], [menu])

    const toggleGroup = (title: string) => {
        setExpanded((prev) => ({ ...prev, [title]: !prev[title] }))
    }

    const renderLeaf = (item: MenuItem, indent: number) => {
        const active = isActiveMenuItem(location.pathname, item.onClick?.route)
        return (
            <div
                key={item.onClick?.route || item.title}
                className={cn(
                    'w-full rounded font-normal text-sm leading-[21px] tracking-tight',
                    active ? 'text-primary-600' : 'hover:bg-neutral-50'
                )}
            >
                {item.title && (
                    <button
                        className={'w-full truncate p-2.5 text-left'}
                        style={{ paddingLeft: `${16 + indent * 16}px` }}
                        onClick={async (event) => {
                            event.stopPropagation()
                            await navigate(item.onClick?.route || ROUTES.TENANTS)
                        }}
                    >
                        {String(item.title)}
                    </button>
                )}
            </div>
        )
    }

    const renderGroup = (item: MenuItem, indent: number) => {
        const key = item.title ?? ''
        const isExpanded = !!expanded[key]
        const activeInGroup = isDescendantActive(location.pathname, item)

        return (
            <div key={key}>
                <button
                    className={cn(
                        'w-full truncate p-2.5 text-left text-sm leading-[21px] tracking-tight rounded flex items-center gap-1',
                        activeInGroup ? 'text-primary-600' : 'hover:bg-neutral-50'
                    )}
                    style={{ paddingLeft: `${16 + indent * 16}px` }}
                    onClick={(e) => {
                        e.stopPropagation()
                        toggleGroup(key)
                    }}
                >
                    {isExpanded ? (
                        <IconArrowDown16 className={'icon-default shrink-0'} />
                    ) : (
                        <IconArrowRight16 className={'icon-default shrink-0'} />
                    )}
                    <span className={'truncate'}>{String(item.title)}</span>
                </button>
                {isExpanded && <div>{(item.children ?? []).map((child) => renderNode(child, indent + 1))}</div>}
            </div>
        )
    }

    const renderNode = (item: MenuItem, indent: number): React.ReactNode => {
        if (item.children?.length) {
            return renderGroup(item, indent)
        }
        return renderLeaf(item, indent)
    }

    return (
        <div
            className={
                'relative inline-flex min-w-[264px] px-4 pt-4 h-screen flex-col items-center border-neutral-100 border-r bg-neutral-0 justify-between transition-all duration-300 ease-in'
            }
        >
            <div className={'w-full'}>{items.map((item) => renderNode(item as MenuItem, 0))}</div>

            <div className={'font-normal ml-8 mb-6 w-full text-[10px] text-neutral-400 leading-[10px] tracking-tight'}>
                <div>{'Powered by Bright Pattern'}</div>
            </div>
        </div>
    )
}
