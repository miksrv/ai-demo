import { useQuery } from '@tanstack/react-query'

export type DtoCurrentUserResponse = {
    id: string
    firstName: string
    lastName: string
}

export const Api = {
    v2LogoutPost: async (_params: { authorization: string; fromAllDevices: boolean }): Promise<void> => {
        // demo stub
    }
}

export const ApiQuery = {
    useGetCurrentUserQuery: (options?: { enabled?: boolean; refetchInterval?: number; refetchOnWindowFocus?: boolean; refetchIntervalInBackground?: boolean }) =>
        useQuery<DtoCurrentUserResponse>({
            queryKey: ['currentUser'],
            queryFn: async (): Promise<DtoCurrentUserResponse> => ({
                id: 'demo-user-id',
                firstName: 'Demo',
                lastName: 'User'
            }),
            ...options
        })
}

export const ApiType = {
    DtoCurrentUserResponse: {} as DtoCurrentUserResponse
}
