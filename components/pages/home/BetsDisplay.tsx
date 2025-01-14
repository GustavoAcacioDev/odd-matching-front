'use client'

import { Button } from '@/components/ui/shadcn/button'
import { getBetbyOdds } from '@/services/betby/betby-client'
import { getPinnacleOdds } from '@/services/pinnacle/pinnacle-client'
import { ValuableBet } from '@/types/bets'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

interface ValuableBetsDisplayProps {
    bets: ValuableBet[]
}

export default function ValuableBetsDisplay({ bets }: ValuableBetsDisplayProps) {
    const [message, setMessage] = useState<string | null>(null)

    const { data: betby } = useQuery({
        queryKey: ['get-betby-odds'],
        queryFn: () => getBetbyOdds(),
      })

    const { data: pinnacle } = useQuery({
        queryKey: ['get-pinnacle-odds'],
        queryFn: () => getPinnacleOdds(),
      })

    const getRecommendedTeam = (bet: ValuableBet) => {
        const evValues = Object.entries(bet.EV)
        return evValues.reduce((a, b) => a[1] > b[1] ? a : b)[0]
    }

    const handleRefresh = () => {
        setMessage("Refreshing bets...")
        // Simulating an API call to refresh bets
        setTimeout(() => {
            setMessage("Bets refreshed successfully!")
        }, 1500)
    }

    const handlePlaceBet = () => {
        setMessage("Placing bet...")
        // Simulating an API call to place a bet
        setTimeout(() => {
            setMessage("Bet placed successfully!")
        }, 1500)
    }

    const handleAnalyze = () => {
        setMessage("Analyzing bets...")
        // Simulating an API call to analyze bets
        setTimeout(() => {
            setMessage("Analysis complete! Check the console for details.")
            console.log("Bet Analysis:", bets)
        }, 1500)
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Valuable Bets</h1>
            <div className="flex space-x-4 mb-4">
                <Button onClick={handleRefresh}>Refresh Bets</Button>
                <Button onClick={handlePlaceBet}>Place Bet</Button>
                <Button onClick={handleAnalyze}>Analyze Bets</Button>
            </div>
            {message && (
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
                    <p>{message}</p>
                </div>
            )}
            <div className="space-y-4">
                {bets.map((bet, index) => {
                    const recommendedTeam = getRecommendedTeam(bet)
                    return (
                        <div key={index} className="border p-4 rounded-lg shadow-sm">
                            <h3 className="font-bold">{bet["Team 1"]} vs {bet["Team 2"]}</h3>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <p className="font-semibold">Betby Odds:</p>
                                    {Object.entries(bet["Betby Odds"]).map(([team, odds]) => (
                                        <p key={team} className={team === recommendedTeam ? "text-green-600 font-bold" : ""}>
                                            {team}: {odds}
                                        </p>
                                    ))}
                                </div>
                                <div>
                                    <p className="font-semibold">Pinnacle Odds:</p>
                                    {Object.entries(bet["Pinnacle Odds"]).map(([team, odds]) => (
                                        <p key={team} className={team === recommendedTeam ? "text-green-600 font-bold" : ""}>
                                            {team}: {odds}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="font-semibold">EV:</p>
                                {Object.entries(bet.EV).map(([team, ev]) => (
                                    <p key={team} className={team === recommendedTeam ? "text-green-600 font-bold" : ""}>
                                        {team}: {(ev * 100).toFixed(2)}%
                                    </p>
                                ))}
                            </div>
                            <p className="mt-2 text-blue-600 font-semibold">
                                Recomendado: Apostar em {recommendedTeam === "Draw" ? "Empate" : bet[recommendedTeam as keyof ValuableBet] as string}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
