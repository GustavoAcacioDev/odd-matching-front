'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CookiesProvider } from 'next-client-cookies/server'
import React from 'react'

const queryClient = new QueryClient()

function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <CookiesProvider>{children}</CookiesProvider>
        </QueryClientProvider>
    )
}

export default Providers