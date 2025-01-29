'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

const queryClient = new QueryClient()

function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider basePath="/api/auth">
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    )
}

export default Providers