import { forwardRef } from 'react'

import { Avatar as JSKitAvatar, AvatarProps as JSKitAvatarProps } from '@servicepattern/ui'

export interface AvatarProps extends JSKitAvatarProps {
    placeholder?: string
    src?: string
}

const makeInitials = (name?: string): string => {
    if (!name?.trim()) {
        return ''
    }
    return name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({ placeholder, src, ...props }, ref) => (
    <JSKitAvatar
        {...props}
        ref={ref}
        src={src}
        fallback={makeInitials(placeholder)}
    />
))

Avatar.displayName = 'Avatar'
