import React, { useMemo } from 'react'

import { Button, Modal, ModalProps } from '@servicepattern/ui'

import { BUILD, RELEASE } from '../../../version'

export interface AboutParametersType {
    name?: string
    value?: string
}

export const AboutModal: React.FC<ModalProps> = (props) => {
    const params: AboutParametersType[] = useMemo(
        () => [
            { name: 'Product Name', value: 'Bright Pattern Contact Center' },
            { name: 'App Name', value: 'Demo Project' },
            { name: 'Version', value: `${RELEASE}.${BUILD}` }
        ],
        []
    )

    return (
        <Modal
            {...props}
            size={'sm'}
            aria-describedby={undefined}
            closeOnEscape={true}
            closeOnClickOutside={true}
        >
            <Modal.Header className={'text-primary-on-primary'}>{'About'}</Modal.Header>
            <Modal.Content className={'flex flex-col gap-2'}>
                {params?.map((param) => (
                    <div
                        key={param?.name}
                        className={'flex'}
                    >
                        <div className={'w-[200px] shrink-0'}>
                            <span className={'font-semibold text-primary-on-primary caption-s'}>{param?.name}</span>
                        </div>
                        <div>
                            <span className={'text-primary-on-primary text-sm'}>{param?.value}</span>
                        </div>
                    </div>
                ))}

                <div className={'mt-2 flex flex-col gap-2'}>
                    <div className={'font-semibold text-primary-action caption-xs'}>
                        <a
                            href={'https://www.brightpattern.com'}
                            target={'_blank'}
                            rel={'noopener noreferrer'}
                        >
                            {'Powered by Bright Pattern'}
                        </a>
                    </div>
                </div>
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
