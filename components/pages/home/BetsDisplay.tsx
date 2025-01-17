'use client'

import { Button } from '@/components/ui/shadcn/button'
import { useFormSubmitHandler } from '@/hooks/useFormSubmitHandler'
import { getEvs, refreshOdds } from '@/services/ev/ev-client'
import { ValuableBet } from '@/types/bets'
import { TEvResponse } from '@/types/evs'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export default function ValuableBetsDisplay() {
    const [isFetching, setIsFetching] = useState(false)

    const { onSubmitHandler } = useFormSubmitHandler()

    const { data: evs, refetch } = useQuery({
        queryKey: ['get-evs'],
        queryFn: () => getEvs(),
    })

    const getRecommendedTeam = (evResponse: TEvResponse): string => {
        const recommendedTeam = evResponse['Best Outcome']

        switch (recommendedTeam) {
            case 'Draw':
                return "Empate"
            case 'Team 1':
                return evResponse['Team 1']
            case 'Team 2':
                return evResponse['Team 2']
        }
    }

    const refreshBets = async () => {
        setIsFetching(true)

        await onSubmitHandler({
            data: null,
            service: refreshOdds,
            options: {
                onFailureCb: () => {
                    setIsFetching(false)
                },
                onSuccessCb: () => {
                    setIsFetching(false)
                    refetch()
                },
                onSuccessMessage: {
                    title: "Odds atualizadas com sucesso!"
                },
                onCatchMessage: {
                    logService: {
                        block: "ValuableBetsDisplay",
                        component: "ValuableBetsDisplay",
                    }
                }
            }
        })
    }

    if (!evs || evs.items.length === 0) return null

    return (
        <div className="container mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold">Valuable Bets</h1>

            <Button disabled={isFetching} onClick={() => refreshBets()}>Atualizar apostas</Button>

            <div className="space-y-4">
                {evs.items.map((bet, index) => {
                    const recommendedTeam = getRecommendedTeam(bet)
                    return (
                        <div key={index} className="border p-4 rounded-lg shadow-sm">
                            <h3 className="font-bold">{bet["Team 1"]} vs {bet["Team 2"]}</h3>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <p className="font-semibold">Betby Odds: <span>{bet['Betby Odds']}</span></p>
                                </div>
                                <div>
                                    <p className="font-semibold">Pinnacle Odds: <span>{bet['Pinnacle Odds']}</span></p>
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="font-semibold">EV: <span>{bet['EV']}</span></p>
                            </div>
                            <p className="mt-2 text-blue-600 font-semibold">
                                Recomendado: Apostar em {recommendedTeam}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
