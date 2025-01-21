'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'
import { getBetHistory } from '@/services/ev/ev-client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/shadcn/table"

export default function BetHistoryTable() {
    const { data: betHistory, isLoading, error } = useQuery({
        queryKey: ['bet-history'],
        queryFn: getBetHistory,
    })

    if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>
    if (error) return <div className="container mx-auto px-4 py-8">An error occurred: {error.message}</div>

    return (
        <main className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Historico de Apostas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>partida</TableHead>
                                <TableHead>Aposta</TableHead>
                                <TableHead>Quantia</TableHead>
                                <TableHead>Odds</TableHead>
                                <TableHead>Resultado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {betHistory?.items.map((bet) => (
                                <TableRow key={bet.id}>
                                    <TableCell>{new Date(bet.timestamp).toLocaleDateString()}</TableCell>
                                    <TableCell>{bet.match}</TableCell>
                                    <TableCell>{bet.bet}</TableCell>
                                    <TableCell>${bet.bet_amount.toFixed(2)}</TableCell>
                                    <TableCell>{bet.odds}</TableCell>
                                    <TableCell>{bet.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    )
}
