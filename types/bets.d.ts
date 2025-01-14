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
  
  