export const isActiveMenuItem = (activeMenuRoute?: string, nodeMenuRoute?: string) => {
    if (typeof activeMenuRoute === 'undefined' || !nodeMenuRoute) {
        return false
    }

    const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/'

    const active = normalizePath(activeMenuRoute)
    const node = normalizePath(nodeMenuRoute)

    // Handling dynamic segments :tabName?
    // replace "/:something?" with "(/[^/]+)?"
    const dynamicPattern = node.replace(/\/:[^\/?]+\?/g, '(/[^/]+)?')
    const regex = new RegExp(`^${dynamicPattern}$`)

    if (node === '/') {
        // Regex for GUID: 8-4-4-4-12 hex
        const guidRegex = /^\/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/
        return active === '/' || guidRegex.test(active)
    }

    return active === node || active.startsWith(node + '/') || regex.test(active)
}

export const isInIframe = () => {
    try {
        return window.self !== window.top
    } catch {
        // cross-origin iframe
        return true
    }
}
