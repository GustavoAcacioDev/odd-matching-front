import { Header } from '@/components/Header'
import BetHistoryTable from '@/components/pages/bet-history/BetHistoryTable'

export default function BetHistoryPage() {

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <BetHistoryTable />
    </div>
  )
}

