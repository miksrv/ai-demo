import React from 'react'

import { Button, InlineAlert, Modal, ModalProps } from '@servicepattern/ui'

export const HelpModal: React.FC<ModalProps> = (props) => {
    return (
        <Modal
            {...props}
            size={'sm'}
            aria-describedby={undefined}
            closeOnEscape={true}
            closeOnClickOutside={true}
        >
            <Modal.Header className={'text-primary-on-primary'}>{'Help'}</Modal.Header>
            <Modal.Content className={'flex min-h-[200px] flex-col gap-4 px-6 py-6'}>
                <InlineAlert
                    variant={'info'}
                    className={'w-full max-h-fit text-primary-on-primary'}
                >
                    {'No help links available'}
                </InlineAlert>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    variant={'primary'}
                    onClick={() => props?.onClose?.('end')}
                >
                    {'Close'}
                </Button>
            </Modal.Actions>
        </Modal>
    )
}
