import { ApiResponse } from "@/global";
import { fetchAuthClient } from "@/lib/fetchWrapperClient/fetch-auth-client";
import { BetResult } from "@/types/bets";

export type TBet = {
    match: string
    bet: string
    amount: number
    odds: number
}

export type TMakeBetBody = {
    username: string
    bet: TBet
}

export type TRemoveBetBody = {
    username: string
    bet_id: string
}

export type TUpdateBet = {
    username: string
    bet_id: string
    status: BetResult
}

export function placeBet(bet: TBet){
    const fetch = fetchAuthClient()

    const body: TMakeBetBody = {
        username: "admin",
        bet: bet
    }

    const res = fetch.post<TMakeBetBody, ApiResponse<null>>('/bet', body)

    return res
}

export function removeBet(betId: string) {
    const fetch = fetchAuthClient()

    const body: TRemoveBetBody = {
        username: "admin",
        bet_id: betId
    }

    const res = fetch.del<TRemoveBetBody, ApiResponse<null>>('/remove-bet', body)

    return res
}

export function updateBet(body: TUpdateBet){
    const fetch = fetchAuthClient()

    const res = fetch.post<TUpdateBet, ApiResponse<null>>('/update-bet', body)

    return res
}