type MatchOdds = {
    "Odd Team 1": string;
    "Odd Draw": string;
    "Odd Team 2": string;
};

type ImpliedProbability = {
    "Implied Team 1": number;
    "Implied Draw": number;
    "Implied Team 2": number;
};

type ExpectedValue = {
    "EV Team 1": number;
    "EV Draw": number;
    "EV Team 2": number;
};

export type TEvResponse = {
    League: string;
    Link: string;
    DateTime: string;
    "Team 1": string;
    "Team 2": string;
    "Betby Odds": MatchOdds;
    "Pinnacle Odds": MatchOdds;
    "Implied Probability": ImpliedProbability;
    EV: ExpectedValue;
    "Max EV": number;
    "Confidence Score": number;
};
