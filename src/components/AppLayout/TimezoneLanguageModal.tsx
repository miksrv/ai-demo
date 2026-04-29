import React, { useEffect, useMemo, useState } from 'react'
import { useAtom } from 'jotai'

import { Button, Modal, ModalProps, SelectField, SelectItemType } from '@servicepattern/ui'

import { TIMEZONES } from '@/constants'
import { timezoneAtom } from '@/store'

export const TimezoneLanguageModal: React.FC<ModalProps> = (props) => {
    const [storageTimezone, setStorageTimezone] = useAtom(timezoneAtom)
    const [timezone, setTimezone] = useState<string>()
    const [rawSearch, setRawSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(rawSearch), 120)
        return () => clearTimeout(timer)
    }, [rawSearch])

    const optionTimezones: SelectItemType[] = useMemo(
        () =>
            TIMEZONES?.map((item) => ({
                value: item?.name,
                content: `(GMT${transformOffsetToNumber(item?.offset)}) ${item?.name}`
            })) || [],
        []
    )

    const handleSave = () => {
        if (timezone) {
            setStorageTimezone(timezone)
        }
        props?.onClose?.('end')
    }

    useEffect(() => {
        setTimezone(storageTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone)
    }, [props?.isOpen])

    return (
        <Modal
            {...props}
            size={'sm'}
            aria-describedby={undefined}
            closeOnEscape={true}
            closeOnClickOutside={true}
        >
            <Modal.Header className={'text-primary-on-primary'}>{'Timezone'}</Modal.Header>
            <Modal.Content className={'flex flex-col gap-4'}>
                <SelectField
                    value={timezone}
                    withSearch={true}
                    disabled={!optionTimezones?.length}
                    layoutClassName={'field-layout-label-full-width'}
                    placeholder={'Select Time Zone'}
                    label={'Time Zone'}
                    searchPlaceholder={'Search Time Zone'}
                    onValueChange={(item) => setTimezone(item)}
                    onSearchChange={setRawSearch}
                    options={optionTimezones?.filter(({ value }) =>
                        debouncedSearch ? value?.toLowerCase().includes(debouncedSearch.toLowerCase()) : true
                    )}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button
                    variant={'secondary'}
                    onClick={() => props?.onClose?.('end')}
                >
                    {'Cancel'}
                </Button>
                <Button
                    variant={'primary'}
                    onClick={handleSave}
                >
                    {'Save'}
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

const transformOffsetToNumber = (offset: number): string => {
    const sign = offset >= 0 ? '+' : '-'
    const absOffset = Math.abs(offset)
    const hours = (absOffset % 3600) / 60
    return `${sign}${String(hours).padStart(2, '0')}:00`
}
