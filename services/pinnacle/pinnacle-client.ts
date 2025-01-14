import { ApiResponse, ApiResponseList } from "@/global";
import { fetchAuthClient } from "@/lib/fetchWrapperClient/fetch-auth-client";
import { leagues } from "@/utils/leagues_name";

type TOddsResult = {
    "League": string,
    "Odd Draw": string,
    "Odd Team 1": string,
    "Odd Team 2": string,
    "Team 1": string,
    "Team 2": string
}


export async function getPinnacleOdds() {
    const fetch = fetchAuthClient()

    const res = await fetch.post<typeof leagues, ApiResponseList<TOddsResult>>('/pinnacle', leagues)

    return res
}