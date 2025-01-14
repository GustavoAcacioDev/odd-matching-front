import { ApiResponse, ApiResponseList } from "@/global";
import { fetchAuthClient } from "@/lib/fetchWrapperClient/fetch-auth-client";

type TOddsResult = {
    "League": string,
    "Odd Draw": string,
    "Odd Team 1": string,
    "Odd Team 2": string,
    "Team 1": string,
    "Team 2": string
}


export function getBetbyOdds() {
    const fetch = fetchAuthClient()

    const res = fetch.get<ApiResponseList<TOddsResult>>('/betby')

    return res
}