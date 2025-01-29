import { ApiResponse, ApiResponseList } from "../../../global";
import { fetchAuthClient } from "@/lib/fetchWrapperClient/fetch-auth-client";
import { OpenBet } from "@/types/bets";
import { TEvResponse } from "@/types/evs";

export function getEvs(){
    const fetch = fetchAuthClient()

    const res = fetch.get<ApiResponseList<TEvResponse>>('/evs')

    return res
}

export function getOpenBets(){
    const fetch = fetchAuthClient()

    const res = fetch.get<ApiResponseList<OpenBet>>('/betting-history?status=open')

    return res
}

export function getBetHistory(){
    const fetch = fetchAuthClient()

    const res = fetch.get<ApiResponseList<OpenBet>>('/betting-history?status=completed')

    return res
}

export function refreshOdds(){
    const fetch = fetchAuthClient()

    const res = fetch.post<null, ApiResponse<null>>('/run-main', null)

    return res
}