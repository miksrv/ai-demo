import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { BP_APP_KEY_TIMEZONE } from '@servicepattern/gn-lib'

const stringStorage = {
    getItem: (key: string) => {
        const value = localStorage.getItem(key)
        return value == null ? '' : value
    },
    setItem: (key: string, value: string) => {
        localStorage.setItem(key, value)
    },
    removeItem: (key: string) => {
        localStorage.removeItem(key)
    }
}

export const isAuthAtom = atom<boolean>(true)

export const timezoneAtom = atomWithStorage(
    BP_APP_KEY_TIMEZONE,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    stringStorage
)
