import React from 'react'

import { Button, CheckboxWithLabel, Modal, ModalProps } from '@servicepattern/ui'

interface LogoutModalProps extends ModalProps {
    loading?: boolean
    logoutFromAllDevices?: boolean
    onLogoutFromAllDevicesChange?: (checked: boolean) => void
    onConfirm?: () => void
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
    loading,
    logoutFromAllDevices = false,
    onLogoutFromAllDevicesChange,
    onConfirm,
    ...props
}) => {
    return (
        <Modal
            {...props}
            closeOnEscape={!loading}
            closeOnClickOutside={!loading}
            size={'sm'}
        >
            <Modal.Header className={'text-primary-on-primary'}>{'Log Out'}</Modal.Header>
            <Modal.Content className={'flex flex-col gap-4 text-base text-primary-on-primary'}>
                <span>{'Log out from all your applications in this browser?'}</span>
                <CheckboxWithLabel
                    size={'20'}
                    checked={logoutFromAllDevices}
                    disabled={loading}
                    label={'Also log out from all devices'}
                    onCheckedChange={(checked: boolean) => onLogoutFromAllDevicesChange?.(checked)}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button
                    autoFocus={true}
                    onClick={() => props.onClose?.('end')}
                    disabled={loading}
                    state={loading ? 'loading' : 'default'}
                >
                    {'Cancel'}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant={'secondary'}
                    disabled={loading}
                    state={loading ? 'loading' : 'default'}
                >
                    {'Log Out'}
                </Button>
            </Modal.Actions>
        </Modal>
    )
}
