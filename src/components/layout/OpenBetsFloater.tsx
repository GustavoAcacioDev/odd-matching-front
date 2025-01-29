'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/shadcn/button"
import { ScrollArea } from "@/components/ui/shadcn/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { ChevronUp, ChevronDown } from 'lucide-react'
import { BetResult, OpenBet } from '@/types/bets'
import { CloseBetModal } from './CloseBetModal'
import { removeBet, TUpdateBet, updateBet } from '@/services/bet/bet-client'
import { QueryObserverResult, RefetchOptions, useQueryClient } from '@tanstack/react-query'
import { ApiResponse, ApiResponseList } from '../../../global'
import { useFormSubmitHandler } from '@/hooks/useFormSubmitHandler'
import { TBalanceValue } from '@/services/balance/balance'

interface OpenBetsFloaterProps {
  bets: OpenBet[]
  refetchOpenBets: (options?: RefetchOptions) => Promise<QueryObserverResult<ApiResponseList<OpenBet>, Error>>
  refetchBalance: (options?: RefetchOptions) => Promise<QueryObserverResult<ApiResponse<TBalanceValue>, Error>>
}

export function OpenBetsFloater({ bets, refetchOpenBets, refetchBalance }: OpenBetsFloaterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [selectedBet, setSelectedBet] = useState<OpenBet | null>(null)

  const { onSubmitHandler } = useFormSubmitHandler()

  const handleCloseBet = (bet: OpenBet) => {
    setSelectedBet(bet)
  }

  const handleConfirmCloseBet = async (betId: string, result: BetResult) => {
    const body: TUpdateBet = {
      bet_id: betId,
      status: result,
      username: "admin",
    }

    await onSubmitHandler({
      data: body,
      service: updateBet,
      options: {
        onSuccessCb: () => {
          refetchOpenBets()
          refetchBalance()
          setIsFetching(false)
        },
        onFailureCb: () => setIsFetching(false),
        onSuccessMessage: {
          title: "Aposta encerrada com sucesso!"
        },
        onCatchMessage: {
          logService: {
            block: "OpenBetsFloater",
            component: "OpenBetsFloater",
          }
        }
      }
    })
  }

  const handleRemoveBet = async (betId: string) => {
    setIsFetching(true)

    await onSubmitHandler({
      data: betId,
      service: removeBet,
      options: {
        onSuccessCb: () => {
          refetchOpenBets()
          refetchBalance()
          setIsFetching(false)
        },
        onFailureCb: () => setIsFetching(false),
        onSuccessMessage: {
          title: "Aposta removida com sucesso!"
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 transition-all duration-300 ease-in-out ${isOpen ? 'h-96' : 'h-12'}`}>
        <CardHeader className="p-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Apostas Abertas ({bets.length})
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </CardTitle>
        </CardHeader>
        {isOpen && (
          <CardContent className="p-0">
            <ScrollArea className="h-80 rounded-md">
              {bets.map((bet) => (
                <div key={bet.id} className="p-4 border-b last:border-b-0">
                  <h3 className="font-semibold">{bet.match}</h3>
                  <p className="text-sm text-gray-500">Bet on: {bet.bet}</p>
                  <div className="mt-2 flex justify-between text-sm">
                    <span>Amount: ${bet.bet_amount}</span>
                    <span>Odds: {bet.odds}</span>
                  </div>
                  <p className="mt-1 text-sm text-green-600">Potential Win: ${bet.potential_win.toFixed(2)}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(bet.timestamp).toLocaleString()}
                  </p>
                  <Button
                    className="mt-2 w-full"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCloseBet(bet)}
                  >
                    Concluir Aposta
                  </Button>
                  <Button
                    className="mt-2 w-full hover:bg-red-100 hover:border-red-500"
                    variant="outline"
                    size="sm"
                    disabled={isFetching}
                    onClick={() => handleRemoveBet(bet.id)}
                  >
                    Remover Aposta
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        )}
      </Card>

      {selectedBet && (
        <CloseBetModal
          bet={selectedBet}
          isOpen={!!selectedBet}
          onClose={() => setSelectedBet(null)}
          onConfirm={handleConfirmCloseBet}
        />
      )}
    </div>
  )
}

