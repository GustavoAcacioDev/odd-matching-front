export interface Odds {
  [key: "Draw" | "Team 1" | "Team 2"]: string;
}

export interface EV {
  [key: "Draw" | "Team 1" | "Team 2"]: number;
}

export interface ValuableBet {
  League: string;
  "Team 1": string;
  "Team 2": string;
  "Betby Odds": Odds;
  "Pinnacle Odds": Odds;
  EV: EV;
}

export interface OpenBet {
  bet: string;
  bet_amount: number;
  id: string;
  match: string;
  odds: number;
  potential_win: number;
  status: string;
  timestamp: string;
  username: string;
}


export type BetResult = 'won' | 'lost';