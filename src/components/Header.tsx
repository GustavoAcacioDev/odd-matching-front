import Link from 'next/link'
import { Button } from "@/components/ui/shadcn/button"

export function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          BetTracker
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Button variant="ghost" asChild>
                <Link href="/">Home</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <Link href="/bet-history">Histórico de Apostas</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

