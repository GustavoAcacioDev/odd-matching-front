"use client"

import { OpenBetsFloater } from "@/components/layout/OpenBetsFloater"
import { Button } from "@/components/ui/shadcn/button"
import { useFormSubmitHandler } from "@/hooks/useFormSubmitHandler"
import { getBetHistory, getEvs, getOpenBets, refreshOdds } from "@/services/ev/ev-client"
import { BetResult, ValuableBet } from "@/types/bets"
import type { TEvResponse } from "@/types/evs"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { UserBalance } from "./UserBalance"
import { getUserBalance } from "@/services/balance/balance"
import { BetModal } from "@/components/layout/BetModal"
import { placeBet, type TBet } from "@/services/bet/bet-client"
import Link from "next/link"

export default function ValuableBetsDisplay() {
  const [isFetching, setIsFetching] = useState(false)
  const [selectedBet, setSelectedBet] = useState<TEvResponse | null>(null)

  const { onSubmitHandler } = useFormSubmitHandler()

  const { data: evs, refetch } = useQuery({
    queryKey: ["get-evs"],
    queryFn: () => getEvs(),
  })

  const { data: openBets, refetch: refetchOpenBets } = useQuery({
    queryKey: ["get-open-bets"],
    queryFn: () => getOpenBets(),
  })

  const {
    data: balance,
    isLoading,
    refetch: refetchBalance,
  } = useQuery({
    queryKey: ["get-user-balance"],
    queryFn: getUserBalance,
  })

  const getRecommendedTeam = (evResponse: TEvResponse): string => {
    const evValues = [
      { team: evResponse["Team 1"], ev: evResponse.EV["EV Team 1"] },
      { team: "Draw", ev: evResponse.EV["EV Draw"] },
      { team: evResponse["Team 2"], ev: evResponse.EV["EV Team 2"] },
    ]
    const maxEv = evValues.reduce((max, current) => (current.ev > max.ev ? current : max))
    return maxEv.team === "Draw" ? "Empate" : maxEv.team
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
          title: "Odds atualizadas com sucesso!",
        },
        onCatchMessage: {
          logService: {
            block: "ValuableBetsDisplay",
            component: "ValuableBetsDisplay",
          },
        },
      },
    })
  }

  const handlePlaceBet = (bet: TEvResponse) => {
    setSelectedBet(bet)
  }

  const handleConfirmBet = async (betAmount: number) => {
    if (selectedBet) {
      const recommendedBet = getRecommendedTeam(selectedBet)

      const body: TBet = {
        amount: betAmount,
        bet: recommendedBet,
        match: `${selectedBet["Team 1"]} vs ${selectedBet["Team 2"]}`,
        odds:
          recommendedBet === selectedBet["Team 1"]
            ? parseFloat(selectedBet["Betby Odds"]["Odd Team 1"])
            : recommendedBet === "Empate"
              ? parseFloat(selectedBet["Betby Odds"]["Odd Draw"])
              : parseFloat(selectedBet["Betby Odds"]["Odd Team 2"]),
      }

      await onSubmitHandler({
        data: body,
        service: placeBet,
        options: {
          onSuccessCb: () => {
            refetchOpenBets()
            refetchBalance()
          },
          onSuccessMessage: {
            title: "Aposta realizada com sucesso!",
          },
          onCatchMessage: {
            logService: {
              block: "ValuableBetsDisplay",
              component: "ValuableBetsDisplay",
            },
          },
        },
      })
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-end">
        <Button disabled={isFetching} onClick={() => refreshBets()}>
          Atualizar apostas
        </Button>
        {!isLoading && balance?.value.balance && (
          <UserBalance balance={balance.value.balance.toString() || ""} refetch={refetchBalance} />
        )}
      </div>

      <div className="space-y-4">
        {evs && evs.items.map((bet, index) => {
          const recommendedTeam = getRecommendedTeam(bet)
          return (
            <div key={index} className="border p-4 rounded-lg shadow-sm">
              <h3 className="font-bold">
                {bet["Team 1"]} vs {bet["Team 2"]}
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="font-semibold">Betby Odds:</p>
                  <p>Team 1: {bet["Betby Odds"]["Odd Team 1"]}</p>
                  <p>Draw: {bet["Betby Odds"]["Odd Draw"]}</p>
                  <p>Team 2: {bet["Betby Odds"]["Odd Team 2"]}</p>
                </div>

                <div>
                  <p className="font-semibold">Pinnacle Odds:</p>
                  <p>Team 1: {bet["Pinnacle Odds"]["Odd Team 1"]}</p>
                  <p>Draw: {bet["Pinnacle Odds"]["Odd Draw"]}</p>
                  <p>Team 2: {bet["Pinnacle Odds"]["Odd Team 2"]}</p>
                </div>
              </div>

              <div className="mt-2">
                <p className="font-semibold">EV:</p>
                <p>Team 1: {bet.EV["EV Team 1"]}%</p>
                <p>Draw: {bet.EV["EV Draw"]}%</p>
                <p>Team 2: {bet.EV["EV Team 2"]}%</p>
              </div>

              <p className="mt-2">Max EV: {bet["Max EV"]}%</p>
              <p>Confidence Score: {bet["Confidence Score"]}</p>
              <p className="mt-2 text-blue-600 font-semibold">Recomendado: Apostar em {recommendedTeam}</p>

              <div className="flex gap-4 items-center">
                <Button className="mt-4" onClick={() => handlePlaceBet(bet)}>
                  Apostar
                </Button>

                <Button className="mt-4" asChild>
                  <Link target="_blank" href={`https://csgoempire.com/match-betting?bt-path=${bet.Link}`}>
                    Link da Partida
                  </Link>
                </Button>
              </div>
            </div>
          )

        })}
      </div>

      {openBets && openBets.items.length > 0 && (
        <OpenBetsFloater bets={openBets.items} refetchOpenBets={refetchOpenBets} refetchBalance={refetchBalance} />
      )}

      {selectedBet && balance?.value.balance !== undefined && (
        <BetModal
          bet={selectedBet}
          isOpen={!!selectedBet}
          onClose={() => setSelectedBet(null)}
          onConfirm={handleConfirmBet}
          userBalance={balance.value.balance}
        />
      )}
    </div>
  )
}

