import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/shadcn/dialog"
import { BetResult, OpenBet } from '@/types/bets';
import { Button } from '../ui/shadcn/button';
import { twMerge } from 'tailwind-merge';

interface CloseBetModalProps {
  bet: OpenBet;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (betId: string, result: BetResult) => void;
}

export function CloseBetModal({ bet, isOpen, onClose, onConfirm }: CloseBetModalProps) {
  const [selectedResult, setSelectedResult] = useState<BetResult | null>(null);

  const handleConfirm = () => {
    if (selectedResult) {
      onConfirm(bet.id, selectedResult);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Encerrar Aposta</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja encerrar essa aposta? Escolha o resultado abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-4 my-4">
          <Button
            variant={selectedResult === 'win' ? 'positive' : 'outline'}
            onClick={() => setSelectedResult('win')}
          >
            Vencedora
          </Button>
          <Button
            variant={selectedResult === 'loss' ? 'negative' : 'outline'}
            onClick={() => setSelectedResult('loss')}
          >
            Perdedora
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!selectedResult}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
