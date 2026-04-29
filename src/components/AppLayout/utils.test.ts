import { describe, expect, it } from 'vitest'

import { isActiveMenuItem } from './utils'

describe('isActiveMenuItem', () => {
    it('returns true when active route exactly matches node route', () => {
        expect(isActiveMenuItem('/tenants', '/tenants')).toBe(true)
    })

    it('returns true when active route is a sub-path of node route', () => {
        expect(isActiveMenuItem('/tenants/123', '/tenants')).toBe(true)
    })

    it('returns false when routes do not match', () => {
        expect(isActiveMenuItem('/users', '/tenants')).toBe(false)
    })

    it('returns false when activeMenuRoute is undefined', () => {
        expect(isActiveMenuItem(undefined, '/tenants')).toBe(false)
    })

    it('returns false when nodeMenuRoute is undefined', () => {
        expect(isActiveMenuItem('/tenants', undefined)).toBe(false)
    })

    it('returns true for root route on root path', () => {
        expect(isActiveMenuItem('/', '/')).toBe(true)
    })

    it('returns false for different top-level routes', () => {
        expect(isActiveMenuItem('/tenants', '/settings')).toBe(false)
    })
})
