'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/shadcn/button"
import { ScrollArea } from "@/components/ui/shadcn/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { ChevronUp, ChevronDown } from 'lucide-react'
import { CloseBetModal } from './CloseBetModal'
import { BetResult, OpenBet } from '@/types/bets'

interface OpenBetsFloaterProps {
  bets: OpenBet[]
  onCloseBet: (betId: string, result: BetResult) => void
}

export function OpenBetsFloater({ bets, onCloseBet }: OpenBetsFloaterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBet, setSelectedBet] = useState<OpenBet | null>(null)

  const handleCloseBet = (bet: OpenBet) => {
    setSelectedBet(bet)
  }

  const handleConfirmCloseBet = (betId: string, result: BetResult) => {
    onCloseBet(betId, result)
    setSelectedBet(null)
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
                    Close Bet
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

