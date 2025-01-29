import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/shadcn/dialog"
import { Button } from "@/components/ui/shadcn/button"
import { Input } from "@/components/ui/shadcn/input"
import { TEvResponse } from '@/types/evs'
import { getKellyValue, getWinPercentage } from '@/utils/utils'

interface BetModalProps {
  bet: TEvResponse;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (betAmount: number) => void;
  userBalance: number;
}

export function BetModal({ bet, isOpen, onClose, onConfirm, userBalance }: BetModalProps) {
  const [betAmount, setBetAmount] = useState<string>('')

  const handleConfirm = () => {
    const amount = parseFloat(betAmount)
    if (!isNaN(amount) && amount > 0 && amount <= userBalance) {
      onConfirm(amount)
      onClose()
    }
  }

  const getRecommendedValue = (evResponse: TEvResponse, userBalance: number) => {
    // Extract EV values and corresponding teams
    const evValues = [
      { team: evResponse["Team 1"], ev: evResponse.EV["EV Team 1"], odds: evResponse["Betby Odds"]["Odd Team 1"], impliedKey: "Implied Team 1" as const },
      { team: "Draw", ev: evResponse.EV["EV Draw"], odds: evResponse["Betby Odds"]["Odd Draw"], impliedKey: "Implied Draw" as const },
      { team: evResponse["Team 2"], ev: evResponse.EV["EV Team 2"], odds: evResponse["Betby Odds"]["Odd Team 2"], impliedKey: "Implied Team 2" as const },
    ];
  
    // Find the team with the highest EV
    const maxEv = evValues.reduce((max, current) => (current.ev > max.ev ? current : max));
  
    // Use the implied probability of the selected team as the win percentage
    const winPercentage = maxEv.ev > 0 ? evResponse["Implied Probability"][maxEv.impliedKey] : 0;
  
    // Calculate the Kelly value
    const kellyValue = getKellyValue(parseFloat(maxEv.odds), winPercentage, userBalance);
  
    // Return the recommended bet amount formatted to 2 decimal places
    setBetAmount(kellyValue.toFixed(2).toString())
  };
  
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fazer aposta</DialogTitle>
          <DialogDescription>
            {bet['Team 1']} vs {bet['Team 2']}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="betAmount" className="text-right">
              Valor a ser apostado:
            </label>
            <Input
              id="betAmount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="col-span-3"
              placeholder="Digite o valor a ser apostado"
            />
          </div>
          <div className='flex gap-2 justify-between items-center'>
            <p className="text-sm text-gray-500">Saldo disponível: ${userBalance.toFixed(2)}</p>
            <Button variant="link" className='w-fit p-0 text-sm text-gray-500' onClick={() => getRecommendedValue(bet, userBalance)}>Valor Recomendado</Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={parseFloat(betAmount) <= 0 || parseFloat(betAmount) > userBalance}>
            Fazer aposta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

